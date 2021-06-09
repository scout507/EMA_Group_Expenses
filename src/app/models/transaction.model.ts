export class Transaction{
  id: string;
  gid: string;
  amount: number;
  purpose: string;
  type: string;
  pending: boolean;
  purchaseDate: Date;
  dueDate: Date;
  rhythm: string;
  photo: any;
  creator: string;

  //TODO figure out photo & person

  constructor(gid, amount, purpose, type, pending, rhythm, creator, people?, purchaseDate?, dueDate?, photo?, id?){
    this.gid = gid;
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
  }



}
