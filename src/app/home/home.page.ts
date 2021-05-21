import { Component} from '@angular/core';







@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  searchbarVisible: Boolean;
  search: any;
  outgoing: any;
  incoming: any;
  pending: any;
  confirm: any;
  filteredpayments: any;

  constructor() {
    this.outgoing = true;
  }



  doSearch() {

  }

  cancelSearch() {
    this.searchbarVisible = false;
  }

  clearSearch() {

  }

  startSearch() {
    this.searchbarVisible = true;
  }

  viewPayment(payment: any) {
    
  }
}
