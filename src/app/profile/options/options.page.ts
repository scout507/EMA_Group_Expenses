import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  user: User = new User();
  userOld: User = new User();

  constructor(private router: Router, private userService: UserService) {
    this.loadData();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    await this.userService.findById("w2Zc9cjVRA21Os8ELOh5").then(value => {
      this.userOld = { ...value };
      this.user = { ...value };
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
        this.user = this.userOld;
        this.router.navigate(['profile']);
      }
    }
    else {
      this.router.navigate(['profile']);
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
        this.router.navigate(['profile']);
      }
    }
    else {
      this.router.navigate(['profile']);
    }
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
