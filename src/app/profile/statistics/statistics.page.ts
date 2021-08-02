import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction.model';
import { User } from 'src/app/models/user.model';
import { StatisticsService } from 'src/app/services/statistics.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import Chart from 'chart.js/auto'

/**
 * This class is needed for the profile-page.
 */

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

  /**
   * @ignore
   * @param router
   * @param af
   * @param transactionsservice
   * @param userService
   * @param stats
   */
  constructor(
    public router: Router,
    private af: AngularFireAuth,
    private transactionsservice: TransactionService,
    private userService: UserService,
    private stats: StatisticsService
  ) { }

  /**
    * When the page is initialized, all the required information
    * is loaded from the services and stored in the variables
    * provided for this purpose. It is important that this is done
    * at initialization otherwise there will be problems with the pichart.
    * Important here is the check whether the user is logged in, otherwise no data will be loaded.
    */
  ngOnInit() {
    var sub = this.af.authState.subscribe(afuser => {
      if (afuser) {
        this.userService.findById(afuser.uid).then(user => {
          this.user = user;
          this.transactionsservice.getAllTransactionByUser(user, true).then(res => {
            this.transactions = res;
            this.createPieChart(30);
            this.changeStats(30);
          });
        });
        sub.unsubscribe();
      }
    });
  }

  /**
   * This function calls the statistics functions to calculate data for a certain period of time.
   * These are then stored in the respective variables and the data set of the pie chart is also updated.
   * @param days Number of days for which the data should be loaded, -1 stands for the entire period.
   */
  async changeStats(days: number) {
    this.income = this.stats.getAllIncomeOfTime(days, this.transactions, this.user.id)[0];
    this.outcome = this.stats.getAllExpensesOfTime(days, this.transactions, this.user.id)[0];
    this.self = this.stats.getAllSelfmadeTransactionsOfTime(this.user.id, days, this.transactions);
    this.pie.data.datasets.forEach((dataset) => {
      dataset.data = [this.stats.getAllIncomeOfTime(days, this.transactions, this.user.id)[0], this.stats.getAllExpensesOfTime(days, this.transactions, this.user.id)[0]];
    });
    this.pie.update();
  }

  /**
   * This function creates a pie chart with two pieces, incomes and outcomes, for a given time period.
   * It calls the statistics functions to calculate the data.
   * @param days Number of days for which the data should be loaded, -1 stands for the entire period.
   */
  createPieChart(days: number) {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Einnahmen', 'Ausgaben'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [this.stats.getAllIncomeOfTime(days, this.transactions, this.user.id)[0], this.stats.getAllExpensesOfTime(days, this.transactions, this.user.id)[0]],
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
