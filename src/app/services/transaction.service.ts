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

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;
  transactionTrackerCollection: AngularFirestoreCollection<TransactionTracker>;

  constructor(private afs: AngularFirestore, private groupService: GroupService, private authService: AuthService, private userService: UserService) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
    this.transactionTrackerCollection = afs.collection<TransactionTracker>('TransactionTracker');
  }


  isTransactionPending(transaction: Transaction): boolean {
    transaction.accepted.forEach(entry => {
      if (!entry) {
        return false;
      }
    });
    return true;
  }

  persist(transaction: Transaction) {
    return this.transactionCollection.add(this.copyAndPrepare(transaction));
  }

  update(transaction: Transaction): void {
    this.transactionCollection.doc(transaction.id).update(this.copyAndPrepare(transaction));
  }

  async getTransactionById(id: string) {
    let doc: any = await this.transactionCollection.doc(id).get().toPromise();
    let transaction = doc.data();
    transaction.id = doc.id;
    await this.userService.findById(doc.data().creator).then(user => transaction.creator = user);
    await this.groupService.getGroupById(doc.data().group).then(group => transaction.group = group);
    return transaction;
  }

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

  async getAllTransactionByUser(user: User): Promise<Transaction[]> {
    const loading = document.createElement('ion-loading');
    loading.cssClass = 'loading';
    loading.message = 'Lade Daten';
    loading.duration = 10000;
    document.body.appendChild(loading);
    await loading.present();

    const snapshot = await this.transactionCollection.get().toPromise();
    const transactions = [];

    await snapshot.docs.map(doc => {
      const transaction = doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {
      if(!document.finished) {
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
    }));
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    transactions.sort(function (b, a): any {
      // @ts-ignore
      return new Date(b.dueDate) - new Date(a.dueDate);
    });

    loading.dismiss();
    return transactions;
  }

  async getAllTransactionByGroup(group: Group): Promise<Transaction[]> {
    const snapshot = await this.transactionCollection.get().toPromise();
    const transactions = [];

    await snapshot.docs.map(doc => {
      const transaction = doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {
      //TODO: Check if transaction is active
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

  async getAllTransactionUser(id: string): Promise<User[]> {
    let users = [];
    let snapshot = await this.transactionCollection.doc(id).get().toPromise();
    await snapshot.data().participation.forEach(entry => {
      users.push(entry.user);
    });
    return users;
  }

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

  deleteAllTransactionsByUser(user: User) {
    this.userService.findById("QWgrWPALVhaZPnB1ZCiqbOELYbJ2").then(deletedUser => {
      this.getAllTransactionByUser(user).then(transactions => {
        transactions.forEach(transaction => {
          if (transaction.creator.id === user.id) {
            this.delete(transaction.id);
          } else {
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

  findAllSync(): Observable<Transaction[]> {
    return this.transactionCollection.valueChanges({idField: 'id'});
  }

  delete(id: string) {
    this.transactionCollection.doc(id).delete();
  }

  deleteTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.doc(tracker.id).delete();
  }

  saveLocally(transaction: Transaction) {
    localStorage.setItem('transaction', JSON.stringify(transaction));
  }

  getLocally(): Transaction {
    return JSON.parse(localStorage.getItem('transaction'));
  }

  checkTransactionFinish(transaction: Transaction): boolean {
    for (const a of transaction.accepted) {
      if (a.accepted === false) {
        return false;
      }
    }
    return true;
  }

  getStakeForUser(member: User, transaction: Transaction): number {
    let stake: number = 0;
    transaction.participation.forEach(participation => {
      if (participation.user.id === member.id) stake = participation.stake
    });
    return Math.round(stake * 100) / 100;
  }

  hasUserPaid(member: User, transaction: Transaction): boolean {
    let paid: boolean = false;
    transaction.paid.forEach(payment => {
      if (payment.user.id === member.id) paid = payment.paid;
    });
    return paid;
  }

  wasPaymentAccepted(member: User, transaction: Transaction): boolean {
    let accepted: boolean = false;
    transaction.accepted.forEach(entry => {
      if (entry.user.id === member.id) accepted = entry.accepted;
    });
    return accepted;
  }

  getParticipants(transaction: Transaction): User[] {
    let participants: User[] = [];
    transaction.participation.forEach(participant => participants.push(participant.user));
    return participants;
  }

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

  checkTransactionsFinishedInGroupByUser(group: Group, user: User) {
    let transactions: Transaction[];
    let openTransactions: boolean = false;
    let participants: User[] = [];
    return this.getAllTransactionByGroup(group).then(t => {
      transactions = t;
      transactions.forEach(t => {
        participants = this.getParticipants(t);
        participants.forEach(p => {
          if (p.id === user.id && (!this.hasUserPaid(user, t) || !this.wasPaymentAccepted(user, t))) {
            openTransactions = true;
          }
        })
      });
      return openTransactions;
    })
  }

  private copyAndPrepare(transaction: Transaction) {
    const copy: any = {...transaction};
    delete copy.id;
    delete copy.group;
    delete copy.creator;
    copy.photo = transaction.photo || null;
    copy.group = transaction.group.id;
    copy.creator = transaction.creator.id;
    return copy;
  }

  async createTransactionContinuation() {
    let currentDate = new Date().getTime();
    const tracker: TransactionTracker[] = await this.getAllTransactionTracker();
    console.log(tracker);
    tracker.forEach((tracker: any) => {
      if (tracker.creator === this.authService.currentUser.id) {
        console.log('Found tracker from user.');
        let transaction = tracker.originalTransaction;
        tracker.createDate = new Date(tracker.createDate.seconds * 1000);
        tracker.lastDate = new Date(tracker.lastDate.seconds * 1000);
        console.log(tracker);
        if (tracker.lastDate.getTime() <= currentDate) {
          let missedEntries = Math.ceil((currentDate - tracker.lastDate.getTime()) / tracker.rhythm);
          if (missedEntries > 0) {
            console.log(`There's ${missedEntries} transactions that need to be created...`);
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
                  console.log(transactionContinuation.dueDate);
                  console.log(tracker);
                  console.log(transactionContinuation);
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


  updateTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.doc(tracker.id).update(this.copyAndPrepareTracker(tracker));
  }

  persistTracker(tracker: TransactionTracker) {
    this.transactionTrackerCollection.add(this.copyAndPrepareTracker(tracker));
  }

  private copyAndPrepareTracker(tracker: TransactionTracker) {
    const copy: any = {...tracker};
    delete copy.id;
    //delete copy.originalTransaction.group;
    copy.creator = tracker.creator.id;
    copy.originalTransaction.group = tracker.originalTransaction.group.id;
    return copy;
  }
}
