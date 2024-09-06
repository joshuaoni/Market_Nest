import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { AllowedRoles } from 'src/utility/decorators/roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';

@AllowedRoles([Roles.ADMIN])
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser: UserEntity): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get('all')
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }
}
