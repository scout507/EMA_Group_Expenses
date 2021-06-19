import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  badges = [[1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"],
  [1, "https://media.discordapp.net/attachments/798632008569061446/851433167793684550/abzeichen.png"]];

  user: User = new User();

  constructor(private router: Router, private userService: UserService) {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ngOnInit() {
  }

  async loadData() {
    await this.userService.findById("w2Zc9cjVRA21Os8ELOh5").then(value => {
      this.user = { ...value };
    });
  }

  friendlist() {
    this.router.navigate(['friends']);
  }

  statics() {
    this.router.navigate(['statistics']);
  }

  profileSettings() {
    this.router.navigate(['options']);
  }

  async badgeDescription(badgename) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Auszeichnung';
    alert.message = badgename; // TODO: Name der Ausszeichnung
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
  }

}
