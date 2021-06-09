export class Transaction_User{
  id: string;
  tid: string;
  groupName: string;
  displayName: string;
  uid: string;
  amount: number;
  pending: boolean;
  accepted: boolean;

  //TODO figure out photo & person

  constructor(amount, uid, id?, tid?, groupName?, displayName?){
    this.id = id;
    this.amount = amount;
    this.tid = tid;
    this.uid = uid;
    this.groupName = groupName;
    this.displayName = displayName;
    this.pending = false;
    this.accepted = false;
  }



}
