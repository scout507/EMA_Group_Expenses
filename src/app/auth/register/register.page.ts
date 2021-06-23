import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string;
  email: string;
  password: string;
  secondPassword: string;
  errorMessage: string;

  constructor(public authService: AuthService, public router: Router) { }

  register(){
    if(this.password === this.secondPassword){
      this.authService.register(this.email, this.password, this.username).then(ret => {
        if(ret){
          this.errorMessage = ret;
        }else{
          console.log(ret);
          this.router.navigate(['home']);
        }
      });
    }else{
      this.errorMessage = 'Passwörter ungleich'
    }
  }


  ngOnInit() {
  }

}
