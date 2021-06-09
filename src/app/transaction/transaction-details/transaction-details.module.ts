import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionDetailsPageRoutingModule } from './transaction-details-routing.module';

import { TransactionDetailsPage } from './transaction-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionDetailsPageRoutingModule
  ],
  declarations: [TransactionDetailsPage]
})
export class TransactionDetailsPageModule {}
