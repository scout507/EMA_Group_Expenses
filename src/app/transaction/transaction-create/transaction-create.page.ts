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
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.page.html',
  styleUrls: ['./transaction-create.page.scss'],
})
/**
 * Class representing the logic for the transaction create view.
 */
export class TransactionCreatePage implements OnInit {
  //The transaction that is going to be saved or passed later on.
  transaction: Transaction;
  //The groups of the current user.
  groups: Group[] = [];
  //Boolean to check whether the participants are picked individually or all at once.
  selectAllUsers: boolean = true;
  //Boolean to check whether everyone pays the same or stakes are decided indiviudally.
  fairlyDistributedPrice: boolean = true;
  //String for the current date to prevent past dates in date pickers
  currentDate: string = new Date().toISOString();
  //Calculation of max date; 3 years from now.
  maxDate = new Date().getFullYear() + 3;
  //Map for saving occuring errors and corresponding messages.
  errors: Map<string, string> = new Map<string, string>();
  //Boolean to mark whether the user came via group menu or not
  fromGroup: boolean = false;
  currentUser: User;

  ionViewWillEnter(){
    if (this.route.snapshot.paramMap.get('fromGroup')) {
      this.fromGroup = true;
      this.groupService.getGroupById(this.route.snapshot.paramMap.get('groupID')).then(group => {this.transaction.group = group});
    }
  }

  /**
   * @ignore
   * @param router
   * @param navCtrl
   * @param route
   * @param transactionService
   * @param groupService
   * @param userService
   * @param af
   * @param authService
   */
  constructor(private router: Router,
              private navCtrl: NavController,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private groupService: GroupService,
              private userService: UserService,
              private af: AngularFireAuth,
              private authService : AuthService) {

      this.transaction = new Transaction("", null, "", "cost", "once", authService.currentUser, new Date().toDateString(), new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toDateString());
      this.transaction.paid = [];
      this.transaction.accepted = [];
      this.transaction.participation = [];

    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.groupService.getGroupsByUserId(this.currentUser.id).then(groups => {
            this.groups = groups;
          });
          sub.unsubscribe();
        });
      }
    });
  }

  /**
   * Function to calculate stakes for all participants.
   */
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

  /**
   * Function to save the current data locally and navigate to the next creation page or finish the transaction creation. Checks for errors of inputs.
   */
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

  /**
   * Function to cancel transaction creation and navigate to last page.
   */
  cancel(): void {
    this.navCtrl.pop();
  }

  /**
   * Function to attach a picture to the transaction.
   */
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
