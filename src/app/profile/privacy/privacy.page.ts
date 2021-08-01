import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { GroupService } from "../../services/group.service";
import { TransactionService } from "../../services/transaction.service";
import { AuthService } from "../../services/auth.service";

/**
 * This class is needed for the privacy page.
 */

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage {
  user: User = new User();
  userOld: User = new User();

  /**
   * @ignore
   * @param router
   * @param route
   * @param userService
   * @param af
   * @param groupService
   * @param transactionService
   * @param authService
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private af: AngularFireAuth,
    private groupService: GroupService,
    private transactionService: TransactionService,
    private authService: AuthService
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

  /**
   * Functionality for user deletion.
   * Step by step:
   * 1. Delete user from friendlist, 2. delete user from groups, 3. Delete user from transactions
   * 4. delete user from User-Collection, 5. delete user from Auth, 6. Loggout
   */
  async deleteBtn() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Möchtest du deinen Account wirklich löschen? Dies kann nicht rückgängig gemacht werden!';
    alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

    document.body.appendChild(alert);
    await alert.present();
    var rsl = await alert.onDidDismiss();

    if (rsl.role == "yes") {
      await this.userService.deleteUserFromFriends(this.user);
      console.log("1");
      await this.groupService.deleteUserFromAllGroups(this.user);
      console.log("2");
      await this.transactionService.deleteAllTransactionsByUser(this.user);
      console.log("3");
      this.userService.delete(this.user.id);
      console.log("4");
      this.authService.delete();
      console.log("5");
      this.authService.logout();
    }
  }

  /**
   * This function is needed when the value of user.awardsPublic changes to true, 
   * to change the value user.awardsPublicfriends as well.
   */
  changeAwardsPublicfriends() {
    if (this.user.awardsPublic)
      this.user.awardsPublicfriends = true;
  }

}
