import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {IonSearchbar} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../../services/user.service";

/**
 * This class shows all groups the user is a member
 */
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

  /**
   * @ignore
   * @param groupService
   * @param authService
   * @param af
   * @param userService
   * @param router
   */
  constructor(private groupService: GroupService,
              private authService: AuthService,
              private af: AngularFireAuth,
              private userService: UserService,
              private router: Router) {

  }

  #searchbar: IonSearchbar;
  @ViewChild(IonSearchbar)
  set searchbar(sb: IonSearchbar) {
    if (sb) {
      sb.setFocus();
      this.#searchbar = sb;
    }
  }

  /**
   * makes the searchbar visible
   */
  setVisible() {
    this.searchbarVisible = true;
  }

  /**
   * filters the groups with the value from searchbar
   */
  doSearch() {
    this.filteredGroups = this.groups.filter(r =>
      r.name.toLowerCase().includes(this.#searchbar.value.toLowerCase()));
  }

  /**
   * hides searchbar and unfilters groups
   */
  cancelSearch() {
    this.#searchbar.value = "";
    this.filteredGroups = this.groups;
    this.searchbarVisible = false;
  }


  /**
   * @ignore
   */
  ionViewWillEnter() {
    this.searchbarVisible = false;
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          sub.unsubscribe();
          this.subGroups = this.groupService.getAll().subscribe(groups => {
            let newGroups: any[] = [];
            groups.forEach(group => {
              group.members.forEach(member => {
                if (member.toString() == this.currentUser.id) {
                  newGroups.push(group)
                }
              })
            });
            this.groups = [];
            newGroups.forEach(group => {
              this.groups.push(this.groupService.createGroup(group, group.id));
            });
            this.filteredGroups.splice(0, this.filteredGroups.length, ...this.groups);
          });
        });
      }
    });
  }

  /**
   * @ignore
   */
  ionViewDidLeave() {
    this.subGroups.unsubscribe();
  }

  /**
   * navigates to the page to create a new group
   */
  createGroup() {
    this.router.navigate(['group-create'])
  }

  /**
   * navigates to the selected group
   * @param group - selected group
   */
  showGroup(group: Group) {
    this.router.navigate(['group-details', {id: group.id}])
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }
}
