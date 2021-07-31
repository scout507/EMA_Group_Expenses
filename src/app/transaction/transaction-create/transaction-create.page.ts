import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {GroupService} from "../../services/group.service";
import {AuthService} from "../../services/auth.service";
import {Camera, CameraResultType} from "@capacitor/camera";
import {TransactionTracker} from "../../models/transactionTracker.model";

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
  currentDate: string = new Date().toISOString();
  maxDate = new Date().getFullYear() + 3;
  errors: Map<string, string> = new Map<string, string>();

  ionViewWillEnter(){
  }

  constructor(private router: Router,
              private navCtrl: NavController,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private groupService: GroupService,
              private authService : AuthService) {
      this.transaction = new Transaction("", null, "", "cost", "once", authService.currentUser, new Date().toDateString(), new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toDateString());
      this.transaction.paid = [];
      this.transaction.accepted = [];
      this.transaction.participation = [];
    if (this.route.snapshot.paramMap.get('fromGroup')) {
      this.groupService.getGroupById(this.route.snapshot.paramMap.get('groupID')).then(group => {this.transaction.group = group});
    }
    this.groupService.getGroupsByUserId(this.authService.currentUser.id).then(groups => {
      this.groups = groups;
    });
  }

  calculateStakes() {
    let stake: number = this.transaction.amount / this.transaction.group.members.length;
    for (let user of this.transaction.group.members) {
      let stakeEntry = {user, stake};
      let paid = user.id === this.transaction.creator.id;
      let accepted = user.id === this.transaction.creator.id;
      let paidEntry = {user, paid};
      let acceptedEntry = {user, accepted};
      this.transaction.participation.push(stakeEntry);
      this.transaction.accepted.push(acceptedEntry);
      this.transaction.paid.push(paidEntry);
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
    if(this.transaction.amount < 0){
      this.errors.set('amount', 'Betrag darf nicht negativ sein.');
    }
    if (!this.transaction.group){
      this.errors.set('group', 'Bitte wählen Sie eine Gruppe aus.');
    }
    if (this.errors.size === 0){
      if (!this.transaction.photo) this.transaction.photo = null;

      if (this.selectAllUsers && this.fairlyDistributedPrice) {
        this.calculateStakes();
        if(!this.editMode) {
          this.transactionService.persist(this.transaction).then(docRef => {
            if (this.transaction.rhythm !== 'once') {
              this.transactionService.getTransactionById(docRef.id).then((doc: any) => {
                let transaction: Transaction = doc;
                let tracker = new TransactionTracker(transaction,
                  transaction.creator,
                  new Date(transaction.dueDate),
                  new Date(new Date(this.transaction.dueDate).getTime() + this.transactionService.getRhythmMiliseconds(this.transaction.rhythm)),
                  new Date(this.transaction.dueDate),
                  this.transactionService.getRhythmMiliseconds(this.transaction.rhythm));
                this.transactionService.persistTracker(tracker);
              });
            }
          });
        } else {
          this.transactionService.update(this.transaction);
        }
        this.navCtrl.pop();
        return;
      }
      if (!this.selectAllUsers) {
        this.transactionService.saveLocally(this.transaction);
        this.router.navigate(['transaction-participants', {'fairlyDistributedPrice': JSON.stringify(this.fairlyDistributedPrice)}]);
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

  async takePicture() {
    await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      }).then(data => {
        this.transaction.photo = "data:image/jpeg;base64, " + data.base64String;
      });
  }

  ngOnInit() {
  }
}
