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

  getGroupsByUserId(id: string): Promise<Group[]>{
    return this.groupCollection.get().toPromise().then(doc => {
      let groups: Group[] = [];
      doc.forEach(g => {
        g.data().users.forEach(member => {
          if(member.toString() === id){
            let group = g.data();
            group.id = g.id;
            groups.push(group);
          }
        })
      });
      return groups;
    })
  }

}
