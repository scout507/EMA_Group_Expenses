import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Transaction_User} from "./models/transactionUser.model";
import {Transaction} from "./models/transaction.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionCollection: AngularFirestoreCollection<Transaction>;
  private transaction_userCollection: AngularFirestoreCollection<Transaction_User>;

  constructor(private afs: AngularFirestore) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
    this.transaction_userCollection = afs.collection<Transaction_User>('Transaction_User');
  }

  newTransaction(transaction: Transaction, transactionUser: Transaction_User[]): void{
    this.transactionCollection.add(this.copyAndPrepareTransaction(transaction)).then(r => {
      transactionUser.forEach((transactionUser: Transaction_User) => {
        this.transaction_userCollection.add(this.copyAndPrepareTransaction_User(transactionUser, r.id))
      })

    });
  }

  deleteTransaction(id: string){
    this.transactionCollection.doc(id).delete().then(r => {
      this.getAllTransactionUser(id, "tid").then(transactionUser => {
        transactionUser.forEach(transactionUser => {
          this.transaction_userCollection.doc(transactionUser.id).delete();
        })
      })
    })
  }

  getAllTransactions(): Observable<Transaction[]>{
    return this.transactionCollection.valueChanges({idField: 'id'});
  }

  getAllTransactionUser(id: string, type: string): Promise<Transaction_User[]> {
    let transactionUserArray: Transaction_User[] = [];
    return this.transaction_userCollection.get().toPromise().then(col => {
      col.forEach(doc => {
        if ((type === "tid" && doc.data().tid === id) || (type === "uid" && doc.data().uid)) {
          let transactionUser = doc.data();
          transactionUser.id = doc.id;
          transactionUserArray.push(transactionUser);
        }
      });
      return transactionUserArray;
    });
  }

  findTransactionWithID(tid: string): Promise<Transaction>{
    return this.transactionCollection.doc(tid).get().toPromise().then(transaction => {
      return transaction.data();
    });
  }

  copyAndPrepareTransaction(transaction: Transaction): Transaction{
    const copy = {...transaction};
    delete copy.id;
    copy.dueDate = copy.dueDate || null;
    copy.photo = copy.photo || null;
    copy.purchaseDate = copy.purchaseDate || null;
    return copy;
  }

  copyAndPrepareTransaction_User(transaction_user: Transaction_User, tid: string): Transaction_User{
    const copy = {...transaction_user};
    delete copy.id;
    delete copy.groupName;
    delete copy.displayName;
    copy.tid = tid;
    return copy;
  }
}
