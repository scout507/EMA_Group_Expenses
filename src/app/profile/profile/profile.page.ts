import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ArwardService } from 'src/app/services/award.service';
import { AuthService } from "../../services/auth.service";
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionService } from 'src/app/services/transaction.service';
import { BadgeService } from 'src/app/services/badge.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  badges: Award[] = [];
  user: User = new User();

  constructor(
    private transactionsservice: TransactionService,
    public sanitizer: DomSanitizer,
    public router: Router,
    private userService: UserService,
    private af: AngularFireAuth,
    private awardService: ArwardService,
    private authService: AuthService,
    private badgeService: BadgeService
  ) { }

  ionViewWillEnter() {
    var sub = this.af.authState.subscribe(userAf => {
      if (userAf) {
        this.userService.findById(userAf.uid).then(user => {
          this.user = { ...user };
          this.badges = [];
          this.transactionsservice.getAllTransactionByUser(user, true).then(transactions => {
            this.badgeService.setBadges(user, transactions);
            this.user.awards.forEach(element => {
              this.awardService.findById(element).then(item => {
                this.badges.push(item);
              });
            });
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
}
