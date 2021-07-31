import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { ArwardService } from 'src/app/services/award.service';
import { FriendsService } from '../../services/friends.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import {AuthService} from "../../services/auth.service";
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionService } from 'src/app/services/transaction.service';
import { BadgeService } from 'src/app/services/badge.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  badges: Award[] = [];
  user: User = new User();
  isfriend= false;
  currentUser: User;

  constructor(
    private transactionsservice: TransactionService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public router: Router,
    private awardService: ArwardService,
    private af: AngularFireAuth,
    private userService:UserService,
    private friendsService: FriendsService,
    private authService: AuthService,
    private badgeService: BadgeService
    ) { }

  ionViewWillEnter() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.route.params.subscribe(item => {
            this.friendsService.findById(item[0], this.currentUser).then(item2 =>{
              this.user = item2;
              this.badges = [];
              this.transactionsservice.getAllTransactionByUser(user, true).then(transactions => {
                this.badgeService.setBadges(user, transactions);
                this.user.awards.forEach(element => {
                  this.awardService.findById(element).then(item => {
                    this.badges.push(item);
                  });
                });
              });
              this.isfriend = this.friendsService.isFriends(this.user,this.currentUser);
            });
          });
          sub.unsubscribe();
        });
      }
    });
  }

  ngOnInit() {
  }

  backBttn() {
    this.router.navigate(['friends']);
  }

  addFriend(){
    this.friendsService.addFriend(this.user.email, this.currentUser.id);
  }

  async badgeDescription(badgename, badgeDescription) {
    const alert = document.createElement('ion-alert');
    alert.header = badgename;
    alert.message = badgeDescription;
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
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
