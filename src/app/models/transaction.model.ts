import {Group} from "./group.model";
import {User} from "./user.model";

export class Transaction{
  group : Group;
  type : string;
  purpose : string;
  costs : number;
  createdBy : User;
  billingDate : Date;
  dueDate : Date;
  rhythm : string;
  stakes : {participant : User, stake : number}[];
  attachment : File;
}
