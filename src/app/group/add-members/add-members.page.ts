import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSearchbar, ModalController, NavParams} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Group} from "../../models/group.model";

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.page.html',
  styleUrls: ['./add-members.page.scss'],
})
export class AddMembersPage implements OnInit {

  public friends: User[] = [];
  public selectedFriends: User[] = [];
  public newSelectedFriends: User[] = [];
  currentUser: User;
  filteredFriends: User[] = [];
  searchbarVisible = false;

  constructor(private modalController: ModalController, public navParams: NavParams, public authService: AuthService) {
    let friendsID: string[] = navParams.get('friendsParam');
    this.selectedFriends = navParams.get('selectedFriendsParam');
    this.currentUser = navParams.get('currentUserParam');
    friendsID.forEach(id => {
      this.authService.getUserById(id).then(user => {
        this.friends.push(user);
        this.filteredFriends.push(user);
      });
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

  add(){
    this.modalController.dismiss(this.newSelectedFriends);
  }

  ngOnInit() {
  }

}
