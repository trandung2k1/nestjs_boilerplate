import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor<string> {
  constructor(private readonly serviceName: string) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const now = Date.now();
    console.log(
      `[${context.getClass().name} / ${
        context.getHandler().name
      }] ---> Request from request [${
        context.switchToHttp().getRequest().url
      }] in ${(Date.now() - now) / 1000}s`,
    );
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[${context.getClass().name} / ${
              context.getHandler().name
            }] ---> Response from request [${
              context.switchToHttp().getRequest().url
            }] in ${(Date.now() - now) / 1000}s`,
          ),
        ),
      );
  }
}
