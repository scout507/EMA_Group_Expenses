import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Group} from '../models/group.model';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import { UserService } from './user.service';
import {AddMembersPage} from '../group/add-members/add-members.page';
import {ModalController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private userService: UserService,
              private modalController: ModalController) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  getAll(): Observable<Group[]>{
    return this.groupCollection.valueChanges({idField: 'id'});
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
    const temp: any = snapshot.data();
    const group: Group = new Group();
    group.id = snapshot.id;
    const members = [];
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
      const groups: Group[] = [];
      doc.forEach(g => {
        for(const member of g.data().members){
          if(member.toString() === id){
            groups.push(this.createGroup(g.data(), g.id));
          }
        }
      });
      return groups;
    });
  }

  createGroup(group: Group, id: string): Group {
    const members: User[] = [];
    group.members.forEach(m => {
      this.userService.findById(m.toString()).then(u => {
        members.push(u);
      });
    });
    const newGroup: Group = group;
    group.members = members;
    group.id = id;
    return group;
  }

  async deleteUserFromAllGroups(user: User){
    const snapshot = await this.groupCollection.get().toPromise();
    const groups: Group[] = [];

    await snapshot.docs.map(doc => {
      const group = doc.data();
      group.id = doc.id;
      groups.push(group);
    });
    for(const i in groups){
      await this.userService.findById(groups[i].creator.toString()).then(creator => {
        groups[i].creator = creator;
      });
      for(const j in groups[i].members){
        await this.userService.findById(groups[i].members[j].toString()).then(member => {
          groups[i].members[j] = member;
        });
      }
      this.deleteUserFromGroup(user, groups[i]);
    }
  }

  deleteUserFromGroup(user: User, group: Group){
    console.log(group);
    let index = -1;
    for(let i = 0; i < group.members.length; i++){
      if(group.members[i].id === user.id){
        index = i;
      }
    }
    if(index > -1) {
      if(group.creator.id === user.id) {
        if(group.members.length > 1){
          if (index < group.members.length - 1) {
            group.creator = group.members[index + 1];
          }else{
            group.creator = group.members[index - 1];
          }
        }
      }
      if(group.members.length > 1){
        group.members.splice(index, 1);
        this.update(group);
      }
      else{
        this.delete(group.id);
      }
    }
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
      //This is not a good way to do this, but member.id is not always set, this is the case when loading members takes too long
      //It is needed for the deleteMemberFromGroup functionality
      if(member.id) copy.members.push(member.id);
      else copy.members.push(member.toString());
    });
    return copy;
  }
}
