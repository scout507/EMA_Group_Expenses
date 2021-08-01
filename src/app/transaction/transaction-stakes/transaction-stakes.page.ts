import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../models/transaction.model";
import {TransactionTracker} from "../../models/transactionTracker.model";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction-stakes',
  templateUrl: './transaction-stakes.page.html',
  styleUrls: ['./transaction-stakes.page.scss'],
})
/**
 * Class representing the logic of the transaction stakes view.
 */
export class TransactionStakesPage implements OnInit {
  transaction: Transaction;
  errors: Map<string, string> = new Map<string, string>();

  /**
   * @ignore
   * @param router
   * @param transactionService
   */
  constructor(private router: Router,
              private transactionService: TransactionService,
              public sanitizer: DomSanitizer) {
    this.transaction = transactionService.getLocally();
    if(this.transaction.participation.length === 0){
      let stake = this.transaction.amount / this.transaction.group.members.length;
      let accepted = false;
      let paid = false;
      this.transaction.group.members.forEach(user => {
        this.transaction.participation.push({user, stake});
        this.transaction.accepted.push({user, accepted});
        this.transaction.paid.push({user, paid});
      })
    }
  }

  /**
   * Function to calculate the current distributed amount in the input fields.
   */
  getCurrentAmount(){
    let sum = 0;
    this.transaction.participation.forEach(participation => sum += participation.stake);
    return sum;
  }

  /**
   * Function to finish the transaction creation. Checks for input errors.
   */
  handleSubmit() {
    this.errors.clear();
    if (this.getCurrentAmount() > this.transaction.amount) {
      this.errors.set('amount', 'Bitte nicht mehr als den Betrag auf die Teilnehmer verteilen.');
    }
    if (this.getCurrentAmount() < this.transaction.amount) {
      this.errors.set('amount', 'Bitte den vollen Betrag auf die Teilnehmer verteilen');
    }
    if (this.errors.size === 0) {
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
    }
  }

  ngOnInit() {
  }

}
