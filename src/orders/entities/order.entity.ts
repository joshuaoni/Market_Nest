import { UserEntity } from "src/users/entities/user.entity";
import { OrderStatus } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShippingEntity } from "./shipping.entity";
import { OrderedItemEntity } from "./ordered-item.entity";

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  buyer: UserEntity;

  @OneToOne(() => ShippingEntity, (shippingAddress) => shippingAddress.order, { cascade: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;

  @OneToMany(() => OrderedItemEntity, (orderedItem) => orderedItem.order, { cascade: true })
  orderedItems: OrderedItemEntity[];





  // @UpdateDateColumn()
  // updatedAt: Date;
}
