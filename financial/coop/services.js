/* ==========================================
   CO-OPERATIVE BANK
   SERVICES
========================================== */

"use strict";

/* ==========================
   DASHBOARD
========================== */

function openCoopDashboard() {

   loadCoopDashboard();

   showScreen("coopDashboard");

}

/* ==========================
   TRANSFER
========================== */

function openCoopTransfer() {

   showScreen("coopTransfer");

}

/* ==========================
   DEPOSIT
========================== */

function openCoopDeposit() {

   showScreen("coopDeposit");

}

/* ==========================
   WITHDRAW
========================== */

function openCoopWithdraw() {

   showScreen("coopWithdraw");

}

/* ==========================
   PAY BILLS
========================== */

function openCoopBills() {

   showScreen("coopBills");

}

/* ==========================
   BUY GOODS
========================== */

function openCoopBuyGoods() {

   showScreen("coopBuyGoods");

}

/* ==========================
   AIRTIME
========================== */

function openCoopAirtime() {

   showScreen("coopAirtime");

}

/* ==========================
   DATA BUNDLES
========================== */

function openCoopBundles() {

   showScreen("coopBundles");

}

/* ==========================
   LOANS
========================== */

function openCoopLoans() {

   updateCoopLoanStatus();

   showScreen("coopLoans");

}

/* ==========================
   CARDS
========================== */

function openCoopCards() {

   loadCoopCard();

   showScreen("coopCards");

}

/* ==========================
   STATEMENTS
========================== */

function openCoopStatement() {

   loadCoopStatement();

   showScreen("coopStatement");

}

/* ==========================
   SETTINGS
========================== */

function openCoopSettings() {

   loadCoopSettings();

   showScreen("coopSettings");

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopDashboard = openCoopDashboard;
window.openCoopTransfer = openCoopTransfer;
window.openCoopDeposit = openCoopDeposit;
window.openCoopWithdraw = openCoopWithdraw;
window.openCoopBills = openCoopBills;
window.openCoopBuyGoods = openCoopBuyGoods;
window.openCoopAirtime = openCoopAirtime;
window.openCoopBundles = openCoopBundles;
window.openCoopLoans = openCoopLoans;
window.openCoopCards = openCoopCards;
window.openCoopStatement = openCoopStatement;
window.openCoopSettings = openCoopSettings;