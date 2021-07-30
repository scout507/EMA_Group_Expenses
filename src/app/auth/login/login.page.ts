import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

/**
 * This class has functions to login a existing user
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /**
   email from user
   */
  email: string;
  /**
   password from user
   */
  password: string;
  /**
   checks if password input is visible or nor
   */
  inputType: string;
  /**
   changes the icon for the password visibility
   */
  iconName: string;
  /**
   changes the error message depending on the error
   */
  errorMessage: string;

  /**
   * @ignore
   */
  constructor(public authService: AuthService, public router: Router) {
    this.inputType = "password";
    this.iconName = "eye-off-outline";
  }

  /**
   * This function makes the password visible/disguised
   */
  changeInputType(){
    if(this.inputType === "password"){
      this.inputType = "text";
      this.iconName = "eye-outline";
    }else{
      this.inputType = "password";
      this.iconName = "eye-off-outline";
    }
  }

  /**
   * This function logs the user into firebase with email and password
   * @param email
   * @param password
   */
  login(email: string, password: string){
    this.authService.login(email, password).then(ret => {
      if(ret){
        this.errorMessage = ret;
      }else{
        this.router.navigate(['home']);
      }
    })
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
