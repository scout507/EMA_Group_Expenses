import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FriendsService } from '../friends.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friends: User[] = [];

  constructor(private router: Router, private af: AngularFireAuth, private friendsService: FriendsService, private userService: UserService) {
  }

  ionViewWillEnter() {
    this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(value => {
          this.friends = [];
          value.friends.forEach(element => {
            this.friendsService.findById(element).then(friend => {
              this.friends.push(friend);
            });
          });
        });
      }
    });
  }

  ngOnInit() {
  }

  async backBtn() {
    this.router.navigate(['profile']);
  }

  friendBttn(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

}
