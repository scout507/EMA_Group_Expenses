import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupListPage } from './group-list.page';

const routes: Routes = [
  {
    path: '',
    component: GroupListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupListPageRoutingModule {}
