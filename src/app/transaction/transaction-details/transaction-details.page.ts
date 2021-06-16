import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction : Transaction;

  constructor(private route: ActivatedRoute) { }

  ionViewWillEnter(){
    this.transaction = JSON.parse(this.route.snapshot.paramMap.get('transaction'));
  }

  ngOnInit() {
  }

}
