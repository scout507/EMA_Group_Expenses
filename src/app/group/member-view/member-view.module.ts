import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberViewPageRoutingModule } from './member-view-routing.module';

import { MemberViewPage } from './member-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberViewPageRoutingModule
  ],
  declarations: [MemberViewPage]
})
export class MemberViewPageModule {}
