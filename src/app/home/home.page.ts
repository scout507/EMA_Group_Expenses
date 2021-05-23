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
  search: string;

  outgoingView: boolean;
  confirmView: boolean;
  incomingView: boolean;
  pendingView: boolean;

  private outgoing: number;
  private incoming: number;
  private pending: number;
  private confirm: number;



  testing: boolean;
  transactions: Transaction[];
  filteredTransactions: Transaction[];


  constructor(private transactionService: TransactionService) {
    this.outgoingView = true;
    this.transactions = transactionService.findAll();
    this.filterTransactions("");
    this.updateInfo();
  }



  doSearch() {
      this.filterTransactions(this.search)
  }

  cancelSearch() {
    this.clearSearch();
    this.filterTransactions("");
    this.searchbarVisible = false;
  }

  clearSearch() {
      this.search = "";
  }

  startSearch() {
    this.searchbarVisible = true;
  }

  filterTransactions(searchTerm: string){

      this.filteredTransactions = [];
      //TODO add search option for search by user/group
      this.transactions.forEach(transaction => {
          if(this.outgoingView){
              if(transaction.type == "outgoing" && !transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
                this.filteredTransactions.push(transaction);
          }
          else if(this.incomingView){
              if(transaction.type == "incoming" && !transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
                this.filteredTransactions.push(transaction);
          }
          else if(this.pendingView){
            if(transaction.type == "outgoing" && transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
              this.filteredTransactions.push(transaction);
          }
          else{
            if(transaction.type == "incoming" && transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
              this.filteredTransactions.push(transaction);
          }
      })
  }

  buttonHandler(type: number) {
    this.incomingView = false;
    this.outgoingView = false;
    this.pendingView = false;
    this.confirmView = false;

    if (type == 0) this.outgoingView = true;
    else if (type == 1) this.incomingView = true;
    else if (type == 2) this.pendingView = true;
    else this.confirmView = true;
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
     //document.getElementById("outgoing-text").innerText = this.outgoing.toString();
  }
}
