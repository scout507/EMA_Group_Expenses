import {Transaction} from "../models/transaction.model";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService{
  transactionCollection: AngularFirestoreCollection<Transaction>;

  //ToDo: Filter Methode zur Suche einer Transaktion(return wert) anhand eines Users (Parameter). Suche innerhalb von Creator + Participation.

  constructor(private afs: AngularFirestore) {
    this.transactionCollection = afs.collection<Transaction>('Transaction');
  }

  private copyAndPrepare(transaction : Transaction){
    const copy : Transaction = {... transaction};
    delete copy.id;
    return copy;
  }

  isTransactionPending(transaction : Transaction) : boolean {
    transaction.accepted.forEach(entry => {
      if(!entry){
        return false;
      }
    });
    return true;
  }

  persist(transaction: Transaction): void{
    this.transactionCollection.add(this.copyAndPrepare(transaction));
  }

  update(transaction: Transaction): void{
    this.transactionCollection.doc(transaction.id).update(this.copyAndPrepare(transaction));
  }

  getAllTransactions(){
    return this.transactionCollection.get().toPromise().then( result =>
        result.docs.map(doc => {
        const transaction = doc.data();
        transaction.id = doc.id;
        return transaction;
      }));
  }

  getAllTransactionUser(id : string): Promise<User[]>{
    return this.transactionCollection.doc(id).get().toPromise().then(result => {
      let transaction = result.data();
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

  saveLocally(transaction : Transaction){
    localStorage.setItem('transaction', JSON.stringify(transaction))
  }

  getLocally(): Transaction{
    return JSON.parse(localStorage.getItem('transaction'));
  }
}
