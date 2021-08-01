import {Transaction} from '../models/transaction.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {GroupService} from './group.service';
import {AuthService} from './auth.service';
import {Group} from '../models/group.model';
import {UserService} from './user.service';
import {TransactionTracker} from "../models/transactionTracker.model";


/***
 *
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Class representing all logic regarding transactions and transactionTrackers.
 */
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>; //The collection of all transaction objects in the firebase database.
  transactionTrackerCollection: AngularFirestoreCollection<TransactionTracker>; //The collection of all transactionTracker objects in the firebase database.

  /**
   * @ignore
   * @param afs
   * @param groupService
   * @param authService
   * @param userService
   */
  constructor(private afs: AngularFirestore, private groupService: GroupService, private authService: AuthService, private userService: UserService) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
    this.transactionTrackerCollection = afs.collection<TransactionTracker>('TransactionTracker');
  }

  /**
   * Function to save a transaction to the database.
   * @param transaction: the transaction to save.
   */
  persist(transaction: Transaction) {
    return this.transactionCollection.add(this.copyAndPrepare(transaction));
  }

  /**
   * Function to update changes of a transaction to the database.
   * @param transaction: The changed transaction.
   */
  async update(transaction: Transaction): Promise<void> {
    await this.transactionCollection.doc(transaction.id).update(this.copyAndPrepare(transaction));
  }

  /**
   * Function to search through all transactions and find one with a given ID.
   * @param id: the ID of the searched transaction.
   */
  async getTransactionById(id: string) {
    let doc: any = await this.transactionCollection.doc(id).get().toPromise();
    let transaction = doc.data();
    transaction.id = doc.id;
    await this.userService.findById(doc.data().creator).then(user => transaction.creator = user);
    await this.groupService.getGroupById(doc.data().group).then(group => transaction.group = group);
    return transaction;
  }

  /**
   * Function to get all transactions.
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const snapshot = await this.transactionCollection.get().toPromise();
    const transactions = [];
    await snapshot.docs.map(doc => {
      const transaction = doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {transactions.push(document);});
    await Promise.all(transactions.map(async (transaction) => {
      await this.userService.findById(transaction.creator.id).then(user => transaction.creator = user);
      await this.groupService.getGroupById(transaction.group).then(group => transaction.group = group);
    }));
    return transactions;

  }

  /**
   * Function to get all transactions where the current user is either creator or participant.
   * @param user: The current user.
   * @param withOld: ToDo
   */
  async getAllTransactionByUser(user: User, withOld: boolean): Promise<Transaction[]> {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.message = 'Lade Daten';
    loading.duration = 100000;
    document.body.appendChild(loading);
    await loading.present();

    const snapshot = await this.transactionCollection.get().toPromise();
    const transactions = [];

    await snapshot.docs.map(doc => {
      const transaction = doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {
      if(!withOld) {
        if (!document.finished) {
          if (document.creator.toString() === user.id) {
            transactions.push(document);
          } else {
            document.participation.forEach(part => {
              if (part.user.id === user.id) {
                transactions.push(document);
              }
            });
          }
        }
      }else{
        if (document.creator.toString() === user.id) {
          transactions.push(document);
        } else {
          document.participation.forEach(part => {
            if (part.user.id === user.id) {
              transactions.push(document);
            }
          });
        }
      }
    });
    await Promise.all(transactions.map(async (transaction) => {
      await this.userService.findById(transaction.creator).then(u => transaction.creator = u);
      await this.groupService.getGroupById(transaction.group).then(group => transaction.group = group);
      for(let i in transaction.participation){
        await this.userService.findById(transaction.participation[i].user).then(user => {
          transaction.participation[i].user = user;
          transaction.paid[i].user = user;
        });
      }
    }));
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    transactions.sort(function(b,a): any{
      // @ts-ignore
      return new Date(b.dueDate) - new Date(a.dueDate);
    });

    loading.dismiss();
    return transactions;
  }

  /**
   * Function to find all transactions for a given group.
   * @param group: The group of which the transactions are searched
   */
  async getAllTransactionByGroup(group: Group): Promise<Transaction[]> {
    const snapshot = await this.transactionCollection.get().toPromise();
    const transactions = [];

    await snapshot.docs.map(doc => {
      const transaction = doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {
      if(document.group.toString() === group.id){
        document.group = group;
        transactions.push(document);
      }
    });
    await Promise.all(transactions.map(async (transaction) => {
      await this.userService.findById(transaction.creator).then(u => transaction.creator = u);
    }));
    return transactions;
  }

  /**
   * Function to find all transactionTracker.
   */
  private async getAllTransactionTracker() {
    const snapshot = await this.transactionTrackerCollection.get().toPromise();

    let tracker = [];

    await snapshot.docs.map((doc: any) => {
      let currTracker = doc.data();
      currTracker.id = doc.id;
      tracker.push(currTracker);
    });
    return tracker;
  }

  /**
   * Function to delete all transactions of a certain user. Used for user deletion.
   * @param user: the user of which the transactions need to be deleted.
   */
  deleteAllTransactionsByUser(user: User){
    this.userService.findById("QWgrWPALVhaZPnB1ZCiqbOELYbJ2").then(deletedUser =>{
      this.getAllTransactionByUser(user,true).then(transactions => {
        transactions.forEach(transaction => {
          if(transaction.creator.id === user.id){
            if(transaction.finished){
              transaction.creator = deletedUser;
              for (let i = 0; i < transaction.participation.length; i++) {
                if (transaction.participation[i].user.id === user.id) {
                  transaction.participation[i].user = deletedUser;
                }
                if (transaction.paid[i].user.id === user.id) {
                  transaction.paid[i].user = deletedUser;
                }
                if (transaction.accepted[i].user.id === user.id) {
                  transaction.accepted[i].user = deletedUser;
                }
              }
            }
            else this.delete(transaction.id);
          }
          else {
            for (let i = 0; i < transaction.participation.length; i++) {
              if (transaction.participation[i].user.id === user.id) {
                transaction.participation[i].user = deletedUser;
              }
              if (transaction.paid[i].user.id === user.id) {
                transaction.paid[i].user = deletedUser;
              }
              if (transaction.accepted[i].user.id === user.id) {
                transaction.accepted[i].user = deletedUser;
              }
            }
          }
          this.update(transaction);
        });
      });
    });
  }

  /**
   * Function to create a subscribable object of the transaction entries in the database.
   */
  findAllSync(): Observable<Transaction[]> {
    return this.transactionCollection.valueChanges({idField: 'id'});
  }

  /**
   * Function to delete a transaction via id.
   * @param id: the id of the transaction to delete
   */
  delete(id: string) {
    this.transactionCollection.doc(id).delete();
  }

  /**
   * Function to delete a transactionTracker.
   * @param tracker: The tracker to delete.
   */
  deleteTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.doc(tracker.id).delete();
  }

  /**
   * Function to find a tracker via Transaction-ID.
   * @param transactionID: The ID of the transaction.
   */
  findTrackerById(transactionID: string){
    return this.getAllTransactionTracker().then(trackerList => {
      for (let tracker of trackerList){
        if (tracker.originalTransaction.id == transactionID){
          return tracker;
        }
      }
    })
  }

  /**
   * Function to save a transaction in the local storage.
   * @param transaction: the transaction to save.
   */
  saveLocally(transaction: Transaction) {
    localStorage.setItem('transaction', JSON.stringify(transaction));
  }

  /**
   * Function to load a transaction from the local storage.
   */
  getLocally(): Transaction {
    return JSON.parse(localStorage.getItem('transaction'));
  }

  /**
   * Function to check if a transaction is finished.
   * @param transaction: the transaction to check.
   */
  checkTransactionFinish(transaction: Transaction): boolean {
    for (const a of transaction.accepted) {
      if (a.accepted === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Function to get the stakes of a certion user from a given transaction.
   * @param member: the user of which stakes are searched
   * @param transaction: the transaction for the search.
   */
  getStakeForUser(member: User, transaction: Transaction): number {
    let stake: number = 0;
    transaction.participation.forEach(participation => {
      if (participation.user.id === member.id) stake = participation.stake
    });
    return Math.round(stake * 100) / 100;
  }

  /**
   * Function to check whether the given user has paid the given transaction or not.
   * @param member: user to check.
   * @param transaction: transaction to check.
   */
  hasUserPaid(member: string, transaction: Transaction): boolean {
    let paid: boolean = false;
    transaction.paid.forEach(payment => {
      if (payment.user.id === member) paid = payment.paid;
    });
    return paid;
  }

  /**
   * Function to check whether the given users payment in the given transaction has been accepted or not.
   * @param member: user to check.
   * @param transaction: transaction to check.
   */
  wasPaymentAccepted(member: string, transaction: Transaction): boolean {
    let accepted: boolean = false;
    transaction.accepted.forEach(entry => {
      if (entry.user.id === member) accepted = entry.accepted;
    });
    return accepted;
  }

  /**
   * Function to return all participants of given transaction
   * @param transaction: transaction to check for participants
   */
  getParticipants(transaction: Transaction): User[] {
    let participants: User[] = [];
    transaction.participation.forEach(participant => participants.push(participant.user));
    return participants;
  }

  /**
   * Function to check whether all transactions of the given group are finished or not.
   * @param group: the group to check.
   */
  checkAllTransactionsFinishedInGroup(group: Group): Promise<boolean> {
    let transactions: Transaction[];
    let openTransactions = false;
    return this.getAllTransactionByGroup(group).then(t => {
      transactions = t;
      transactions.forEach(t => {
        if (!this.checkTransactionFinish(t)) {
          openTransactions = true;
        }
      });
      return openTransactions;
    });
  }

  /**
   * Function to check if all transactions of a certain user are finished in a certain group.
   * @param group: group to check
   * @param user: user to check
   */
  checkTransactionsFinishedInGroupByUser(group: Group, user: User) {
    let transactions: Transaction[];
    let openTransactions: boolean = false;
    let participants: User[] = [];
    return this.getAllTransactionByGroup(group).then(t => {
      transactions = t;
      transactions.forEach(t => {
        participants = this.getParticipants(t);
        participants.forEach(p => {
          if (p.id === user.id && (!this.hasUserPaid(user.id, t) || !this.wasPaymentAccepted(user.id, t))) {
            openTransactions = true;
          }
        })
      });
      return openTransactions;
    })
  }

  /**
   * Function to redesign transaction data type for saving in database.
   * @param transaction: the transaction that needs to be saved.
   */
  private copyAndPrepare(transaction: Transaction) {
    const copy: any = {...transaction};
    delete copy.id;
    delete copy.group;
    delete copy.creator;
    copy.photo = transaction.photo || null;
    copy.group = transaction.group.id;
    copy.creator = transaction.creator.id;
    for (let i = 0; i < copy.participation.length; i++) {
      copy.participation[i].user = copy.participation[i].user.id;
      copy.accepted[i].user = copy.accepted[i].user.id;
      copy.paid[i].user = copy.paid[i].user.id;
    }
    console.log(copy);
    return copy;
  }

  /**
   * Function to create reoccuring transactions.
   */
  async createTransactionContinuation() {
    let currentDate = new Date().getTime();
    const tracker: TransactionTracker[] = await this.getAllTransactionTracker();
    tracker.forEach((tracker: any) => {
      if (tracker.creator === this.authService.currentUser.id) {
        let transaction = tracker.originalTransaction;
        tracker.createDate = new Date(tracker.createDate.seconds * 1000);
        tracker.lastDate = new Date(tracker.lastDate.seconds * 1000);
        if (tracker.lastDate.getTime() <= currentDate) {
          let missedEntries = Math.ceil((currentDate - tracker.lastDate.getTime()) / tracker.rhythm);
          if (missedEntries > 0) {
            for (let i = 0; i < missedEntries; i++) {
              let transactionContinuation: Transaction = transaction;
              this.groupService.getGroupById(transaction.group).then(group => {
                this.userService.findById(tracker.creator).then(creator => {
                  transactionContinuation.photo = null;
                  transactionContinuation.creator = creator;
                  transactionContinuation.group = group;
                  transactionContinuation.purchaseDate = transaction.dueDate;
                  transactionContinuation.dueDate = new Date(tracker.lastDate.getTime() + this.getRhythmMiliseconds(tracker.originalTransaction.rhythm)).toDateString();
                  tracker.lastDate = new Date(transactionContinuation.dueDate);
                  tracker.creator = creator;
                  this.persist(transactionContinuation);
                  this.updateTracker(tracker);
                });
              });
            }
          }
        }
      }
    })
  }

  /**
   * Function to get the time in milliseconds that a rhythm needs in between occurrences.
   * @param rhythm
   */
  getRhythmMiliseconds(rhythm: string) {
    let rhythmMiliseconds = 0;
    if (rhythm === 'daily') {
      rhythmMiliseconds = 86400000;
    }
    if (rhythm === 'weekly') {
      rhythmMiliseconds = 86400000 * 7;
    }
    if (rhythm === 'monthly') {
      rhythmMiliseconds = 86400000 * 31;
    }
    if (rhythm === 'yearly') {
      rhythmMiliseconds = 86400000 * 365;
    }
    return rhythmMiliseconds;
  }

  /**
   * Function to save a changed tracker.
   * @param tracker: tracker to save.
   */
  updateTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.doc(tracker.id).update(this.copyAndPrepareTracker(tracker));
  }

  /**
   * Function to save a tracker to the database.
   * @param tracker: tracker to save.
   */
  persistTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.add(this.copyAndPrepareTracker(tracker));
  }

  /**
   * Function to redesign tracker data model for saving in the database.
   * @param tracker: the tracker to save.
   */
  private copyAndPrepareTracker(tracker: TransactionTracker) {
    const copy: any = {...tracker};
    delete copy.id;
    //delete copy.originalTransaction.group;
    copy.creator = tracker.creator.id;
    copy.originalTransaction.group = tracker.originalTransaction.group.id;
    return copy;
  }
}
