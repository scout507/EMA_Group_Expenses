import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction;
  currentView: string = 'overview';

  constructor(private route: ActivatedRoute, private transactionService : TransactionService, private router: Router) {
    this.transaction = this.transactionService.getLocally();
  }


  ngOnInit() {
  }

  formatType(type: string): string{
    switch (type) {
      case 'cost': {
        return 'Ausgabe';
      }
      case 'income': {
        return 'Einnahme';
      }
    }
  }

  formatRhythm(rhythm: string): string{
    switch (rhythm) {
      case 'once': {
        return 'Einmalig';
      }
      case 'daily': {
        return 'Täglich';
      }
      case 'weekly': {
        return 'Wöchentlich';
      }
      case 'monthly': {
        return 'Monatlich';
      }
      case 'yearly': {
        return 'Jährlich';
      }
    }
  }

  delete(){
    let confirmation = confirm('Are you sure you want to delete this transaction?');
    if (confirmation) {
      this.transactionService.delete(this.transaction.id);
      this.router.navigate(['home']);
    }
  }

  editTransaction(){
    this.transactionService.saveLocally(this.transaction);
    this.router.navigate(['transaction-create', {editMode: true}]);
  }
}
