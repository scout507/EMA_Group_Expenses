import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {

  id: string;
  group: Group;
  currentUser: User;
  currentTransactions: Transaction[];
  oldTransactions: Transaction[];
  current = true;

  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private alertController: AlertController,
              private authService: AuthService,
              private transactionService: TransactionService,
              private router: Router) {
  }


  update(){
    if(this.group.name.length > 2){
      if(this.group.members.length > 1){
        this.groupService.update(this.group);
        this.navCtrl.back();
      } else {
        alert("Bitte fügen Sie ein Freund Ihrer Gruppe hinzu.")
      }
    } else{
      alert("Bitte geben Sie einen längeren Namen ein.")
    }
  }

  async delete(): Promise<void>{
    const alert = await this.alertController.create({
      header: 'Gruppe löschen',
      message: `Bist du dir sicher, dass du die Gruppe ${this.group.name} löschen möchtest?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Löschen',
          handler: () => {
            this.groupService.delete(this.group.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  async leaveGroup(): Promise<void>{
    const alert = await this.alertController.create({
      header: 'Gruppe verlassen',
      message: `Bist du dir sicher, dass du die Gruppe ${this.group.name} verlassen möchtest?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Verlassen',
          handler: () => {
            this.groupService.deleteUserFromGroup(this.currentUser, this.group);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter() {
    this.currentTransactions = [];
    this.oldTransactions = [];
    this.currentUser = this.authService.currentUser;
    const groupID = this.route.snapshot.paramMap.get('id');
    this.groupService.getGroupById(groupID).then(g => {
      this.group = g;
      this.transactionService.getAllTransactionByGroup(this.group).then(transactions =>{
        transactions.forEach(transaction =>{
          if(!this.transactionService.checkTransactionFinish(transaction)){
            this.currentTransactions.push(transaction);
          }
          else{
            this.oldTransactions.push(transaction);
          }
        });
      });
    });
  }

  viewTransaction(transaction: Transaction) {
    this.transactionService.saveLocally(transaction);
    this.router.navigate(['transaction-details']);
  }

  viewMembers(){
    this.router.navigate(['member-view', {id: this.group.id}])
  }


  ngOnInit() {
  }

}
