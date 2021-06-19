import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
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
  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
  }

  backBttn() {
    this.router.navigate(['friends']);
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
