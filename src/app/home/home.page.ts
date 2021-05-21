import { Component} from '@angular/core';
import {Transaction} from '../transaction.model';
import {TransactionService} from "../transaction.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage{

  searchbarVisible: Boolean;
  search: any;
  outgoing: any;
  incoming: any;
  pending: any;
  confirm: any;
  testing: boolean;
  transactions: Transaction[];
  filteredTransactions: Transaction[];

  constructor(private transactionService: TransactionService) {
    this.outgoing = true;
    this.transactions = transactionService.findAll();
    this.filterTransactions();
  }



  doSearch() {

  }

  cancelSearch() {
    this.searchbarVisible = false;
  }

  clearSearch() {

  }

  startSearch() {
    this.searchbarVisible = true;
  }

  filterTransactions(){
      console.log(this.transactions);
      this.filteredTransactions = this.transactions;
  }

  viewTransaction(transaction: Transaction) {

  }
}
