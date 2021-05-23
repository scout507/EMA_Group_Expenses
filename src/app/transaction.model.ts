export class Transaction{
  id: number;
  amount: number;
  purpose: String;
  type: string;
  pending: boolean;
  purchaseDate: Date;
  dueDate: Date;
  rhythm: string;
  photo: any;
  person: any;

  //TODO figure out photo & person

  constructor(id, amount, purpose, type, pending, rhythm, purchaseDate?, dueDate?, photo?, person?){
    this.id = id;
    this.amount = amount;
    this.purpose = purpose;
    this.type = type;
    this.pending = pending;
    this.purchaseDate = purchaseDate;
    this.dueDate = dueDate;
    this.rhythm = rhythm;
    this.photo = photo;
    this.person = person;
  }



}
