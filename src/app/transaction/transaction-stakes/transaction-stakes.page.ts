import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";

@Component({
  selector: 'app-transaction-stakes',
  templateUrl: './transaction-stakes.page.html',
  styleUrls: ['./transaction-stakes.page.scss'],
})
export class TransactionStakesPage implements OnInit {
  costs : number;
  stakes : {user : User, stake : number}[] = [];

  constructor() { }

  currentStakes(){
    let sum = 0;
    for (let stake of this.stakes){
      sum += stake.stake;
    }

    return sum;
  }

  ngOnInit() {
  }

}
