import {Component, ViewChild} from '@angular/core';
import {TransactionService} from '../services/transaction.service';
import {Transaction} from '../models/transaction.model';
import {User} from '../models/user.model';
import {AuthService} from '../services/auth.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import {SimpleTransaction} from '../models/simpleTransaction.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {Share} from '@capacitor/share';
import {UserService} from '../services/user.service';
import {DomSanitizer} from '@angular/platform-browser';
import {IonSearchbar, ModalController} from "@ionic/angular";
import {PaymentReminderPage} from "../payment-reminder/payment-reminder.page";

/**
 * Class used for Home-view. HomePage for displaying the users active Transactions.
 */

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  #searchbar: IonSearchbar;
  @ViewChild(IonSearchbar) set searchbar(sb: IonSearchbar) {
    if (sb) {
      sb.setFocus();
      this.#searchbar = sb;
    }
  }

  //data
  transactions: Transaction[] = [];
  simpleTransactions: SimpleTransaction[] = [];
  filteredTransactions: SimpleTransaction[] = [];
  currentUser: User;

  //current View
  outgoingView: boolean;
  confirmView: boolean;
  incomingView: boolean;
  pendingView: boolean;


  //numbers for display on the filter-buttons
  incoming: number;
  pending: number;
  confirm: number;
  outgoing: number;

  // search & search-bar
  searchbarVisible: boolean;
  search: string;

  /**
   * @ignore
   * @param sanitizer used for the avatar images
   * @param transactionService
   * @param authService
   * @param userService
   * @param groupService
   * @param router
   * @param af
   * @param modalController
   */

  constructor(private sanitizer: DomSanitizer,
              private transactionService: TransactionService,
              private authService: AuthService,
              private userService: UserService,
              private groupService: GroupService,
              private router: Router,
              private af: AngularFireAuth,
              private modalController: ModalController) {
  }

  /**
   * @ignore
   */
  ionViewWillEnter() {
    this.outgoingView = true;
    this.confirmView = false;
    this.incomingView = false;
    this.pendingView = false;
    this.transactionService.createTransactionContinuation();
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.updateTransactions();
          sub.unsubscribe();
        });
      }
    });
  }

  /**
   * Filters all displayed transactions for the given search term (search for purpose, user name, group name). Results get pushed into filteredTransactions.
   * @param searchTerm
   */
  filterTransaction(searchTerm: string) {
    this.filteredTransactions = [];
    this.simpleTransactions.forEach(transaction => {
      if (transaction.purpose.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
        transaction.otherUser.displayName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
        transaction.groupName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
        if(this.outgoingView && transaction.outgoing && !transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.incomingView && !transaction.outgoing && !transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.pendingView && transaction.outgoing && transaction.pending){
          this.filteredTransactions.push(transaction);
        }
        else if(this.confirmView && !transaction.outgoing && transaction.pending){
          this.filteredTransactions.push(transaction);
        }
      }
    });
  }

  /**
   * Navigates to transaction-details-view on click. The transaction gets localy saved for the transaction view to load.
   * @param transactionID
   * @param userID the current user's id.
   */
  viewTransaction(transactionID: string, userID: string) {
    this.transactions.forEach(transaction =>{
      if(transaction.id === transactionID){
        localStorage.setItem('otherUser', JSON.stringify(userID));
        this.transactionService.saveLocally(transaction);
        this.router.navigate(['transaction-details', {id: this.currentUser.id}]);
      }
    });
  }

  /**
   * Creates the PaymentReminder modal.
   * @param transaction
   */
  async createPaymentReminder(transaction: SimpleTransaction) {
    const modal = await this.modalController.create({
      component: PaymentReminderPage,
      componentProps: {
        displayName_otherUser: transaction.otherUser.displayName,
        groupName: transaction.groupName,
        purpose: transaction.purpose,
        amount: transaction.amount.toString(),
        dueDate: transaction.dueDate,
        displayName_currentUser: this.currentUser.displayName
      }
    });
    await modal.present();
    const result = await modal.onDidDismiss();

    if(result.data !== undefined){
      Share.share({
        title: `Zahlungserinnerung von ${this.currentUser.displayName}`,
        text: result.data,
        dialogTitle: 'Zahlungserinnerung'
      }).then(() => console.log("Sharing supported"))
        .catch(error => console.log(error));
    }
  }

  /**
   * Reloads all of the users active transactions. Transactions get parsed into SimpleTransaction format and pushed into transactions.
   * Calls filterTransaction with the current search.
   * Updates the counters for amounts displayed.
   */
  updateTransactions() {
    this.transactions = [];
    this.simpleTransactions = [];
    this.search = '';
    this.transactionService.getAllTransactionByUser(this.currentUser, false).then( result => {
      result.forEach( transaction => {
        this.createSimpleTransaction(transaction);
      });
      this.transactions.push(...result);
      this.filterTransaction(this.search);

      //for the counter
      this.outgoing = 0;
      this.incoming = 0;
      this.pending = 0;
      this.confirm = 0;
      //TODO: add pending
      this.simpleTransactions.forEach(transaction => {
        if(transaction.outgoing && !transaction.pending){
          this.outgoing += transaction.amount;
        }
        else if(!transaction.outgoing && !transaction.pending){
          this.incoming += transaction.amount;
        }
        else if(transaction.outgoing && transaction.pending){
          this.pending ++;
        }
        else if(!transaction.outgoing && transaction.pending){
          this.confirm++;
        }
      });
      this.outgoing = Math.round(this.outgoing);
      this.incoming = Math.round(this.incoming);
    });
  }

  /**
   * Calls updateTransactions() when the refresher is activated.
   * @param event
   */
  refreshHandler(event) {
    this.updateTransactions();
    setTimeout(() => {
      event.target.complete();
    }, 200);
  }

  /**
   * Formats the transaction recived from the TransactionService into the SimpleTransaction format.
   * SimpleTransactions only contain the necessary information for display in home-view and are based on a one-to-one user relationship.
   * In some cases multiple SimpleTransactions have to be created for one Transaction.
   *
   * @param transaction transaction to be parsed into SimpleTransaction(s)
   */

  createSimpleTransaction(transaction: Transaction){
    let otherUser: User;
    let outgoing = true;
    let cost: number;
    let pending: boolean;
    if(transaction.creator.id !== this.currentUser.id){
      otherUser = transaction.creator;
      if(transaction.type === 'income') {outgoing = false;}

      for(let i = 0; i < transaction.participation.length; i++){
        if(transaction.accepted[i].accepted !== true && transaction.participation[i].user.id === this.currentUser.id) {
          cost = Math.round(transaction.participation[i].stake * 100) / 100;
          pending = transaction.paid[i].paid;
          // eslint-disable-next-line max-len
          this.simpleTransactions.push(new SimpleTransaction(transaction.id,cost,transaction.purpose,outgoing,pending,otherUser,transaction.group.name,transaction.dueDate));
        }
      }
    }
    else{
      if(transaction.type === 'cost') {outgoing = false;}
      for(let i = 0; i < transaction.participation.length; i++){
        if(transaction.participation[i].user.id !== this.currentUser.id){
          if(transaction.accepted[i].accepted !== true) {
            otherUser = transaction.participation[i].user;
            cost = Math.round(transaction.participation[i].stake * 100) / 100;
            pending = transaction.paid[i].paid;
            // eslint-disable-next-line max-len
            this.simpleTransactions.push(new SimpleTransaction(transaction.id, cost, transaction.purpose, outgoing, pending, otherUser, transaction.group.name, transaction.dueDate));
          }
        }
      }
    }
  }

  /**
   * Displays the confirmDialog alert.
   * @param transactionID ID of the transaction to be confirmed.
   * @param userID The other user's id
   * @param userName The other user's name
   */
  async confirmDialog(transactionID: string, userID: string, userName: string){
    const alert = document.createElement('ion-alert');
    alert.header = 'Hast du die Zahlung von ' + userName + ' erhalten?';
    alert.buttons = [{ text: 'Ja', role: 'yes' },{ text: 'Details', role: 'detail' },{ text: 'Abbrechen'}];

    document.body.appendChild(alert);
    await alert.present();
    const rsl = await alert.onDidDismiss();
    if (rsl.role === 'yes') {
        this.confirmTransaction(transactionID,userID);
    }
    else if(rsl.role === 'detail'){
      this.viewTransaction(transactionID, userID);
    }
  }

  /**
   * Calculates and returns the difference of the transaction.dueDate to the current date.
   * @param transcation
   */
  getDateDifference(transcation: Transaction){
    // @ts-ignore
    return Math.round((new Date(transcation.dueDate ) - new Date())/86400000)+1;
  }

  /**
   * Calls the filter-Method
   */
  doSearch() {
    this.filterTransaction(this.search);
  }

  /**
   * Cancels search, resets the search-term and displayed transactions and deactivates the search-bar.
   */
  cancelSearch() {
    this.clearSearch();
    this.filterTransaction(this.search);
    this.searchbarVisible = false;
  }

  /**
   * Empties the search sting
   */
  clearSearch() {
    this.search = '';
  }

  /**
   * Activates the search-bar
   */
  startSearch() {
    this.searchbarVisible = true;
  }

  /**
   * Switches between different views (which type of transactions are displayed).
   * @param type Number that corresponds to the view.
   */
  buttonHandler(type: number) {
    this.incomingView = false;
    this.outgoingView = false;
    this.pendingView = false;
    this.confirmView = false;

    if (type === 0) {this.outgoingView = true;}
    else if (type === 1) {this.incomingView = true;}
    else if (type === 2) {this.pendingView = true;}
    else {this.confirmView = true;}
  }

  /**
   * Confirmes a given transaction for a given user and refreshes the displayed transactions.
   * If the transaction is of type 'cost' the other user needs to be flagged as accepted in the accepted array.
   * If the transaction is of type 'income' the current user needs to be flagged as accepted in the accepted array (Because the current user is recieving money from the other user).
   * @param transactionID Id of the transaction to be confirmed.
   * @param userID The other user's ID.
   */
  confirmTransaction(transactionID: string, userID: string){
    this.transactions.forEach(transaction => {
      if(transaction.id === transactionID){
        if(transaction.type === "cost") {
          transaction.accepted.forEach(a => {
            if (a.user.id === userID) {
              a.accepted = true;
              transaction.finished = this.transactionService.checkTransactionFinish(transaction);
              this.transactionService.update(transaction);
              setTimeout( () => { this.updateTransactions(); }, 150 );
            }
          });
        }else{
          transaction.accepted.forEach(a => {
            if (a.user.id === this.currentUser.id) {
              a.accepted = true;
              transaction.finished = this.transactionService.checkTransactionFinish(transaction);
              this.transactionService.update(transaction);
              setTimeout( () => { this.updateTransactions(); }, 150 );
            }
          });
        }
      }
    });
  }
}
