import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

/**
 * This class is needed for the password page.
 */

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
  errors: Map<string, string> = new Map<string, string>();

  /**
   * @ignore
   * @param router 
   * @param authservice 
   */
  constructor(
    private router: Router, 
    public authservice: AngularFireAuth
    ) { }

  /**
   * This function initializes the varibals when calling the page.
   */
  ionViewWillEnter() {
    this.oldPassword = "";
    this.newPassword1 = "";
    this.newPassword2 = "";
  }

  /**
   * This function checks if there were changes by the user, if there were any then an 
   * ionic alert is created, in this alert it is asked if the changes should be discarded. 
   * Afterwards it navigates back to the option page.
   */
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

  /**
   * This function checks the entered password for the correct length, 
   * if the new passwords match and if the old password was correct. 
   * If one of the cases is true, an error message is added to the error map, 
   * if it contains any, the password cannot be saved. 
   * A message/text is then inserted in the html.
   */
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
