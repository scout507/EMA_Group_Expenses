import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserService } from "./user.service";
import {AuthService} from "./auth.service";

/**
 * This class is needed to manage friends, with linking of the database.
 */

@Injectable({
  providedIn: 'root'
})

export class FriendsService {
  userCollection: AngularFirestoreCollection<User>;

  /**
   * @ignore
   * @param afs 
   * @param userService 
   * @param authService 
   */
  constructor(private afs: AngularFirestore, private userService: UserService, private authService: AuthService) {
    this.userCollection = afs.collection<User>('User');
  }

  /**
   * The function finds the friend and checks if he is a friend of the user.
   * @param id Needed to identify friend.
   * @param currentUser Needed to identify user.
   * @returns User (the friend)
   */
  findById(id: string, currentUser: User) {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret = res.data();
      ret.id = res.id;
      const friends = this.isFriends(ret, currentUser);
      if (!ret.imagePublic && !friends)
        ret.profilePic = "https://bit.ly/2S904CS";

      if (!ret.descriptionPublic && !friends)
        ret.description = "(keine Beschreibung)";

      if (!ret.awardsPublic && !friends)
        ret.awards = [];

      return ret;
    });
  }

  /**
   * Add a friend and check if he exists.
   * @param email Needed to find users by email.
   * @param currentUserID Needed to find users by email.
   * @returns String with feedback for user.
   */
  async addFriend(email: string, currentUserID: string): Promise<string>{
    let output = "Nutzer nicht vorhanden"
    return await this.userService.findByEmail(email.toLocaleLowerCase()).then(async user => {
      let alreadyFriends = false;
      //the actual user is in a somewhat random spot in the "user" array.
      for(let u of user){
        if(u != undefined) {

                    await this.userService.findById(currentUserID).then(async curUser => {
                      alreadyFriends = this.isFriends(curUser, u)
                      if(!alreadyFriends) {
                        curUser.friends.push(u.id);
                        u.friends.push(currentUserID);
                        this.update(u);
                        this.update(curUser);
                        output = "erfolgreich hinzugefügt";
                      }
                      else{
                        output = "bereits befreundet";
                      }
                  });
        }
      }
        return output;
    });
    return "error";
  }

  /**
   * Checks if two users are friends.
   * @param user1 Identifies user.
   * @param user2 Identifies the other user
   * @returns Boolean whether friend (true) or not (false).
   */
  isFriends(user1: User, user2: User): boolean{
    if(user1.id == user2.id) return true;
    for(let i in user1.friends){
      if(user1.friends[i] === user2.id) return true;
    }
    return false;
  }

  /**
   * Updated user in the database
   * @param user User to be updated in the database with the data
   */
  update(user: User) {
    this.userCollection.doc(user.id).update(this.copyAndPrepare(user));
  }

  /**
   * Copy a User.
   * @param user Identifies user.
   * @returns Copy of User
   */
  private copyAndPrepare(user: User): User {
    const copy = { ...user };
    delete copy.id;
    return copy;
  }
}
