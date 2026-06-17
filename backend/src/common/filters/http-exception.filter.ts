import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

 
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Error interno del servidor';
    let errorDetail: unknown = 'InternalServerError';

    if (exception instanceof HttpException) {
      const body = exception.getResponse() as ExceptionBody | string;

      if (typeof body === 'string') {
        message = body;
        errorDetail = body;
      } else {
        const raw = body.message;
        message = Array.isArray(raw) ? raw[0] : (raw ?? exception.message);
        errorDetail = body;
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({
      success: false,
      message,
      error: errorDetail,
    });
  }
}
