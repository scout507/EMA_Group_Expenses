import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  cash: boolean;
  ec_card: boolean;
  kreditcard: boolean;
  paypal: boolean;

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

    this.cash = this.profileImageOld;
    this.ec_card = this.firstnameOld;
    this.kreditcard = this.lastnameOld;
    this.paypal = this.awardsOld;
  }

  async backBtn() {
    if (this.cash != this.profileImageOld || this.ec_card != this.firstnameOld || this.kreditcard != this.lastnameOld || this.paypal != this.awardsOld) {
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
