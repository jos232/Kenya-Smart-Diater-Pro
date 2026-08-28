/* ==========================================
   CO-OPERATIVE BANK
   DASHBOARD
========================================== */

"use strict";

/* ==========================
   ACCOUNT DETAILS
========================== */

let coopAccount = {

    holder: "",

    accountNumber: "",

    accountType: "Current Account",

    branch: "",

    balance: 0,

    currency: "KES"

};

/* ==========================
   LOAD DASHBOARD
========================== */

async function loadCoopDashboard() {

    try {

        const data =
            await apiGet("/financial/profile");

        if (!data.success) {

            console.error(
                "Co-op Profile:",
                data.message
            );

            return;

        }

        const profile =
            data.profile;

        /* ==========================
           USER NAME
        ========================== */

        if (profile.user) {

            if (typeof profile.user === "object") {

                coopAccount.holder =
                    profile.user.name ||
                    profile.user.fullName ||
                    profile.user.username ||
                    "Customer";

            }

        }

        /* ==========================
           CO-OP ACCOUNT
        ========================== */

        if (
            profile.banks &&
            profile.banks.coop
        ) {

            const coop =
                profile.banks.coop;

            coopAccount.accountNumber =
                coop.accountNumber || "";

            coopAccount.balance =
                Number(coop.balance || 0);

        }

        /* ==========================
           UPDATE UI
        ========================== */

        updateCoopBalance();

        updateCoopAccount();

        loadCoopRecentTransactions();

    }

    catch (error) {

        console.error(
            "Co-op Profile Error:",
            error
        );

        updateCoopBalance();

        updateCoopAccount();

        loadCoopRecentTransactions();

    }

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
        document.getElementById(
            "coopRecentTransactions"
        );

    if (!container) return;


    const transactions =
        getBankStatements("CO-OP");


    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

                💳

            </div>

            <h3>No Recent Transactions</h3>

            <p>

                Your latest banking transactions
                will appear here automatically.

            </p>

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

            <div class="transaction-info">

                <strong>
                    ${item.service}
                </strong>

                <small>
                    ${item.date}
                </small>

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

window.coopAccount =
    coopAccount;

window.loadCoopDashboard =
    loadCoopDashboard;

window.updateCoopBalance =
    updateCoopBalance;

window.updateCoopAccount =
    updateCoopAccount;

window.loadCoopRecentTransactions =
    loadCoopRecentTransactions;