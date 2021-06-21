import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-transaction-participants',
  templateUrl: './transaction-participants.page.html',
  styleUrls: ['./transaction-participants.page.scss'],
})
export class TransactionParticipantsPage implements OnInit {
  allSelected : boolean = false;
  stakes: { user: User, stake: number }[] = [];
  participants: User[] = [];
  fairlyDistributedCosts : boolean;
  transaction : Transaction;

  constructor(private transactionService : TransactionService,
              private router: Router) {
    this.transaction = this.transactionService.getLocally();
  }

  //ToDo: push / remove user to stakes depending on the selection

  toggleSelected(user : User): boolean{
    let found = false;
    this.participants.forEach(participant => {
      if (user.id == participant.id) {
        this.participants.splice(this.participants.indexOf(participant), 1);
        found = true;
      }
    });
    if (!found){
      this.participants.push(user);
    }
    return !found;
  }

  calculateStakes(){
    if (this.fairlyDistributedCosts){
      let stake: number = this.transaction.amount / this.transaction.group.members.length;
      for (let user of this.participants) {
        let stakeEntry = {user, stake};
        let paid = false;
        let accepted = false;
        let paidEntry = {user, paid};
        let acceptedEntry = {user, accepted};
        this.transaction.participation.push(stakeEntry);
        this.transaction.accepted.push(acceptedEntry);
        this.transaction.paid.push(paidEntry);
      }
    }
  }

  handleSubmit(){
    if (this.fairlyDistributedCosts) {
      this.calculateStakes();
      this.transaction.participation = this.stakes;
      this.transactionService.persist(this.transaction);
      this.router.navigate(['home']);
    } else {
      this.transactionService.saveLocally(this.transaction);
      this.router.navigate(['transaction-stakes', {participants: JSON.stringify(this.participants)}]);
    }
  }

  toggleSelectAll(){
    if (this.allSelected) {
      this.participants = this.transaction.group.members;
    } else {
      this.participants = [];
    }
  }

  getParticipation(user: User): boolean{
    let found = false;
    this.participants.forEach(participant => {
      if(participant.id == user.id) found = true;
    });
    return found;
  }

  ngOnInit() {
  }

}
