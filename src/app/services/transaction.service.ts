import {Transaction} from "../models/transaction.model";
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection, QuerySnapshot} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TransactionService{
  transactionCollection: AngularFirestoreCollection<Transaction>;


  constructor(private afs: AngularFirestore) {
    this.transactionCollection = afs.collection<Transaction>('transactions');
  }

  private copyAndPrepare(transaction : Transaction){
    const copy = {... transaction};
    delete copy.id;
    return copy;
  }

  persist(transaction : Transaction): void{
    this.transactionCollection.add(this.copyAndPrepare(transaction));
  }

  update(transaction : Transaction): void{
    this.transactionCollection.doc(transaction.id).update(this.copyAndPrepare(transaction));
  }

  findAll(): Promise<QuerySnapshot<Transaction>>{
    return this.transactionCollection.get().toPromise();
  }

  /*
  findAllSync(): Observable<Transaction> {
    return this.transactionCollection.valueChanges({idField: 'id'});
  }
  */

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
