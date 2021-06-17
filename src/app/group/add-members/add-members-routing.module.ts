import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMembersPage } from './add-members.page';

const routes: Routes = [
  {
    path: '',
    component: AddMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMembersPageRoutingModule {}
