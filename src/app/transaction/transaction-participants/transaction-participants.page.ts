import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {ActivatedRoute, Router} from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import {TransactionTracker} from "../../models/transactionTracker.model";

@Component({
  selector: 'app-transaction-participants',
  templateUrl: './transaction-participants.page.html',
  styleUrls: ['./transaction-participants.page.scss'],
})
/**
 * This class represents the logic for the page in which users chose participants for transactions
 */
export class TransactionParticipantsPage implements OnInit {
  allSelected : boolean = false;
  participants: User[] = [];
  participation: { user: User, participates: boolean}[] = [];
  fairlyDistributedCosts : boolean;
  transaction : Transaction;

  /**
   * @ignore
   * @param transactionService:
   * @param router
   * @param route
   * @param sanitizer
   */
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

  /**
   * Function to calculate the stakes of all selected participants and fill the corresponding arrays.
   */
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

  /**
   * Function to complete the creation of the transaction by creating a tracker if needed and saving the transaction either locally for further editing via stakes or to the database.
   */
  handleSubmit() {
    this.calculateStakes();
    if (this.fairlyDistributedCosts) {
      this.transactionService.persist(this.transaction).then(docRef => {
        if (this.transaction.rhythm !== 'once') {
          this.transactionService.getTransactionById(docRef.id).then((doc: any) => {
            let transaction: Transaction = doc;
            let tracker = new TransactionTracker(transaction,
              transaction.creator,
              new Date(transaction.dueDate),
              new Date(new Date(this.transaction.dueDate).getTime() + this.transactionService.getRhythmMiliseconds(this.transaction.rhythm)),
              new Date(this.transaction.dueDate),
              this.transactionService.getRhythmMiliseconds(this.transaction.rhythm));
            this.transactionService.persistTracker(tracker);
          });
        }
        this.router.navigate(['home']);
      });
    } else {
      this.transactionService.saveLocally(this.transaction);
      this.router.navigate(['transaction-stakes']);
    }
  }

  /**
   * Function for the Choose all slider.
   */
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
