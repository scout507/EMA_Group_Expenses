import {Component, OnInit, ViewChild} from '@angular/core';
import {Group} from "../../models/group.model";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {Transaction} from "../../models/transaction.model";
import {TransactionService} from "../../services/transaction.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../../services/user.service";
import { DomSanitizer } from '@angular/platform-browser';
import {StatisticsService} from "../../services/statistics.service";
import {Statistic} from "../../models/statistics.model";
import Chart from "chart.js/auto";

/**
 * This class shows the details from the selected group
 */
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {

  id: string;
  group: Group;
  currentUser: User;
  allTransactions: Transaction[];
  currentTransactions: Transaction[];
  oldTransactions: Transaction[];
  statistic: Statistic;
  view = 0;
  errorMessage: string;
  statsArray = ["Insgesamt", "Letztes Jahr", "Letzte 6 Monate", "Letzte 3 Monate", "Letzter Monat", "Letzte Woche"]
  currentStats = 0;
  currentTotal = 0;
  currentCost = 0;
  currentIncome = 0;
  pie: Chart;

  @ViewChild('pieChart') pieChart;


  /**
   * @ignore
   * @param groupService
   * @param route
   * @param navCtrl
   * @param alertController
   * @param authService
   * @param af
   * @param userService
   * @param transactionService
   * @param sanitizer
   * @param statisticsService
   * @param router
   */
  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private alertController: AlertController,
              private authService: AuthService,
              private af: AngularFireAuth,
              private userService: UserService,
              private transactionService: TransactionService,
              private sanitizer: DomSanitizer,
              private statisticsService: StatisticsService,
              private router: Router) {
  }


  /**
   * updates the existing group with new details
   */
  update(){
    if(this.group.name.length > 2){
      if(this.group.members.length > 1){
        this.groupService.update(this.group);
        this.navCtrl.back();
      } else {
        alert("Bitte f??gen Sie ein Freund Ihrer Gruppe hinzu.")
      }
    } else{
      alert("Bitte geben Sie einen l??ngeren Namen ein.")
    }
  }

  /**
   * deletes the selected group
   */
  async delete(): Promise<void>{
    const alert = await this.alertController.create({
      header: 'Gruppe l??schen',
      message: `Bist du dir sicher, dass du die Gruppe ${this.group.name} l??schen m??chtest?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'L??schen',
          handler: () => {
            this.transactionService.checkAllTransactionsFinishedInGroup(this.group).then(openTransactions => {
              if(openTransactions){
                this.errorMessage = "Es bestehen noch offene Transaktionen";
              }else{
                this.groupService.delete(this.group);
                this.navCtrl.back();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * lets the user leave the selected group
   */
  async leaveGroup(): Promise<void>{
    const alert = await this.alertController.create({
      header: 'Gruppe verlassen',
      message: `Bist du dir sicher, dass du die Gruppe ${this.group.name} verlassen m??chtest?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Verlassen',
          handler: () => {
            this.transactionService.checkTransactionsFinishedInGroupByUser(this.group, this.currentUser).then(openTransactions => {
              if(openTransactions){
                this.errorMessage = "Sie haben noch offene Rechnungen"
              }else{
                this.groupService.deleteUserFromGroup(this.currentUser, this.group);
                this.navCtrl.back();
              }
            });

          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * @ignore
   */
  ionViewWillEnter() {
    this.currentTransactions = [];
    this.oldTransactions = [];
    this.allTransactions = [];
    const sub = this.af.authState.subscribe(user => {
      if (user) {
        this.userService.findById(user.uid).then(result => {
          this.currentUser = result;
          sub.unsubscribe();
        });
      }
    });
    const groupID = this.route.snapshot.paramMap.get('id');
    this.groupService.getGroupById(groupID).then(g => {
      this.group = g;
      this.transactionService.getAllTransactionByGroup(this.group).then(transactions =>{
        transactions.forEach(transaction =>{
          this.allTransactions.push(transaction);
          if(!transaction.finished){
            this.currentTransactions.push(transaction);
          }
          else{
            this.oldTransactions.push(transaction);
          }
        });
        if(this.allTransactions.length >0){
          this.statistic = this.statisticsService.getGroupStatistics(this.allTransactions);
          this.currentTotal = this.statistic.allTimeTotal;
          this.currentCost = this.statistic.allTimeCost;
          this.currentIncome = this.statistic.allTimeIncome;
        }
      });
    });
  }

  /**
   * navigates to the selected transaction
   * @param transaction - selected transaction
   */
  viewTransaction(transaction: Transaction) {
    this.transactionService.saveLocally(transaction);
    this.router.navigate(['transaction-details']);
  }

  /**
   * shows all members from the selected group
   */
  viewMembers(){
    this.router.navigate(['member-view', {id: this.group.id}])
  }

  /**
   * lets the user create a new transaction with the group
   */
  createTransaction(){
    if(this.group){
      this.router.navigate(['transaction-create', {fromGroup: true, groupID: this.group.id}]);
    }
  }

  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * lets the user see the statistics of the group
   */
  switchToStats(){
    if(this.view != 2) {
      this.view = 2;
      this.createPieChart();
    }
  }

  /**
   * creates a pie chart with the statistics of the group
   */
  createPieChart() {
    if(this.pieChart != undefined) {
      this.pie = new Chart(this.pieChart.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Einnahmen', 'Ausgaben'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [this.currentIncome, this.currentCost],
              backgroundColor: ["rgba(104, 237, 136, 1)", "rgba(237, 104, 104, 1)"],
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        },
      });
    }
    else{
      setTimeout( () => { this.createPieChart() }, 100 );
    }
  }

  /**
   * sets the time frame for the statistics of the group
   * @param back - checks if back or forward is pressed
   */
  statsButton(back: boolean) {
    if(back && this.currentStats>0) this.currentStats--;
    else if(!back && this.currentStats<5) this.currentStats++;
    switch (this.currentStats){
      case 0: {
        this.currentTotal = this.statistic.allTimeTotal;
        this.currentCost = this.statistic.allTimeCost;
        this.currentIncome = this.statistic.allTimeIncome;
        break;
      }
      case 1: {
        this.currentTotal = this.statistic.lastYearTotal;
        this.currentCost = this.statistic.lastYearCost;
        this.currentIncome = this.statistic.lastYearIncome;
        break;
      }
      case 2: {
        this.currentTotal = this.statistic.lastSixMonthsTotal;
        this.currentCost = this.statistic.lastSixMonthsCost;
        this.currentIncome = this.statistic.lastSixMonthsIncome;
        break;
      }
      case 3: {
        this.currentTotal = this.statistic.lastThreeMonthsTotal;
        this.currentCost = this.statistic.lastThreeMonthsCost;
        this.currentIncome = this.statistic.lastThreeMonthsIncome;
        break;
      }
      case 4: {
        this.currentTotal = this.statistic.lastMonthTotal;
        this.currentCost = this.statistic.lastMonthCost;
        this.currentIncome = this.statistic.lastMonthIncome;
        break;
      }
      case 5: {
        this.currentTotal = this.statistic.lastWeekTotal;
        this.currentCost = this.statistic.lastWeekCost;
        this.currentIncome = this.statistic.lastWeekIncome;
        break;
      }
    }
    this.pie.data.datasets.forEach((dataset) => {
      dataset.data = [this.currentIncome, this.currentCost];
    });
    this.pie.update();
  }

  /**
   * creates the desired date format
   * @param oldDate - date format that needs to be changed
   */
  dateFormat(oldDate: string): string{
    const d = new Date(oldDate);
    return '' + d.getDate() + "." + (d.getMonth()+1) + '.' + d.getFullYear();
  }
}
