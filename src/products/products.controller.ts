import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AllowedRoles } from 'src/utility/decorators/roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { SerializeInterceptor } from 'src/utility/interceptors/serialize.interceptor';
import { ProductDto } from './dto/product.dto';

@AllowedRoles([Roles.ADMIN])
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() currentUser: UserEntity): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('all')
  async findAll(@Query() query: any): Promise<ProductDto> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    return await this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.remove(+id);
  }
}
