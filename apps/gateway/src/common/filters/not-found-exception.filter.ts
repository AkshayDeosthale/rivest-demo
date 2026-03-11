import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const accept = request.headers.accept || '';

    if (accept.includes('application/json') || request.xhr) {
      response.status(404).json({ statusCode: 404, message: 'Not found' });
      return;
    }

    response.status(404).render('not-found', {});
  }
}
