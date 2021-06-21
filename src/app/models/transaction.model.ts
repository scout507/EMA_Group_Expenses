import {User} from "./user.model";
import {Group} from "./group.model";

export class Transaction{
  id: string;
  group : Group;
  amount: number;
  purpose: string;
  type: string;
  purchaseDate: Date;
  dueDate: Date;
  rhythm: string;
  photo: any;
  creator: User;

  participation : Map<User, number>;
  accepted : Map<User, boolean>;
  paid : Map<User, boolean>;

  //TODO figure out photo & person

  constructor(group : Group, amount : number, purpose : string, type : string, rhythm : string, creator : User, purchaseDate?, dueDate?, photo?, id?){
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
  }

}
