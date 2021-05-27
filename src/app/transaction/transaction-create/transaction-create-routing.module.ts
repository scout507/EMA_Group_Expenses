import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionCreatePage } from './transaction-create.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionCreatePageRoutingModule {}
