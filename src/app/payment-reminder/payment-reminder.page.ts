import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, NavParams} from "@ionic/angular";

/**
 * This class is used to send payment reminder to other users
 */
@Component({
  selector: 'app-payment-reminder',
  templateUrl: './payment-reminder.page.html',
  styleUrls: ['./payment-reminder.page.scss'],
})
export class PaymentReminderPage implements OnInit {

  displayName_otherUser: string;
  groupName: string;
  purpose: string;
  amount: string;
  dueDate: string;
  displayName_currentUser: string;
  firstMsg: string;
  secondMsg: string = "";
  thirdMsg: string;

  /**
   * @ignore
   * @param navParams
   * @param modalController
   */
  constructor(public navParams: NavParams, public modalController: ModalController) {
    this.displayName_otherUser = navParams.get('displayName_otherUser');
    this.groupName = navParams.get('groupName');
    this.purpose = navParams.get('purpose');
    this.amount = navParams.get('amount');
    this.dueDate = navParams.get('dueDate');
    this.displayName_currentUser = navParams.get('displayName_currentUser');
    this.firstMsg = `Hallo ${this.displayName_otherUser},\n`;
    this.thirdMsg = `Details der Transaktion:\n` +
      `Gruppe:  ${this.groupName}\n` +
      `Zweck:  ${this.purpose}\n` +
      `Betrag:  ${this.amount}€\n` +
      `Fälligkeitsdatum:  ${new Date(this.dueDate).toLocaleDateString()}`;
  }


  /**
   * creates new Payment Reminder for another user
   */
  createPaymentReminder() {
    let msg = this.firstMsg + this.secondMsg + "\n" + this.thirdMsg;
    this.modalController.dismiss(msg);
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
