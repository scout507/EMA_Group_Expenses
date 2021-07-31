import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../services/user.service";
import {GroupService} from "../../services/group.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "../../models/user.model";
import {Group} from "../../models/group.model";
import {Router} from "@angular/router";


/**
 * This class lets a user join a group with a invite link
 */
@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {
  currentUser: User;
  group: Group = new Group("0","",[],undefined);
  message = "";
  groupFound = false;

  /**
   * @ignore
   * @param modalController
   * @param af
   * @param groupService
   * @param userService
   * @param router
   */
  constructor(private modalController: ModalController,
              private af: AngularFireAuth,
              private groupService: GroupService,
              public userService: UserService,
              public router: Router) {

  }

  /**
   * @ignore
   */
  ngOnInit() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          // @ts-ignore
          this.findGroup();
          sub.unsubscribe();
        });
      }
    });
  }

  /**
   * search for group with the invite link
   */
  async findGroup(){
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.message = 'Lade Daten';
    loading.duration = 10000;
    document.body.appendChild(loading);
    await loading.present();

    const queryString = window.location.search;
    const groupId = queryString.split("=");
    await this.groupService.getGroupById(groupId[1]).then(group => {
      if(group !== undefined) {
        this.group = group;
        this.groupFound = true;
      }
      else{
        this.message = "Gruppe existiert nicht";
      }
    });
    loading.dismiss();
  }

  /**
   * adds the user to the group
   */
  addToGroup(){
    for (let i in this.group.members) {
      if (this.group.members[i].id === this.currentUser.id){
        this.message = "Bereits in der Gruppe";
        return;
      }
    }
    this.groupService.addUserToGroup(this.group,this.currentUser);
    this.message = "Erfolgreich beigetretten";
  }
}
