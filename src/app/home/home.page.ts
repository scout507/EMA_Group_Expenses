import {Component} from '@angular/core';
import {TransactionService} from '../services/transaction.service';
import {Transaction} from '../models/transaction.model';
import {Subscription} from 'rxjs';
import {User} from '../models/user.model';
import {AuthService} from '../services/auth.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import {SimpleTransaction} from '../models/simpleTransaction.model';


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
  simpleTransactions: SimpleTransaction[] = [];
  filteredTransactions: Transaction[] = [];
  currentUser: User;

  private incoming: number;
  private pending: number;
  private confirm: number;
  private subTransactions: Subscription;



  // eslint-disable-next-line max-len
  constructor(private transactionService: TransactionService, private authService: AuthService, private groupService: GroupService, private router: Router) {

  }

  ionViewWillEnter() {
    this.transactions = [];
    this.simpleTransactions = [];
    this.search = '';
    this.outgoingView = true;
    this.currentUser = this.authService.currentUser;
    this.transactionService.getAllTransactionByUser(this.currentUser).then( result => {
      result.forEach( transaction => {
        this.createSimpleTransaction(transaction);
      });
      this.transactions.push(...result);
      this.filterTransaction(this.search);
      this.updateTransactions();
    });
    this.transactionService.presentLoading();
  }

  filterTransaction(searchTerm: string) {

    this.filteredTransactions = [];
    this.transactions.forEach(transaction =>{
      //TODO: add pending & add multiple search options
      if(transaction.purpose.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
        if (this.outgoingView) {
          if (transaction.type === 'cost' && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === 'income' && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }else if (this.incomingView) {
          if (transaction.type === 'income' && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === 'cost' && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
        else if (this.pendingView) {
          if (transaction.type === 'cost' && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === 'income' && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
        else if (this.confirmView) {
          if (transaction.type === 'income' && transaction.creator !== this.currentUser) {
            this.filteredTransactions.push(transaction);
          } else if (transaction.type === 'cost' && transaction.creator === this.currentUser){
            this.filteredTransactions.push(transaction);
          }
        }
      }
    });
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
    this.search = '';
  }

  startSearch() {
    this.searchbarVisible = true;
  }


  buttonHandler(type: number) {
    this.incomingView = false;
    this.outgoingView = false;
    this.pendingView = false;
    this.confirmView = false;

    if (type === 0) {this.outgoingView = true;}
    else if (type === 1) {this.incomingView = true;}
    else if (type === 2) {this.pendingView = true;}
    else {this.confirmView = true;}
  }


  viewTransaction(transaction: Transaction) {
    this.transactionService.saveLocally(transaction);
    this.router.navigate(['transaction-details']);
  }

  updateTransactions(){
    //for the counter
    this.outgoing = 0;
    this.incoming = 0;
    this.pending = 0;
    this.confirm = 0;
    //TODO: add pending
    this.transactions.forEach(transaction => {
      if (transaction.type === 'cost') {
        if (transaction.creator !== this.currentUser) {
          this.outgoing += transaction.amount;
        } else {
          this.incoming += transaction.amount;
        }
      }
      else if(transaction.type === 'income'){
        if (transaction.creator !== this.currentUser) {
          this.incoming += transaction.amount;
        } else {
          this.outgoing += transaction.amount;
        }
      }
      else if(transaction.type === 'cost'){
        if (transaction.creator !== this.currentUser) {
          this.pending ++;
        } else {
          this.confirm ++;
        }
      }
      else if(transaction.type === 'income'){
        if(transaction.creator !== this.currentUser) {
          this.pending ++;
        } else {
          this.confirm ++;
        }
      }
    });

  }


  createSimpleTransaction(transaction: Transaction){
    let otherUser: User;
    let outgoing: boolean;
    let cost: number;
    //THIS IS NOT WORKING RIGHT NOW; NEED TO WAIT FOR THE DB to contain participation
    //TODO: add pending
    if(transaction.creator !== this.currentUser){
      otherUser = transaction.creator;
      if(transaction.type === "cost") outgoing = true;
      else outgoing = false;
      // cost = transaction.participation.get(this.currentUser); <--- use instead of transaction.amount
      // eslint-disable-next-line max-len
      this.simpleTransactions.push(new SimpleTransaction(transaction.id,transaction.amount,transaction.purpose,true,transaction.creator,transaction.group.name,transaction.dueDate));
    }
    console.log(this.simpleTransactions);
  }

  redirect(target: string){
    switch (target) {
      case 'transaction': {
        this.router.navigate(['transaction-create']);
        break;
      }
      case 'group':{
        this.router.navigate(['group-list']);
        break;
      }
    }
  }
}
