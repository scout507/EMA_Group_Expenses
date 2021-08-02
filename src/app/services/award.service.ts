import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Award } from '../models/award.model';

/**
 * This class is needed to manage awards, with linking of the database.
 */

@Injectable({
  providedIn: 'root'
})

export class ArwardService {
  userCollection: AngularFirestoreCollection<Award>;

  /**
   * @ignore
   * @param afs 
   */
  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<Award>('Achievement');
  }

  /**
   * The function finds an Achievements by its id and returns it.
   * @param id Needed to find the Achievements by their id.
   * @returns 
   */
  findById(id: string) {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret = res.data();
      ret.id = res.id;
      return ret;
    });
  }

}
