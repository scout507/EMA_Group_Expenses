import {Transaction} from '../models/transaction.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {GroupService} from './group.service';
import {AuthService} from './auth.service';
import {Group} from '../models/group.model';




@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;

  constructor(private afs: AngularFirestore, private groupService: GroupService, private authService: AuthService) {
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
      const transaction =  doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {transactions.push(document);});
    await Promise.all(transactions.map(async (transaction) => {
        await this.authService.getUserById(transaction.creator).then(user => transaction.creator = user);
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
      const transaction =  doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => {
      //TODO: also search participation
      if(document.creator.toString() === user.id){
        transactions.push(document);
      }
    });
    await Promise.all(transactions.map(async (transaction) => {
      await this.authService.getUserById(transaction.creator).then(u => transaction.creator = u);
      await this.groupService.getGroupById(transaction.group).then(group => transaction.group = group);
    }));
    loading.dismiss();
    return transactions;
  }


  getAllTransactionUser(id:
                          string
  ):
    Promise<User[]> {
    return this.transactionCollection.doc(id).get().toPromise().then(result => {
      const transaction = result.data();
      transaction.id = result.id;
      return Array.from(transaction.participation.keys());
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

  async presentLoading() {

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
