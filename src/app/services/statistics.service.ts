import {Transaction} from "../models/transaction.model";
import {Injectable} from "@angular/core";
import {Statistic} from "../models/statistics.model";

@Injectable({
  providedIn: 'root'
})

export class StatisticsService{

  getGroupStatistics(transactions: Transaction[]): Statistic{
    let today = new Date();
    let statistic = new Statistic(new Date(transactions[0].purchaseDate), today)

    transactions.forEach(transaction => {
      transaction.amount = Math.round(transaction.amount*100)/100
      statistic.allTimeTotal ++;
      if(transaction.type === "cost") statistic.allTimeCost += transaction.amount;
      else  statistic.allTimeIncome += transaction.amount;

      if(this.getDays(new Date(transaction.purchaseDate), today) <= 360){
        statistic.lastYearTotal ++;
        if(transaction.type === "cost") statistic.lastYearCost += transaction.amount;
        else  statistic.lastYearIncome += transaction.amount;
      }
      if(this.getDays(new Date(transaction.purchaseDate), today) <= 180){
        statistic.lastSixMonthsTotal ++;
        if(transaction.type === "cost") statistic.lastSixMonthsCost += transaction.amount;
        else  statistic.lastSixMonthsIncome += transaction.amount;
      }
      if(this.getDays(new Date(transaction.purchaseDate), today) <= 90){
        statistic.lastThreeMonthsTotal ++;
        if(transaction.type === "cost") statistic.lastThreeMonthsCost += transaction.amount;
        else  statistic.lastThreeMonthsIncome += transaction.amount;
      }
      if(this.getDays(new Date(transaction.purchaseDate), today) <= 30){
        statistic.lastMonthTotal ++;
        if(transaction.type === "cost") statistic.lastMonthCost += transaction.amount;
        else  statistic.lastMonthIncome += transaction.amount;
      }
      if(this.getDays(new Date(transaction.purchaseDate), today) <= 7){
        statistic.lastWeekTotal ++;
        if(transaction.type === "cost") statistic.lastWeekCost += transaction.amount;
        else  statistic.lastWeekIncome += transaction.amount;
      }
    });
    return statistic;
  }

  getDays(date1: Date, date2: Date): Number{
    // @ts-ignore
    return Math.round(((date2 - date1)/ 86400000))
  }

  getAllExpensesOfTime(days:number, transactions:Transaction[]){
    var costs:number = 0;
    var ammount:number = 0;
    transactions.forEach(item => {
      if (item.type === "cost"){
        if (this.getDays(new Date (item.purchaseDate), new Date()) <= days || days == -1){
          costs += item.amount;
          ammount++;
        }
      }
    });
    return [costs, ammount];
  }

  getAllIncomeOfTime(days:number, transactions:Transaction[]){
    var costs:number = 0;
    var ammount:number = 0;
    transactions.forEach(item => {
      if (item.type === "income"){
        if (this.getDays(new Date (item.purchaseDate), new Date()) <= days || days == -1){
          costs += item.amount;
          ammount++;
        }
      }
    });
    return [costs, ammount];
  }

  getAllSelfmadeTransactionsOfTime(userid:string, days:number, transactions:Transaction[]){
    var ammount:number = 0;
    transactions.forEach(item => {
      if (item.creator.id === userid){
        if (this.getDays(new Date (item.purchaseDate), new Date()) <= days || days == -1){
          ammount++;
        }
      }
    });
    return ammount;
  }

}
