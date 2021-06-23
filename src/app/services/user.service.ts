import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User');
  }

  persist(id: string, email:string, username:string) {
    var user = new User();
    user.displayName = username;
    user.profilePic = "https://bit.ly/2S904CS";
    user.email = email;
    user.description = "Erstelle eine Beschreibung...";
    user.awards = ["iO3uC7uzgAb5j8PfycqB"];
    user.descriptionPublic = false;
    user.cash = false;
    user.ec_card = false;
    user.paypal = false;
    user.kreditcard = false;
    user.imagePublic = false;
    user.awardsPublic = false;
    user.friends = [""];
    this.userCollection.doc(id).set(this.copyAndPrepare(user));
  }

  findById(id: string): Promise<User> {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret: User = res.data();
      ret.id = id;
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

  findByEmail(email: string) {
    return this.userCollection.get()
      .toPromise()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const user = doc.data();
          user.id = doc.id;
          if (user.email == email)
          return user;
        }));
  }
}
