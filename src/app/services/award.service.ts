import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})

export class ArwardService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('Achievement');
  }

  findById(id: string) {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret = res.data();
      ret.id = res.id;
      return ret;
    });
  }

}
