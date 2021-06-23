import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Group} from "../models/group.model";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import { UserService } from './user.service';
import {AddMembersPage} from "../group/add-members/add-members.page";
import {ModalController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private userService:UserService,
              private modalController: ModalController) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  getAll(): Observable<Group[]>{
    return this.groupCollection.valueChanges({idField: 'id'})
  }

  new(group: Group){
    this.groupCollection.add(this.copyAndPrepare(group));
  }

  update(group: Group) {
    this.groupCollection.doc(group.id).update(this.copyAndPrepare(group));
  }


  delete(id: string){
    this.groupCollection.doc(id).delete();
  }

  async getGroupById(id: string): Promise<Group> {
    const snapshot = await this.groupCollection.doc(id).get().toPromise();
    let temp: any = snapshot.data();
    let group: Group = new Group();
    group.id = snapshot.id;
    let members = [];
    await temp.members.forEach(member => {
      this.userService.findById(member.toString()).then(user => {
        members.push(user);
      });
    });
    group.creator = await this.userService.findById(temp.creator.toString());
    group.members = members;
    group.name = temp.name;
    return group;
  }

  getGroupsByUserId(id: string): Promise<Group[]>{
    return this.groupCollection.get().toPromise().then(doc => {
      let groups: Group[] = [];
      doc.forEach(g => {
        g.data().members.forEach(member => {
          if(member.toString() === id){
            groups.push(this.createGroup(g.data(), g.id))
          }
        })
      });
      return groups;
    })
  }

  createGroup(group: Group, id: string): Group {
    let members: User[] = [];
    group.members.forEach(m => {
      this.userService.findById(m.toString()).then(u => {
        members.push(u);
      })
    });
    let newGroup: Group = group;
    group.members = members;
    group.id = id;
    return group
  }


  async addMembers(group: Group, currentUser: User): Promise<User[]> {
    const modal = await this.modalController.create({
      component: AddMembersPage,
      componentProps: {
        selectedFriendsParam: group.members,
        currentUserParam: currentUser
      }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    return result.data;
  }


  copyAndPrepare(group: Group): Group{
    const copy: any = {...group};
    delete copy.id;
    copy.creator = group.creator.id;
    copy.members = [];
    group.members.forEach(member => {
      copy.members.push(member.id);
    });
    return copy
  }
}
