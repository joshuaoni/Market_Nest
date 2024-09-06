import { Exclude, Expose, Transform, Type } from "class-transformer";

export class ProductDto {
  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

class CategoryDto {
  id: number;
  title: string;
}

class ProductList {
  @Expose({ name: 'product_id' })
  id: number;

  @Expose({ name: 'product_title' })
  title: string;

  @Expose({ name: 'product_description' })
  description: string;

  @Expose({ name: 'product_price' })
  price: number;

  @Expose({ name: 'product_images' })
  @Transform(({ value }) => value.split(','))
  images: string[];

  @Expose({ name: 'product_stock' })
  stock: number;

  @Expose()
  @Transform(({ obj }) => {
    return {
      id: obj.category_id,
      title: obj.category_title
    }
  })
  category: CategoryDto;

  @Expose({ name: 'reviewcount' })
  reviewcount: number;

  @Expose({ name: 'avgrating' })
  rating: number;

  @Exclude()
  product_createdAt: string;
  @Exclude()
  product_updatedAt: string;
  @Exclude()
  product_addedById: number;
  @Exclude()
  product_categoryId: number;
  @Exclude()
  category_id: number;
  @Exclude()
  category_title: string;
  @Exclude()
  category_description: string;
  @Exclude()
  category_createdAt: string;
  @Exclude()
  category_updatedAt: string;
  @Exclude()
  category_addedById: number;
}