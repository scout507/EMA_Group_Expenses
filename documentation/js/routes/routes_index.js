var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"home","loadChildren":"./home/home.module#HomePageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/home/home-routing.module.ts","module":"HomePageRoutingModule","children":[{"path":"","component":"HomePage"}],"kind":"module"}],"module":"HomePageModule"}]},{"path":"","redirectTo":"login","pathMatch":"full"},{"path":"group-create","loadChildren":"./group/group-create/group-create.module#GroupCreatePageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/group-create/group-create-routing.module.ts","module":"GroupCreatePageRoutingModule","children":[{"path":"","component":"GroupCreatePage"}],"kind":"module"}],"module":"GroupCreatePageModule"}]},{"path":"group-list","loadChildren":"./group/group-list/group-list.module#GroupListPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/group-list/group-list-routing.module.ts","module":"GroupListPageRoutingModule","children":[{"path":"","component":"GroupListPage"}],"kind":"module"}],"module":"GroupListPageModule"}]},{"path":"group-details","loadChildren":"./group/group-details/group-details.module#GroupDetailsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/group-details/group-details-routing.module.ts","module":"GroupDetailsPageRoutingModule","children":[{"path":"","component":"GroupDetailsPage"}],"kind":"module"}],"module":"GroupDetailsPageModule"}]},{"path":"profile","loadChildren":"./profile/profile/profile.module#ProfilePageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/profile/profile-routing.module.ts","module":"ProfilePageRoutingModule","children":[{"path":"","component":"ProfilePage"}],"kind":"module"}],"module":"ProfilePageModule"}]},{"path":"statistics","loadChildren":"./profile/statistics/statistics.module#StatisticsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/statistics/statistics-routing.module.ts","module":"StatisticsPageRoutingModule","children":[{"path":"","component":"StatisticsPage"}],"kind":"module"}],"module":"StatisticsPageModule"}]},{"path":"friends","loadChildren":"./profile/friends/friends.module#FriendsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/friends/friends-routing.module.ts","module":"FriendsPageRoutingModule","children":[{"path":"","component":"FriendsPage"}],"kind":"module"}],"module":"FriendsPageModule"}]},{"path":"options","loadChildren":"./profile/options/options.module#OptionsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/options/options-routing.module.ts","module":"OptionsPageRoutingModule","children":[{"path":"","component":"OptionsPage"}],"kind":"module"}],"module":"OptionsPageModule"}]},{"path":"transaction-create","loadChildren":"./transaction/transaction-create/transaction-create.module#TransactionCreatePageModule"},{"path":"transaction-participants","loadChildren":"./transaction/transaction-participants/transaction-participants.module#TransactionParticipantsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/transaction/transaction-participants/transaction-participants-routing.module.ts","module":"TransactionParticipantsPageRoutingModule","children":[{"path":"","component":"TransactionParticipantsPage"}],"kind":"module"}],"module":"TransactionParticipantsPageModule"}]},{"path":"transaction-details","loadChildren":"./transaction/transaction-details/transaction-details.module#TransactionDetailsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/transaction/transaction-details/transaction-details-routing.module.ts","module":"TransactionDetailsPageRoutingModule","children":[{"path":"","component":"TransactionDetailsPage"}],"kind":"module"}],"module":"TransactionDetailsPageModule"}]},{"path":"transaction-stakes","loadChildren":"./transaction/transaction-stakes/transaction-stakes.module#TransactionStakesPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/transaction/transaction-stakes/transaction-stakes-routing.module.ts","module":"TransactionStakesPageRoutingModule","children":[{"path":"","component":"TransactionStakesPage"}],"kind":"module"}],"module":"TransactionStakesPageModule"}]},{"path":"password","loadChildren":"./profile/password/password.module#PasswordPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/password/password-routing.module.ts","module":"PasswordPageRoutingModule","children":[{"path":"","component":"PasswordPage"}],"kind":"module"}],"module":"PasswordPageModule"}]},{"path":"payment","loadChildren":"./profile/payment/payment.module#PaymentPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/payment/payment-routing.module.ts","module":"PaymentPageRoutingModule","children":[{"path":"","component":"PaymentPage"}],"kind":"module"}],"module":"PaymentPageModule"}]},{"path":"privacy","loadChildren":"./profile/privacy/privacy.module#PrivacyPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/privacy/privacy-routing.module.ts","module":"PrivacyPageRoutingModule","children":[{"path":"","component":"PrivacyPage"}],"kind":"module"}],"module":"PrivacyPageModule"}]},{"path":"friend-profile","loadChildren":"./profile/friend-profile/friend-profile.module#FriendProfilePageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/profile/friend-profile/friend-profile-routing.module.ts","module":"FriendProfilePageRoutingModule","children":[{"path":"","component":"FriendProfilePage"}],"kind":"module"}],"module":"FriendProfilePageModule"}]},{"path":"register","loadChildren":"./auth/register/register.module#RegisterPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/auth/register/register-routing.module.ts","module":"RegisterPageRoutingModule","children":[{"path":"","component":"RegisterPage"}],"kind":"module"}],"module":"RegisterPageModule"}]},{"path":"login","loadChildren":"./auth/login/login.module#LoginPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/auth/login/login-routing.module.ts","module":"LoginPageRoutingModule","children":[{"path":"","component":"LoginPage"}],"kind":"module"}],"module":"LoginPageModule"}]},{"path":"change-password","loadChildren":"./auth/change-password/change-password.module#ChangePasswordPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/auth/change-password/change-password-routing.module.ts","module":"ChangePasswordPageRoutingModule","children":[{"path":"","component":"ChangePasswordPage"}],"kind":"module"}],"module":"ChangePasswordPageModule"}]},{"path":"login","loadChildren":"./auth/login/login.module#LoginPageModule","children":[{"kind":"module","children":[],"module":"LoginPageModule"}]},{"path":"register","loadChildren":"./auth/register/register.module#RegisterPageModule","children":[{"kind":"module","children":[],"module":"RegisterPageModule"}]},{"path":"change-password","loadChildren":"./auth/change-password/change-password.module#ChangePasswordPageModule","children":[{"kind":"module","children":[],"module":"ChangePasswordPageModule"}]},{"path":"add-members","loadChildren":"./group/add-members/add-members.module#AddMembersPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/add-members/add-members-routing.module.ts","module":"AddMembersPageRoutingModule","children":[{"path":"","component":"AddMembersPage"}],"kind":"module"}],"module":"AddMembersPageModule"}]},{"path":"member-view","loadChildren":"./group/member-view/member-view.module#MemberViewPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/member-view/member-view-routing.module.ts","module":"MemberViewPageRoutingModule","children":[{"path":"","component":"MemberViewPage"}],"kind":"module"}],"module":"MemberViewPageModule"}]},{"path":"payment-reminder","loadChildren":"./payment-reminder/payment-reminder.module#PaymentReminderPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/payment-reminder/payment-reminder-routing.module.ts","module":"PaymentReminderPageRoutingModule","children":[{"path":"","component":"PaymentReminderPage"}],"kind":"module"}],"module":"PaymentReminderPageModule"}]},{"path":"tutorial","loadChildren":"./tutorial/tutorial.module#TutorialPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/tutorial/tutorial-routing.module.ts","module":"TutorialPageRoutingModule","children":[{"path":"","component":"TutorialPage"}],"kind":"module"}],"module":"TutorialPageModule"}]},{"path":"invite","loadChildren":"./group/invite/invite.module#InvitePageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/group/invite/invite-routing.module.ts","module":"InvitePageRoutingModule","children":[{"path":"","component":"InvitePage"}],"kind":"module"}],"module":"InvitePageModule"}]}],"kind":"module"}]}
