import {Transaction} from '../models/transaction.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {GroupService} from './group.service';
import {AuthService} from './auth.service';
import {Group} from '../models/group.model';
import { UserService } from './user.service';
import { TransactionTracker } from "../models/transactionTracker.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;
  recTransactionCollection: AngularFirestoreCollection<TransactionTracker>;

  constructor(private afs: AngularFirestore, private groupService: GroupService, private authService: AuthService, private userService: UserService) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
  }


  isTransactionPending(transaction: Transaction): boolean {
    transaction.accepted.forEach(entry => {
      if (!entry) {
        return false;
      }
    });
    return true;
  }

  persist(transaction: Transaction): void {
    this.transactionCollection.add(this.copyAndPrepare(transaction));
  }

  update(transaction: Transaction): void {
    this.transactionCollection.doc(transaction.id).update(this.copyAndPrepare(transaction));
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
    transactions.sort(function(b,a): any{
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

  deleteAllTransactionsByUser(user: User){
    this.userService.findById("QWgrWPALVhaZPnB1ZCiqbOELYbJ2").then(deletedUser =>{
      this.getAllTransactionByUser(user).then(transactions => {
        transactions.forEach(transaction => {
          if(transaction.creator.id === user.id){
            this.delete(transaction.id);
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

  findAllSync(): Observable<Transaction[]> {
    return this.transactionCollection.valueChanges({idField: 'id'});
  }

  delete(id: string) {
    this.transactionCollection.doc(id).delete();
  }

  saveLocally(transaction: Transaction){
    localStorage.setItem('transaction', JSON.stringify(transaction));
  }

  getLocally(): Transaction{
    return JSON.parse(localStorage.getItem('transaction'));
  }

  checkTransactionFinish(transaction: Transaction): boolean{
    for(const a of transaction.accepted){
      if(a.accepted === false){
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

  async handleRecTransactions(user: User){
    const snapshot = await this.recTransactionCollection.get().toPromise();
    await snapshot.docs.map(doc => {
      const transactionHandler = doc.data();
      transactionHandler.id = doc.id;
    });
  }

  checkAllTransactionsFinishedInGroup(group: Group): Promise<boolean>{
    let transactions: Transaction[];
    let openTransactions: boolean = false;
    return this.getAllTransactionByGroup(group).then(t => {
      transactions = t;
      transactions.forEach(t => {
        if(!this.checkTransactionFinish(t)){
          openTransactions = true;
        }
      });
      return openTransactions;
    });
  }
  
  checkTransactionsFinishedInGroupByUser(group: Group, user: User){
    let transactions: Transaction[];
    let openTransactions: boolean = false;
    let participants: User[] = [];
    return this.getAllTransactionByGroup(group).then(t => {
      transactions = t;
      transactions.forEach(t => {
        participants = this.getParticipants(t);
        participants.forEach(p => {
          if(p.id === user.id && (!this.hasUserPaid(user, t) || !this.wasPaymentAccepted(user, t))){
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
}
