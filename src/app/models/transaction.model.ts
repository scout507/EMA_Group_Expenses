import {User} from './user.model';
import {Group} from './group.model';

/**
 * Class representing the data type for the transaction.
 */
export class Transaction{
  id: string; //The id used in the database to identify the transaction
  group: Group; //The group the transaction is part of
  amount: number; //The total price that is paid or received
  purpose: string; //The purpose of the transaction
  type: string; //Either income or cost.
  purchaseDate: string; //The date the bill was first created
  dueDate: string; //The date when the transaction is due
  rhythm: string; //The reoccurance of the transaction
  photo: any; //A picture showing the bill
  creator: User; //The creator of the transcation
  finished: boolean; //Flag whether everyone has paid or not

  participation: {user: User; stake: number}[]; //All participants of the transaction
  accepted: {user: User; accepted: boolean}[]; //All participants that paid and whose payment got accepted by the creator
  paid: {user: User; paid: boolean}[]; //All participants that marked the transaction as paid.

  /**
   * @ignore
   * @param id
   * @param amount
   * @param purpose
   * @param type
   * @param rhythm
   * @param creator
   * @param purchaseDate
   * @param dueDate
   * @param photo
   * @param group
   */
  constructor(id: string, amount: number, purpose: string, type: string, rhythm: string, creator: User, purchaseDate : string, dueDate : string, photo? : any,  group? : Group){
    this.group = group;
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
    this.type = type;
    this.purchaseDate = purchaseDate;
    this.dueDate = dueDate;
    this.rhythm = rhythm;
    this.photo = photo;
    this.creator = creator;
    this.finished = false;
  }

}
