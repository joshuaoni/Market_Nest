import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderedItemsDto } from "./ordered-items.dto";

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderedItemsDto)
  @ValidateNested()
  orderedItems: OrderedItemsDto[];
}
