import {Transaction_User} from "./Transaction_User.model";

export class Transaction{
  id: string;
  amount: number;
  purpose: String;
  type: string;
  pending: boolean;
  purchaseDate: Date;
  dueDate: Date;
  rhythm: string;
  photo: any;
  creator: string;
  people: Transaction_User[];

  //TODO figure out photo & person

  constructor(amount, purpose, type, pending, rhythm, creator, people?, purchaseDate?, dueDate?, photo?, id?){
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
    this.type = type;
    this.pending = pending;
    this.purchaseDate = purchaseDate;
    this.dueDate = dueDate;
    this.rhythm = rhythm;
    this.photo = photo;
    this.creator = creator;
    this.people = people;
  }



}
