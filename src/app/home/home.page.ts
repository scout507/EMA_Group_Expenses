import { Component } from '@angular/core';
import { TransactionService } from "../transaction.service";
import firebase from "firebase";
import { Transaction } from "../Transaction.model";
import { Transaction_User } from "../Transaction_User.model";
import { Subscription } from "rxjs";
import { userInfo } from 'os';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  searchbarVisible: Boolean;
  search: string;

  outgoingView: boolean;
  confirmView: boolean;
  incomingView: boolean;
  pendingView: boolean;

  outgoing: number;
  private incoming: number;
  private pending: number;
  private confirm: number;

  currentUser: User;
  private subTransactions: Subscription;
  testing: boolean;
  transactions: Transaction[];
  filteredTransactions: Transaction[];


  constructor(private transactionService: TransactionService) {
    this.outgoingView = true;
    this.transactions = transactionService.findAll();
    this.filterTransactions("");
    this.updateInfo();
    this.transactions = [];
  }

  /*
  ionViewWillEnter() {
    this.subTransactions = this.transactionService.getAllTransactions()
      .subscribe(transactions => {
        this.transactions.splice(0, this.transactions.length, ...transactions);
        this.openBill = [];
        this.pendingBill = [];
        this.notConfirmed = [];
        this.toConfirm = [];
        this.transactions.forEach(transaction => {
          this.transactionService.getAllTransactionUser(transaction.id, "tid").then(transactionUser => {
            transaction.people = transactionUser;
            if (!transaction.pending) {
              this.setArrays(transaction);
            }
          })
        });
      });
  }

  
  setArrays(transaction: Transaction) {
    transaction.people.forEach(person => {
      if ((
        (transaction.type === "Ausgabe" && person.uid === this.currentUser.id) ||
        (transaction.type === "Einnahme" && transaction.creator === this.currentUser.id)
      ) && !person.pending
      ) {
        this.openBill.push(person)
      }
      if ((
        (transaction.type === "Einnahme" && person.uid === this.currentUser.id) ||
        (transaction.type === "Ausgabe" && transaction.creator === this.currentUser.id)
      ) && !person.pending
      ) {
        this.pendingBill.push(person)
      }
      if (
        (transaction.type === "Einnahme" && person.uid === this.currentUser.id) &&
        person.pending
      ) {
        this.notConfirmed.push(person);
      }
      if (
        (transaction.type === "Ausgabe" && transaction.creator === this.currentUser.id) &&
        person.pending
      ) {
        this.toConfirm.push(person)

        ionViewDidLeave() {
    this.subTransactions.unsubscribe();
  }

  */

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

  filterTransactions(searchTerm: string) {
    this.filteredTransactions = [];
    //TODO add search option for search by user/group
    this.transactions.forEach(transaction => {
      if (this.outgoingView) {
        if (transaction.type == "outgoing" && !transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
          this.filteredTransactions.push(transaction);
      } else if (this.incomingView) {
        if (transaction.type == "incoming" && !transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
          this.filteredTransactions.push(transaction);
      } else if (this.pendingView) {
        if (transaction.type == "outgoing" && transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
          this.filteredTransactions.push(transaction);
      } else {
        if (transaction.type == "incoming" && transaction.pending && transaction.purpose.toLocaleLowerCase().includes(searchTerm))
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

  updateInfo() {
    this.outgoing = 0;
    this.incoming = 0;
    this.pending = 0;
    this.confirm = 0;
    this.transactions.forEach(transaction => {
      if (transaction.type == "outgoing" && !transaction.pending)
        this.outgoing += transaction.amount;

      else if (transaction.type == "incoming" && !transaction.pending)
        this.incoming += transaction.amount;

      else if (transaction.type == "outgoing" && transaction.pending)
        this.pending++;

      else if (transaction.type == "incoming" && transaction.pending)
        this.confirm++;
    })
  }
}
