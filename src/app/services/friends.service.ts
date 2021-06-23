import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class FriendsService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User');
  }

  persist(id: string) {
    var user = new User();
    user.displayName = "Max Mustername";
    user.profilePic = "https://bit.ly/2S904CS";
    user.description = "Erstelle eine Beschreibung...";
    user.cash = false;
    user.ec_card = false;
    user.paypal = false;
    user.kreditcard = false;
    user.imagePublic = false;
    user.awardsPublic = false;
    this.userCollection.doc(id).set(this.copyAndPrepare(user));
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
      
      if (!ret.imagePublic)
        ret.profilePic = "https://bit.ly/2S904CS";

      if (!ret.descriptionPublic)
        ret.description = "(keine Beschreibung)";

      if (!ret.awardsPublic)
        ret.awards = [];

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
