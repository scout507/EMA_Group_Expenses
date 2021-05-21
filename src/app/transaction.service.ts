import {Transaction} from "./transaction.model";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TransactionService{
  private testing: boolean;
  Transactions: Transaction[];


  constructor() {

    this.testing = true;
    if(this.testing){
      this.Transactions = [
        new Transaction(0,100, "Taschengeld","incoming", "once"),
        new Transaction(1,200,"Einkauf","incoming", "once"),
        new Transaction(2,300,"Friseur","incoming", "once"),
        new Transaction(3,400,"Miete","outgoing", "once"),
        new Transaction(4,500,"Katzenfutter","outgoing", "once")
      ]
    }

  }

  findAll(): Transaction[]{
    return this.Transactions;
  }




}
