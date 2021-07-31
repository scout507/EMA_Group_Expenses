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

/**
 * This class shows all members of the group
 */
@Component({
  selector: 'app-member-view',
  templateUrl: './member-view.page.html',
  styleUrls: ['./member-view.page.scss'],
})
export class MemberViewPage implements OnInit {

  id: string;
  group: Group;
  currentUser: User;

  /**
   * @ignore
   * @param groupService
   * @param sanitizer
   * @param route
   * @param navCtrl
   * @param alertController
   * @param authService
   * @param transactionService
   * @param router
   * @param af
   * @param userService
   */
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

  /**
   * navigates to the addMembers page and adds the new selected users
   */
  addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {
      if(members && members.length > 1){
        this.group.members.splice(0, this.group.members.length, ...members);
        this.groupService.update(this.group);
      }else{
        alert("mind. 1 Mitglied muss in der Gruppe sein (ohne Admin)");
      }

    });
  }

  /**
   * @ignore
   */
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

  /**
   * navigates to the selected user
   * @param id - id from the selected user
   */
  viewUser(id: string) {
    this.router.navigate(['friend-profile', [id]]);
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
