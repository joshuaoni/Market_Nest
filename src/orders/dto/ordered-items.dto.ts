import { IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedItemsDto {
  @IsNotEmpty({ message: 'product id must be present' })
  productId: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Unit price should be a number and must have max d.p of 2' })
  @IsPositive({ message: 'Unit price cannot be negative' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Product quantity should be a number and must have max d.p of 2' })
  @IsPositive({ message: 'Product quantity cannot be negative' })
  @IsInt({ message: 'Product quantity must be an integer' })
  product_quantity: number;
}