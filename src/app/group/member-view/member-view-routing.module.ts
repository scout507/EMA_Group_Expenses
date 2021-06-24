import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberViewPage } from './member-view.page';

const routes: Routes = [
  {
    path: '',
    component: MemberViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberViewPageRoutingModule {}
