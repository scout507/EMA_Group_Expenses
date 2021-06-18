import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction;

  constructor(private route: ActivatedRoute, private transactionService : TransactionService) {
    this.transaction = JSON.parse(this.route.snapshot.paramMap.get('transaction'));
    console.log(this.transaction);
  }

  ionViewWillEnter(){
    /* this should be in the constructor
    this.transaction = JSON.parse(this.route.snapshot.paramMap.get('transaction'));
    console.log(this.transaction);
    if (!this.transaction) {
      this.transaction = this.transactionService.getLocally();
    }
    */
  }

  ngOnInit() {
  }

}
