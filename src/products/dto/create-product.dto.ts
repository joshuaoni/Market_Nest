import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description must not be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Price must not be empty' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with decimal precision 2' })
  @IsPositive({ message: 'Invalid price' })
  price: number;

  @IsNotEmpty({ message: 'Stock must not be empty' })
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsNotEmpty({ message: 'Images must not be empty' })
  @IsArray({ message: 'Images must be in array format' })
  images: string[];

  @IsNotEmpty({ message: 'CategoryId must not be empty' })
  @IsNumber({}, { message: 'CategoryId must be a number' })
  categoryId: number;
}
