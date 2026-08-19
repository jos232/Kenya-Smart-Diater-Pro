"use strict";

console.log("✅ financial.js loaded");


/* ==========================================
   NAVIGATION
========================================== */

function hideFinancialTabs() {

    document
        .querySelectorAll("#financial .financial-content")
        .forEach(screen => {

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


/* ==========================================
   TRANSACTIONS
========================================== */

function finishTransaction() {

    if (typeof updateKCBBalance === "function") {
        updateKCBBalance();
    }

    if (typeof updateKCBAccount === "function") {
        updateKCBAccount();
    }

    if (typeof loadKCBRecentTransactions === "function") {
        loadKCBRecentTransactions();
    }

    if (typeof showScreen === "function") {
        showScreen("kcbDashboard");
    }

}


function openStatement() {

    if (typeof loadStatement === "function") {
        loadStatement("KCB");
    }

    if (typeof showScreen === "function") {
        showScreen("kcbStatement");
    }

}


/* ==========================================
   LOANS
========================================== */

function openLoans() {

    if (typeof updateLoanDashboard === "function") {
        updateLoanDashboard();
    }

    if (typeof showScreen === "function") {
        showScreen("kcbLoans");
    }

}


function updateLoanDashboard() {

    if (typeof kcbLoan === "undefined") {
        return;
    }

    const limit = document.getElementById("loanLimit");
    const status = document.getElementById("loanStatus");
    const outstanding = document.getElementById("loanOutstanding");

    if (limit) {
        limit.textContent = formatMoney(kcbLoan.limit);
    }

    if (!status || !outstanding) {
        return;
    }

    if (kcbLoan.active) {

        status.textContent = "Active Loan";

        outstanding.textContent =
            "Outstanding Loan: " +
            formatMoney(kcbLoan.amount);

    } else {

        status.textContent = "No Active Loan";

        outstanding.textContent =
            "Outstanding Loan: KSh 0.00";

    }

}


/* ==========================================
   EQUITY
========================================== */

function showEquityDashboard() {

    if (typeof loadEquityDashboard === "function") {
        loadEquityDashboard();
    }

    if (typeof showScreen === "function") {
        showScreen("equityDashboard");
    }

}


/* ==========================================
   LOAD FINANCIAL PROFILE
========================================== */

async function loadFinancialProfile() {

    try {

        const data = await apiGet("/financial/profile");

        if (!data.success) {

            console.error(
                "Financial Profile:",
                data.message
            );

            return;

        }

        updateFinancialDashboard(data.profile);

    }

    catch (err) {

        console.error(
            "Financial Profile Error:",
            err
        );

    }

}


/* ==========================================
   UPDATE FINANCIAL DASHBOARD
========================================== */

function updateFinancialDashboard(profile) {

    if (!profile || !profile.banks) {
        return;
    }


    /* ==========================
       KCB
    ========================== */

    const kcbBalance =
        document.getElementById("kcbBalance");

    if (
        kcbBalance &&
        profile.banks.kcb
    ) {

        kcbBalance.textContent =
            "KSh " +
            profile.banks.kcb.balance.toLocaleString();

    }


    const accountNumber =
        document.getElementById("kcbAccountNumber");

    if (
        accountNumber &&
        profile.banks.kcb
    ) {

        accountNumber.textContent =
            profile.banks.kcb.accountNumber;

    }


    /* ==========================
       EQUITY
    ========================== */

    const equityBalance =
        document.getElementById("equityBalance");

    if (
        equityBalance &&
        profile.banks.equity
    ) {

        equityBalance.textContent =
            "KSh " +
            profile.banks.equity.balance.toLocaleString();

    }


    /* ==========================
       CO-OP
    ========================== */

    const coopBalance =
        document.getElementById("coopBalance");

    if (
        coopBalance &&
        profile.banks.coop
    ) {

        coopBalance.textContent =
            "KSh " +
            profile.banks.coop.balance.toLocaleString();

    }


    /* ==========================
       WALLET
    ========================== */

    const walletBalance =
        document.getElementById("walletBalance");

    if (
        walletBalance &&
        profile.wallet
    ) {

        walletBalance.textContent =
            "KSh " +
            profile.wallet.balance.toLocaleString();

    }

}


/* ==========================================
   KCB DASHBOARD
========================================== */

function showKCBDashboard() {

    if (typeof showScreen === "function") {
        showScreen("kcbDashboard");
    }

    loadFinancialProfile();

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.hideFinancialTabs =
    hideFinancialTabs;

window.showFinancialTab =
    showFinancialTab;

window.finishTransaction =
    finishTransaction;

window.openStatement =
    openStatement;

window.openLoans =
    openLoans;

window.updateLoanDashboard =
    updateLoanDashboard;

window.showEquityDashboard =
    showEquityDashboard;

window.loadFinancialProfile =
    loadFinancialProfile;

window.updateFinancialDashboard =
    updateFinancialDashboard;

window.showKCBDashboard =
    showKCBDashboard;


console.log("✅ Financial functions exported");