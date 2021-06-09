import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  firstname = "Max";
  lastname = "Mustermann";
  profileImage = "https://bit.ly/2S904CS";
  description = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et uptua. Atdolores etat.";


  constructor(private router: Router) { }

  ngOnInit() {
  }

  async backBtn(){
    const alert = document.createElement('ion-alert');
    alert.header = 'Änderungen verwefen?';
    alert.buttons = [{ text: "Ja" }, { text: "Nein" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
    this.router.navigate(['profile']);
  }

  payment(){

  }

  profileImageChange(){
    console.log("Test");
  }

}
