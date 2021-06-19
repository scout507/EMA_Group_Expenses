import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friendlist = [["https://bit.ly/2S904CS", "Max Mustermann", "id"],["https://bit.ly/2S904CS", "Max Mustermann", "id"],["https://bit.ly/2S904CS", "Max Mustermann", "id"],["https://bit.ly/2S904CS", "Max Mustermann", "id"]];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async backBtn() {
    this.router.navigate(['profile']);
  }

  friendBttn(id: String){
    this.router.navigate(['friend-profile']);
  }

}
