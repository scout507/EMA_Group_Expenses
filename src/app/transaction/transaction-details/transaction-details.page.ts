import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {GroupService} from "../../services/group.service";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction;

  constructor(private route: ActivatedRoute, private transactionService : TransactionService, private groupService : GroupService) {
    this.transaction = transactionService.getLocally();
    console.log(this.transaction);
  }

  ngOnInit() {
  }

}
