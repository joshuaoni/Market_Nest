import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @ManyToOne(() => UserEntity, (user) => user.reviews)
  addedBy: UserEntity;

  @Index()
  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  product: ProductEntity;
}
