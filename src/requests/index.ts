import {RequestsParams} from "../../types/request"
import {MoneyhubRequests} from "../../types"

import accounts from "./accounts"
import authRequests from "./auth-requests"
import beneficiaries from "./beneficiaries"
import categories from "./categories"
import payees from "./payees"
import payments from "./payments"
import projects from "./projects"
import recurringPayments from "./recurring-payments"
import regularTransactions from "./regular-transactions"
import rentalRecords from "./rental-records"
import savingsGoals from "./savings-goals"
import spendingAnlysis from "./spending-analysis"
import spendingGoals from "./spending-goals"
import standingOrders from "./standing-orders"
import sync from "./sync"
import tax from "./tax"
import transactionFiles from "./transaction-files"
import transactionSplits from "./transaction-splits"
import transactions from "./transactions"
import unauthenticated from "./unauthenticated"
import usersAndConnections from "./users-and-connections"

export default ({config, request}: RequestsParams): MoneyhubRequests => {
  return {
    ...accounts({config, request}),
    ...authRequests({config, request}),
    ...beneficiaries({config, request}),
    ...categories({config, request}),
    ...payees({config, request}),
    ...payments({config, request}),
    ...projects({config, request}),
    ...recurringPayments({config, request}),
    ...regularTransactions({config, request}),
    ...rentalRecords({config, request}),
    ...savingsGoals({config, request}),
    ...spendingAnlysis({config, request}),
    ...spendingGoals({config, request}),
    ...standingOrders({config, request}),
    ...sync({config, request}),
    ...tax({config, request}),
    ...transactionFiles({config, request}),
    ...transactionSplits({config, request}),
    ...transactions({config, request}),
    ...unauthenticated({config, request}),
    ...usersAndConnections({config, request}),
  }
}
