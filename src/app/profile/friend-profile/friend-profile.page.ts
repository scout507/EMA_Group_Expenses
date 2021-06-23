import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from '../award.model';
import { ArwardService } from '../award.service';
import { FriendsService } from '../friends.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  badges: Award[] = [];
  user: User = new User();

  constructor(private route: ActivatedRoute, private router: Router, private awardService: ArwardService, private af: AngularFireAuth, private userService:UserService,  private friendsService: FriendsService) { }

  ionViewWillEnter() {
    this.route.params.subscribe(item => {
      this.friendsService.findById(item[0]).then(item2 =>{
        this.user = item2;
        this.badges = [];
        this.user.awards.forEach(element => {
          this.awardService.findById(element).then(item3 =>{
            this.badges.push(item3);
          });
        });
      });
    });
  }

  ngOnInit() {
  }

  backBttn() {
    this.router.navigate(['friends']);
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

}
