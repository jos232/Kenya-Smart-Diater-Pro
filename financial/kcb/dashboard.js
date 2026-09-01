/* ==========================================
   KCB MOBILE BANKING
   DASHBOARD
========================================== */

"use strict";

/* ==========================
   ACCOUNT DETAILS
========================== */

let kcbAccount = {

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

    const accountNumber =
        document.getElementById("kcbAccountNumber");

    const accountType =
        document.getElementById("kcbAccountType");

    const holder =
        document.getElementById("kcbHolder");

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
   LOAD USER KCB PROFILE
========================== */

async function loadUserKCBProfile() {

    try {

        const data =
            await apiGet("/financial/profile");

        if (!data.success) {

            console.error(
                "KCB Profile:",
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

                kcbAccount.holder =
                    profile.user.name ||
                    profile.user.fullName ||
                    profile.user.username ||
                    "Customer";

            }

        }

        /* ==========================
           KCB ACCOUNT
        ========================== */

        if (
            profile.banks &&
            profile.banks.kcb
        ) {

            const kcb =
                profile.banks.kcb;

            kcbAccount.accountNumber =
                kcb.accountNumber || "";

            kcbAccount.balance =
                Number(kcb.balance || 0);

        }

        /* ==========================
           UPDATE UI
        ========================== */

        updateKCBBalance();

        updateKCBAccount();

    }

    catch (error) {

        console.error(
            "KCB Profile Error:",
            error
        );

    }

}


/* ==========================
   OPEN KCB DASHBOARD
========================== */

function showKCBDashboard() {

    showScreen("kcbDashboard");

    loadUserKCBProfile();

}


/* ==========================
   LOAD RECENT TRANSACTIONS
========================== */

function loadKCBRecentTransactions() {

    const container =
        document.getElementById(
            "kcbRecentTransactions"
        );

    if (!container) return;

    const transactions =
        getBankStatements("KCB");

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

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


/* ==========================
   REFRESH KCB DASHBOARD
========================== */

function refreshKCBDashboard() {

    loadUserKCBProfile();

    loadKCBRecentTransactions();

}


/* ==========================================
   EXPORTS
========================================== */

window.kcbAccount =
    kcbAccount;

window.loadKCBDashboard =
    loadKCBDashboard;

window.updateKCBBalance =
    updateKCBBalance;

window.updateKCBAccount =
    updateKCBAccount;

window.loadKCBRecentTransactions =
    loadKCBRecentTransactions;

window.loadUserKCBProfile =
    loadUserKCBProfile;

window.showKCBDashboard =
    showKCBDashboard;

window.refreshKCBDashboard =
    refreshKCBDashboard;