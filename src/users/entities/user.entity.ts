import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  category: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.addedBy)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntity, (order) => order.buyer)
  orders: OrderEntity[];
}
