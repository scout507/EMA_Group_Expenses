import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
