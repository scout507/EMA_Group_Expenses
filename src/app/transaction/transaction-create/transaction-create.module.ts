import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionCreatePageRoutingModule } from './transaction-create-routing.module';

import { TransactionCreatePage } from './transaction-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionCreatePageRoutingModule
  ],
  declarations: [TransactionCreatePage]
})
export class TransactionCreatePageModule {}
