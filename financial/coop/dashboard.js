/* ==========================================
   CO-OPERATIVE BANK
   DASHBOARD
========================================== */

"use strict";

/* ==========================
   ACCOUNT DETAILS
========================== */

let coopAccount = {

    holder: "Joshua Nkario",

    accountNumber: "011234567890",

    accountType: "Current Account",

    branch: "Nakuru Branch",

    balance: 50000.00,

    currency: "KES"

};

/* ==========================
   LOAD DASHBOARD
========================== */

function loadCoopDashboard() {

    updateCoopBalance();

    updateCoopAccount();

    loadCoopRecentTransactions();

}

/* ==========================
   UPDATE BALANCE
========================== */

function updateCoopBalance() {

    const balance =
        document.getElementById("coopBalance");

    if (!balance) return;

    balance.textContent =
        formatMoney(coopAccount.balance);

}

/* ==========================
   ACCOUNT DETAILS
========================== */

function updateCoopAccount() {

    const number =
        document.getElementById("coopAccountNumber");

    const type =
        document.getElementById("coopAccountType");

    const holder =
        document.getElementById("coopHolder");

    if (number)
        number.textContent =
            coopAccount.accountNumber;

    if (type)
        type.textContent =
            coopAccount.accountType;

    if (holder)
        holder.textContent =
            coopAccount.holder;

}

/* ==========================
   RECENT TRANSACTIONS
========================== */

function loadCoopRecentTransactions() {

    const container =
        document.getElementById("coopRecentTransactions");

    if (!container) return;

    const transactions =
        getBankStatements("CO-OP");

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

    container.innerHTML = "";

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

window.coopAccount = coopAccount;

window.loadCoopDashboard = loadCoopDashboard;
window.updateCoopBalance = updateCoopBalance;
window.updateCoopAccount = updateCoopAccount;
window.loadCoopRecentTransactions = loadCoopRecentTransactions;