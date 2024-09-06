import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProductDto } from 'src/products/dto/product.dto';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        map((data: any) => {
          return plainToInstance(ProductDto, data, { exposeUnsetFields: true });
        })
      );
  }
}