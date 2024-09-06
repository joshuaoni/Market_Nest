import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity('shipping')
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
  order: OrderEntity;
}