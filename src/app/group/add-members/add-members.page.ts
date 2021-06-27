import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController, NavParams} from "@ionic/angular";
import { UserService } from 'src/app/services/user.service';
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

  public friends: User[] = [];
  public selectedFriends: User[] = [];
  public newSelectedFriends: User[] = [];
  group: Group;
  currentUser: User;
  filteredFriends: User[] = [];
  searchbarVisible = false;

  constructor(private modalController: ModalController,
              public navParams: NavParams,
              public authService: AuthService,
              public transactionService: TransactionService,
              public userService: UserService) {
    this.group = navParams.get('groupParam');
    this.selectedFriends = this.group.members;
    this.currentUser = navParams.get('currentUserParam');
    this.currentUser.friends.forEach(id => {
      if(id.toString().length > 9){
        this.userService.findById(id.toString()).then(user => {
          this.friends.push(user);
          this.filteredFriends.push(user);
        });
      }
    });
    if(this.selectedFriends){
      this.newSelectedFriends.splice(0, this.newSelectedFriends.length, ...this.selectedFriends);
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
  setVisible(){
    this.searchbarVisible = true;
  }

  doSearch(){
    this.filteredFriends = this.friends.filter(r =>
      r.displayName.toLowerCase().includes(this.#searchbar.value.toLowerCase()))
  }

  cancelSearch(){
    this.#searchbar.value = "";
    this.filteredFriends = this.friends;
    this.searchbarVisible = false;
  }

  select(friend: User){
    if(this.checkSelectedFriendsContainFriend(friend)){
      this.newSelectedFriends = this.newSelectedFriends.filter(f => f.id != friend.id);
    }else{
      this.newSelectedFriends.push(friend);
    }
  }

  checkSelectedFriendsContainFriend(friend: User): boolean{
    let ret = false;
    this.newSelectedFriends.forEach(f => {
      if(f.id == friend.id){
        ret = true;
      }
    });
    return ret;
  }

  async add(){
    let removedFriend: User[] = [];
    let friendsWithOpenTransactions: User[] = [];
    this.selectedFriends.forEach(friend => {
      if(!this.newSelectedFriends.includes(friend)){
        removedFriend.push(friend)
      }
    });
    for (const friend of removedFriend) {
      let open = await this.transactionService.checkTransactionsFinishedInGroupByUser(this.group, friend);
      if(open){
        friendsWithOpenTransactions.push(friend);
      }
    }
    if(friendsWithOpenTransactions.length > 0){
      let msg = `Diese Auswahl kann nicht bestätigt werden, da noch folgende Freunde offene Transaktionen haben:\n`;
      friendsWithOpenTransactions.forEach(friend => {
        msg += `${friend.displayName}\n`
      });
      this.newSelectedFriends = this.selectedFriends;
      alert(msg)
    }else{
      await this.modalController.dismiss(this.newSelectedFriends);
    }
  }

  ngOnInit() {
  }

}
