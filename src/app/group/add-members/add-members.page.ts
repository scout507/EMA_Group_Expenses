import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import { UserService } from 'src/app/services/user.service';
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

  constructor(private modalController: ModalController, public navParams: NavParams, public authService: AuthService, private userService:UserService) {
    let friendsID: string[] = navParams.get('friends');
    let selectedFriendsID: string[] = navParams.get('selectedFriends');
    friendsID.forEach(id => {
      this.userService.findById(id).then(user => {
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
