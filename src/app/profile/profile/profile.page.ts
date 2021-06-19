import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { ProfileService } from './profile.service';

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

  firstname = "Max";
  lastname = "Mustermann";
  profileImage = "https://bit.ly/2S904CS";
  description = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et uptua. Atdolores etat.";
  user: User;
  private subUser;

  constructor(private router: Router, private profileService: ProfileService) {
    //profileService.findById("w2Zc9cjVRA21Os8ELOh5").then(item => this.user = item);
    //this.firstname = this.user.firstname;
    //this.lastname = this.user.lastname;
    //this.profileImage = this.user.image;
    //this.description = this.user.description;
  }

  ngOnInit() {
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
