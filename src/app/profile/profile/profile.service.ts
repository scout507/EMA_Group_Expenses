import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User2');
  }

  persist(user: User) {
    this.userCollection.add(this.copyAndPrepare(user));
  }

  findAll() {
    return this.userCollection.get()
      .toPromise()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const user = doc.data();
          user.id = doc.id;
          return user;
        }));
  }

  findById(id: string) {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret = res.data();
      ret.id = res.id;
      return ret;
    });
  }

  update(user: User) {
    this.userCollection.doc(user.id).update(this.copyAndPrepare(user));
  }

  delete(id: string) {
    this.userCollection.doc(id).delete();
  }

  private copyAndPrepare(user: User): User {
    const copy = { ...user };
    delete copy.id;
    return copy;
  }

  findAllSync() {
    return this.userCollection.valueChanges({ idField: 'id' });
  }
}
