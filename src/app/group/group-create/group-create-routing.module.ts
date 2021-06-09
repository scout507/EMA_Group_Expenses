import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupCreatePage } from './group-create.page';

const routes: Routes = [
  {
    path: '',
    component: GroupCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupCreatePageRoutingModule {}
