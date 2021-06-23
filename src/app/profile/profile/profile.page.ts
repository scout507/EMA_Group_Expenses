import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ArwardService } from 'src/app/services/award.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  badges: Award[] = [];
  user: User = new User();

  constructor(private router: Router, private userService: UserService, private af: AngularFireAuth, private awardService: ArwardService) {
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
        });
        sub.unsubscribe();
      }
    });
  }

  ngOnInit() {
  }

  friendlist() {
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
