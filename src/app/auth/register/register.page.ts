import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

/**
 * This class has functions to register a new user
 */
export class RegisterPage implements OnInit {

  username: string;
  email: string;
  password: string;
  secondPassword: string;
  errorMessage: string;

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


  ngOnInit() {
  }

}
