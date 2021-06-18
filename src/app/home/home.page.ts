import {Component} from '@angular/core';
import {TransactionService} from "../services/transaction.service";
import {Transaction} from "../models/transaction.model";
import {Subscription} from "rxjs";
import {User} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import {GroupService} from "../services/group.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  searchbarVisible: boolean;
  search: string;

  outgoingView: boolean;
  confirmView: boolean;
  incomingView: boolean;
  pendingView: boolean;

  outgoing: number;

  testing: boolean;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  currentUser: User;

  private incoming: number;
  private pending: number;
  private confirm: number;
  private subTransactions: Subscription;


  constructor(private transactionService: TransactionService, private authService: AuthService, private groupService: GroupService, private router : Router) {
  }

  ionViewWillEnter() {
    this.search = '';
    this.outgoingView = true;
    this.currentUser = this.authService.currentUser;
    this.transactionService.getAllTransactions().then( result => {
      this.transactions.push(...result);
    });
    this.subTransactions = this.transactionService.findAllSync()
      .subscribe(transactions => {
        this.updateTransactions();
        this.transactions.splice(0, this.transactions.length, ...transactions);
        this.filterTransaction(this.search);
      });
  }


  filterTransaction(searchTerm: string) {
    this.filteredTransactions = [];
    this.transactions.forEach(transaction =>{
      //TODO: add pending & add multiple search options
      if(transaction.purpose.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
        if (this.outgoingView) {
          if (transaction.type === "Ausgabe" && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === "Einnahme" && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }else if (this.incomingView) {
          if (transaction.type === "Einnahme" && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === "Ausgabe" && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
        else if (this.pendingView) {
          if (transaction.type === "Ausgabe" && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === "Einnahme" && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
        else if (this.confirmView) {
          if (transaction.type === "Einnahme" && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === "Ausgabe" && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
      }
    });

  }


  ionViewDidLeave() {
    this.subTransactions.unsubscribe();
  }

  doSearch() {
    this.filterTransaction(this.search);
  }

  cancelSearch() {
    this.clearSearch();
    this.filterTransaction(this.search);
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


  viewTransaction(tid: Transaction) {
    this.transactionService.saveLocally(tid);
    this.router.navigate(['transaction-details'])
  }

  updateTransactions(){
    //for the counter
    this.outgoing = 0;
    this.incoming = 0;
    this.pending = 0;
    this.confirm = 0;
    //TODO: add pending
    this.transactions.forEach(transaction => {
      if (transaction.type === 'Ausgabe') {
        if (transaction.creator !== this.currentUser) {
          this.outgoing += transaction.amount;
        } else {
          this.incoming += transaction.amount;
        }
      }
      else if(transaction.type === 'Einnahme'){
        if (transaction.creator !== this.currentUser) {
          this.incoming += transaction.amount;
        } else {
          this.outgoing += transaction.amount;
        }
      }
      else if(transaction.type === 'Ausgabe'){
        if (transaction.creator !== this.currentUser) {
          this.pending ++;
        } else {
          this.confirm ++;
        }
      }
      else if(transaction.type === 'Einnahme'){
        if(transaction.creator !== this.currentUser) {
          this.pending ++;
        } else {
          this.confirm ++;
        }
      }
    });

  }

  redirect(target : string){
    switch (target) {
      case "transaction": {
        this.router.navigate(['transaction-create']);
        break;
      }
      case "group":{
        this.router.navigate(['group-list']);
        break;
      }
    }
  }
}
