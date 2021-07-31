import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalController, NavController} from "@ionic/angular";
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group.model";
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../../services/user.service";

/**
 * This class has functions to create a new group
 */
@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.page.html',
  styleUrls: ['./group-create.page.scss'],
})

export class GroupCreatePage implements OnInit {

  /**
   user who currently uses the app
   */
  currentUser: User;
  /**
   the new group that the user creates
   */
  group: Group = new Group();

  /**
   * @ignore
   * @param activatedRoute
   * @param modalController
   * @param authService
   * @param groupService
   * @param af
   * @param userService
   * @param navCtrl
   */
  constructor(private activatedRoute: ActivatedRoute,
              private modalController: ModalController,
              private authService: AuthService,
              private groupService: GroupService,
              private af: AngularFireAuth,
              private userService: UserService,
              private navCtrl: NavController) {

  }

  /**
   * This function changes the group members to the new selected users
   */
  async addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {
      this.group.members = members;
    })
  }

  /**
   * adds the new created group to firebase
   */
  add(){
    if(this.group.name && this.group.name.length > 2){
      if(this.group.members && this.group.members.length > 0){
        this.group.creator = this.currentUser;
        this.group.members.push(this.currentUser);
        this.groupService.new(this.group);
        this.navCtrl.back();
      }else{
        alert("Gruppe muss mind. 1 Mitglied enthalten.")
      }
    }else{
      alert("Gruppenname muss mind. 3 Zeichen lang sein.")
    }
  }


  /**
   * @ignore
   */
  ngOnInit() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          sub.unsubscribe();
        });
      }
    });
  }

}
