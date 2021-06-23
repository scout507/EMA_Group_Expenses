import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {

  id: string;
  group: Group = new Group();
  creator: User;
  currentUser: User = new User();

  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private alertController: AlertController,
              private authService: AuthService) {

  }
  addMembers(){
    this.groupService.addMembers(this.group, this.currentUser).then(members => {
      this.group.members.splice(0, this.group.members.length, ...members);
    })
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
      message: `Bist du dir sicher das du die Gruppe ${this.group.name} löschen möchtest?`,
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

  ionViewWillEnter() {
    this.currentUser = this.authService.currentUser;
    const groupID = this.route.snapshot.paramMap.get('id');
    this.groupService.getGroupById(groupID).then(g => {
      this.group = g;
      this.authService.getUserById(this.group.creator).then(u => {
        this.creator = u;
        console.log(this.creator);
      })
    });
  }

  ngOnInit() {
  }

}
