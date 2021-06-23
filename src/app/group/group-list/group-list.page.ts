import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage implements OnInit {

  groups: Group[] = [];
  currentUser: User;

  constructor(private groupService: GroupService, private authService: AuthService, private router: Router){

  }


  ionViewWillEnter(){
    this.currentUser = this.authService.currentUser;
    this.groupService.getGroupsByUserId(this.currentUser.id).then(groups => {
      this.groups.splice(0, this.groups.length, ...groups);
    });
  }

  ionViewDidLeave() {
  }

  createGroup(){
    this.router.navigate(['group-create'])
  }

  showGroup(group: Group){
    this.router.navigate(['group-details', {id: group.id}])
  }

  ngOnInit() {
  }

}
