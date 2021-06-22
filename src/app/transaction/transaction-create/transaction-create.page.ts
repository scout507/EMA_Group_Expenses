import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {GroupService} from "../../services/group.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.page.html',
  styleUrls: ['./transaction-create.page.scss'],
})
export class TransactionCreatePage implements OnInit {
  transaction: Transaction;
  groups: Group[] = [];
  selectAllUsers: boolean = true;
  fairlyDistributedPrice: boolean = true;
  editMode: boolean = false;

  errors: Map<string, string> = new Map<string, string>();

  ionViewWillEnter(){
    if (this.route.snapshot.paramMap.get('editMode')) {
      this.editMode = true;
      this.transaction = this.transactionService.getLocally();
    } else {
      this.groupService.getGroupsByUserId(this.authService.currentUser.id).then(groups => {
        this.groups = groups;
      });
    }
  }

  constructor(private router: Router,
              private navCtrl: NavController,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private groupService: GroupService,
              private authService : AuthService) {
    if (!this.editMode) {
      this.transaction = new Transaction("", 0, "", "cost", "once", authService.currentUser, new Date(), null);
    }
  }

  calculateStakes() {
    let stake: number = this.transaction.amount / this.transaction.group.members.length;
    for (let user of this.transaction.group.members) {
      let stakeEntry = {user, stake};
      let paid = false;
      let accepted = false;
      let paidEntry = {user, paid};
      let acceptedEntry = {user, accepted};
      //this.transaction.participation.push(stakeEntry);
      //this.transaction.accepted.push(acceptedEntry);
      //this.transaction.paid.push(paidEntry);
    }
  }

  nextPage(): void {
    this.errors.clear();
    if (!this.transaction.purpose){
      this.errors.set('purpose', 'Bitte geben Sie einen Zweck an.');
    }
    if (!this.transaction.amount){
      this.errors.set('amount', 'Bitte geben Sie einen Betrag an.');
    }
    if (!this.transaction.group){
      this.errors.set('group', 'Bitte wählen Sie eine Gruppe aus.');
    }
    if (this.errors.size === 0){
      if (!this.transaction.participation) {
        this.transaction.participation = [];
      }
      if (!this.transaction.accepted) {
        this.transaction.accepted = [];
      }
      if (!this.transaction.paid) {
        this.transaction.paid = [];
      }
      if (this.selectAllUsers && this.fairlyDistributedPrice) {
        this.calculateStakes();
        if(!this.editMode) {
          this.transactionService.persist(this.transaction);
        } else {
          this.transactionService.update(this.transaction);
        }
        this.navCtrl.pop();
        return;
      }
      if (!this.selectAllUsers) {
        this.transactionService.saveLocally(this.transaction);
        this.router.navigate(['transaction-participation', {'fairlyDistributedPrice': JSON.stringify(this.fairlyDistributedPrice)}]);
        return;
      }
      if (!this.fairlyDistributedPrice) {
        this.transactionService.saveLocally(this.transaction);
        this.router.navigate(['transaction-stakes']);
        return;
      }
    }
  }

  cancel()
    :
    void {
    this.navCtrl.pop();
  }

  ngOnInit() {
  }

}
