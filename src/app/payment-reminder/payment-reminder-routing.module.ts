import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentReminderPage } from './payment-reminder.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentReminderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentReminderPageRoutingModule {}
