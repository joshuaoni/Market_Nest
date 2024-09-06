import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity('ordered-item')
export class OrderedItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  product_quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderedItems)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderedItems, { cascade: true })
  product: ProductEntity;
}