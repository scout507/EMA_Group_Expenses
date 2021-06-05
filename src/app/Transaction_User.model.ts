export class Transaction_User{
  id: string;
  tid: string;
  uid: string;
  amount: number;
  pending: boolean;
  accepted: boolean;

  //TODO figure out photo & person

  constructor(amount, uid, id?, tid?){
    this.id = id;
    this.amount = amount;
    this.tid = tid;
    this.uid = uid;
    this.pending = false;
    this.accepted = false;
  }



}
