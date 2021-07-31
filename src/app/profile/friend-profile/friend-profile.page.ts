import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from '../../models/award.model';
import { ArwardService } from 'src/app/services/award.service';
import { FriendsService } from '../../services/friends.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from "../../services/auth.service";
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionService } from 'src/app/services/transaction.service';
import { BadgeService } from 'src/app/services/badge.service';

/**
 * Die Klasse wird für die Friend-Profil Page benötigt.
 */

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})

export class FriendProfilePage {
  badges: Award[] = [];
  user: User = new User();
  isfriend = false;
  currentUser: User;

  /**
   * @ignore
   * @param transactionsservice 
   * @param sanitizer 
   * @param route 
   * @param router 
   * @param awardService 
   * @param af 
   * @param userService 
   * @param friendsService 
   * @param authService 
   * @param badgeService 
   */

  constructor(
    private transactionsservice: TransactionService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public router: Router,
    private awardService: ArwardService,
    private af: AngularFireAuth,
    private userService: UserService,
    private friendsService: FriendsService,
    private authService: AuthService,
    private badgeService: BadgeService
  ) { }

  /**
   * Beim öffnen der Seite werden alle benötigten Informationen über die Services geladen und in den 
   * dafür vorgsehenen Variablen gespeichert. Dabei werden ebenfalls die Archievments berechnet und sollte
   * es neue geben, werden diese in der Datenbank gespeichert. Wichtig hierbei ist die Überprüfung ob der
   * User eingeloggt ist, sonst werden keine Daten geladen.
   */

  ionViewWillEnter() {
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          this.route.params.subscribe(item => {
            this.friendsService.findById(item[0], this.currentUser).then(item2 => {
              this.user = item2;
              this.badges = [];
              this.transactionsservice.getAllTransactionByUser(item2, true).then(transactions => {
                this.badgeService.setBadges(item2, transactions);
                this.user.awards.forEach(element => {
                  this.awardService.findById(element).then(item => {
                    this.badges.push(item);
                  });
                });
              });
              this.isfriend = this.friendsService.isFriends(this.user, this.currentUser);
            });
          });
          sub.unsubscribe();
        });
      }
    });
  }

  /**
  * Über die Funktion können Freunde hinzugefügt werden.
  */
  addFriend() {
    this.friendsService.addFriend(this.user.email, this.currentUser.id);
  }

  /**
   * Diese Funktionalität erstellt einen Ionic-Alert, dieser enthält nur einen Titel und eine Beschreibung,
   * des Weiteren gibt es einen Schließen-Button um den Ionic-Alert zu schließen. Wird benutzt wenn man auf
   * die Icons der Badges klickt.
   * @param badgename Wird benötigt für den Titel.
   * @param badgeDescription Wird benötigt für die Beschreibung.
   */
  async badgeDescription(badgename, badgeDescription) {
    const alert = document.createElement('ion-alert');
    alert.header = badgename;
    alert.message = badgeDescription;
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
  }

  /**
   * Diese Funktionalität erstellt einen Ionic-Alert, dieser enthält nur einen Titel und eine Beschreibung,
   * des Weiteren gibt es einen Schließen-Button um den Ionic-Alert zu schließen. Wird benutzt wenn man auf
   * die Icons der Bezahlmethoden klickt.
   * @param name Benötigt für den Titel.
   * @param discription Benötigt für die Beschreibung.
   */
  async paymentDescription(name: string, discription: string) {
    const alert = document.createElement('ion-alert');
    alert.header = name;
    alert.message = discription;
    alert.buttons = [{ text: "schließen" }];

    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss();
  }
}
