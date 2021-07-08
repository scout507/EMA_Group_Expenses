import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
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
    path: 'transaction-participants',
    loadChildren: () => import('./transaction/transaction-participants/transaction-participants.module').then(m => m.TransactionParticipantsPageModule)
  },
  {
    path: 'transaction-details',
    loadChildren: () => import('./transaction/transaction-details/transaction-details.module').then( m => m.TransactionDetailsPageModule)
  },
  {
    path: 'transaction-stakes',
    loadChildren: () => import('./transaction/transaction-stakes/transaction-stakes.module').then(m => m.TransactionStakesPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./profile/password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./profile/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./profile/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'friend-profile',
    loadChildren: () => import('./profile/friend-profile/friend-profile.module').then( m => m.FriendProfilePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'add-members',
    loadChildren: () => import('./group/add-members/add-members.module').then( m => m.AddMembersPageModule)
  },
  {
    path: 'member-view',
    loadChildren: () => import('./group/member-view/member-view.module').then( m => m.MemberViewPageModule)
  },
  {
    path: 'payment-reminder',
    loadChildren: () => import('./payment-reminder/payment-reminder.module').then( m => m.PaymentReminderPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'invite',
    loadChildren: () => import('./group/invite/invite.module').then( m => m.InvitePageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
