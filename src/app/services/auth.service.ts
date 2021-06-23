import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = null;

  constructor(private auth: AngularFireAuth, private router: Router, private userservice: UserService) {
  }

  async register(email: string, password: string): Promise<void | string>{
    let message: string;
    await this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userservice.persist(result.user.uid, email);
        this.userservice.findById(result.user.uid).then(user => {
          this.currentUser = user;
          this.router.navigate(['home']);
        });
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

  login(email: string, password: string): Promise<void | string>{
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userservice.findById(result.user.uid).then(user => {
          this.currentUser = user;
          this.router.navigate(['home']);
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

  changePassword(email){
    this.auth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['login']);
      }
    ).catch((error) => {
      console.log(error)
    })
  }
}
