import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

/**
 * This class is for the tutorial after you register a new account
 */
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  /**
   * @ignore
   * @param router
   */
  constructor(public router: Router) { }

  /**
   * @ignore
   */
  ngOnInit() {
  }

}
