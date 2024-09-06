import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'title cannot be empty' })
  @IsString({ message: 'title should be string' })
  title: string;

  @IsNotEmpty({ message: 'description cannot be empty' })
  @IsString({ message: 'description should be string' })
  description: string;
}
