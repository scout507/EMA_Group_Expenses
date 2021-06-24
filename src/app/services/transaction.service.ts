import {Transaction} from '../models/transaction.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {GroupService} from './group.service';
import {AuthService} from './auth.service';
import {Group} from '../models/group.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;

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
      //TODO: Check if transaction is active
      document.participation.forEach( part =>{
        if(part.user.id === user.id){
          transactions.push(document);
        }
      });
    });
    await Promise.all(transactions.map(async (transaction) => {
      await this.userService.findById(transaction.creator).then(u => transaction.creator = u);
      await this.groupService.getGroupById(transaction.group).then(group => transaction.group = group);
    }));
    loading.dismiss();
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

  getStakeForUser(member: User, transaction: Transaction): number {
    let stake: number = 0;
    transaction.participation.forEach(participation => {
      if (participation.user.id === member.id) stake = participation.stake
    });
    return stake;
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
}
