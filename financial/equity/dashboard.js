/* ==========================================
   EQUITY MOBILE BANKING
   DASHBOARD
========================================== */

"use strict";

/* ==========================
   ACCOUNT DETAILS
========================== */

let equityAccount = {

    holder: "Joshua Nkario",

    accountNumber: "0123456789",

    accountType: "Savings Account",

    branch: "Nakuru Branch",

    balance: 75000.00,

    currency: "KES"

};

/* ==========================
   LOAD DASHBOARD
========================== */

function loadEquityDashboard() {

    updateEquityBalance();

    updateEquityAccount();

    loadEquityRecentTransactions();

}

/* ==========================
   UPDATE BALANCE
========================== */

function updateEquityBalance() {

    const balance =
        document.getElementById("equityBalance");

    if (!balance) return;

    balance.textContent =
        formatMoney(equityAccount.balance);

}

/* ==========================
   UPDATE ACCOUNT
========================== */

function updateEquityAccount() {

    const holder =
        document.getElementById("equityHolder");

    const account =
        document.getElementById("equityAccountNumber");

    if (holder)
        holder.textContent =
            equityAccount.holder;

    if (account)
        account.textContent =
            "Account No. " +
            equityAccount.accountNumber;

}

/* ==========================
   RECENT TRANSACTIONS
========================== */

function loadEquityRecentTransactions() {

    const container =
        document.getElementById("equityRecentTransactions");

    if (!container) return;

    const transactions =
        getBankStatements("EQUITY");

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

                📄

            </div>

            <h3>No Recent Transactions</h3>

            <p>Your latest Equity transactions will appear here.</p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    transactions
        .slice(0, 5)
        .forEach(item => {

            container.innerHTML += `

            <div class="transaction-card">

                <div>

                    <strong>${item.service}</strong>

                    <small>${item.date}</small>

                </div>

                <div>

                    ${formatMoney(item.amount)}

                </div>

            </div>

            `;

        });

}
/* ==========================================
   OPEN EQUITY DASHBOARD
========================================== */

function showEquityDashboard() {

    showScreen("equityDashboard");

    loadUserEquityProfile();

}

/* ==========================================
   LOAD USER PROFILE
========================================== */

async function loadUserEquityProfile() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/financial/profile", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (!data.success) {

            console.error(data.message);

            return;

        }

        equityAccount.balance =
            data.profile.banks.equity.balance;

        equityAccount.accountNumber =
            data.profile.banks.equity.accountNumber;

        updateEquityBalance();

        updateEquityAccount();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   ACCOUNT SUMMARY
========================================== */

function showEquitySummary() {

    alert(

        "EQUITY ACCOUNT\n\n" +

        "Holder: " + equityAccount.holder +

        "\nAccount: " + equityAccount.accountNumber +

        "\nType: " + equityAccount.accountType +

        "\nBalance: " + formatMoney(equityAccount.balance)

    );

}

/* ==========================================
   REFRESH DASHBOARD
========================================== */

function refreshEquityDashboard() {

    loadUserEquityProfile();

    loadEquityRecentTransactions();

    addBankNotification(

        "Dashboard Updated",

        "Your Equity account has been refreshed."

    );

}

/* ==========================================
   QUICK BALANCE
========================================== */

function quickEquityBalance() {

    alert(

        "Available Balance\n\n" +

        formatMoney(equityAccount.balance)

    );

}

/* ==========================================
   EXPORT FUNCTIONS
========================================== */

window.showEquityDashboard = showEquityDashboard;
window.loadUserEquityProfile = loadUserEquityProfile;
window.refreshEquityDashboard = refreshEquityDashboard;
window.quickEquityBalance = quickEquityBalance;
window.showEquitySummary = showEquitySummary;