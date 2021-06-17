import {Transaction} from "../models/transaction.model";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  transactionCollection: AngularFirestoreCollection<Transaction>;

  constructor(private afs: AngularFirestore) {
    this.transactionCollection = afs.collection<Transaction>('transactions');
  }

  private copyAndPrepare(transaction: Transaction) {
    const copy: any = {...transaction};
    delete copy.id;
    delete copy.group;
    delete copy.creator;
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

  getAllTransactions(): Promise<QuerySnapshot<Transaction>> {
    return this.transactionCollection.get().toPromise();
  }

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


  getAllTransactionUser(id
                          :
                          string
  ):
    Promise<User[]> {
    return this.transactionCollection.doc(id).get().toPromise().then(result => {
      let transaction = result.data();
      transaction.id = result.id;
      return Array.from(transaction.participation.keys());
    });
  }

  findAllSync()
    :
    Observable<Transaction[]> {
    return this.transactionCollection.valueChanges({idField: 'id'});
  }

  delete(id
           :
           string
  ) {
    this.transactionCollection.doc(id).delete();
  }

  saveLocally(transaction
                :
                Transaction
  ) {
    localStorage.setItem('transaction', JSON.stringify(transaction))
  }

  getLocally()
    :
    Transaction {
    return JSON.parse(localStorage.getItem('transaction'));
  }
}
