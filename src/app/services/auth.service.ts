import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import { UserService } from './user.service';
import {Platform} from "@ionic/angular";

/**
 * functions for the authentication of a user
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = null;

  /**
   * @ignore
   * @param auth
   * @param router
   * @param userservice
   * @param platform
   */
  constructor(private auth: AngularFireAuth, private router: Router, private userservice: UserService, public platform: Platform) {
  }

  /**
   * registers a user with firebase
   * @param email - email from the user
   * @param password - password from the user
   * @param username - username from the user
   * returns a error message if not successful
   */
  async register(email: string, password: string, username: string): Promise<void | string>{
    let message: string;
    console.log(email, password, username);
    await this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userservice.persist(result.user.uid, email.toLocaleLowerCase(), username);
        this.userservice.findById(result.user.uid).then(user => {
          this.currentUser = user;
          if(this.platform.is('desktop')){
            this.router.navigate(['profile']);
          }else{
            this.router.navigate(['tutorial']);
          }
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

  /**
   * lets the user log into firebase
   * @param email - email from the user
   * @param password - password from the user
   * returns a error message if not successful
   */
  login(email: string, password: string): Promise<void | string>{
    return this.auth.signInWithEmailAndPassword(email.toLocaleLowerCase(), password)
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


  /**
   * lets the user log out of firebase
   */
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

  /**
   * lets the user delete his profile from the database
   */
  delete(){
    this.auth.currentUser.then(user => {
      user.delete().then(() => {
        // User deleted.
      }).catch((error) => {
        console.log(error.message);
      });
    });
  }

  /**
   * lets the user change his password
   * @param email - email from user
   */
  changePassword(email){
    this.auth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['login']);
      }
    ).catch((error) => {
      console.log(error)
    })
  }
}
