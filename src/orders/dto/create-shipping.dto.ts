import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateShippingDto {
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @MinLength(10, { message: 'Invalid phone number' })
  @MaxLength(10, { message: 'Invalid phone number' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address cannot be empty' })
  address: string;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City cannot be empty' })
  city: string;

  @IsString({ message: 'Post code must be a string' })
  @IsNotEmpty({ message: 'Post code cannot be empty' })
  postCode: string;

  @IsString({ message: 'State must be a string' })
  @IsNotEmpty({ message: 'State cannot be empty' })
  state: string;

  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country cannot be empty' })
  country: string;
}