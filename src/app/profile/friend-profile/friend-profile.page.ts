import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { ArwardService } from 'src/app/services/award.service';
import { FriendsService } from '../../services/friends.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from "../../services/auth.service";
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionService } from 'src/app/services/transaction.service';
import { BadgeService } from 'src/app/services/badge.service';
import { NavController } from '@ionic/angular';

/**
 * The class is needed for the Friend Profile Page.
 */

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})

export class FriendProfilePage {
  badges: Award[] = [];
  user: User = new User();
  isfriend = false;
  currentUser: User;

  /**
   * @ignore
   * @param transactionsservice 
   * @param sanitizer 
   * @param route 
   * @param router 
   * @param awardService 
   * @param af 
   * @param userService 
   * @param friendsService 
   * @param authService 
   * @param badgeService 
   */

  constructor(
    private transactionsservice: TransactionService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public router: Router,
    private awardService: ArwardService,
    private af: AngularFireAuth,
    private userService: UserService,
    private friendsService: FriendsService,
    private authService: AuthService,
    private badgeService: BadgeService,
    private navCtrl: NavController
  ) { }

  /**
   * When the page is opened, all the required information 
   * is loaded from the services and stored in the variables 
   * provided for this purpose. The archievments are also 
   * calculated and if there should be there are new ones, these 
   * are stored in the data base. Important here is the check 
   * whether the user is logged in, otherwise no data will be loaded.
   */

  ionViewWillEnter() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.route.params.subscribe(item => {
            this.friendsService.findById(item[0], this.currentUser).then(item2 => {
              this.user = {... item2};
              this.badges = [];
              if(!this.user.descriptionPublic){
                this.user.description = "";
              }
              if(!this.user.imagePublic){
                this.user.profilePic = "https://bit.ly/2S904CS";
              }
              this.transactionsservice.getAllTransactionByUser(item2, true).then(transactions => {
                this.badgeService.setBadges(item2, transactions);
                if (this.user.awardsPublic) {
                  this.user.awards.forEach(element => {
                    this.awardService.findById(element).then(item => {
                      this.badges.push(item);
                    });

                  });
                }
              });
              this.isfriend = this.friendsService.isFriends(this.user, this.currentUser);
            });
          });
          sub.unsubscribe();
        });
      }
    });
  }

  /**
  * Friends can be added via the function.
  */
  addFriend() {
    this.friendsService.addFriend(this.user.email, this.currentUser.id);
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
