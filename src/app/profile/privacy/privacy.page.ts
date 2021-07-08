import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import {GroupService} from "../../services/group.service";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {
  user: User = new User();
  userOld: User = new User();


  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private userService: UserService, 
    private af: AngularFireAuth, 
    private groupService: GroupService, 
    private transactionService: TransactionService, 
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

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

  async deleteBtn(){
    /* what does this do and why is it not working here? Is this comparing user settings by comparing users?
    if (JSON.stringify(this.user) !== JSON.stringify(this.userOld)) {
     */
      const alert = document.createElement('ion-alert');
      alert.header = 'Möchtest du deinen Account wirklich löschen? Dies kann nicht rückgängig gemacht werden!';
      alert.buttons = [{ text: "Ja", role: "yes" }, { text: "Abbrechen" }];

      document.body.appendChild(alert);
      await alert.present();
      var rsl = await alert.onDidDismiss();

      if (rsl.role == "yes") {
        await this.userService.deleteUserFromFriends(this.user);
        await this.groupService.deleteUserFromAllGroups(this.user);
        await this.transactionService.deleteAllTransactionsByUser(this.user);
        this.userService.delete(this.user.id);
        this.authService.delete();
        this.authService.logout();
      }
  }

}
