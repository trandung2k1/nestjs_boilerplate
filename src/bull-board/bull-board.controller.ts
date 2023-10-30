import { createBullBoard } from '@bull-board/api';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
import { ExpressAdapter } from '@bull-board/express';
import { All, Controller, Next, Request, Response } from '@nestjs/common';
import { NextFunction } from 'express';
import { getBullBoardQueues } from './queue-pool';

@Controller('/queues/admin')
export class BullBoardController {
  @All('*')
  admin(
    @Request() req: Request,
    @Response() res: Response,
    @Next() next: NextFunction,
  ) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues/admin');
    const queues = getBullBoardQueues();
    const router = serverAdapter.getRouter();
    const { addQueue } = createBullBoard({
      queues: [],
      serverAdapter,
    });
    queues.forEach((queue: BaseAdapter) => {
      addQueue(queue);
    });
    const entryPointPath = '/queues/admin/';
    (req as any).url = req.url.replace(entryPointPath, '/');
    router(req, res, next);
  }
}
