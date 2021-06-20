import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import firebase from "firebase";
import {User} from "../models/user.model";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User>;
  currentUser: User;

  constructor(private auth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User');
    //TESTING
    this.currentUser = new User("ralf", "ralf", "ralf2@web.de", "FJD2mpSZ6PLDXDC3dNja", ["qf4XQRDvbUJm9dVEZ0BT"])
    //TESTING
  }

  register(username: string, email: string, password: string){
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.currentUser = new User(username, username, email);
        this.userCollection.add(this.copyAndPrepareUser(this.currentUser));
        this.router.navigate(['home'])
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  login(email: string, password: string){
    this.auth.signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        this.currentUser = await this.getUser(email);
        await this.router.navigate(['home'])
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  logout(){
    this.auth.signOut()
      .then((result) => {
        this.currentUser = null;
        this.router.navigate(['login'])
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  getUserById(id: string){
    return this.userCollection.doc(id).get().toPromise().then(u => {
      let user: User = u.data();
      user.id = u.id;
      return user;
    })
  }

  changePassword(email){
    this.auth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['login']);
      }
    ).catch((error) => {
      console.log(error)
    })
  }

  getUser(email: string): Promise<User>{
    let user: User;
    return this.userCollection.get().toPromise().then(col => {
      col.forEach(doc => {
        if(doc.data().email === email){
          user = doc.data();
        }
      });
      return user;
    })
  }

  copyAndPrepareUser(user: User): User{
    const copy = {...user};
    delete copy.id;
    return copy;
  }

}
