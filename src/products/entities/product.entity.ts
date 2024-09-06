import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrderedItemEntity } from "src/orders/entities/ordered-item.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @OneToMany(() => ReviewEntity, (review) => review.product, { onDelete: 'CASCADE' })
  reviews: ReviewEntity[];

  @OneToMany(() => OrderedItemEntity, (orderedItem) => orderedItem.product)
  orderedItems: OrderedItemEntity[];
}
