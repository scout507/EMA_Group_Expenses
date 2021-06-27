import {User} from './user.model';
import {Transaction} from './transaction.model';

export class TransactionTracker{
  id: string;
  originalTransaction: Transaction;
  creator: User;
  lastDate: Date;
  nextDate: Date;
  createDate: Date;
  rhythm: number;
}

