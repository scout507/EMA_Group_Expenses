import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {
  profileImage: boolean;
  firstname: boolean;
  lastname: boolean;
  awards: boolean;

  profileImageOld: boolean;
  firstnameOld: boolean;
  lastnameOld: boolean;
  awardsOld: boolean;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // TODO: Daten Laden aus Service
    this.profileImageOld = true;
    this.firstnameOld = true;
    this.lastnameOld = false;
    this.awardsOld = false;

    this.profileImage = this.profileImageOld;
    this.firstname = this.firstnameOld;
    this.lastname = this.lastnameOld;
    this.awards = this.awardsOld;
  }

  async backBtn() {
    if (this.profileImage != this.profileImageOld || this.firstname != this.firstnameOld || this.lastname != this.lastnameOld || this.awards != this.awardsOld) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Änderungen verwefen?';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();
      if (rsl.role == "yes")
        this.router.navigate(['options']);
    }
    else {
      this.router.navigate(['options']);
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
      this.router.navigate(['options']);
    // TODO: Über Service speichern
  }

}
