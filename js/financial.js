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
   MONEY FORMATTER
========================================== */

function formatFinancialMoney(amount) {

    const value = Number(amount || 0);

    return "KSh " + value.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* ==========================================
   TRANSACTIONS
========================================== */

function finishTransaction() {

    loadFinancialProfile();

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


/* ==========================================
   STATEMENT
========================================== */

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

    loadFinancialProfile();

    if (typeof showScreen === "function") {
        showScreen("kcbLoans");
    }

}


function updateLoanDashboard(profile) {

    /*
       If a real MongoDB financial profile was supplied,
       use it.
    */

    if (profile && profile.loans) {

        const limit =
            document.getElementById("loanLimit");

        const status =
            document.getElementById("loanStatus");

        const outstanding =
            document.getElementById("loanOutstanding");


        if (limit) {

            limit.textContent =
                formatFinancialMoney(profile.loans.limit);

        }


        if (outstanding) {

            outstanding.textContent =
                "Outstanding Loan: " +
                formatFinancialMoney(
                    profile.loans.outstanding
                );

        }


        if (status) {

            if (Number(profile.loans.outstanding || 0) > 0) {

                status.textContent =
                    "Active Loan";

            } else {

                status.textContent =
                    "No Active Loan";

            }

        }

        return;

    }


    /*
       Backward compatibility with the existing
       local KCB loan engine.
    */

    if (typeof kcbLoan === "undefined") {

        return;

    }


    const limit =
        document.getElementById("loanLimit");

    const status =
        document.getElementById("loanStatus");

    const outstanding =
        document.getElementById("loanOutstanding");


    if (limit) {

        limit.textContent =
            formatFinancialMoney(kcbLoan.limit);

    }


    if (!status || !outstanding) {

        return;

    }


    if (kcbLoan.active) {

        status.textContent =
            "Active Loan";

        outstanding.textContent =
            "Outstanding Loan: " +
            formatFinancialMoney(kcbLoan.amount);

    } else {

        status.textContent =
            "No Active Loan";

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

    loadFinancialProfile();

    if (typeof showScreen === "function") {

        showScreen("equityDashboard");

    }

}


/* ==========================================
   LOAD FINANCIAL PROFILE
========================================== */

async function loadFinancialProfile() {

    try {

        const token = getToken();

        /*
           Do not call the financial API when the
           user is not authenticated.
        */

        if (!token) {

            console.warn(
                "Financial profile: no authentication token."
            );

            return null;

        }


        console.log(
            "Loading financial profile..."
        );


        const data =
            await apiGet("/financial/profile");


        if (!data || !data.success) {

            console.error(
                "Financial Profile:",
                data?.message || "Unknown error"
            );

            return null;

        }


        console.log(
            "Financial Profile Loaded:",
            data.profile
        );


        updateFinancialDashboard(
            data.profile
        );


        return data.profile;

    }

    catch (err) {

        console.error(
            "Financial Profile Error:",
            err
        );

        return null;

    }

}

/* ==========================================
   UPDATE FINANCIAL DASHBOARD
========================================== */

function updateFinancialDashboard(profile) {

    if (!profile) {

        console.warn(
            "No financial profile supplied."
        );

        return;
    }


    /* ======================================
       KCB
    ====================================== */

    if (profile.banks?.kcb) {

        const kcb = profile.banks.kcb;


        /* ----------------------------------
           MAIN BALANCE
        ---------------------------------- */

        const kcbBalance =
            document.getElementById(
                "kcbDashboardBalance"
            );

        if (kcbBalance) {

            kcbBalance.textContent =
                formatFinancialMoney(
                    kcb.balance || 0
                );
        }


        /* ----------------------------------
           ACCOUNT NUMBER
        ---------------------------------- */

        const kcbAccountNumber =
            document.getElementById(
                "kcbAccountNumber"
            );

        if (kcbAccountNumber) {

            kcbAccountNumber.textContent =
                kcb.accountNumber ||
                "Account number unavailable";
        }


        /* ----------------------------------
           ACCOUNT TYPE
        ---------------------------------- */

        const kcbAccountType =
            document.getElementById(
                "kcbAccountType"
            );

        if (kcbAccountType) {

            kcbAccountType.textContent =
                kcb.accountType ||
                "Account";
        }


        /* ----------------------------------
           CUSTOMER NAME
        ---------------------------------- */

        const kcbHolder =
            document.getElementById(
                "kcbHolder"
            );

        if (kcbHolder) {

            const customerName =
                profile.name ||
                profile.fullName ||
                profile.username ||
                profile.user?.name ||
                "Customer";

            kcbHolder.textContent =
                customerName;
        }


        /* ----------------------------------
           CUSTOMER TYPE
        ---------------------------------- */

        const kcbCustomerType =
            document.getElementById(
                "kcbCustomerType"
            );

        if (kcbCustomerType) {

            kcbCustomerType.textContent =
                kcb.customerType ||
                "KCB Customer";
        }


        /* ----------------------------------
           CUSTOMER AVATAR
        ---------------------------------- */

        const kcbCustomerAvatar =
            document.getElementById(
                "kcbCustomerAvatar"
            );

        if (kcbCustomerAvatar) {

            const name =
                profile.name ||
                profile.fullName ||
                profile.username ||
                "K";

            kcbCustomerAvatar.textContent =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase();
        }


        /* ----------------------------------
           SAVINGS
        ---------------------------------- */

        const kcbSavingsBalance =
            document.getElementById(
                "kcbSavingsBalance"
            );

        if (kcbSavingsBalance) {

            kcbSavingsBalance.textContent =
                formatFinancialMoney(
                    kcb.savingsBalance ||
                    kcb.savings ||
                    0
                );
        }


        /* ----------------------------------
           CURRENT ACCOUNT
        ---------------------------------- */

        const kcbCurrentBalance =
            document.getElementById(
                "kcbCurrentBalance"
            );

        if (kcbCurrentBalance) {

            kcbCurrentBalance.textContent =
                formatFinancialMoney(
                    kcb.currentBalance ||
                    kcb.current ||
                    kcb.balance ||
                    0
                );
        }


        /* ----------------------------------
           LOAN BALANCE
        ---------------------------------- */

        const kcbLoanBalance =
            document.getElementById(
                "kcbLoanBalance"
            );

        if (kcbLoanBalance) {

            kcbLoanBalance.textContent =
                formatFinancialMoney(
                    profile.loans?.outstanding ||
                    kcb.loanBalance ||
                    0
                );
        }


        /* ----------------------------------
           CREDIT CARD
        ---------------------------------- */

        const kcbCreditCardBalance =
            document.getElementById(
                "kcbCreditCardBalance"
            );

        if (kcbCreditCardBalance) {

            kcbCreditCardBalance.textContent =
                formatFinancialMoney(
                    kcb.creditCardBalance ||
                    kcb.creditCard ||
                    0
                );
        }

    }


    /* ======================================
       EQUITY
    ====================================== */

    if (profile.banks?.equity) {

        const equity =
            profile.banks.equity;


        const equityBalance =
            document.getElementById(
                "equityBalance"
            );

        if (equityBalance) {

            equityBalance.textContent =
                formatFinancialMoney(
                    equity.balance || 0
                );
        }


        const equityAccountNumber =
            document.getElementById(
                "equityAccountNumber"
            );

        if (equityAccountNumber) {

            equityAccountNumber.textContent =
                equity.accountNumber ||
                "Account number unavailable";
        }

    }


    /* ======================================
       CO-OPERATIVE BANK
    ====================================== */

    if (profile.banks?.coop) {

        const coop =
            profile.banks.coop;


        const coopBalance =
            document.getElementById(
                "coopBalance"
            );

        if (coopBalance) {

            coopBalance.textContent =
                formatFinancialMoney(
                    coop.balance || 0
                );
        }


        const coopAccountNumber =
            document.getElementById(
                "coopAccountNumber"
            );

        if (coopAccountNumber) {

            coopAccountNumber.textContent =
                coop.accountNumber ||
                "Account number unavailable";
        }

    }


    /* ======================================
       WALLET
    ====================================== */

    if (profile.wallet) {

        const walletBalance =
            document.getElementById(
                "walletBalance"
            );

        if (walletBalance) {

            walletBalance.textContent =
                formatFinancialMoney(
                    profile.wallet.balance || 0
                );
        }

    }


    /* ======================================
       LOANS
    ====================================== */

    if (profile.loans) {

        updateLoanDashboard(profile);


        const coopLoanLimit =
            document.getElementById(
                "coopLoanLimit"
            );

        if (coopLoanLimit) {

            coopLoanLimit.textContent =
                formatFinancialMoney(
                    profile.loans.limit || 0
                );
        }


        const coopLoanStatus =
            document.getElementById(
                "coopLoanStatus"
            );

        if (coopLoanStatus) {

            const outstanding =
                Number(
                    profile.loans.outstanding || 0
                );


            if (outstanding > 0) {

                coopLoanStatus.textContent =
                    "Active Loan • Outstanding " +
                    formatFinancialMoney(
                        outstanding
                    );

            } else {

                coopLoanStatus.textContent =
                    "No Active Loan";

            }

        }

    }


    /* ======================================
       SAVINGS
    ====================================== */

    if (profile.savings) {

        const savingsBalance =
            document.getElementById(
                "savingsBalance"
            );

        if (savingsBalance) {

            savingsBalance.textContent =
                formatFinancialMoney(
                    profile.savings.balance || 0
                );
        }

    }


    /* ======================================
       AIRTIME
    ====================================== */

    if (profile.airtime) {

        const safaricomAirtime =
            document.getElementById(
                "safaricomAirtime"
            );

        if (safaricomAirtime) {

            safaricomAirtime.textContent =
                formatFinancialMoney(
                    profile.airtime.safaricom || 0
                );
        }


        const airtelAirtime =
            document.getElementById(
                "airtelAirtime"
            );

        if (airtelAirtime) {

            airtelAirtime.textContent =
                formatFinancialMoney(
                    profile.airtime.airtel || 0
                );
        }


        const telkomAirtime =
            document.getElementById(
                "telkomAirtime"
            );

        if (telkomAirtime) {

            telkomAirtime.textContent =
                formatFinancialMoney(
                    profile.airtime.telkom || 0
                );
        }

    }


    /* ======================================
       BUNDLES
    ====================================== */

    if (profile.bundles) {

        const dataBalance =
            document.getElementById(
                "financialDataBalance"
            );

        if (dataBalance) {

            dataBalance.textContent =
                Number(
                    profile.bundles.data || 0
                ) + " MB";
        }


        const voiceBalance =
            document.getElementById(
                "financialVoiceBalance"
            );

        if (voiceBalance) {

            voiceBalance.textContent =
                Number(
                    profile.bundles.voice || 0
                ) + " Min";
        }


        const smsBalance =
            document.getElementById(
                "financialSMSBalance"
            );

        if (smsBalance) {

            smsBalance.textContent =
                Number(
                    profile.bundles.sms || 0
                ) + " SMS";
        }

    }


    /* ======================================
       FINAL STATUS
    ====================================== */

    console.log(
        "✅ Financial dashboard updated:",
        profile
    );

}


/* ==========================================
   KCB DASHBOARD
========================================== */

async function showKCBDashboard() {

    if (typeof showScreen === "function") {

        showScreen("kcbDashboard");

    }

    await loadFinancialProfile();

}


/* ==========================================
   INITIAL FINANCIAL LOAD
========================================== */

async function initializeFinancialData() {

    console.log(
        "Initializing financial data..."
    );

    await loadFinancialProfile();

}


/* ==========================================
   AUTO LOAD AFTER LOGIN / APP START
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
           Give auth.js a moment to restore
           the saved login token.
        */

        setTimeout(
            initializeFinancialData,
            300
        );

    }
);


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

window.initializeFinancialData =
    initializeFinancialData;

window.formatFinancialMoney =
    formatFinancialMoney;


console.log(
    "✅ Financial functions exported"
);