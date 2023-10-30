import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
export const queuePool: Set<any> = new Set();

export const getBullBoardQueues = (): BaseAdapter[] => {
  const bullBoardQueues = [...queuePool].reduce((acc: BaseAdapter[], val) => {
    acc.push(new BullAdapter(val));
    return acc;
  }, []);

  return bullBoardQueues;
};
