// request-context.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestContextService {
  private context: Record<string, any> = {};

  setContext(key: string, value: any) {
    this.context[key] = value;
  }

  getContext(key: string): any {
    return this.context[key];
  }
}
