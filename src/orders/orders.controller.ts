import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AllowedRoles } from 'src/utility/decorators/roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@AllowedRoles([Roles.ADMIN])
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: UserEntity): Promise<OrderEntity> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthenticationGuard)
  @Get('all')
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderEntity> {
    return await this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthenticationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return await this.ordersService.update(+id, updateOrderStatusDto);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('cancel/:id')
  async cancel(@Param('id') id: string, @CurrentUser() currentUser: UserEntity) {
    return await this.ordersService.cancel(+id, currentUser);
  }
}
