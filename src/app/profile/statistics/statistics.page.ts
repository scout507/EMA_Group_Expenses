import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { User } from 'src/app/models/user.model';
import { StatisticsService } from 'src/app/services/statistics.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import Chart from 'chart.js/auto'

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
  pie: Chart;

  @ViewChild('pieChart') pieChart;

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
            this.createPieChart(30);
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

    this.pie.data.datasets.forEach((dataset) => {
      dataset.data = [this.stats.getAllIncomeOfTime(days, this.transactions)[0], this.stats.getAllExpensesOfTime(days, this.transactions)[0]];
    });
    this.pie.update();
  }

  createPieChart(days: number) {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Einnahmen', 'Ausgaben'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [this.stats.getAllIncomeOfTime(days, this.transactions)[0], this.stats.getAllExpensesOfTime(days, this.transactions)[0]],
            backgroundColor: ["rgba(104, 237, 136, 1)", "rgba(237, 104, 104, 1)"],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      },
    });
  }
}
