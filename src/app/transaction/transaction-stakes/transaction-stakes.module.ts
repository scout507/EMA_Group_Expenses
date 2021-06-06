import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionStakesPageRoutingModule } from './transaction-stakes-routing.module';

import { TransactionStakesPage } from './transaction-stakes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionStakesPageRoutingModule
  ],
  declarations: [TransactionStakesPage]
})
export class TransactionStakesPageModule {}
