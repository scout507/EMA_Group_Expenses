import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  // TODO: Daten in Modal
  firstname: String;
  lastname: String;
  profileImage: String;
  description: String;
  firstnameOld: String;
  lastnameOld: String;
  profileImageOld: String;
  descriptionOld: String;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // TODO: Daten Laden aus Service
    this.firstnameOld = "Max";
    this.lastnameOld = "Mustermann";
    this.profileImageOld = "https://bit.ly/2S904CS";
    this.descriptionOld = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et uptua. Atdolores etat.";
    
    this.firstname = this.firstnameOld;
    this.lastname = this.lastnameOld;
    this.profileImage = this.profileImageOld;
    this.description = this.descriptionOld;
  }

  async backBtn() {
    if (this.firstname != this.firstnameOld || this.lastname != this.lastnameOld || this.profileImage != this.profileImageOld || this.description != this.descriptionOld) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Änderungen verwefen?';
    alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

    document.body.appendChild(alert);
    await alert.present();
    var rsl = await alert.onDidDismiss();
    if (rsl.role == "yes")
      this.router.navigate(['profile']);
    }
    else {
      this.router.navigate(['profile']);
    }
  }

  async saveBtn() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Änderungen speichern?';
    alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

    document.body.appendChild(alert);
    await alert.present();
    var rsl = await alert.onDidDismiss();

    if (rsl.role == "yes")
      this.router.navigate(['profile']);
    // TODO: Über Service speichern
  }

  profileImageChange() {
    // TODO: Foto hochladen
    console.log("Test");
  }

  payment() {
    this.router.navigate(['payment']);
  }

  passwordchange() {
    this.router.navigate(['password']);
  }

  privacy() {
    this.router.navigate(['privacy']);
  }

}
