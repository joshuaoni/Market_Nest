import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderedItemEntity } from './entities/ordered-item.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderedItemEntity, ShippingEntity]),
    forwardRef(() => ProductsModule)
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
