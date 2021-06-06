import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionParticipantsPageRoutingModule } from './transaction-participants-routing.module';

import { TransactionParticipantsPage } from './transaction-participants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionParticipantsPageRoutingModule
  ],
  declarations: [TransactionParticipantsPage]
})
export class TransactionParticipantsPageModule {}
