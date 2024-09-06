import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty({ message: 'product id is not passed' })
  @IsNumber({}, { message: 'productId must be a number' })
  productId: number;

  @Min(1, { message: 'minimum rating is 1' })
  @Max(5, { message: 'maximum rating is 5' })
  @IsInt({ message: 'rating must be an integer' })
  rating: number;

  @IsString({ message: "comment must be a string" })
  @IsNotEmpty({ message: 'comment cannot be empty' })
  comment: string;
}
