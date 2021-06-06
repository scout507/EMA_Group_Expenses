import { Component, OnInit } from '@angular/core';
import {Group} from "../../models/group.model";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";


@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.page.html',
  styleUrls: ['./transaction-create.page.scss'],
})
export class TransactionCreatePage implements OnInit {
  transaction : Transaction;
  group : Group;
  groups : Group[] = [];
  participants : User[] = [];
  stakes : {user : User, stake: number}[] = [];
  purpose : string;
  transactionType : string = "cost";
  billingDate : Date = new Date();
  dueDate : Date = new Date();
  rhythm : string = "once";
  price : number = 0;
  selectAllUsers : boolean = true;
  fairlyDistributedPrice : boolean = true;

  constructor(private router: Router, private navCtrl : NavController) {
    this.transaction = new Transaction();

    //Sample Data
    let user1 = new User("Karl");
    let user2 = new User("Gustav");
    let user3 = new User("Hans");

    this.participants.push(user1);
    this.participants.push(user2);
    this.participants.push(user3);
  }

  calculateStakes() {
    if(this.fairlyDistributedPrice){
      if (this.participants.length > 0) {
        let stake: number = this.price / this.participants.length;
        for (let user of this.participants){
          let stakeEntry = {user, stake};
          this.stakes.push(stakeEntry)
        }
      }
    }
  }

  nextPage(): void {
    if (this.selectAllUsers && this.fairlyDistributedPrice){
      this.calculateStakes();
      this.save();
      this.navCtrl.pop();
      return;
    }
    if (!this.selectAllUsers) {
      this.router.navigate(['transaction-participants', {fairlyDistributedPrice : this.fairlyDistributedPrice, users : this.participants}]);
      return;
    }
    if (!this.fairlyDistributedPrice) {
      this.router.navigate(['transaction-stakes', {participants : this.participants}]);
      return;
    }
  }

  cancel() : void {
    this.navCtrl.pop();
  }

  save(): void {
    //ToDo: save transaction
    return
  }

  ngOnInit() {
  }

}
