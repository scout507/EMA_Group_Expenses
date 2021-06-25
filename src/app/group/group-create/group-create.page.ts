import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalController, NavController} from "@ionic/angular";
import {AddMembersPage} from "../add-members/add-members.page";
import {GroupService} from "../../services/group.service";
import {Group} from "../../models/group.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.page.html',
  styleUrls: ['./group-create.page.scss'],
})
export class GroupCreatePage implements OnInit {

  currentUser: User;
  group: Group = new Group();

  constructor(private activatedRoute: ActivatedRoute,
              private modalController: ModalController,
              private authService: AuthService,
              private groupService: GroupService,
              private navCtrl: NavController) {

  }

  async addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {
      this.group.members = members;
    })
  }

  add(){
    if(this.group.name.length > 0 && this.group.members.length > 0){
      this.group.creator = this.currentUser;
      this.group.members.push(this.currentUser);
      this.groupService.new(this.group);
      this.navCtrl.pop();
      console.log(this.navCtrl);
    }else{
      alert("name zu kurz");
    }
  }


  ngOnInit() {
    this.currentUser = this.authService.currentUser;
  }

}
