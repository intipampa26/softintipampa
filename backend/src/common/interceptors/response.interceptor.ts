import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../interfaces/api-response.interface';

function isPaginated<T>(val: unknown): val is PaginatedResult<T> {
  return (
    typeof val === 'object' &&
    val !== null &&
    Array.isArray((val as PaginatedResult<T>).data) &&
    typeof (val as PaginatedResult<T>).meta === 'object' &&
    (val as PaginatedResult<T>).meta !== null
  );
}

 
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value) => {
        if (isPaginated(value)) {
          return {
            success: true,
            message: 'Operación exitosa',
            data: value.data,
            meta: value.meta,
          };
        }

        return {
          success: true,
          message: 'Operación exitosa',
          data: value ?? null,
        };
      }),
    );
  }
}
