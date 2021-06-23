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

  register(email: string, password: string, username: string){
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userservice.persist(result.user.uid, email, username);
        this.userservice.findById(result.user.uid).then(user => {
          this.currentUser = user;
          this.router.navigate(['home']);
        });  
      })
      .catch((error) => {
        console.log(error.message);
      })
  }

  login(email: string, password: string){
    this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userservice.findById(result.user.uid).then(user => {
          this.currentUser = user;
          this.router.navigate(['home']);
        });       
      })
      .catch((error) => {
        console.log(error.message);
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
