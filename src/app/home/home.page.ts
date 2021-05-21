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

  outgoingView: boolean;
  private outgoing: any;
  incomingView: boolean;
  private incoming: number;
  pendingView: boolean;
  private pending: number;
  confirmView: boolean;
  private confirm: number;



  testing: boolean;
  transactions: Transaction[];
  filteredTransactions: Transaction[];


  constructor(private transactionService: TransactionService) {
    this.outgoingView = true;
    this.transactions = transactionService.findAll();
    this.filterTransactions();
    this.updateInfo();
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

  updateInfo(){
      this.transactions.forEach(transaction => {
          if (transaction.type == "outgoing") {
            this.outgoing += transaction.amount;
          }
          if (transaction.type == "incoming") {
            this.incoming += transaction.amount;
          }
          if (transaction.type == "pending") {
            this.pending ++;
          }
          if (transaction.type == "confirm") {
            this.confirm ++;
          }
        }
      )
  }
}
