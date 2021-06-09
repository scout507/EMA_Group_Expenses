import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  inputType: string;
  iconName: string;

  constructor(public authService: AuthService, public router: Router) {
    this.inputType = "password";
    this.iconName = "eye-off-outline";
  }

  changeInputType(){
    if(this.inputType === "password"){
      this.inputType = "text";
      this.iconName = "eye-outline";
    }else{
      this.inputType = "password";
      this.iconName = "eye-off-outline";
    }
  }

  ngOnInit() {
  }

}
