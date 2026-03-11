import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError() as { code?: number; message?: string };
    const status = this.mapGrpcCodeToHttp(error?.code);
    const message = error?.message || 'Internal server error';

    this.logger.error(`gRPC error: ${message} (code: ${error?.code})`);

    response.status(status).json({
      statusCode: status,
      message,
      error: this.getErrorName(status),
    });
  }

  private mapGrpcCodeToHttp(code?: number): number {
    const map: Record<number, number> = {
      2: HttpStatus.BAD_GATEWAY,
      3: HttpStatus.BAD_REQUEST,
      5: HttpStatus.NOT_FOUND,
      6: HttpStatus.CONFLICT,
    };
    return map[code ?? 2] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorName(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      404: 'Not Found',
      409: 'Conflict',
      502: 'Bad Gateway',
    };
    return map[status] ?? 'Internal Server Error';
  }
}
