import {Transaction} from "../models/transaction.model";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {AuthService} from "./auth.service";
import {GroupService} from "./group.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;

  constructor(private afs: AngularFirestore, private authService : AuthService, private groupService : GroupService) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
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

  //ToDo: Add id to transaction
  async getAllTransactions() : Promise<Transaction[]> {
    const snapshot = await this.transactionCollection.get().toPromise();
    let transactions = [];
    await snapshot.docs.map(doc => {
      let transaction =  doc.data();
      transaction.id = doc.id;
      return transaction;
    }).forEach(document => transactions.push(document));
    await transactions.forEach(transaction => {
      this.authService.getUserById(transaction.creator).then(user => transaction.creator = user);
      this.groupService.getGroupById(transaction.group).then(group => transaction.group = group);
    });
    return transactions;
  }

  //ToDo: Use getAllTransactions
  findTransactionByUser(user: User): Transaction[] {
    let userTransactions: Transaction[] = [];
    this.transactionCollection.get().toPromise().then(results => {
      results.forEach(transactionRaw => {
        let transaction: Transaction = transactionRaw.data();
        this.getAllTransactionUser(transaction.id).then(users => {
          if (transaction.creator == user) {
            userTransactions.push(transaction);
            return;
          }
          users.forEach(userTrans => {
            if (userTrans == user) {
              userTransactions.push(transaction);
              return
            }
          })
        })
      });
      return userTransactions;
    });
    return userTransactions;
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

  saveLocally(transaction : Transaction){
    localStorage.setItem('transaction', JSON.stringify(transaction));
  }

  getLocally(): Transaction{
    return JSON.parse(localStorage.getItem('transaction'));
  }
}
