import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

/**
 * The class is needed for the Friend Page.
 */

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage {
  friends: User[] = [];
  addFriendInput;
  currentUser: User;
  addFriendsOutput = "";
  errors: Map<string, string> = new Map<string, string>();

  /**
   * @ignore
   * @param sanitizer 
   * @param router 
   * @param af 
   * @param friendsService 
   * @param userService 
   */
  constructor(
    public sanitizer: DomSanitizer,
    public router: Router,
    private af: AngularFireAuth,
    private friendsService: FriendsService,
    private userService: UserService,
    private navCtrl: NavController
  ) { }

  /**
   * When the page is opened, 
   * all the required information is loaded from the services and 
   * stored in the variables provided for this purpose. Important 
   * here is the check whether the user is logged in, otherwise 
   * no data will be loaded.
   */
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


  /**
   * This function navigates to the Friend-Profile page, 
   * passing on the ID of the clicked user.
   * @param id Is needed to identify the clicked user.
   */
  friendBttn(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

  /**
   * Takes the email from the inputfield and calls friendService.addFriend with the given email.
   * The return value of friendService.addFriend (string which confirms if the action was successful) 
   * gets displayed via error.
   */
  addFriend() {
    this.friendsService.addFriend(this.addFriendInput, this.currentUser.id).then(res => {
      this.addFriendsOutput = res;
      this.errors.set("addFriendsOutput", this.addFriendsOutput);
      if (res === "Nutzer nicht vorhanden")
        this.errors.set("addFriendsOutputColor", "var(--ion-color-danger)");
      else
        this.errors.set("addFriendsOutputColor", "#006600");
    });
  }
}
