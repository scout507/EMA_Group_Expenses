import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Group} from '../models/group.model';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import { UserService } from './user.service';
import {AddMembersPage} from '../group/add-members/add-members.page';
import {ModalController} from '@ionic/angular';

/**
 * functions for groups
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  /**
   * @ignore
   * @param afs
   * @param authService
   * @param userService
   * @param modalController
   */
  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private userService: UserService,
              private modalController: ModalController) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  /**
   * get all groups from database
   * returns an Observable of a array of group
   */
  getAll(): Observable<Group[]>{
    return this.groupCollection.valueChanges({idField: 'id'});
  }

  /**
   * creates a new group in the database
   * @param group - new created group
   */
  new(group: Group){
    this.groupCollection.add(this.copyAndPrepare(group));
  }

  /**
   * updates a group in the database
   * @param group - group with updates
   */
  update(group: Group) {
    this.groupCollection.doc(group.id).update(this.copyAndPrepare(group));
  }

  /**
   * deletes a group in the database
   * @param group - group that gets deleted
   */
  delete(group: Group){
    this.groupCollection.doc(group.id).delete();
  }

  /**
   * find group with id
   * @param id - id from group
   */
  async getGroupById(id: string): Promise<Group> {
    const snapshot = await this.groupCollection.doc(id).get().toPromise();
    const temp: any = snapshot.data();
    const group: Group = new Group();
    group.id = snapshot.id;
    const members = [];
    for(let member of temp.members){
      await this.userService.findById(member.toString()).then(user => {
        members.push(user);
        if(user.id === temp.creator.toString())  group.creator = user;
      });
    }
    group.members = members;
    group.name = temp.name;
    return group;
  }

  /**
   * find all groups from a user
   * @param id - id from user
   * returns a array of all groups from user
   */
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

  /**
   * creates new group with old group and id
   * @param group - old group without id
   * @param id - id from group
   */
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

  /**
   * deletes user from all groups
   * @param user
   */
  async deleteUserFromAllGroups(user: User){
    const snapshot = await this.groupCollection.get().toPromise();
    const groups: Group[] = [];

    await snapshot.docs.map(doc => {
      const group = doc.data();
      group.id = doc.id;
      groups.push(group);
    });
    for(const i in groups){
      let containsUser = false;
      await this.userService.findById(groups[i].creator.toString()).then(creator => {
        groups[i].creator = creator;
        if(creator.id === user.id) containsUser = true;
      });
      for(const j in groups[i].members){
        await this.userService.findById(groups[i].members[j].toString()).then(member => {
          groups[i].members[j] = member;
          if(member.id === user.id) containsUser = true;
        });
      }
      if(containsUser) this.deleteUserFromGroup(user, groups[i]);
    }
  }

  /**
   * deletes user from a group
   * @param user
   * @param group
   */
  deleteUserFromGroup(user: User, group: Group){
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
        this.delete(group);
      }
    }
  }

  /**
   * add Members to a existing group
   * @param group
   * @param currentUser
   */
  async addMembers(group: Group, currentUser: User): Promise<User[]> {
    const modal = await this.modalController.create({
      component: AddMembersPage,
      componentProps: {
        groupParam: group,
        currentUserParam: currentUser
      }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    return result.data;
  }

  /**
   * add a user to a group
   * @param group
   * @param user
   */
  addUserToGroup(group: Group, user: User){
    group.members.push(user);
    this.update(group);
  }

  /**
   * changing the group object to fit in the database
   * @param group
   */
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
