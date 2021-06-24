import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { ArwardService } from 'src/app/services/award.service';
import { FriendsService } from '../../services/friends.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  badges: Award[] = [];
  user: User = new User();
  isfriend: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private awardService: ArwardService, private af: AngularFireAuth, private userService:UserService,  private friendsService: FriendsService, private authService: AuthService) { }

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
        this.user.friends.forEach(friend => {
          if(friend === this.authService.currentUser.id) this.isfriend = true;
        })
      });
    });
  }

  ngOnInit() {
  }

  backBttn() {
    this.router.navigate(['friends']);
  }

  addFriend(){
    this.friendsService.addFriend(this.user.email, this.authService.currentUser.id);
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

  redirect(target: string){
    switch (target) {
      case 'transaction': {
        this.router.navigate(['transaction-create']);
        break;
      }
      case 'group':{
        this.router.navigate(['group-list']);
        break;
      }
      case 'home':{
        this.router.navigate(['home']);
        break;
      }
    }
  }
}
