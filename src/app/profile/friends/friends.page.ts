import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

/**
 * Die Klasse wird für die Friend Page benötigt.
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
   * Beim öffnen der Seite werden alle benötigten Informationen über die Services geladen und in den 
   * dafür vorgsehenen Variablen gespeichert.
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

  friendBttn(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

  /**
   * Takes the email from the inputfield and calls friendService.addFriend with the given email.
   * The return value of friendService.addFriend (string which confirms if the action was successful) gets displayed via error.
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
