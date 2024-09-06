import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderedItemEntity } from './entities/ordered-item.entity';
import { Repository } from 'typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from 'src/utility/common/user-roles.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderedItemEntity)
    private readonly orderedItemRepository: Repository<OrderedItemEntity>,
    @InjectRepository(ShippingEntity)
    private readonly shippingRepository: Repository<ShippingEntity>,
    @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    const shippingAddress = this.shippingRepository.create(createOrderDto.shippingAddress);

    let order = new OrderEntity();
    order.shippingAddress = shippingAddress;
    order.buyer = currentUser;
    order = await this.orderRepository.save(order);

    const orderedItems: OrderedItemEntity[] = [];

    for (const item of createOrderDto.orderedItems) {
      let product = await this.productService.findOne(item.productId);
      product = await this.productService.update(product.id, { stock: product.stock - item.product_quantity })
      const orderedItem = this.orderedItemRepository.create({
        ...item,
        product,
        order
      });
      orderedItems.push(orderedItem);
    }

    order = await this.orderRepository.save({ ...order, orderedItems })
    return await this.findOne(order.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        buyer: true,
        shippingAddress: true,
        orderedItems: {
          product: true
        }
      },
      select: {
        orderedItems: {
          id: true,
          product_unit_price: true,
          product_quantity: true,
          product: {
            id: true,
            title: true
          }
        },
        buyer: {
          id: true,
          name: true,
          email: true
        }
      }
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        buyer: true,
        shippingAddress: true,
        orderedItems: {
          product: true
        }
      },
      select: {
        orderedItems: {
          id: true,
          product_unit_price: true,
          product_quantity: true,
          product: {
            id: true,
            title: true,
            stock: true
          }
        },
        buyer: {
          id: true,
          name: true,
          email: true
        }
      }
    });
    if (!order) throw new NotFoundException('Order does not exist');
    return order;
  }

  async findOrderedItemsByProduct(id: number) {
    return await this.orderedItemRepository.find({
      where: {
        product: { id: id }
      }
    })
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      throw new BadRequestException(`Shipment before delivery`);
    }
    if (order.status === updateOrderStatusDto.status) return order; // this runs when order.status = shipped only.
    if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if (order.status === OrderStatus.SHIPPED && updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    return await this.orderRepository.save(order);
  }

  async cancel(id: number, currentUser: UserEntity) {
    const order = await this.findOne(id);
    if (currentUser.id !== order.buyer.id) throw new BadRequestException('Only the buyer can cancel an order')
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    }
    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException('Cannot cancel order after it has shipped');
    }
    order.status = OrderStatus.CANCELLED;
    const orderedItems = order.orderedItems;
    const newOrderedItems: OrderedItemEntity[] = [];
    for (const item of orderedItems) {
      const product = await this.productService.update(item.product.id, { stock: item.product.stock + item.product_quantity });
      const orderedItem = this.orderedItemRepository.create({
        ...item,
        product
      });
      newOrderedItems.push(orderedItem);
    }
    return await this.orderRepository.save({ ...order, orderedItems: newOrderedItems });
  }
}
