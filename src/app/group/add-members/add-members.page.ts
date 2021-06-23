import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.page.html',
  styleUrls: ['./add-members.page.scss'],
})
export class AddMembersPage implements OnInit {

  public friendsArray: User[] = [];
  public selectedFriendsArray: User[] = [];
  public newSelectedFriendsArray: User[] = [];

  constructor(private modalController: ModalController, public navParams: NavParams, public authService: AuthService) {
    let friendsID: string[] = navParams.get('friends');
    let selectedFriendsID: string[] = navParams.get('selectedFriends');
    friendsID.forEach(id => {
      this.authService.getUserById(id).then(user => {
        this.friendsArray.push(user);
        if(selectedFriendsID !== undefined && selectedFriendsID.includes(user.id)){
          this.selectedFriendsArray.push(user);
          this.newSelectedFriendsArray.push(user);
        }
      })
    });
  }

  select(friend: User){
    if(this.newSelectedFriendsArray.includes(friend)){
      this.newSelectedFriendsArray = this.newSelectedFriendsArray.filter(f => f !== friend);
    }else{
      this.newSelectedFriendsArray.push(friend);
    }
  }

  add(){
    let members: User[] = [];
    this.newSelectedFriendsArray.forEach(f => {
      members.push(f)
    });
    this.modalController.dismiss(members);
  }

  ngOnInit() {
  }

}
