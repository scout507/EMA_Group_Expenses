import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'group-create',
    loadChildren: () => import('./group/group-create/group-create.module').then( m => m.GroupCreatePageModule)
  },
  {
    path: 'group-list',
    loadChildren: () => import('./group/group-list/group-list.module').then( m => m.GroupListPageModule)
  },
  {
    path: 'group-details',
    loadChildren: () => import('./group/group-details/group-details.module').then( m => m.GroupDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'statistics',
    loadChildren: () => import('./profile/statistics/statistics.module').then( m => m.StatisticsPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./profile/friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./profile/options/options.module').then( m => m.OptionsPageModule)
  },
  {
    path: 'transaction-create',
    loadChildren: () => import('./transaction/transaction-create/transaction-create.module').then( m => m.TransactionCreatePageModule)
  },
  {
    path: 'transaction-details',
    loadChildren: () => import('./transaction/transaction-details/transaction-details.module').then( m => m.TransactionDetailsPageModule)
  },
  {
    path: 'transaction-participants',
    loadChildren: () => import('./transaction/transaction-participants/transaction-participants.module').then( m => m.TransactionParticipantsPageModule)
  },
  {
    path: 'transaction-stakes',
    loadChildren: () => import('./transaction/transaction-stakes/transaction-stakes.module').then( m => m.TransactionStakesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
