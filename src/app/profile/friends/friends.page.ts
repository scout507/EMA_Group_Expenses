import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friends: User[] = [];
  addFriendInput;
  currentUser: User;
  addFriendsOutput = "";
  errors: Map<string, string> = new Map<string, string>();

  constructor(
    public sanitizer: DomSanitizer,
    public router: Router,
    private af: AngularFireAuth,
    private friendsService: FriendsService,
    private userService: UserService) { }

  ionViewWillEnter() {
    this.addFriendsOutput = "";
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(value => {
          this.currentUser = value;
          sub.unsubscribe();
          this.friends = [];
          value.friends.forEach(async element => {
            await this.friendsService.findById(element, this.currentUser).then(friend => {
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

  addFriend() {
    //TODO: this needs to reload the friends list and check if input was valid
    // @ts-ignore
    this.friendsService.addFriend(this.addFriendInput, this.currentUser.id).then(res => {
      this.addFriendsOutput = res;
      this.errors.set("addFriendsOutput", this.addFriendsOutput);
    });
  }
}
