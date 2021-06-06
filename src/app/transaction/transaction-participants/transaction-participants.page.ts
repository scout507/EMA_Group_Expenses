import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";

@Component({
  selector: 'app-transaction-participants',
  templateUrl: './transaction-participants.page.html',
  styleUrls: ['./transaction-participants.page.scss'],
})
export class TransactionParticipantsPage implements OnInit {
  allSelected : boolean = false;
  participations : {user : User, selected : boolean}[];
  fairlyDistributedCosts : boolean;

  constructor() { }

  ngOnInit() {
  }

}
