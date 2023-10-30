// request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from 'src/request-context/request-context.service';
interface IRequest extends Request {
  userId: string;
}
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: IRequest, res: Response, next: NextFunction) {
    this.requestContextService.setContext('user', req.userId);
    next();
  }
}
