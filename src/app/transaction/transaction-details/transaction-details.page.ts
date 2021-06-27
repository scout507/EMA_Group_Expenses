import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {Camera, CameraResultType} from "@capacitor/camera";


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

  constructor(private route: ActivatedRoute, private transactionService : TransactionService, private router: Router, private authService: AuthService, private userService: UserService) {
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
    }
  }

  delete(){
    let confirmation = confirm('Are you sure you want to delete this transaction?');
    if (confirmation) {
      this.transactionService.delete(this.transaction.id);
      this.router.navigate(['home']);
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
            console.log(p.user.id);
            console.log(this.otherUserId);
          if(p.user.id === this.otherUserId) {
            console.log("hallo");
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
