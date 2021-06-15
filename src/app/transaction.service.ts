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
        new Transaction(0,100, "Taschengeld","incoming", false, "once", "Gruppe 1"),
        new Transaction(1,200,"Einkauf","incoming", false,"once", "Gruppe 1"),
        new Transaction(2,300,"Friseur","incoming", true, "once", "Gruppe 1"),
        new Transaction(3,400,"Miete","outgoing", false,"once", "Gruppe 1"),
        new Transaction(4,500,"Katzenfutter","outgoing", true, "once", "Gruppe 1")
      ]
    }

  }

  findAll(): Transaction[]{
    return this.Transactions;
  }




}
