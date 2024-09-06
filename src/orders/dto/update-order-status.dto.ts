import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "src/utility/common/user-roles.enum";

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'status cannot be empty' })
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  @IsString({ message: 'status must be a string' })
  status: string;
}