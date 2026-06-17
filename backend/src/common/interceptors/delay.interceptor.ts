import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

 
@Injectable()
export class DelayInterceptor implements NestInterceptor {
  private readonly enabled: boolean;
  private readonly delayMs: number;

  constructor(private readonly config: ConfigService) {
    this.enabled = config.get<string>('ENABLE_DELAY', 'false') === 'true';
    this.delayMs = parseInt(config.get<string>('DELAY_MS', '3000'), 10);
  }

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!this.enabled) return next.handle();

    
    return next.handle().pipe(
      switchMap((value) => timer(this.delayMs).pipe(map(() => value))),
    );
  }
}
