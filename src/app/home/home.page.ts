import {Component} from '@angular/core';
import {TransactionService} from "../services/transaction.service";
import {Transaction} from "../models/transaction.model";
import {Transaction_User} from "../models/transactionUser.model";
import {Subscription} from "rxjs";
import {User} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import {GroupService} from "../services/group.service";


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
  transactions: Transaction[] = [];
  transactionUserArray: Transaction_User[] = [];


  constructor(private transactionService: TransactionService, private authService: AuthService, private groupService: GroupService) {
  }

  ionViewWillEnter() {
    this.subTransactions = this.transactionService.getAllTransactions()
      .subscribe(transactions => {
        this.transactions.splice(0, this.transactions.length, ...transactions);
        this.currentUser = this.authService.currentUser;
        this.outgoingView = true;
        this.filterTransaction("");
      });
  }

  filterTransaction(searchTerm: string) {
    this.transactionUserArray = [];
    this.outgoing = 0;
    this.incoming = 0;
    this.pending = 0;
    this.confirm = 0;
    this.transactions.forEach(transaction => {
      if (transaction.pending) {
        this.transactionService.getAllTransactionUser(transaction.id).then(transactionUser => {
          transactionUser.forEach(tu => {
            if (transaction.purpose.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) && !tu.accepted) {
              this.groupService.getGroupById(transaction.gid).then(g => tu.groupName = g.name);
              this.pushTransactionUser(tu, transaction.type, transaction.creator);
            }
          })
        })
      }
    });
  }

  pushTransactionUser(transactionUser: Transaction_User, transactionType: string, transactionCreator: string) {
    let outgoing: boolean;
    if (transactionType === "Ausgabe" && transactionUser.uid === this.currentUser.id) {
      this.authService.getUserById(transactionCreator).then(u => transactionUser.displayName = u.displayName);
      outgoing = true;
    } else if (transactionType === "Einnahme" && transactionCreator === this.currentUser.id) {
      this.authService.getUserById(transactionUser.uid).then(u => transactionUser.displayName = u.displayName);
      outgoing = true;
    } else if (transactionType === "Einnahme" && transactionUser.uid === this.currentUser.id) {
      this.authService.getUserById(transactionCreator).then(u => transactionUser.displayName = u.displayName);
      outgoing = false;
    } else if (transactionType === "Ausgabe" && transactionCreator === this.currentUser.id) {
      this.authService.getUserById(transactionUser.uid).then(u => transactionUser.displayName = u.displayName);
      outgoing = false;
    }

    if(outgoing){
      if(transactionUser.pending){
        this.pending++;
        if(this.pendingView){
          this.transactionUserArray.push(transactionUser);
        }
      }else{
        this.outgoing += transactionUser.amount;
        if(this.outgoingView){
          this.transactionUserArray.push(transactionUser);
        }
      }
    }else{
      if(transactionUser.pending){
        this.confirm++;
        if(this.confirmView){
          this.transactionUserArray.push(transactionUser);
        }
      }else{
        this.incoming += transactionUser.amount;
        if(this.incomingView){
          this.transactionUserArray.push(transactionUser);
        }
      }
    }
  }

  ionViewDidLeave() {
    this.subTransactions.unsubscribe();
  }

  doSearch() {
    this.filterTransaction(this.search)
  }

  cancelSearch() {
    this.clearSearch();
    this.filterTransaction("");
    this.searchbarVisible = false;
  }

  clearSearch() {
    this.search = "";
  }

  startSearch() {
    this.searchbarVisible = true;
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


  viewTransaction(tid: string) {

  }

}
