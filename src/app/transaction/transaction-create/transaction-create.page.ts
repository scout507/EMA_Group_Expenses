import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
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
  stakes: { user: User, stake: number }[] = [];
  selectAllUsers: boolean = true;
  fairlyDistributedPrice: boolean = true;

  errors: Map<string, string> = new Map<string, string>();

  ionViewWillEnter(){
    this.groupService.getGroupsByUserId(this.authService.currentUser.id).then(groups => {
      this.groups = groups;
    });
  }

  constructor(private router: Router,
              private navCtrl: NavController,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private groupService: GroupService,
              private authService : AuthService) {

    this.transaction = new Transaction("",0, "", "cost", "once", authService.currentUser, new Date(), new Date());
    const groupId = this.route.snapshot.paramMap.get('group');
    if (groupId) {
      this.groupService.getGroupById(groupId).then(group => {
        this.transaction.group = group;
      });
    }
  }

  calculateStakes() {
    if (this.transaction.group) {
        if (this.transaction.amount) {
          if (this.fairlyDistributedPrice) {
            console.log(this.transaction);
            let stake: number = this.transaction.amount / this.transaction.group.members.length;
            for (let user of this.transaction.group.members) {
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
    if (this.transaction.purpose
    ) {
      if (this.transaction.amount) {
        if (this.selectAllUsers && this.fairlyDistributedPrice) {
          this.calculateStakes();
          console.log(this.transaction);
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

  cancel()
    :
    void {
    this.navCtrl.pop();
  }

  ngOnInit() {
  }

}
