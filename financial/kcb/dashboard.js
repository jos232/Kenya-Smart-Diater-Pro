/* ==========================================
   KCB MOBILE BANKING
   DASHBOARD
========================================== */

"use strict";

/* ==========================
   ACCOUNT DETAILS
========================== */

let kcbAccount = {

    holder: "Joshua Nkario",

    accountNumber: "1234567890",

    accountType: "Current Account",

    branch: "Nakuru Branch",

    balance: 50000.00,

    currency: "KES"

};

/* ==========================
   LOAD DASHBOARD
========================== */

function loadKCBDashboard() {

    updateKCBBalance();

    updateKCBAccount();

    loadKCBRecentTransactions();

}
/* ==========================
   UPDATE KCB BALANCE
========================== */

function updateKCBBalance() {

    const balance =
        document.getElementById("kcbBalance");

    if (!balance) return;

    balance.textContent =
        formatMoney(kcbAccount.balance);

}

/* ==========================
   ACCOUNT DETAILS
========================== */

function updateKCBAccount() {

    const accountNumber = document.getElementById("kcbAccountNumber");

    const accountType = document.getElementById("kcbAccountType");

    const holder = document.getElementById("kcbHolder");

    if (accountNumber)

        accountNumber.textContent =

            kcbAccount.accountNumber;

    if (accountType)

        accountType.textContent =

            kcbAccount.accountType;

    if (holder)

        holder.textContent =

            kcbAccount.holder;

}
/* ==========================
   LOAD RECENT TRANSACTIONS
========================== */

function loadKCBRecentTransactions() {

    const container =
        document.getElementById("kcbRecentTransactions");

    if (!container) return;

    const transactions =
        getBankStatements("KCB");

    // No Transactions
    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

                📄

            </div>

            <h3>No Recent Transactions</h3>

            <p>

                Your latest banking transactions will appear here automatically.

            </p>

        </div>

        `;

        return;

    }

    // Clear old transactions
    container.innerHTML = "";

    // Display latest 5 transactions
    transactions.slice(0, 5).forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-info">

                <strong>${item.service}</strong>

                <small>${item.date}</small>

            </div>

            <div class="transaction-amount">

                ${formatMoney(item.amount)}

            </div>

        </div>

        `;

    });

}
/* ==========================================
   EXPORTS
========================================== */

window.kcbAccount = kcbAccount;

window.loadKCBDashboard = loadKCBDashboard;

window.updateKCBBalance = updateKCBBalance;

window.updateKCBAccount = updateKCBAccount;

window.loadKCBRecentTransactions = loadKCBRecentTransactions;

