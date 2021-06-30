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

  constructor(originalTransaction: Transaction, creator: User, lastDate: Date, nextDate: Date, createDate: Date, rhythm: number){
    this.originalTransaction = originalTransaction;
    this.creator = creator;
    this.lastDate = lastDate;
    this.nextDate = nextDate;
    this.createDate = createDate;
    this.rhythm = rhythm;
  }
}
