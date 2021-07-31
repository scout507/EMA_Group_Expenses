import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * This class is needed for the option-page.
 */

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage {
  user: User = new User();
  userOld: User = new User();

  /**
   * @ignore
   * @param sanitizer 
   * @param router 
   * @param route 
   * @param userService 
   * @param af 
   */
  constructor(
    public sanitizer: DomSanitizer, 
    private router: Router, 
    private route: ActivatedRoute, 
    private userService: UserService, 
    private af: AngularFireAuth
    ) { }

  /**
   * When the page is opened, all the required information 
   * is loaded from the services and stored in the variables 
   * provided for this purpose. Important here is the check 
   * whether the user is logged in, otherwise no data will be loaded.
   */
  ionViewWillEnter() {
    this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(value => {
          this.userOld = { ...value };
          this.user = { ...value };
        });
      }
    });
  }

  /**
   * This function navigates back to the Profile page. It checks whether the user 
   * has changed data, if this is the case, then an Ionic alert is created, which 
   * asks again whether the changes should be discarded. If there are no changes, then 
   * it is simply navigated back.
   */
  async backBtn() {
    if (JSON.stringify(this.user) !== JSON.stringify(this.userOld)) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Änderungen verwefen?';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();
      if (rsl.role == "yes") {
        this.user = this.userOld;
        this.router.navigate(['profile']);
      }
    }
    else {
      this.router.navigate(['profile']);
    }
  }

  /**
   * This function navigates back to the Profile page. It checks whether the user 
   * has changed data, if this is the case, then an Ionic alert is created, which 
   * asks again whether the changes should be saved. If there are no changes, then 
   * it is simply navigated back.
   */
  async saveBtn() {
    if (JSON.stringify(this.user) !== JSON.stringify(this.userOld)) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Änderungen speichern?';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();

      if (rsl.role == "yes") {
        this.userService.update(this.user);
        this.router.navigate(['profile']);
      }
    }
    else {
      this.router.navigate(['profile']);
    }
  }

  /**
   * This function opens the photo app of the device and saves it in Base64 format, 
   * afterwards it is saved in the variable User. Here the plugin "Camera" from 
   * Capicitor is used.
   */
  async profileImageChange() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    this.user.profilePic = "data:image/png;base64, " + image.base64String;
  }

  /**
   * Calls the save Alert function with a parameter = "payment".
   */
  payment() {
    this.saveAlert("payment");
  }

   /**
   * Calls the save Alert function with a parameter = "password".
   */
  passwordchange() {
    this.saveAlert('password');
  }

   /**
   * Calls the save Alert function with a parameter = "privacy".
   */
  privacy() {
    this.saveAlert('privacy');
  }

  /**
   * This function navigates back to the page that comes with the parameter. It checks 
   * whether the user has changed data, if this is the case, then an Ionic alert is created, which 
   * asks again whether the changes should be saved. If there are no changes, then 
   * it is simply navigated to the page from the parameter.
   * @param site Is needed to navigate to the right page.
   */
  async saveAlert(site: string) {
    if (JSON.stringify(this.user) !== JSON.stringify(this.userOld)) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Änderungen speichern?';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Nein", role: "no" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();

      if (rsl.role == "yes") {
        this.userService.update(this.user);
        this.router.navigate([site]);
      } else if (rsl.role == "no") {
        this.user = this.userOld;
        this.router.navigate([site]);
      }
    }
    else {
      this.router.navigate([site]);
    }
  }
}
