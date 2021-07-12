import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController, NavParams} from "@ionic/angular";
import {UserService} from 'src/app/services/user.service';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Group} from "../../models/group.model";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.page.html',
  styleUrls: ['./add-members.page.scss'],
})
export class AddMembersPage implements OnInit {

  friendsAndMembers: User[] = [];
  newSelectedMembers: User[] = [];
  group: Group;
  currentUser: User;
  filteredFriendsAndMembers: User[] = [];
  searchbarVisible = false;

  constructor(private modalController: ModalController,
              public navParams: NavParams,
              public authService: AuthService,
              public transactionService: TransactionService,
              public userService: UserService) {
    this.group = navParams.get('groupParam');
    this.currentUser = navParams.get('currentUserParam');
    this.group.members.forEach(member => {
      this.friendsAndMembers.push(member);
      this.filteredFriendsAndMembers.push(member);
    });
    let friendIsMember;
    for(let friend of this.currentUser.friends){
      friendIsMember = false;
      for(let member of this.group.members){
        if(friend.toString() == member.id){
          friendIsMember = true;
          break;
        }
      }
      if(!friendIsMember){
        this.userService.findById(friend.toString()).then(user => {
          this.friendsAndMembers.push(user);
          this.filteredFriendsAndMembers.push(user);
        });
      }
    }
    if (this.group.members) {
      this.newSelectedMembers.splice(0, this.newSelectedMembers.length, ...this.group.members);
    }
  }

  #searchbar: IonSearchbar;
  @ViewChild(IonSearchbar)
  set searchbar(sb: IonSearchbar) {
    if (sb) {
      sb.setFocus();
      this.#searchbar = sb;
    }
  }

  setVisible() {
    this.searchbarVisible = true;
  }

  doSearch() {
    this.filteredFriendsAndMembers = this.friendsAndMembers.filter(r =>
      r.displayName.toLowerCase().includes(this.#searchbar.value.toLowerCase()))
  }

  cancelSearch() {
    this.#searchbar.value = "";
    this.filteredFriendsAndMembers = this.friendsAndMembers;
    this.searchbarVisible = false;
  }

  select(friend: User) {
    if (this.checkSelectedFriendsContainFriend(friend)) {
      this.newSelectedMembers = this.newSelectedMembers.filter(f => f.id != friend.id);
    } else {
      this.newSelectedMembers.push(friend);
    }
  }

  checkSelectedFriendsContainFriend(friend: User): boolean {
    let ret = false;
    this.newSelectedMembers.forEach(f => {
      if (f.id == friend.id) {
        ret = true;
      }
    });
    return ret;
  }

  async add() {
    let removedFriend: User[] = [];
    let friendsWithOpenTransactions: User[] = [];
    let groupSizeGreaterOne: boolean = true;
    if (this.group.members) {
      this.group.members.forEach(friend => {
        if (!this.newSelectedMembers.includes(friend)) {
          removedFriend.push(friend);
        }
      });
      for (const friend of removedFriend) {
        let open = await this.transactionService.checkTransactionsFinishedInGroupByUser(this.group, friend);
        if (open) {
          friendsWithOpenTransactions.push(friend);
        }
      }
    } else {
      groupSizeGreaterOne = false;
    }
    if (groupSizeGreaterOne && friendsWithOpenTransactions.length > 0) {
      let msg = `Diese Auswahl kann nicht bestätigt werden, da noch folgende Freunde offene Transaktionen haben:\n`;
      friendsWithOpenTransactions.forEach(friend => {
        msg += `${friend.displayName}\n`
      });
      this.newSelectedMembers = this.group.members;
      alert(msg)
    } else {
      await this.modalController.dismiss(this.newSelectedMembers);
    }
  }

  ngOnInit() {
  }

}
