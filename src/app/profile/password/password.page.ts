import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
  errors: Map<string, string> = new Map<string, string>();

  constructor(
    private router: Router, 
    public authservice: AngularFireAuth
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.oldPassword = "";
    this.newPassword1 = "";
    this.newPassword2 = "";
  }

  async backBtn() {
    if (this.oldPassword != "" || this.newPassword1 != "" || this.newPassword2 != "") {
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
    this.errors.clear();

    if (this.oldPassword.length == 0) {
      this.errors.set('oldPassword', 'Altes Passwort eingeben!');
    }

    if (this.newPassword1.length == 0) {
      this.errors.set('newPassword1', 'Neues Passwort eingeben!');
    }

    if (this.newPassword2.length == 0) {
      this.errors.set('newPassword2', 'Neues Passwort wiederholen!');
    }

    if (this.newPassword1 != this.newPassword2) {
      this.errors.set('newPassword2', 'Stimmt nicht überein!');
    }
    else if (this.newPassword1.length < 6) {
      this.errors.set('newPassword1', 'Passwort zu kurz mind. 6 Zeichen!');
    }

    await this.authservice.signInWithEmailAndPassword((await this.authservice.currentUser).email,this.oldPassword)
      .catch(error => this.errors.set('oldPassword', 'Altes Passwort falsch!'));

    if (this.errors.size === 0) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Passwort speichern?';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();

      if (rsl.role == "yes") {
        (await this.authservice.currentUser).updatePassword(this.newPassword1);
        this.router.navigate(['options']);
      }
    }
  }

}
