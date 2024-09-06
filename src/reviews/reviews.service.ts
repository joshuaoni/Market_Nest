import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
    const product = await this.productsService.findOne(createReviewDto.productId);
    let review = await this.findReviewByProductAndUser(createReviewDto.productId, currentUser.id);
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.product = product;
      review.addedBy = currentUser;
    } else {
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }
    return await this.reviewRepository.save(review);
  }

  async findAllByProduct(productId: number): Promise<ReviewEntity[]> {
    const product = await this.productsService.findOne(productId);
    return await this.reviewRepository.find({
      where: {
        product: {
          id: productId
        }
      },
      relations: {
        addedBy: true,
        product: true
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        product: {
          id: true,
          title: true,
          description: true
        }
      }
    })
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: {
        id: id
      },
      relations: {
        addedBy: true,
        product: true
      }
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async remove(id: number) {
    const review = await this.findOne(id)
    return await this.reviewRepository.remove(review);
  }

  async findReviewByProductAndUser(productId: number, userId: number): Promise<ReviewEntity> {
    return this.reviewRepository.findOne({
      where: {
        addedBy: {
          id: userId
        },
        product: {
          id: productId
        }
      },
      select: {
        addedBy: {
          id: true,
          email: true,
          name: true
        },
        product: {
          id: true,
          title: true
        }
      }
    })
  }
}
