import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Group} from "../models/group.model";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {AddMembersPage} from "../group/add-members/add-members.page";
import {ModalController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private modalController: ModalController) {
    this.groupCollection = afs.collection<Group>('Group');
  }

  getAll(): Observable<Group[]> {
    return this.groupCollection.valueChanges({idField: 'id'})
  }

  new(group: Group) {
    this.groupCollection.add(this.copyAndPrepare(group));
  }

  update(group: Group) {
    this.groupCollection.doc(group.id).update(this.copyAndPrepare(group));
  }

  delete(id: string) {
    this.groupCollection.doc(id).delete();
  }

  getGroupById(id: string): Promise<Group> {
    return this.groupCollection.doc(id).get().toPromise().then(g => {
      let group: Group = new Group();
      g.data().members.forEach(member => {
        group = this.createGroup(g.data(), g.id);
      });
      return group;
    })
  }

  async addMembers(group: Group, currentUser: User): Promise<User[]> {
    const modal = await this.modalController.create({
      component: AddMembersPage,
      componentProps: {
        friendsParam: currentUser.friends,
        selectedFriendsParam: group.members,
        currentUserParam: currentUser
      }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    return result.data;
  }

  getGroupsByUserId(id: string): Promise<Group[]>{
    return this.groupCollection.get().toPromise().then(doc => {
      let groups: Group[] = [];
      doc.forEach(g => {
        groups.push(this.createGroup(g.data(), g.id));
      });
      return groups;
    })
  }

  createGroup(group: Group, id: string): Group {
    let members: User[] = [];
    group.members.forEach(m => {
      this.authService.getUserById(m.toString()).then(u => {
        members.push(u);
      })
    });
    let newGroup: Group = group;
    group.members = members;
    group.id = id;
    return group
  }

  copyAndPrepare(group: Group): Group {
    const copy: any = {...group};
    delete copy.id;
    copy.members = [];
    group.members.forEach(member => {
      copy.members.push(member.id);
    });
    return copy
  }
}
