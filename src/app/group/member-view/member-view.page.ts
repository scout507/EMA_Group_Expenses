import { Component, OnInit } from '@angular/core';
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {TransactionService} from "../../services/transaction.service";
import {Group} from "../../models/group.model";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-member-view',
  templateUrl: './member-view.page.html',
  styleUrls: ['./member-view.page.scss'],
})
export class MemberViewPage implements OnInit {

  id: string;
  group: Group;
  currentUser: User;

  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private alertController: AlertController,
              private authService: AuthService,
              private transactionService: TransactionService,
              private router: Router) {
  }

  addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {
      this.group.members.splice(0, this.group.members.length, ...members);
    });
  }

  ionViewWillEnter() {
    this.currentUser = this.authService.currentUser;
    const groupID = this.route.snapshot.paramMap.get('id');
    this.groupService.getGroupById(groupID).then(g => {
      this.group = g;
    });
  }

  viewUser(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

  ngOnInit() {
  }

}
