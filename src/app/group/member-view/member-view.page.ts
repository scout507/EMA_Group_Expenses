import { Component, OnInit } from '@angular/core';
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {TransactionService} from "../../services/transaction.service";
import {Group} from "../../models/group.model";
import {User} from "../../models/user.model";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../../services/user.service";
import { DomSanitizer } from '@angular/platform-browser';

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
              private sanitizer:DomSanitizer,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private alertController: AlertController,
              private authService: AuthService,
              private transactionService: TransactionService,
              private router: Router,
              private af: AngularFireAuth,
              private userService: UserService) {
  }

  addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {

      this.group.members.splice(0, this.group.members.length, ...members);
      this.groupService.update(this.group);
    });
  }

  ionViewWillEnter() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          const groupID = this.route.snapshot.paramMap.get('id');
          this.groupService.getGroupById(groupID).then(g => {
            this.group = g;
          });
          sub.unsubscribe();
        });
      }
    });
  }

  viewUser(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

  ngOnInit() {
  }

}
