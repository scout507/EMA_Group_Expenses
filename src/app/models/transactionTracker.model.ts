import {User} from './user.model';
import {Transaction} from './transaction.model';

/**
 * This class represents a TransactionTracker, a data type used to create reoccurring transactions.
 */
export class TransactionTracker{
  id: string;
  originalTransaction: Transaction;
  creator: User;
  lastDate: Date;
  nextDate: Date;
  createDate: Date;
  rhythm: number;

  /**
   * @param originalTransaction: The transaction that needs follow-up transactions
   * @param creator: The creator of the original transaction
   * @param lastDate: The date where the last transaction was created
   * @param nextDate: The date where the next transaction needs to be created
   * @param createDate
   * @param rhythm: The rhythm in which the transaction needs to be created
   */
  constructor(originalTransaction: Transaction, creator: User, lastDate: Date, nextDate: Date, createDate: Date, rhythm: number){
    this.originalTransaction = originalTransaction;
    this.creator = creator;
    this.lastDate = lastDate;
    this.nextDate = nextDate;
    this.createDate = createDate;
    this.rhythm = rhythm;
  }
}
