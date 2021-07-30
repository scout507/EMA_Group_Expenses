import {User} from './user.model';
import {Group} from './group.model';

export class SimpleTransaction{
  id: string;
  amount: number;
  purpose: string;

  pending: boolean;
  outgoing: boolean;

  otherUser: User;
  groupName: string;

  dueDate: string;




  constructor(id: string, amount: number, purpose: string, outgoing: boolean, pending: boolean, otherUser: User, groupName: string, dueDate? : string){
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
