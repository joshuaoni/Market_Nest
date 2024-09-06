import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: "name cannot be empty" })
  name: string;
}