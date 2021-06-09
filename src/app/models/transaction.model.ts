import {Group} from "./group.model";
import {User} from "./user.model";

export class Transaction{
  id : string;
  group : Group;
  type : string;
  purpose : string;
  costs : number;
  createdBy : User;
  billingDate : Date;
  dueDate : Date;
  rhythm : string;
  stakes : Map<User, number>;
  attachment : File;
}
