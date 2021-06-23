import {Component} from '@angular/core';
import {TransactionService} from '../services/transaction.service';
import {Transaction} from '../models/transaction.model';
import {Subscription} from 'rxjs';
import {User} from '../models/user.model';
import {AuthService} from '../services/auth.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import {SimpleTransaction} from '../models/simpleTransaction.model';
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../services/user.service";


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
  filteredTransactions: SimpleTransaction[] = [];
  currentUser: User;

  private incoming: number;
  private pending: number;
  private confirm: number;



  // eslint-disable-next-line max-len
  constructor(private transactionService: TransactionService, private authService: AuthService, private userService: UserService,private groupService: GroupService, private router: Router, private af: AngularFireAuth) {
  }

  ionViewWillEnter() {
    this.outgoingView = true;
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.updateTransactions();
          sub.unsubscribe();
        });
      }
    });
  }

  filterTransaction(searchTerm: string) {
    this.filteredTransactions = [];
    this.simpleTransactions.forEach(transaction =>{
      if(transaction.purpose.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
        if(this.outgoingView && transaction.outgoing && !transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.incomingView && !transaction.outgoing && !transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.pendingView && transaction.outgoing && transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.confirmView && !transaction.outgoing && transaction.pending){
          this.filteredTransactions.push(transaction);
        }
      }
    });
  }

  viewTransaction(transactionID: string) {
    this.transactions.forEach(transaction =>{
      if(transaction.id === transactionID){
        this.transactionService.saveLocally(transaction);
        this.router.navigate(['transaction-details']);
      }
    })
  }

  updateTransactions(){
    this.transactions = [];
    this.simpleTransactions = [];
    this.search = '';
    this.transactionService.getAllTransactionByUser(this.currentUser).then( result => {
      result.forEach( transaction => {
        this.createSimpleTransaction(transaction);
      });
      this.transactions.push(...result);
      this.filterTransaction(this.search);

      //for the counter
      this.outgoing = 0;
      this.incoming = 0;
      this.pending = 0;
      this.confirm = 0;
      //TODO: add pending
      this.simpleTransactions.forEach(transaction => {
        if(transaction.outgoing && !transaction.pending){
          this.outgoing += transaction.amount;
        }
        else if(!transaction.outgoing && !transaction.pending){
          this.incoming += transaction.amount;
        }
        else if(transaction.outgoing && transaction.pending){
          this.pending ++;
        }
        else if(!transaction.outgoing && transaction.pending){
          this.confirm++;
        }
      });
      this.outgoing = Math.round(this.outgoing);
      this.incoming = Math.round(this.incoming);
    });
  }

  refreshHandler(event) {
    this.updateTransactions();
    setTimeout(() => {
      event.target.complete();
    }, 200);
  }

  createSimpleTransaction(transaction: Transaction){
    let otherUser: User;
    let outgoing = true;
    let cost: number;
    let pending: boolean;
    //THIS IS NOT WORKING RIGHT NOW; NEED TO WAIT FOR THE DB to contain participation
    //TODO: add pending
    if(transaction.creator.id !== this.currentUser.id){
      otherUser = transaction.creator;
      if(transaction.type === "income") outgoing = false;

      for(let i = 0; i < transaction.participation.length; i++){
        if(transaction.accepted[i].accepted !== true && transaction.participation[i].user.id === this.currentUser.id) {
          cost = Math.round(transaction.participation[i].stake * 100) / 100;
          pending = transaction.paid[i].paid;
          // eslint-disable-next-line max-len
          this.simpleTransactions.push(new SimpleTransaction(transaction.id,cost,transaction.purpose,outgoing,pending,otherUser,transaction.group.name,transaction.dueDate));
        }
      }
    }
    else{
      if(transaction.type === "cost") outgoing = false;

      for(let i = 0; i < transaction.participation.length; i++){
        if(transaction.participation[i].user.id !== this.currentUser.id){
          if(transaction.accepted[i].accepted !== true) {
            otherUser = transaction.participation[i].user;
            cost = Math.round(transaction.participation[i].stake * 100) / 100;
            pending = transaction.paid[i].paid;
            // eslint-disable-next-line max-len
            this.simpleTransactions.push(new SimpleTransaction(transaction.id, cost, transaction.purpose, outgoing, pending, otherUser, transaction.group.name, transaction.dueDate));
          }
        }
      }
    }
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
      case 'profile':{
        this.router.navigate(['profile']);
        break;
      }
    }
  }
}
