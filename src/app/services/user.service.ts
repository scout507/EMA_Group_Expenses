import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


/**
 * This class has functions for the user
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;

  /**
   * @ignore
   * @param afs
   */
  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User');
  }

  /**
   * add the user to the database
   * @param id - id from the user
   * @param email - email from the user
   * @param username - username from the user
   */
  persist(id: string, email:string, username:string) {
    var user = new User();
    user.displayName = username;
    user.profilePic = "https://bit.ly/2S904CS";
    user.email = email;
    user.description = "Erstelle eine Beschreibung...";
    user.awards = ["jEy1DdqvHv9minKnPOCc"];
    user.descriptionPublic = false;
    user.cash = false;
    user.ec_card = false;
    user.paypal = false;
    user.kreditcard = false;
    user.imagePublic = false;
    user.awardsPublic = false;
    user.friends = [];
    this.userCollection.doc(id).set(this.copyAndPrepare(user));
  }

  /**
   * finds user by ID
   * @param id - id from user
   */
  findById(id: string): Promise<User> {
    return this.userCollection.doc(id).get().toPromise().then(res => {
      const ret: User = res.data();
      ret.id = id;
      return ret;
    });
  }

  /**
   * updates existing user
   * @param user
   */
  update(user: User) {
    this.userCollection.doc(user.id).update(this.copyAndPrepare(user));
  }

  /**
   * deletes existing user
   * @param id - id from user
   */
  delete(id: string) {
    this.userCollection.doc(id).delete();
  }

  /**
   * Deletes a given user from all his friends friends-lists (user.friends) and updates the friend in the user-collection.
   * @param user The user to be deleted
   */
  deleteUserFromFriends(user: User){
    user.friends.forEach(friend => {
      this.findById(friend).then(result => {
        const index = result.friends.indexOf(user.id, 0);
        if(index > -1) {
          result.friends.splice(index, 1);
        }
        this.update(result);
      });
    });
  }

  /**
   * deletes the id from the user object
   * @param user
   * returns the user object without the id
   */
  private copyAndPrepare(user: User): User {
    const copy = { ...user };
    delete copy.id;
    return copy;
  }

  /**
   * finds the user by email
   * @param email - email from user
   */
  findByEmail(email: string) {
    return this.userCollection.get()
      .toPromise()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const user = doc.data();
          user.id = doc.id;
          if (user.email == email)
          return user;
        }));
  }
}
