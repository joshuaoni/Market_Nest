import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middleware/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store'
import { UserEntity } from './users/entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    OrdersModule,
    CacheModule.register<RedisClientOptions>({
      ttl: +process.env.CACHE_DEFAULT_EXPIRATION,
      isGlobal: true,
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      }
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes('*');
    //.forRoutes({ path: 'users', method: RequestMethod.GET })
  }
}
