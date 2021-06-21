import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionParticipantsPage } from './transaction-participants.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionParticipantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionParticipantsPageRoutingModule {}
