import { Transaction } from "../models/transaction.model";
import { Injectable } from "@angular/core";
import { Statistic } from "../models/statistics.model";

/**
 * Service for calculating group & user statistics.
 */

@Injectable({
  providedIn: 'root'
})

export class StatisticsService {
  /**
   * Creates and returns a new Statistics object and calculates data for the different time-spans.
   * @param transactions Array containing all transactions of the given group
   */
  getGroupStatistics(transactions: Transaction[]): Statistic {
    let today = new Date();
    let statistic = new Statistic(new Date(transactions[0].purchaseDate), today)

    transactions.forEach(transaction => {
      transaction.amount = Math.round(transaction.amount * 100) / 100
      //All time
      statistic.allTimeTotal++;
      if (transaction.type === "cost") statistic.allTimeCost += transaction.amount;
      else statistic.allTimeIncome += transaction.amount;
      //Last year
      if (this.getDays(new Date(transaction.purchaseDate), today) <= 360 && this.getDays(new Date(transaction.purchaseDate), today) >= 0) {
        statistic.lastYearTotal++;
        if (transaction.type === "cost") statistic.lastYearCost += transaction.amount;
        else statistic.lastYearIncome += transaction.amount;
      }
      //Last 6 months
      if (this.getDays(new Date(transaction.purchaseDate), today) <= 180 && this.getDays(new Date(transaction.purchaseDate), today) >= 0) {
        statistic.lastSixMonthsTotal++;
        if (transaction.type === "cost") statistic.lastSixMonthsCost += transaction.amount;
        else statistic.lastSixMonthsIncome += transaction.amount;
      }
      //Last 3 Months
      if (this.getDays(new Date(transaction.purchaseDate), today) <= 90 && this.getDays(new Date(transaction.purchaseDate), today) >= 0) {
        statistic.lastThreeMonthsTotal++;
        if (transaction.type === "cost") statistic.lastThreeMonthsCost += transaction.amount;
        else statistic.lastThreeMonthsIncome += transaction.amount;
      }
      //Last Month
      if (this.getDays(new Date(transaction.purchaseDate), today) <= 30 && this.getDays(new Date(transaction.purchaseDate), today) >= 0) {
        statistic.lastMonthTotal++;
        if (transaction.type === "cost") statistic.lastMonthCost += transaction.amount;
        else statistic.lastMonthIncome += transaction.amount;
      }
      //Last Week
      if (this.getDays(new Date(transaction.purchaseDate), today) <= 7 && this.getDays(new Date(transaction.purchaseDate), today) >= 0) {
        statistic.lastWeekTotal++;
        if (transaction.type === "cost") statistic.lastWeekCost += transaction.amount;
        else statistic.lastWeekIncome += transaction.amount;
      }
    });
    return statistic;
  }

  /**
   * Calculates the difference between two dates in days.
   * @param date1 transaction.purchaseDate
   * @param date2 new Date()
   */
  getDays(date1: Date, date2: Date): Number {
    // @ts-ignore
    return Math.round(((date2 - date1) / 86400000))
  }

  /**
   * This function returns all expenses of a user for a period of time.
   * @param days Specifies the number of days, -1 represents the entire period.
   * @param transactions Contains the transactions from a user in an array.
   * @param userID Is needed for the identification of the user.
   * @returns Returns all expenses of a user for a period of time.
   */
  getAllExpensesOfTime(days: number, transactions: Transaction[], userID: string) {
    let costs = 0;
    let ammount = 0;
    transactions.forEach(transaction => {
      if (transaction.type === "cost") {
        if (this.getDays(new Date(transaction.purchaseDate), new Date()) <= days || days == -1) {
          transaction.participation.forEach(p => {
            if (p.user.id === userID) costs += p.stake;
          })
          ammount++;
        }
      }
    });
    return [Math.round(costs * 100) / 100, ammount];
  }

  /**
     * This function returns all income of a user for a period of time.
     * @param days Specifies the number of days, -1 represents the entire period.
     * @param transactions Contains the transactions from a user in an array.
     * @param userID Is needed for the identification of the user.
     * @returns Returns all income of a user for a period of time.
     */
  getAllIncomeOfTime(days: number, transactions: Transaction[], userID: string) {
    var costs: number = 0;
    var ammount: number = 0;
    transactions.forEach(transaction => {
      if (transaction.type === "income") {
        if (this.getDays(new Date(transaction.purchaseDate), new Date()) <= days || days == -1) {
          transaction.participation.forEach(p => {
            if (p.user.id === userID) costs += p.stake;
          })
          ammount++;
        }
      }
    });
    return [Math.round(costs * 100) / 100, ammount];
  }

  /**
     * This function returns all created transactions of a user for a period of time.
     * @param userid Is needed for the identification of the user.
     * @param days Specifies the number of days, -1 represents the entire period.
     * @param transactions Contains the transactions from a user in an array.
     * @returns Returns all created transactions of a user for a period of time.
     */
  getAllSelfmadeTransactionsOfTime(userid: string, days: number, transactions: Transaction[]) {
    var ammount: number = 0;
    transactions.forEach(item => {
      if (item.creator.id === userid) {
        if (this.getDays(new Date(item.purchaseDate), new Date()) <= days || days == -1) {
          ammount++;
        }
      }
    });
    return ammount;
  }

}
