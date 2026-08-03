/* ==========================================
   EQUITY MOBILE
   SERVICES
========================================== */

"use strict";

/* ==========================
   TRANSFER
========================== */

function openEquityTransfer() {

   showScreen("equityTransfer");

}

/* ==========================
   DEPOSIT
========================== */

function openEquityDeposit() {

   showScreen("equityDeposit");

}

/* ==========================
   WITHDRAW
========================== */

function openEquityWithdraw() {

   showScreen("equityWithdraw");

}

/* ==========================
   STATEMENT
========================== */

function openEquityStatement() {

   showScreen("equityStatement");

}

/* ==========================
   BILLS
========================== */

function openEquityBills() {

   showScreen("equityBills");

}

/* ==========================
   BUY GOODS
========================== */

function openEquityBuyGoods() {

   showScreen("equityBuyGoods");

}

/* ==========================
   AIRTIME
========================== */

function openEquityAirtime() {

   showScreen("equityAirtime");

}

/* ==========================
   BUNDLES
========================== */

function openEquityBundles() {

   showScreen("equityBundles");

}

/* ==========================
   LOANS
========================== */

function openEquityLoans() {

   showScreen("equityLoans");

}

/* ==========================
   CARDS
========================== */

function openEquityCards() {

   showScreen("equityCards");

}

/* ==========================
   SETTINGS
========================== */

function openEquitySettings() {

   showScreen("equitySettings");

}
/* ==========================================
   SMART SERVICE LOADER
========================================== */

function loadEquityService(service) {

   switch (service) {

      case "dashboard":
         loadEquityDashboard();
         break;

      case "transfer":
         if (typeof loadEquityBeneficiaries === "function")
            loadEquityBeneficiaries();
         break;

      case "deposit":
         break;

      case "withdraw":
         break;

      case "statement":
         if (typeof loadEquityStatement === "function")
            loadEquityStatement();
         break;

      case "bills":
         break;

      case "buygoods":
         break;

      case "airtime":
         break;

      case "bundles":
         break;

      case "loans":
         if (typeof updateEquityLoanDashboard === "function")
            updateEquityLoanDashboard();
         break;

      case "cards":
         break;

      case "settings":
         break;

   }

}

/* ==========================================
   REFRESH ALL EQUITY SERVICES
========================================== */

function refreshEquityServices() {

   loadEquityDashboard();

   if (typeof loadEquityRecentTransactions === "function")
      loadEquityRecentTransactions();

   addBankNotification(

      "Equity Updated",

      "All Equity services have been refreshed."

   );

}

/* ==========================================
   QUICK ACTIONS
========================================== */

function openEquitySendMoney() {

   openEquityTransfer();

}

function openEquityPayBills() {

   openEquityBills();

}

function openEquityBuyAirtime() {

   openEquityAirtime();

}

function openEquityMiniStatement() {

   openEquityStatement();

}

/* ==========================================
   EXPORTS
========================================== */

window.refreshEquityServices = refreshEquityServices;
window.loadEquityService = loadEquityService;
window.openEquitySendMoney = openEquitySendMoney;
window.openEquityPayBills = openEquityPayBills;
window.openEquityBuyAirtime = openEquityBuyAirtime;
window.openEquityMiniStatement = openEquityMiniStatement;