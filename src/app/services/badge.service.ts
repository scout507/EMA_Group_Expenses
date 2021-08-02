import { Injectable } from "@angular/core";
import { UserService } from './user.service';
import { User } from "../models/user.model";
import { StatisticsService } from "./statistics.service";
import { Transaction } from "../models/transaction.model";

/**
 * This class is needed to manage the allocation of awards, with linking of the database.
 */

@Injectable({
    providedIn: 'root'
})

export class BadgeService {

    /**
     * @ignore
     * @param userservice 
     * @param stats 
     */
    constructor(private userservice: UserService, private stats:StatisticsService) { }

    /**
     * This function checks which awards the user has and adds missing ones as needed. 
     * Awards will only be added if the requirements are met.
     * @param user Needed to see which awards are present and add the missing ones.
     * @param transactions Are needed to work with the satistics functions
     */
    setBadges(user: User, transactions: Transaction[]) {
        if (this.stats.getAllSelfmadeTransactionsOfTime(user.id, -1, transactions) >= 50 && !user.awards.includes("2jgBrLRTucI9CjxxWv5g")) {
            user.awards.push("2jgBrLRTucI9CjxxWv5g");
        }

        if (user.friends.length >= 10 && !user.awards.includes("KNUGSj8xbsuwc0YvdYsU")) {
            user.awards.push("KNUGSj8xbsuwc0YvdYsU");
        }

        if (this.stats.getAllSelfmadeTransactionsOfTime(user.id, -1, transactions) >= 10 && !user.awards.includes("dHIv113GmkQMxesxqF2K")) {
            user.awards.push("dHIv113GmkQMxesxqF2K");
        }

        if (this.stats.getAllIncomeOfTime(-1, transactions, user.id)[0] >= 100 && !user.awards.includes("fdb031aej8qazbadvIA8")) {
            user.awards.push("fdb031aej8qazbadvIA8");
        }

        if (this.stats.getAllExpensesOfTime(7, transactions, user.id)[0] >= 1000 && !user.awards.includes("pthZ34GVf4eB6qlXPAvv")) {
            user.awards.push("pthZ34GVf4eB6qlXPAvv");
        }
        this.userservice.update(user);
    }

}