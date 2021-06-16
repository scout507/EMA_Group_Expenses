import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Group} from "../models/group.model";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private afs: AngularFirestore) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  getGroupById(id: string): Promise<Group>{
    return this.groupCollection.doc(id).get().toPromise().then(group => {
      return group.data();
    })
  }
}
