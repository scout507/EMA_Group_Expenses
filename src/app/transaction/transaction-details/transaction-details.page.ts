import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction;
  currentView: string = 'overview';

  constructor(private route: ActivatedRoute, private transactionService : TransactionService, private router: Router, private authService: AuthService) {
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

  payTransaction(){
    if(this.authService.currentUser){
      if(this.transaction.creator !== this.authService.currentUser) {
        this.transaction.paid.forEach(p => {
          console.log(p.user.id);
          console.log(this.authService.currentUser.id);
          if (p.user.id === this.authService.currentUser.id) {
            p.paid = true;
            this.transactionService.update(this.transaction);
            console.log("hallo");
            this.router.navigate(['home']);
          }
        });
      }
      else{
        //This is the case when you push a transaction as income, so you owe other people money
        //TODO: Get who you are paying and confirm it
      }
    }
  }

  editTransaction(){
    this.transactionService.saveLocally(this.transaction);
    this.router.navigate(['transaction-create', {editMode: true}]);
  }
}
