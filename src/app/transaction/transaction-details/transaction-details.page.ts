import { Component, OnInit } from '@angular/core';
import {Transaction} from "../../models/transaction.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionService} from "../../services/transaction.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Camera, CameraResultType} from "@capacitor/camera";
import {DomSanitizer} from "@angular/platform-browser";
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "../../models/user.model";
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
/**
 * Class representing the logic for the transaction detal view.
 */
export class TransactionDetailsPage implements OnInit {
  transaction: Transaction; //transaction of which the details are shown
  currentView: string = 'overview'; //tab which is shown
  otherUserId: string; //ID of the user which is targeted (when the current user wants to pay out an income to all participants this helps with the payment for one specific participant)
  hasStake: boolean = false; //Boolean whether the current user is involved in the transaction or not
  currentUser: User;
  stake: number;
  paidAndNotAccepted: boolean;
  accepted: boolean;
  notPaid: boolean;
  /**
   * @ignore
   * @param route
   * @param sanitizer
   * @param transactionService
   * @param router
   * @param authService
   * @param userService
   * @param navCtrl
   * @param af
   */
  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private transactionService : TransactionService,
              private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private navCtrl: NavController,
              private af: AngularFireAuth,) {
    this.transaction = this.transactionService.getLocally();
    this.otherUserId = JSON.parse(localStorage.getItem('otherUser'));
  }

  ionViewWillEnter() {

    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.transaction.participation.forEach(entry => {
            if (entry.user.id === this.currentUser.id){
              this.hasStake = true;
            }
          })
          this.stake = this.transactionService.getStakeForUser(this.currentUser, this.transaction);
          this.paidAndNotAccepted = (this.transactionService.hasUserPaid(this.currentUser.id, this.transaction) && !this.transactionService.wasPaymentAccepted(this.currentUser.id, this.transaction))
          this.accepted = this.transactionService.wasPaymentAccepted(this.currentUser.id, this.transaction);
          this.notPaid =  !this.transactionService.hasUserPaid(this.currentUser.id, this.transaction);
          sub.unsubscribe();
        });
      }
    });
  }


  ngOnInit() {
  }

  /**
   * Function to return a more readable format for the transaction type.
   * @param type: the intern representation of the type.
   */
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

  /**
   * Function to return a more readable format for the transaction rhythm.
   * @param rhythm: the intern representation of the rhythm.
   */
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

  /**
   * Function to delete the current viewed transaction after confirmation.
   */
  delete(){
    let confirmation = confirm('Wollen Sie die Transaktion wirklich löschen?');
    if (confirmation) {
      this.transactionService.delete(this.transaction.id);
      this.router.navigate(['home']);
    }
  }

  /**
   * Function to delete the tracker of the current transaction after confirmation if there is one.
   */
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

  /**
   * Function to send the information of payment to the owner of the transaction for confirmation.
   */
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

  /**
   * Function to upload a picture in the attachment tab.
   */
  async takePicture() {
    await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    }).then(data => {
      this.transaction.photo = "data:image/jpeg;base64, " + data.base64String;
      console.log(this.transaction);
      this.transactionService.update(this.transaction)
    });
  }

  /**
   * Function to remove attachment from transaction.
   */
  removePicture(){
    this.transaction.photo = null;
    this.transactionService.update(this.transaction);
  }
}
