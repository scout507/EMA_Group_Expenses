import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ArwardService } from 'src/app/services/award.service';
import { AuthService } from "../../services/auth.service";
import { DomSanitizer } from '@angular/platform-browser';
import { StatisticsService } from 'src/app/services/statistics.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/models/transaction.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  badges: Award[] = [];
  user: User = new User();
  transactions: Transaction[];
  income: number = 0;
  outcome: number = 0;
  self: number = 0;

  constructor(private transactionsservice: TransactionService, private stats: StatisticsService, private sanitizer: DomSanitizer, private router: Router, private userService: UserService, private af: AngularFireAuth, private awardService: ArwardService, private authService: AuthService) {
  }

  ionViewWillEnter() {
    var sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(value => {
          this.user = { ...value };
          this.badges = [];
          this.user.awards.forEach(element => {
            this.awardService.findById(element).then(item => {
              this.badges.push(item);
            });
          });
          this.transactionsservice.getAllTransactionByUser(this.user, true).then(res => {
            this.transactions = res;
            this.changeStats(30);
          });
        });
        sub.unsubscribe();
      }
    });
  }

  ngOnInit() {
  }

  async friendlist() {
    this.router.navigate(['friends']);
  }

  profileSettings() {
    this.router.navigate(['options']);
  }

  async badgeDescription(badgename, badgeDescription) {
    const alert = document.createElement('ion-alert');
    alert.header = badgename;
    alert.message = badgeDescription;
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
    this.user.ec_card
    this.user.kreditcard
    this.user.paypal
  }

  loggout() {
    this.authService.logout();
  }

  async paymentDescription(name: string, discription: string) {
    const alert = document.createElement('ion-alert');
    alert.header = name;
    alert.message = discription;
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
  }

  async changeStats(days: number) {
    this.income = this.stats.getAllIncomeOfTime(days, this.transactions, this.user.id)[0];
    this.outcome = this.stats.getAllExpensesOfTime(days, this.transactions, this.user.id)[0];
    this.self = this.stats.getAllSelfmadeTransactionsOfTime(this.user.id, days, this.transactions);
  }
}
