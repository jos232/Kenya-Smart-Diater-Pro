"use strict";

/* ==========================================
   OPEN KCB DASHBOARD
========================================== */

function openKCBDashboard() {

    loadKCBDashboard();

    showScreen("kcbDashboard");

}
/* ==========================================
   BACK TO BANKS
========================================== */

function backToBanks() {

    hideFinancialTabs();

    document.getElementById("bankSelectionScreen").style.display = "block";

}