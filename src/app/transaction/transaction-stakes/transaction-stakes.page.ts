import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../models/transaction.model";

@Component({
  selector: 'app-transaction-stakes',
  templateUrl: './transaction-stakes.page.html',
  styleUrls: ['./transaction-stakes.page.scss'],
})
export class TransactionStakesPage implements OnInit {
  transaction: Transaction;
  errors: Map<string, string> = new Map<string, string>();

  constructor(private router: Router,
              private transactionService: TransactionService) {
    this.transaction = transactionService.getLocally();
    if(this.transaction.participation.length === 0){
      let stake = this.transaction.amount / this.transaction.group.members.length;
      this.transaction.group.members.forEach(user => {
        this.transaction.participation.push({user, stake});
      })
    }
  }

  getCurrentAmount(){
    let sum = 0;
    this.transaction.participation.forEach(participation => sum += participation.stake);
    return sum;
  }

  handleSubmit(){
    this.errors.clear();
    if(this.getCurrentAmount() > this.transaction.amount){
      this.errors.set('amount', 'Bitte nicht mehr als den Betrag auf die Teilnehmer verteilen.');
    }
    if (this.getCurrentAmount() < this.transaction.amount){
      this.errors.set('amount', 'Bitte den vollen Betrag auf die Teilnehmer verteilen');
    }
    if (this.errors.size === 0){
      this.transactionService.persist(this.transaction);
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
  }

}
