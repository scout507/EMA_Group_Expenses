import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {IonSearchbar} from "@ionic/angular";
import firebase from "firebase";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage implements OnInit {

  subGroups: Subscription;
  groups: Group[] = [];
  currentUser: User;
  filteredGroups: Group[] = [];
  searchbarVisible = false;

  constructor(private groupService: GroupService,
              private authService: AuthService,
              private router: Router){

  }

  #searchbar: IonSearchbar;
  @ViewChild(IonSearchbar)
  set searchbar(sb: IonSearchbar) {
    if (sb) {
      sb.setFocus();
      this.#searchbar = sb;
    }
  }
  setVisible(){
    this.searchbarVisible = true;
  }

  doSearch(){
    this.filteredGroups = this.groups.filter(r =>
      r.name.toLowerCase().includes(this.#searchbar.value.toLowerCase()));
  }

  cancelSearch(){
    this.#searchbar.value = "";
    this.filteredGroups = this.groups;
    this.searchbarVisible = false;
  }


  ionViewWillEnter(){
    this.searchbarVisible = false;
    this.currentUser = this.authService.currentUser;
    this.subGroups = this.groupService.getAll().subscribe(groups => {
      let newGroups: any[] = [];
      groups.forEach(group => {
        if(group.creator == this.currentUser.id){
          newGroups.push(group)
        }else{
          group.members.forEach(member => {
            if(member.toString() == this.currentUser.id){
              newGroups.push(group)
            }
          })
        }
      });
      this.groups = [];
      newGroups.forEach(group => {
        this.groups.push(this.groupService.createGroup(group, group.id));
      });
      this.filteredGroups.splice(0, this.filteredGroups.length, ...this.groups);
    });
  }

  ionViewDidLeave() {
    this.subGroups.unsubscribe();
  }

  createGroup(){
    this.router.navigate(['group-create'])
  }

  showGroup(group: Group){
    this.router.navigate(['group-details', {id: group.id}])
  }

  ngOnInit() {
  }

}
