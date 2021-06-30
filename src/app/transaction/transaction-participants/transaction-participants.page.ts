import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {ActivatedRoute, Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction-participants',
  templateUrl: './transaction-participants.page.html',
  styleUrls: ['./transaction-participants.page.scss'],
})
export class TransactionParticipantsPage implements OnInit {
  allSelected : boolean = false;
  participants: User[] = [];
  participation: { user: User, participates: boolean}[] = [];
  fairlyDistributedCosts : boolean;
  transaction : Transaction;

  constructor(private transactionService : TransactionService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
    this.fairlyDistributedCosts = JSON.parse(route.snapshot.paramMap.get('fairlyDistributedPrice'));
    this.transaction = this.transactionService.getLocally();
    this.transaction.group.members.forEach(user => {
      let participates = false;
      this.participation.push({user, participates});
    })
  }


  calculateStakes(){
      this.participation.forEach(participant => {if (participant.participates) this.participants.push(participant.user)});
      let stake: number = this.transaction.amount / this.participants.length;
      for (let user of this.participants) {
        let stakeEntry = {user, stake};
        let paid = user.id === this.transaction.creator.id;
        let accepted = user.id === this.transaction.creator.id;
        let paidEntry = {user, paid};
        let acceptedEntry = {user, accepted};
        console.log(stakeEntry);
        this.transaction.participation.push(stakeEntry);
        this.transaction.accepted.push(acceptedEntry);
        this.transaction.paid.push(paidEntry);
      }
  }

  handleSubmit(){
    this.calculateStakes();
    if (this.fairlyDistributedCosts) {
      this.transactionService.persist(this.transaction);
      this.router.navigate(['home']);
    } else {
      this.transactionService.saveLocally(this.transaction);
      this.router.navigate(['transaction-stakes']);
    }
  }

  toggleSelectAll(){
    if (this.allSelected) {
      this.participation.forEach(participant => participant.participates = false);
    } else {
      this.participation.forEach(participant => participant.participates = true);
    }
  }

  ngOnInit() {
  }

}
