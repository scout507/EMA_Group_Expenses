import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Group} from "../models/group.model";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  getAll(): Observable<Group[]>{
    return this.groupCollection.valueChanges({idField: 'id'})
  }

  new(group: Group){
    this.groupCollection.add(this.copyAndPrepare(group));
  }

  delete(id: string){
    this.groupCollection.doc(id).delete();
  }

  getGroupById(id: string): Promise<Group>{
    return this.groupCollection.doc(id).get().toPromise().then(g => {
      let group = g.data();
      group.id = g.id;
      return group;
    })
  }

  getGroupsByUserId(id: string): Promise<Group[]>{
    return this.groupCollection.get().toPromise().then(doc => {
      let groups: Group[] = [];
      doc.forEach(g => {
        g.data().members.forEach(member => {
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

  copyAndPrepare(group: Group): Group{
    const copy: any = {...group};
    delete copy.id;
    copy.members = [];
    group.members.forEach(member => {
      copy.members.push(member.id);
    });
    return copy
  }
}
