import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { User } from 'src/app/models/user.model';
import { StatisticsService } from 'src/app/services/statistics.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  user: User = new User();
  transactions: Transaction[];
  income: number = 0;
  outcome: number = 0;
  self: number = 0;

  constructor(
    public router: Router,
    private af: AngularFireAuth,
    private transactionsservice: TransactionService,
    private userService: UserService,
    private stats: StatisticsService
  ) { }

  ngOnInit() {
    var sub = this.af.authState.subscribe(afuser => {
      if (afuser) {
        this.userService.findById(afuser.uid).then(user => {
          this.user = user;
          this.transactionsservice.getAllTransactionByUser(user).then(res => {
            this.transactions = res;
            this.changeStats(30);
          });
        });
        sub.unsubscribe();
      }
    });
  }

  async changeStats(days: number) {
    this.income = this.stats.getAllIncomeOfTime(days, this.transactions)[0];
    this.outcome = this.stats.getAllExpensesOfTime(days, this.transactions)[0];
    this.self = this.stats.getAllSelfmadeTransactionsOfTime(this.user.id, days, this.transactions);
  }
}
