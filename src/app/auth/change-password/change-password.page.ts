import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NavController} from "@ionic/angular";

/**
 * This class is used to generate a new password
 */
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  /**
   email for the new password
   */
  email: string;

  /**
   * @ignore
   */
  constructor(public authService: AuthService, public navCtrl: NavController) { }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
