import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as Sentry from '@sentry/core';
import { Scope } from '@sentry/node';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Nest.js interceptor which helps in sending all application exceptions to a centralized error logging service.
 */
@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  /**
   *
   */
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);
  /**
   *
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        const request: Request = context.switchToHttp().getRequest();

        // CAPTURE ERROR IN SENTRY
        Sentry.captureException(exception, (scope: Scope) => {
          scope.setExtra('request', {
            url: request.url,
            body: JSON.stringify(request.body),
            headers: request.headers,
          });
          return scope;
        });

        //CAPTURE ERROR IN LOGGER
        this.logger.error('Fatal Error', exception);

        // RETHROW EXCEPTION
        return throwError(
          () => {
            if (exception instanceof BadRequestException) {
              return new HttpException(
                {
                  code: `'FXQL-${exception?.getStatus()}`,
                  message: 'Bad Request Exception',
                  validationErrors:
                    (exception.getResponse() as any)?.message || 'Invalid request data provided',
                  timestamp: new Date().toISOString(),
                  route: request.path,
                  method: request.method,
                },
                exception?.getStatus(),
              );
            } else if (
              exception instanceof Prisma.PrismaClientKnownRequestError ||
              exception instanceof Prisma.PrismaClientUnknownRequestError ||
              exception instanceof Prisma.PrismaClientInitializationError ||
              exception instanceof Prisma.PrismaClientValidationError ||
              exception instanceof Prisma.PrismaClientRustPanicError
            ) {
              this.logger.error('Prisma Exception', exception?.message);
              return new HttpException(
                {
                  code: 'FXQL-500',
                  message: 'Service unavailable',
                  timestamp: new Date().toISOString(),
                  route: request.path,
                  method: request.method,
                },
                500,
              );
            } else {
              return new HttpException(
                {
                  code: `FXQL-${exception?.status}` || 'FXQL-500',
                  message: exception?.message || exception?.detail || 'Something went wrong',
                  timestamp: new Date().toISOString(),
                  route: request.path,
                  method: request.method,
                },
                exception.status || 500,
              );
            }
          },

          // exception,
        );
      }), // RETHROW EXCEPTION
    );
  }
}
