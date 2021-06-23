import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  email: string;

  constructor(public authService: AuthService, public navCtrl: NavController) { }

  ngOnInit() {
  }

}
