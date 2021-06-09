import { Component, OnInit } from '@angular/core';
import {Group} from "../../models/group.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.page.html',
  styleUrls: ['./transaction-create.page.scss'],
})
export class TransactionCreatePage implements OnInit {
  transaction : Transaction;
  groups : Group[] = [];
  stakes : {user : User, stake: number}[] = [];
  selectAllUsers : boolean = true;
  fairlyDistributedPrice : boolean = true;

  errors: Map<string, string> = new Map<string, string>();

  constructor(private router: Router,
              private navCtrl : NavController,
              private route: ActivatedRoute,
              private transactionService : TransactionService,
              /*private groupService : GroupService*/) {
    this.transaction = new Transaction();
    this.transaction.rhythm = "once";
    this.transaction.type = "cost";
    this.transaction.dueDate = new Date();
    this.transaction.billingDate = new Date();
    const testGroup = new Group("Test");
    testGroup.users.push(new User("Tester"));
    this.groups.push(testGroup);
    //this.groups = groupService.findAll();
    const groupId = this.route.snapshot.paramMap.get('group');
    if (groupId) {
      //this.transaction.group = this.groupService.findById(groupId);
    }
  }

  calculateStakes() {
    if (this.transaction.group){
      if (this.transaction.costs) {
        if (this.fairlyDistributedPrice) {
          let stake: number = this.transaction.costs / this.transaction.group.users.length;
          for (let user of this.transaction.group.users) {
            let stakeEntry = {user, stake};
            this.stakes.push(stakeEntry)
          }
        }
      } else {
        this.errors.set('costs', 'Bitte Betrag angeben.');
      }
    } else {
      this.errors.set('group', 'Bitte Gruppe auswählen.');
    }
  }

  nextPage(): void {
    if (this.transaction.purpose) {
      if (this.transaction.costs) {
        if (this.selectAllUsers && this.fairlyDistributedPrice) {
          this.calculateStakes();
          this.transactionService.persist(this.transaction);
          this.navCtrl.pop();
          return;
        }
        if (!this.selectAllUsers) {
          this.transactionService.saveLocally(this.transaction);
          this.router.navigate(['transaction-participants']);
          return;
        }
        if (!this.fairlyDistributedPrice) {
          this.transactionService.saveLocally(this.transaction);
          this.router.navigate(['transaction-stakes']);
          return;
        }
      } else {
        this.errors.set('costs', 'Bitte Betrag angeben.');
      }
    } else {
      this.errors.set('purpose', 'Bitte geben Sie einen Zweck an.');
    }
  }

  cancel() : void {
    this.navCtrl.pop();
  }

  ngOnInit() {
  }

}
