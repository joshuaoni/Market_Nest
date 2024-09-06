import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser: UserEntity): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto, currentUser);
  }

  @Get()
  async findAllByProduct(@Body('productId') productId: number): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}

