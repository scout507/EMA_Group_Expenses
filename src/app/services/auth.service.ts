import {Injectable} from '@angular/core';
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
  cU: firebase.User;

  constructor(private auth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('User');
    //TESTING
    this.currentUser = new User("ralf", "ralf", "ralf2@web.de", "FJD2mpSZ6PLDXDC3dNja", ["qf4XQRDvbUJm9dVEZ0BT"])
    //TESTING
  }

  async register(username: string, email: string, password: string): Promise<void | string> {
    let message: string;
    await this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.currentUser = new User(username, username, email);
        this.userCollection.add(this.copyAndPrepareUser(this.currentUser));
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          message = 'ungültige E-mail';
        } else if (error.code === 'auth/email-already-in-use') {
          message = 'Nutzer bereits vorhanden';
        } else if (error.code === 'auth/weak-password') {
          message = 'Das Passwort ist zu schwach.';
        } else if (error.code === 'auth/argument-error'){
          message = 'Bitte alle Felder ausfüllen'
        } else {
          console.log(error.code);
          message = 'unbekannter Fehler';
        }
      });
    return message;

  }

  login(email: string, password: string): Promise<void | string> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.getUser(email).then(user => {
          this.currentUser = user;
        });
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          return 'ungültige E-mail';
        } else if (error.code === 'auth/wrong-password') {
          return 'Passwort falsch'
        } else if (error.code === 'auth/user-not-found') {
          return 'Nutzer nicht vorhanden';
        } else if (error.code === 'auth/argument-error'){
          return 'Bitte alle Felder ausfüllen'
        } else {
          console.log(error.code);
          return 'unbekannter Fehler';
        }
      })
  }

  logout() {
    this.auth.signOut()
      .then((result) => {
        this.currentUser = null;
        this.router.navigate(['login'])
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  getUserById(id: string) : Promise<User>{
    return this.userCollection.doc(id).get().toPromise().then(u => {
      let user: User = u.data();
      user.id = u.id;
      return user;
    })
  }

  changePassword(email) {
    this.auth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['login']);
      }
    ).catch((error) => {
      console.log(error)
    })
  }

  getUser(email: string): Promise<User> {
    let user: User;
    return this.userCollection.get().toPromise().then(col => {
      col.forEach(doc => {
        if (doc.data().email === email) {
          user = doc.data();
          user.id = doc.id;
        }
      });
      return user;
    })
  }

  copyAndPrepareUser(user: User): User {
    const copy = {...user};
    delete copy.id;
    delete copy.friends;
    delete copy.profilePic;
    return copy;
  }

}
