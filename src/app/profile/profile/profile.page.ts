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

/**
 * This class is needed for the profile-page.
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  badges: Award[] = [];
  user: User = new User();

  /**
   * @ignore
   * @param transactionsservice 
   * @param sanitizer 
   * @param router 
   * @param userService 
   * @param af 
   * @param awardService 
   * @param authService 
   * @param badgeService 
   */
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

  /**
   * When the page is opened, all the required information 
   * is loaded from the services and stored in the variables 
   * provided for this purpose. Important here is the check 
   * whether the user is logged in, otherwise no data will be loaded.
   */
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

  /**
   * This function navigates to the friends page.
   */
  async friendlist() {
    this.router.navigate(['friends']);
  }

  /**
   * This function navigates to the options page.
   */
  profileSettings() {
    this.router.navigate(['options']);
  }

   /**
   * This functionality creates an Ionic alert, this contains only a title and a description, 
   * furthermore there is a close button to close the Ionic alert. Used when you click on 
   * the badge icons.
   * @param badgename Required for the title.
   * @param badgeDescription Required for the description.
   */
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

  /**
   * This function logs out the user.
   */
  loggout() {
    this.authService.logout();
  }

  /**
   * This functionality creates an Ionic alert, this contains only a title and a description, 
   * furthermore there is a close button to close the Ionic alert. Used when clicking on 
   * the icons of the payment methods.
   * @param name Required for the title.
   * @param discription Required for the description.
   */
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
