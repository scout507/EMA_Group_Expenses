import {Component} from '@angular/core';
import {TransactionService} from "../transaction.service";
import {Transaction} from "../models/transaction.model";
import {Transaction_User} from "../models/transactionUser.model";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user.model";
import {GroupService} from "../group.service";


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
  currentUser: User;

  constructor(public transactionService: TransactionService, public authService: AuthService, public groupService: GroupService) {
    this.currentUser = this.authService.currentUser;
  }

  add() {
    this.transactionService.newTransaction(new Transaction(
      "gP8AW5UiVorhqX9Cp9FL",
      12,
      "Grillen",
      "Ausgabe",
      true,
      "einmalig",
      "qf4XQRDvbUJm9dVEZ0BT",
    ), [
      new Transaction_User(6, "FJD2mpSZ6PLDXDC3dNja")
    ])

  }

  delete(person: Transaction_User) {
    this.transactionService.findTransactionWithID(person.tid).then(transaction => {
      this.transactionService.deleteTransaction(transaction.id);
    });
  }

  async getGroupName(gid: string): Promise<string> {
    let name;
    await this.groupService.getGroupById(gid).then(g => {
      name = g.name;
    });
    return name;
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
          if(transaction.pending){
            this.transactionService.getAllTransactionUser(transaction.id, "tid").then(transactionUser => {
              transactionUser.forEach(tu => {
                if(!tu.accepted){
                  this.groupService.getGroupById(transaction.gid).then(g => tu.groupName = g.name);
                  this.pushTransactionUser(tu, transaction.type, transaction.creator);
                }
              })
            })
          }
        });
      });
  }

  pushTransactionUser(transactionUser: Transaction_User, transactionType: string, transactionCreator: string) {
      let userHasToPay: boolean;
      if (transactionType === "Ausgabe" && transactionUser.uid === this.currentUser.id){
        this.authService.getUserById(transactionCreator).then(u => transactionUser.displayName = u.displayName);
        userHasToPay = true;
      }else if(transactionType === "Einnahme" && transactionCreator === this.currentUser.id){
        this.authService.getUserById(transactionUser.uid).then(u => transactionUser.displayName = u.displayName);
        userHasToPay = true;
      }else if(transactionType === "Einnahme" && transactionUser.uid === this.currentUser.id){
        this.authService.getUserById(transactionCreator).then(u => transactionUser.displayName = u.displayName);
        userHasToPay = false;
      }else if(transactionType === "Ausgabe" && transactionCreator === this.currentUser.id){
        this.authService.getUserById(transactionUser.uid).then(u => transactionUser.displayName = u.displayName);
        userHasToPay = false;
      }

      if(userHasToPay){
        if(transactionUser.pending){
          this.notConfirmed.push(transactionUser);
        }else{
          this.openBill.push(transactionUser);
        }
      }else{
        if(transactionUser.pending){
          this.toConfirm.push(transactionUser);
        }else{
          this.pendingBill.push(transactionUser);
        }
      }
  }


  ionViewDidLeave() {
    this.subTransactions.unsubscribe();
  }
}
