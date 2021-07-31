import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';


/**
 * This class is needed for the password page.
 */

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage {
  user: User = new User();
  userOld: User = new User();

  /**
   * @ignore
   * @param router 
   * @param route 
   * @param userService 
   * @param af 
   */
  constructor(
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
   * This function navigates back to the option page. It checks whether the user 
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
        this.user = { ...this.userOld };
        this.router.navigate(['options']);
      }
    }
    else {
      this.router.navigate(['options']);
    }
  }

  /**
    * This function navigates back to the option page. It checks whether the user 
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
        this.router.navigate(['options']);
      }
    }
    else {
      this.router.navigate(['options']);
    }
  }

}
