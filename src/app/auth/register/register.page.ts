import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

/**
 * This class has functions to register a new user
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  /**
   username from user
   */
  username: string;
  /**
   email from user
   */
  email: string;
  /**
   password from user
   */
  password: string;
  /**
   the repeated password from user
   */
  secondPassword: string;
  /**
   displays the error message from firebase
   */
  errorMessage: string;

  /**
   * @ignore
   */
  constructor(public authService: AuthService, public router: Router) { }

  /**
   * This function registers a new User into firebase
   */
  register(){
    if(this.password === this.secondPassword){
      this.authService.register(this.email, this.password, this.username).then(ret => {
        if(ret){
          this.errorMessage = ret;
        }
      });
    }else{
      this.errorMessage = 'Passwörter nicht identisch';
    }
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
