import {Component} from '@angular/core';
import {TransactionService} from "../transaction.service";
import firebase from "firebase";
import {Transaction} from "../Transaction.model";
import {Transaction_User} from "../Transaction_User.model";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  transactions: Transaction[] = [];
  private subTransactions: Subscription;
  openBill: Transaction_User[] = [];
  pendingBill: Transaction_User[] = [];
  notConfirmed: Transaction_User[] = [];
  toConfirm: Transaction_User[] = [];
  currentUser = {id: "10"};

  constructor(public transactionService: TransactionService) {
    this.transactions = [];
  }

  add() {
    this.transactionService.newTransaction(new Transaction(
      12,
      "Grillen",
      "Ausgabe",
      false,
      "einmalig",
      "arnlew34",
      [
        new Transaction_User(6, "2"),
        new Transaction_User(6, "3")
      ]))

  }

  delete(person: Transaction_User) {
    this.transactionService.findTransactionWithID(person.tid).then(transaction => {
      this.transactionService.deleteTransaction(transaction.id);
    });
  }

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
      }
    })
  }


  ionViewDidLeave() {
    this.subTransactions.unsubscribe();
  }
}
