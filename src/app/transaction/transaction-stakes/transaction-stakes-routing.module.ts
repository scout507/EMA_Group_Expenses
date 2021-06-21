import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionStakesPage } from './transaction-stakes.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionStakesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionStakesPageRoutingModule {}
