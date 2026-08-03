"use strict";

console.log("✅ financial.js loaded");

const API_URL = "http://localhost:3000/api";

/* ==========================
   TOKEN
========================== */

/* ==========================
   NAVIGATION
========================== */

function hideFinancialTabs() {
    document.querySelectorAll("#financial .financial-content").forEach(screen => {
        screen.style.display = "none";
    });
}

function showFinancialTab(screenId) {
    hideFinancialTabs();

    const screen = document.getElementById(screenId);

    if (screen) {
        screen.style.display = "block";
    }
}

/* ==========================
   TRANSACTIONS
========================== */

function finishTransaction() {

    if (typeof updateKCBBalance === "function")
        updateKCBBalance();

    if (typeof updateKCBAccount === "function")
        updateKCBAccount();

    if (typeof loadKCBRecentTransactions === "function")
        loadKCBRecentTransactions();

    if (typeof showScreen === "function")
        showScreen("kcbDashboard");
}

function openStatement() {

    if (typeof loadStatement === "function")
        loadStatement("KCB");

    if (typeof showScreen === "function")
        showScreen("kcbStatement");
}

/* ==========================
   LOANS
========================== */

function openLoans() {

    if (typeof updateLoanDashboard === "function")
        updateLoanDashboard();

    if (typeof showScreen === "function")
        showScreen("kcbLoans");
}

function updateLoanDashboard() {

    if (typeof kcbLoan === "undefined")
        return;

    const limit = document.getElementById("loanLimit");
    const status = document.getElementById("loanStatus");
    const outstanding = document.getElementById("loanOutstanding");

    if (limit)
        limit.textContent = formatMoney(kcbLoan.limit);

    if (!status || !outstanding)
        return;

    if (kcbLoan.active) {

        status.textContent = "Active Loan";

        outstanding.textContent =
            "Outstanding Loan: " + formatMoney(kcbLoan.amount);

    } else {

        status.textContent = "No Active Loan";

        outstanding.textContent = "Outstanding Loan: KSh 0.00";
    }
}

/* ==========================
   EQUITY
========================== */

function showEquityDashboard() {

    if (typeof loadEquityDashboard === "function")
        loadEquityDashboard();

    if (typeof showScreen === "function")
        showScreen("equityDashboard");
}
/* ==========================
   LOAD PROFILE
========================== */

async function loadFinancialProfile() {

    try {

        const data = await apiGet("/financial/profile");

        if (!data.success) {

            console.error(data.message);

            return;

        }

        updateFinancialDashboard(data.profile);

    }

    catch (err) {

        console.error(err);

    }

}

/* ==========================
   UPDATE DASHBOARD
========================== */

function updateFinancialDashboard(profile) {

    const kcbBalance = document.getElementById("kcbBalance");

    if (kcbBalance)
        kcbBalance.textContent =
            "KSh " + profile.banks.kcb.balance.toLocaleString();

    const acc = document.getElementById("kcbAccountNumber");

    if (acc)
        acc.textContent = profile.banks.kcb.accountNumber;

    const equity = document.getElementById("equityBalance");

    if (equity)
        equity.textContent =
            "KSh " + profile.banks.equity.balance.toLocaleString();

    const coop = document.getElementById("coopBalance");

    if (coop)
        coop.textContent =
            "KSh " + profile.banks.coop.balance.toLocaleString();

    const wallet = document.getElementById("walletBalance");

    if (wallet)
        wallet.textContent =
            "KSh " + profile.wallet.balance.toLocaleString();
}

/* ==========================
   KCB DASHBOARD
========================== */

function showKCBDashboard() {

    if (typeof showScreen === "function")
        showScreen("kcbDashboard");

    loadFinancialProfile();
}

/* ==========================
   GLOBAL EXPORTS
========================== */

window.hideFinancialTabs = hideFinancialTabs;
window.showFinancialTab = showFinancialTab;
window.finishTransaction = finishTransaction;
window.openStatement = openStatement;
window.openLoans = openLoans;
window.updateLoanDashboard = updateLoanDashboard;
window.showEquityDashboard = showEquityDashboard;
window.loadFinancialProfile = loadFinancialProfile;
window.updateFinancialDashboard = updateFinancialDashboard;
window.showKCBDashboard = showKCBDashboard;

console.log("✅ Financial functions exported");