import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import dataSource from 'db/data-source';
import { ProductDto } from './dto/product.dto';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.categoryId);
    const product = this.productsRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productsRepository.save(product);
  }

  async findAll(query: any): Promise<ProductDto> {
    // let limit = 4;
    const queryBuilder = dataSource.getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.rating)::numeric(10,1) AS avgRating'
      ])
      .groupBy('product.id,category.id');

    if (query.search) {
      const search = query.search;
      queryBuilder.andWhere('product.title like :title', { title: `%${search}%` });
    }
    if (query.category) {
      queryBuilder.andWhere('category.id=:categoryId', { categoryId: query.category });
    }
    if (query.minPrice) {
      queryBuilder.andWhere('product.price>=:minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      queryBuilder.andWhere('product.price<=:maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.minRating) {
      queryBuilder.andHaving('AVG(review.rating)>=:minRating', { minRating: query.minRating });
    }
    // if (query.limit) limit = query.limit;
    // queryBuilder.limit(limit)
    // if (query.offset) queryBuilder.offset=query.offset;

    const products = await queryBuilder.getRawMany();
    return { products, };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        category: {
          id: true,
          title: true
        }
      }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    let product = await this.findOne(id);
    product = { ...product, ...updateProductDto };
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(+updateProductDto.categoryId);
      product.category = category;
    }
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<ProductEntity> {
    const product = await this.findOne(id);
    const order = await this.ordersService.findOrderedItemsByProduct(id);
    if (order.length) throw new BadRequestException('Product is in use');
    // return await this.productsRepository.delete(id);
    return await this.productsRepository.remove(product);
  }
}
