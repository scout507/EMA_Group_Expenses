import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserService } from "./user.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class FriendsService {
  userCollection: AngularFirestoreCollection<User>;
  currentUser: User;
  constructor(private afs: AngularFirestore, private userService: UserService, private authService: AuthService) {
    this.userCollection = afs.collection<User>('User');
    //do better than this vvvv
    this.currentUser = authService.currentUser;
  }

  persist(id: string) {
    var user = new User();
    user.displayName = "Max Mustername";
    user.profilePic = "https://bit.ly/2S904CS";
    user.description = "Erstelle eine Beschreibung...";
    user.cash = false;
    user.ec_card = false;
    user.paypal = false;
    user.kreditcard = false;
    user.imagePublic = false;
    user.awardsPublic = false;
    this.userCollection.doc(id).set(this.copyAndPrepare(user));
  }

  findAll() {
    return this.userCollection.get()
      .toPromise()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const user = doc.data();
          user.id = doc.id;
          return user;
        }));
  }

  findById(id: string) {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret = res.data();
      ret.id = res.id;
      const friends = this.isFriends(ret, this.currentUser);
      if (!ret.imagePublic && !friends)
        ret.profilePic = "https://bit.ly/2S904CS";

      if (!ret.descriptionPublic && !friends)
        ret.description = "(keine Beschreibung)";

      if (!ret.awardsPublic && !friends)
        ret.awards = [];

      return ret;
    });
  }

  addFriend(email: string, currentUserID: string): Promise<string>{
    return this.userService.findByEmail(email.toLocaleLowerCase()).then(user => {
      let alreadyFriends = false;
      //the actual user is in a somewhat random spot in the "user" array.
      if(user) {
        user.forEach(u => {
              if(u) {
                  this.userService.findById(currentUserID).then(async curUser => {
                  curUser.friends.forEach(friend =>{
                    if(friend === u.id) {
                      alreadyFriends = true;
                      return 'bereits befreundet';
                    }
                  });
                  if(!alreadyFriends) {
                    curUser.friends.push(u.id);
                    u.friends.push(currentUserID);
                    this.update(u);
                    this.update(curUser);
                    return 'erfolgreich hinzugefügt';
                  }
                });
              }
        });
      }
      else{

        return 'Nutzer nicht vorhanden';
      }
    });
  }

  isFriends(user1: User, user2: User): boolean{
    for(let i in user1.friends){
      if(user1.friends[i] === user2.id) return true;
    }
    return false;
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

  findAllSync() {
    return this.userCollection.valueChanges({ idField: 'id' });
  }
}
