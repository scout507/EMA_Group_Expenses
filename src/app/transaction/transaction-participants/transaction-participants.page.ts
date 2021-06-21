import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";

@Component({
  selector: 'app-transaction-participants',
  templateUrl: './transaction-participants.page.html',
  styleUrls: ['./transaction-participants.page.scss'],
})
export class TransactionParticipantsPage implements OnInit {
  allSelected : boolean = false;
  participations : Map<User, boolean> = new Map<User, boolean>();
  fairlyDistributedCosts : boolean;
  transaction : Transaction;

  constructor() {
    this.transaction = JSON.parse(localStorage.getItem('transaction'));
  }

  toggleSelected(user : User){
    const entry = this.participations.get(user);
    if (entry){
      this.participations.set(user, false);
    } else {
      this.participations.set(user, true);
    }
  }

  ngOnInit() {
  }

}
