import { Component, OnInit } from '@angular/core';
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {

  id: string;
  group: Group = new Group();
  friendsArray: User[] = [];
  currentUser: User;

  constructor(private groupService: GroupService, private userService:UserService, private route: ActivatedRoute, private navCtrl: NavController, private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
    const groupID = this.route.snapshot.paramMap.get('id');
    this.groupService.getGroupById(groupID).then(g => {
      this.group = g;
      for(const member of this.group.members){
        this.userService.findById(member.id).then(result => {
          this.friendsArray.push(result);
        });
      }
    });
  }

  ngOnInit() {
  }

}
