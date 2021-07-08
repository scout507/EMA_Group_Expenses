import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  user: User = new User();
  userOld: User = new User();

  constructor(
    public sanitizer: DomSanitizer, 
    private router: Router, 
    private route: ActivatedRoute, 
    private userService: UserService, 
    private af: AngularFireAuth
    ) { }

  ngOnInit() { }

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

  async profileImageChange() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    this.user.profilePic = "data:image/png;base64, " + image.base64String;
  }

  payment() {
    this.saveAlert("payment");
  }

  passwordchange() {
    this.saveAlert('password');
  }

  privacy() {
    this.saveAlert('privacy');
  }

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
