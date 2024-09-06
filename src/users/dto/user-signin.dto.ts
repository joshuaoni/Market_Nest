import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5, { message: "minimum password length is 5 characters" })
  password: string
}