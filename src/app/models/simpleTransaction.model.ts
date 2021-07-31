import {User} from './user.model';

/**
 * SimpleTransactions are used for the home view.
 * It's a simple version of the Transaction model and is used to display a part of an Transaction between the current user and another user.
 * This class is fit for usage in the home-view and should probably not be used anywhere else.
 */

export class SimpleTransaction{
  id: string;
  amount: number;
  purpose: string;
  pending: boolean;
  outgoing: boolean;
  otherUser: User;
  groupName: string;
  dueDate: string;

  /**
   *
   * @param id transaction.id
   * @param amount Amount from transaction.participation (amount per user)
   * @param purpose transaction.purpose
   * @param outgoing  Whether the transaction is a cost or an income for the current user
   * @param pending If the transaction is still pending. Check if transaction.paid == true and transaction.accepted == false
   * @param otherUser The other user tied to this Transaction
   * @param groupName
   * @param dueDate
   */
  constructor(id: string, amount: number, purpose: string, outgoing: boolean, pending: boolean, otherUser: User, groupName: string, dueDate : string){
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
    this.pending = pending;
    this.outgoing = outgoing;
    this.otherUser = otherUser;
    this.groupName = groupName;
    this.dueDate = dueDate;
  }

}
