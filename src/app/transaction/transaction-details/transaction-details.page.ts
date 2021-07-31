import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {Camera, CameraResultType} from "@capacitor/camera";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction;
  currentView: string = 'overview';
  otherUserId: string;
  hasStake: boolean = false;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private transactionService : TransactionService, private router: Router, private authService: AuthService, private userService: UserService) {
    this.transaction = this.transactionService.getLocally();
    this.otherUserId = JSON.parse(localStorage.getItem('otherUser'));
    this.transaction.participation.forEach(entry => {
      if (entry.user.id === authService.currentUser.id){
        this.hasStake = true;
      }
    })
  }


  ngOnInit() {
  }

  formatType(type: string): string{
    switch (type) {
      case 'cost': {
        return 'Ausgabe';
      }
      case 'income': {
        return 'Einnahme';
      }
    }
  }

  formatRhythm(rhythm: string): string{
    switch (rhythm) {
      case 'once': {
        return 'Einmalig';
      }
      case 'daily': {
        return 'Täglich';
      }
      case 'weekly': {
        return 'Wöchentlich';
      }
      case 'monthly': {
        return 'Monatlich';
      }
      case 'yearly': {
        return 'Jährlich';
      }
      case 'deleted': {
        return 'Beendet';
      }
    }
  }

  delete(){
    let confirmation = confirm('Wollen Sie die Transaktion wirklich löschen?');
    if (confirmation) {
      this.transactionService.delete(this.transaction.id);
      this.router.navigate(['home']);
    }
  }

  deleteTracker(){
    let confirmation = confirm('Wollen Sie das Wiederkehren dieser Transaktion wirklich beenden?');
    if (confirmation) {
      this.transactionService.findTrackerById(this.transaction.id).then(tracker => {
        this.transaction.rhythm = 'deleted';
        this.transactionService.deleteTracker(tracker);
      }).finally(() => {
        this.transactionService.update(this.transaction);
      })
    }
  }

  payTransaction(){
    if(this.authService.currentUser){
      if(this.transaction.creator.id !== this.authService.currentUser.id) {
          this.transaction.paid.forEach(p => {
            if (p.user.id === this.authService.currentUser.id) {
              p.paid = true;
              this.transactionService.update(this.transaction);
              this.router.navigate(['home']);
            }
          });
        }
        else{
          this.transaction.paid.forEach(p => {
          if(p.user.id === this.otherUserId) {
            p.paid = true;
            this.transactionService.update(this.transaction);
            this.router.navigate(['home']);
          }
        });
      }
    }
  }


  editTransaction(){
    this.transactionService.saveLocally(this.transaction);
    this.router.navigate(['transaction-create', {editMode: true}]);
  }

  async takePicture() {
    await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    }).then(data => {
      this.transaction.photo = "data:image/jpeg;base64, " + data.base64String;
      this.transactionService.update(this.transaction)
    });
  }
}
