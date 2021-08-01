'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">group-expenses documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AddMembersPageModule.html" data-type="entity-link" >AddMembersPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AddMembersPageModule-8219500273a7dbbc4371281e300aad4d"' : 'data-target="#xs-components-links-module-AddMembersPageModule-8219500273a7dbbc4371281e300aad4d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AddMembersPageModule-8219500273a7dbbc4371281e300aad4d"' :
                                            'id="xs-components-links-module-AddMembersPageModule-8219500273a7dbbc4371281e300aad4d"' }>
                                            <li class="link">
                                                <a href="components/AddMembersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddMembersPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AddMembersPageRoutingModule.html" data-type="entity-link" >AddMembersPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-8c9373f0e13fc389f53d4a649f2011b4"' : 'data-target="#xs-components-links-module-AppModule-8c9373f0e13fc389f53d4a649f2011b4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-8c9373f0e13fc389f53d4a649f2011b4"' :
                                            'id="xs-components-links-module-AppModule-8c9373f0e13fc389f53d4a649f2011b4"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ChangePasswordPageModule.html" data-type="entity-link" >ChangePasswordPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ChangePasswordPageModule-814e0cee9a33c214344cddbd4c6bc7fd"' : 'data-target="#xs-components-links-module-ChangePasswordPageModule-814e0cee9a33c214344cddbd4c6bc7fd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ChangePasswordPageModule-814e0cee9a33c214344cddbd4c6bc7fd"' :
                                            'id="xs-components-links-module-ChangePasswordPageModule-814e0cee9a33c214344cddbd4c6bc7fd"' }>
                                            <li class="link">
                                                <a href="components/ChangePasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangePasswordPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChangePasswordPageRoutingModule.html" data-type="entity-link" >ChangePasswordPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FriendProfilePageModule.html" data-type="entity-link" >FriendProfilePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FriendProfilePageModule-74388a5689571ddf59c3e7bfdddff9a6"' : 'data-target="#xs-components-links-module-FriendProfilePageModule-74388a5689571ddf59c3e7bfdddff9a6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FriendProfilePageModule-74388a5689571ddf59c3e7bfdddff9a6"' :
                                            'id="xs-components-links-module-FriendProfilePageModule-74388a5689571ddf59c3e7bfdddff9a6"' }>
                                            <li class="link">
                                                <a href="components/FriendProfilePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FriendProfilePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FriendProfilePageRoutingModule.html" data-type="entity-link" >FriendProfilePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FriendsPageModule.html" data-type="entity-link" >FriendsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FriendsPageModule-ba3807c761d4b715f6d8cf5e3cdbd5e2"' : 'data-target="#xs-components-links-module-FriendsPageModule-ba3807c761d4b715f6d8cf5e3cdbd5e2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FriendsPageModule-ba3807c761d4b715f6d8cf5e3cdbd5e2"' :
                                            'id="xs-components-links-module-FriendsPageModule-ba3807c761d4b715f6d8cf5e3cdbd5e2"' }>
                                            <li class="link">
                                                <a href="components/FriendsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FriendsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FriendsPageRoutingModule.html" data-type="entity-link" >FriendsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GroupCreatePageModule.html" data-type="entity-link" >GroupCreatePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GroupCreatePageModule-25acea8fa73e0cda520a6b796d246974"' : 'data-target="#xs-components-links-module-GroupCreatePageModule-25acea8fa73e0cda520a6b796d246974"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GroupCreatePageModule-25acea8fa73e0cda520a6b796d246974"' :
                                            'id="xs-components-links-module-GroupCreatePageModule-25acea8fa73e0cda520a6b796d246974"' }>
                                            <li class="link">
                                                <a href="components/GroupCreatePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupCreatePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupCreatePageRoutingModule.html" data-type="entity-link" >GroupCreatePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GroupDetailsPageModule.html" data-type="entity-link" >GroupDetailsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GroupDetailsPageModule-23029396a244dadeb6f8e6b5ce4ae8b0"' : 'data-target="#xs-components-links-module-GroupDetailsPageModule-23029396a244dadeb6f8e6b5ce4ae8b0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GroupDetailsPageModule-23029396a244dadeb6f8e6b5ce4ae8b0"' :
                                            'id="xs-components-links-module-GroupDetailsPageModule-23029396a244dadeb6f8e6b5ce4ae8b0"' }>
                                            <li class="link">
                                                <a href="components/GroupDetailsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupDetailsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupDetailsPageRoutingModule.html" data-type="entity-link" >GroupDetailsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GroupListPageModule.html" data-type="entity-link" >GroupListPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GroupListPageModule-d38e3d5a7d809988752118ca772aa5c6"' : 'data-target="#xs-components-links-module-GroupListPageModule-d38e3d5a7d809988752118ca772aa5c6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GroupListPageModule-d38e3d5a7d809988752118ca772aa5c6"' :
                                            'id="xs-components-links-module-GroupListPageModule-d38e3d5a7d809988752118ca772aa5c6"' }>
                                            <li class="link">
                                                <a href="components/GroupListPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupListPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupListPageRoutingModule.html" data-type="entity-link" >GroupListPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomePageModule-b8de082369b6c9ceb3956999e3fe8541"' : 'data-target="#xs-components-links-module-HomePageModule-b8de082369b6c9ceb3956999e3fe8541"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-b8de082369b6c9ceb3956999e3fe8541"' :
                                            'id="xs-components-links-module-HomePageModule-b8de082369b6c9ceb3956999e3fe8541"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link" >HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InvitePageModule.html" data-type="entity-link" >InvitePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-InvitePageModule-d679cd2ac792d94623b6fe3b8a63de5d"' : 'data-target="#xs-components-links-module-InvitePageModule-d679cd2ac792d94623b6fe3b8a63de5d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InvitePageModule-d679cd2ac792d94623b6fe3b8a63de5d"' :
                                            'id="xs-components-links-module-InvitePageModule-d679cd2ac792d94623b6fe3b8a63de5d"' }>
                                            <li class="link">
                                                <a href="components/InvitePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvitePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvitePageRoutingModule.html" data-type="entity-link" >InvitePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link" >LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginPageModule-914e8573cc62a35705a5281425a92841"' : 'data-target="#xs-components-links-module-LoginPageModule-914e8573cc62a35705a5281425a92841"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-914e8573cc62a35705a5281425a92841"' :
                                            'id="xs-components-links-module-LoginPageModule-914e8573cc62a35705a5281425a92841"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MemberViewPageModule.html" data-type="entity-link" >MemberViewPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MemberViewPageModule-9820faa5ea1746989a633fc7dad5b2cd"' : 'data-target="#xs-components-links-module-MemberViewPageModule-9820faa5ea1746989a633fc7dad5b2cd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MemberViewPageModule-9820faa5ea1746989a633fc7dad5b2cd"' :
                                            'id="xs-components-links-module-MemberViewPageModule-9820faa5ea1746989a633fc7dad5b2cd"' }>
                                            <li class="link">
                                                <a href="components/MemberViewPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberViewPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MemberViewPageRoutingModule.html" data-type="entity-link" >MemberViewPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OptionsPageModule.html" data-type="entity-link" >OptionsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OptionsPageModule-f882ff56232435fa04d9d87bd5b85be4"' : 'data-target="#xs-components-links-module-OptionsPageModule-f882ff56232435fa04d9d87bd5b85be4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OptionsPageModule-f882ff56232435fa04d9d87bd5b85be4"' :
                                            'id="xs-components-links-module-OptionsPageModule-f882ff56232435fa04d9d87bd5b85be4"' }>
                                            <li class="link">
                                                <a href="components/OptionsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OptionsPageRoutingModule.html" data-type="entity-link" >OptionsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PasswordPageModule.html" data-type="entity-link" >PasswordPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PasswordPageModule-5b7c8d6218d07cf228315ae5c81a3d68"' : 'data-target="#xs-components-links-module-PasswordPageModule-5b7c8d6218d07cf228315ae5c81a3d68"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PasswordPageModule-5b7c8d6218d07cf228315ae5c81a3d68"' :
                                            'id="xs-components-links-module-PasswordPageModule-5b7c8d6218d07cf228315ae5c81a3d68"' }>
                                            <li class="link">
                                                <a href="components/PasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PasswordPageRoutingModule.html" data-type="entity-link" >PasswordPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentPageModule.html" data-type="entity-link" >PaymentPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PaymentPageModule-37678f07cd71f815e7ff8217ba194bc8"' : 'data-target="#xs-components-links-module-PaymentPageModule-37678f07cd71f815e7ff8217ba194bc8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PaymentPageModule-37678f07cd71f815e7ff8217ba194bc8"' :
                                            'id="xs-components-links-module-PaymentPageModule-37678f07cd71f815e7ff8217ba194bc8"' }>
                                            <li class="link">
                                                <a href="components/PaymentPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentPageRoutingModule.html" data-type="entity-link" >PaymentPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentReminderPageModule.html" data-type="entity-link" >PaymentReminderPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PaymentReminderPageModule-e2b50ff7498dfe3cdeaaf25f63b5db91"' : 'data-target="#xs-components-links-module-PaymentReminderPageModule-e2b50ff7498dfe3cdeaaf25f63b5db91"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PaymentReminderPageModule-e2b50ff7498dfe3cdeaaf25f63b5db91"' :
                                            'id="xs-components-links-module-PaymentReminderPageModule-e2b50ff7498dfe3cdeaaf25f63b5db91"' }>
                                            <li class="link">
                                                <a href="components/PaymentReminderPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentReminderPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentReminderPageRoutingModule.html" data-type="entity-link" >PaymentReminderPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PrivacyPageModule.html" data-type="entity-link" >PrivacyPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PrivacyPageModule-053c2911f8117c9f4b7636c6014793de"' : 'data-target="#xs-components-links-module-PrivacyPageModule-053c2911f8117c9f4b7636c6014793de"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PrivacyPageModule-053c2911f8117c9f4b7636c6014793de"' :
                                            'id="xs-components-links-module-PrivacyPageModule-053c2911f8117c9f4b7636c6014793de"' }>
                                            <li class="link">
                                                <a href="components/PrivacyPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrivacyPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrivacyPageRoutingModule.html" data-type="entity-link" >PrivacyPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageModule.html" data-type="entity-link" >ProfilePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProfilePageModule-7456eccb69388d69a4e5f0021af5ebbc"' : 'data-target="#xs-components-links-module-ProfilePageModule-7456eccb69388d69a4e5f0021af5ebbc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfilePageModule-7456eccb69388d69a4e5f0021af5ebbc"' :
                                            'id="xs-components-links-module-ProfilePageModule-7456eccb69388d69a4e5f0021af5ebbc"' }>
                                            <li class="link">
                                                <a href="components/ProfilePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageRoutingModule.html" data-type="entity-link" >ProfilePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageModule.html" data-type="entity-link" >RegisterPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegisterPageModule-937fd78c6173f7028ff2c50e518b4eb8"' : 'data-target="#xs-components-links-module-RegisterPageModule-937fd78c6173f7028ff2c50e518b4eb8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterPageModule-937fd78c6173f7028ff2c50e518b4eb8"' :
                                            'id="xs-components-links-module-RegisterPageModule-937fd78c6173f7028ff2c50e518b4eb8"' }>
                                            <li class="link">
                                                <a href="components/RegisterPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageRoutingModule.html" data-type="entity-link" >RegisterPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StatisticsPageModule.html" data-type="entity-link" >StatisticsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StatisticsPageModule-35fba6e2d4982ddcd5c27ec5c306eef9"' : 'data-target="#xs-components-links-module-StatisticsPageModule-35fba6e2d4982ddcd5c27ec5c306eef9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StatisticsPageModule-35fba6e2d4982ddcd5c27ec5c306eef9"' :
                                            'id="xs-components-links-module-StatisticsPageModule-35fba6e2d4982ddcd5c27ec5c306eef9"' }>
                                            <li class="link">
                                                <a href="components/StatisticsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatisticsPageRoutingModule.html" data-type="entity-link" >StatisticsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionCreatePageModule.html" data-type="entity-link" >TransactionCreatePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionCreatePageModule-8b8f416493a1f77bc8401017c6c9116e"' : 'data-target="#xs-components-links-module-TransactionCreatePageModule-8b8f416493a1f77bc8401017c6c9116e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionCreatePageModule-8b8f416493a1f77bc8401017c6c9116e"' :
                                            'id="xs-components-links-module-TransactionCreatePageModule-8b8f416493a1f77bc8401017c6c9116e"' }>
                                            <li class="link">
                                                <a href="components/TransactionCreatePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionCreatePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionCreatePageRoutingModule.html" data-type="entity-link" >TransactionCreatePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionDetailsPageModule.html" data-type="entity-link" >TransactionDetailsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionDetailsPageModule-9ad27c32bfec225b7e23e1631e829565"' : 'data-target="#xs-components-links-module-TransactionDetailsPageModule-9ad27c32bfec225b7e23e1631e829565"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionDetailsPageModule-9ad27c32bfec225b7e23e1631e829565"' :
                                            'id="xs-components-links-module-TransactionDetailsPageModule-9ad27c32bfec225b7e23e1631e829565"' }>
                                            <li class="link">
                                                <a href="components/TransactionDetailsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionDetailsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionDetailsPageRoutingModule.html" data-type="entity-link" >TransactionDetailsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionParticipantsPageModule.html" data-type="entity-link" >TransactionParticipantsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionParticipantsPageModule-d9d2953e21d1aa5b0941cbc7a4d5b892"' : 'data-target="#xs-components-links-module-TransactionParticipantsPageModule-d9d2953e21d1aa5b0941cbc7a4d5b892"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionParticipantsPageModule-d9d2953e21d1aa5b0941cbc7a4d5b892"' :
                                            'id="xs-components-links-module-TransactionParticipantsPageModule-d9d2953e21d1aa5b0941cbc7a4d5b892"' }>
                                            <li class="link">
                                                <a href="components/TransactionParticipantsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionParticipantsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionParticipantsPageRoutingModule.html" data-type="entity-link" >TransactionParticipantsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionStakesPageModule.html" data-type="entity-link" >TransactionStakesPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionStakesPageModule-d09aaec56a0e5f4a837ce097fc152f5d"' : 'data-target="#xs-components-links-module-TransactionStakesPageModule-d09aaec56a0e5f4a837ce097fc152f5d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionStakesPageModule-d09aaec56a0e5f4a837ce097fc152f5d"' :
                                            'id="xs-components-links-module-TransactionStakesPageModule-d09aaec56a0e5f4a837ce097fc152f5d"' }>
                                            <li class="link">
                                                <a href="components/TransactionStakesPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionStakesPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionStakesPageRoutingModule.html" data-type="entity-link" >TransactionStakesPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TutorialPageModule.html" data-type="entity-link" >TutorialPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TutorialPageModule-02da5ea4941941e8debb3146a5167d22"' : 'data-target="#xs-components-links-module-TutorialPageModule-02da5ea4941941e8debb3146a5167d22"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TutorialPageModule-02da5ea4941941e8debb3146a5167d22"' :
                                            'id="xs-components-links-module-TutorialPageModule-02da5ea4941941e8debb3146a5167d22"' }>
                                            <li class="link">
                                                <a href="components/TutorialPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TutorialPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TutorialPageRoutingModule.html" data-type="entity-link" >TutorialPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Award.html" data-type="entity-link" >Award</a>
                            </li>
                            <li class="link">
                                <a href="classes/Group.html" data-type="entity-link" >Group</a>
                            </li>
                            <li class="link">
                                <a href="classes/SimpleTransaction.html" data-type="entity-link" >SimpleTransaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Statistic.html" data-type="entity-link" >Statistic</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transaction.html" data-type="entity-link" >Transaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transaction-1.html" data-type="entity-link" >Transaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionTracker.html" data-type="entity-link" >TransactionTracker</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ArwardService.html" data-type="entity-link" >ArwardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BadgeService.html" data-type="entity-link" >BadgeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FriendsService.html" data-type="entity-link" >FriendsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupService.html" data-type="entity-link" >GroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatisticsService.html" data-type="entity-link" >StatisticsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransactionService.html" data-type="entity-link" >TransactionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});