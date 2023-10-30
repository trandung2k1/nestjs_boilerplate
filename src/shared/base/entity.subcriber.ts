import { RequestContextService } from 'src/request-context/request-context.service';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface {
  constructor(private readonly requestContextService: RequestContextService) {}

  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const user = this.requestContextService.getContext('user');
    console.log('User in subscriber:', user);
    event.entity.createdByUserId = user;
  }
}
