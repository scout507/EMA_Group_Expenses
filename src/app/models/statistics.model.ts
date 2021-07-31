/**
 * Class used to hold Group statistics.
 */

export class Statistic{
  startDate: Date;
  newestDate: Date;
  timespan: number;

  allTimeTotal = 0;
  allTimeCost = 0;
  allTimeIncome = 0;

  lastYearTotal = 0;
  lastYearCost = 0;
  lastYearIncome = 0;

  lastSixMonthsTotal = 0;
  lastSixMonthsCost = 0;
  lastSixMonthsIncome = 0;

  lastThreeMonthsTotal = 0;
  lastThreeMonthsCost = 0;
  lastThreeMonthsIncome = 0;

  lastMonthTotal = 0;
  lastMonthCost = 0;
  lastMonthIncome = 0;

  lastWeekTotal = 0;
  lastWeekCost = 0;
  lastWeekIncome = 0;

  /**
   *
   * @param startDate transaction.purchaseDate
   * @param newestDate new Date()
   */
  constructor(startDate: Date, newestDate: Date) {
    this.startDate = startDate;
    this.newestDate = newestDate;
    // @ts-ignore
    this.timespan = Math.round(((newestDate - startDate)/ 86400000));
  }
}
