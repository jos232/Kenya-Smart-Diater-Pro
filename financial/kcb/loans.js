/* ==========================================
   KCB MOBILE BANKING
   LOANS MODULE
========================================== */

"use strict";

/* ==========================================
   API
========================================== */

const LOAN_API = "/loans";

/* ==========================================
   LOAN STATE
========================================== */

let kcbLoan = {

    id: null,

    // Loaded from the user's FinancialProfile
    limit: 0,

    active: false,

    amount: 0,

    repayment: 0,

    months: 0,

    balance: 0,

    interest: 0,

    totalRepayment: 0,

    status: "NONE"

};

let loanHistory = [];


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeLoans
);


/* ==========================================
   INITIALIZE LOANS
========================================== */

async function initializeLoans() {

    try {

        /*
         * First load the real financial profile.
         * This supplies the customer's actual
         * approved loan limit.
         */

        if (typeof loadFinancialProfile === "function") {

            const profile =
                await loadFinancialProfile();

            if (profile && profile.loans) {

                kcbLoan.limit =
                    Number(profile.loans.limit || 0);

            }

        }

        /*
         * Then load actual loan history.
         */

        await loadLoanHistory();

        updateLoanDashboard();

    }

    catch (error) {

        console.error(
            "KCB Loan Initialization Error:",
            error
        );

    }

}


/* ==========================================
   LOAD LOAN HISTORY
========================================== */

async function loadLoanHistory() {

    try {

        const response =
            await apiGet(LOAN_API);

        loanHistory =
            response.loans || [];

        /*
         * Find currently active loan.
         */

        const activeLoan =
            loanHistory.find(
                loan => loan.status === "ACTIVE"
            );

        if (activeLoan) {

            kcbLoan.id =
                activeLoan._id;

            kcbLoan.active =
                true;

            kcbLoan.amount =
                Number(activeLoan.amount || 0);

            kcbLoan.balance =
                Number(activeLoan.balance || 0);

            kcbLoan.months =
                Number(activeLoan.duration || 0);

            kcbLoan.repayment =
                Number(
                    activeLoan.monthlyPayment || 0
                );

            kcbLoan.totalRepayment =
                Number(
                    activeLoan.totalRepayment || 0
                );

            kcbLoan.interest =
                kcbLoan.totalRepayment -
                kcbLoan.amount;

            kcbLoan.status =
                activeLoan.status;

        }

        else {

            kcbLoan.id = null;

            kcbLoan.active = false;

            kcbLoan.amount = 0;

            kcbLoan.balance = 0;

            kcbLoan.months = 0;

            kcbLoan.repayment = 0;

            kcbLoan.interest = 0;

            kcbLoan.totalRepayment = 0;

            kcbLoan.status = "NONE";

        }

        renderLoanHistory();

        updateLoanDashboard();

    }

    catch (error) {

        console.error(
            "KCB Loan History Error:",
            error
        );

    }

}


/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateLoanDashboard() {

    const outstanding =
        document.getElementById(
            "loanOutstanding"
        );

    const status =
        document.getElementById(
            "loanStatus"
        );

    const limit =
        document.getElementById(
            "loanLimit"
        );


    /*
     * REAL LOAN LIMIT
     */

    if (limit) {

        limit.textContent =
            formatMoney(
                kcbLoan.limit
            );

    }


    /*
     * REAL OUTSTANDING BALANCE
     */

    if (outstanding) {

        outstanding.textContent =
            formatMoney(
                kcbLoan.balance
            );

    }


    /*
     * LOAN STATUS
     */

    if (status) {

        status.textContent =
            kcbLoan.active
                ? "ACTIVE"
                : "NO ACTIVE LOAN";

    }

}


/* ==========================================
   LOAN CALCULATOR
========================================== */

async function calculateLoan() {

    const amount =
        Number(
            document.getElementById(
                "loanAmount"
            ).value
        );

    const months =
        Number(
            document.getElementById(
                "loanMonths"
            ).value
        );


    if (!amount || !months) {

        return;

    }


    /*
     * Never allow calculation above
     * the customer's actual limit.
     */

    if (amount > kcbLoan.limit) {

        alert(
            "Requested amount exceeds your available loan limit."
        );

        return;

    }


    try {

        const result =
            await apiPost(
                LOAN_API + "/calculate",
                {
                    amount,
                    duration: months
                }
            );


        const interestElement =
            document.getElementById(
                "loanInterest"
            );

        const monthlyElement =
            document.getElementById(
                "loanMonthly"
            );

        const totalElement =
            document.getElementById(
                "loanTotal"
            );


        if (interestElement) {

            interestElement.textContent =
                formatMoney(
                    result.interest
                );

        }


        if (monthlyElement) {

            monthlyElement.textContent =
                formatMoney(
                    result.monthlyPayment
                );

        }


        if (totalElement) {

            totalElement.textContent =
                formatMoney(
                    result.totalRepayment
                );

        }

    }

    catch (error) {

        console.error(
            "Loan Calculation Error:",
            error
        );

    }

}


/* ==========================================
   APPLY LOAN
========================================== */

async function applyLoan() {

    const amount =
        Number(
            document.getElementById(
                "loanAmount"
            ).value
        );

    const months =
        Number(
            document.getElementById(
                "loanMonths"
            ).value
        );

    const pin =
        document.getElementById(
            "loanPIN"
        ).value;


    const purposeField =
        document.getElementById(
            "loanPurpose"
        );


    const purpose =
        purposeField
            ? purposeField.value
            : "Personal Loan";


    /* ======================================
       VALIDATION
    ====================================== */

    if (amount <= 0) {

        alert(
            "Enter a valid loan amount."
        );

        return;

    }


    if (amount > kcbLoan.limit) {

        alert(
            "Requested amount exceeds your available loan limit."
        );

        return;

    }


    if (kcbLoan.active) {

        alert(
            "You already have an active loan."
        );

        return;

    }


    const verify =
        verifyPIN(pin);


    if (!verify.success) {

        alert(
            verify.message
        );

        return;

    }


    /* ======================================
       APPLY THROUGH SERVER
    ====================================== */

    try {

        const response =
            await apiPost(
                LOAN_API + "/apply",
                {
                    loanType: "Personal",
                    amount,
                    duration: months,
                    purpose
                }
            );


        const loan =
            response.loan;


        /* ==================================
           SAVE ACTIVE LOAN
        ================================== */

        kcbLoan.id =
            loan._id;

        kcbLoan.active =
            true;

        kcbLoan.amount =
            Number(loan.amount || 0);

        kcbLoan.balance =
            Number(loan.balance || 0);

        kcbLoan.months =
            Number(loan.duration || 0);

        kcbLoan.repayment =
            Number(
                loan.monthlyPayment || 0
            );

        kcbLoan.totalRepayment =
            Number(
                loan.totalRepayment || 0
            );

        kcbLoan.interest =
            kcbLoan.totalRepayment -
            kcbLoan.amount;

        kcbLoan.status =
            loan.status;


        /* ==================================
           CREDIT LOCAL ACCOUNT DISPLAY
        ================================== */

        kcbAccount.balance += amount;

        updateKCBBalance();

        updateLoanDashboard();


        /* ==================================
           TRANSACTION
        ================================== */

        const transaction =
            createTransaction({

                bank: "KCB",

                service: "LOAN",

                sender: "KCB",

                recipient:
                    kcbAccount.accountNumber,

                amount,

                fee:
                    kcbLoan.interest,

                total:
                    kcbLoan.totalRepayment,

                balance:
                    kcbAccount.balance

            });


        saveBankTransaction(
            transaction
        );

        addStatement(
            transaction
        );

        generateReceipt(
            transaction
        );


        /* ==================================
           NOTIFICATION
        ================================== */

        addBankNotification(

            "Loan Approved",

            `${formatMoney(amount)} has been credited to your account.`

        );


        loadKCBRecentTransactions();


        /* ==================================
           RESET FORM
        ================================== */

        resetLoanForm();


        /* ==================================
           REFRESH DATA FROM SERVER
        ================================== */

        await loadLoanHistory();


        showScreen(
            "kcbReceipt"
        );

    }

    catch (error) {

        console.error(
            "KCB Loan Application Error:",
            error
        );

        alert(
            error.message ||
            "Loan application failed."
        );

    }

}


/* ==========================================
   REPAY LOAN
========================================== */

async function repayLoan() {

    if (!kcbLoan.active) {

        alert(
            "You do not have an active loan."
        );

        return;

    }


    const amount =
        Number(
            document.getElementById(
                "loanRepaymentAmount"
            ).value
        );


    const pin =
        document.getElementById(
            "loanRepaymentPIN"
        ).value;


    if (amount <= 0) {

        alert(
            "Enter a valid repayment amount."
        );

        return;

    }


    const verify =
        verifyPIN(pin);


    if (!verify.success) {

        alert(
            verify.message
        );

        return;

    }


    if (amount > kcbAccount.balance) {

        alert(
            "Insufficient account balance."
        );

        return;

    }


    try {

        await apiPut(

            LOAN_API +
            "/repay/" +
            kcbLoan.id,

            {
                amount
            }

        );


        /* ==================================
           UPDATE LOCAL DATA
        ================================== */

        kcbAccount.balance -=
            amount;

        kcbLoan.balance -=
            amount;


        if (kcbLoan.balance <= 0) {

            kcbLoan.balance = 0;

            kcbLoan.active = false;

            kcbLoan.status =
                "COMPLETED";

        }


        updateKCBBalance();

        updateLoanDashboard();


        /* ==================================
           TRANSACTION
        ================================== */

        const transaction =
            createTransaction({

                bank: "KCB",

                service:
                    "LOAN REPAYMENT",

                sender:
                    kcbAccount.accountNumber,

                recipient:
                    "KCB Loan",

                amount,

                fee: 0,

                total: amount,

                balance:
                    kcbAccount.balance

            });


        saveBankTransaction(
            transaction
        );

        addStatement(
            transaction
        );

        generateReceipt(
            transaction
        );


        addBankNotification(

            "Loan Repayment",

            `${formatMoney(amount)} loan repayment received.`

        );


        loadKCBRecentTransactions();


        resetRepaymentForm();


        await loadLoanHistory();


        showScreen(
            "kcbReceipt"
        );

    }

    catch (error) {

        console.error(
            "KCB Loan Repayment Error:",
            error
        );

        alert(
            error.message ||
            "Loan repayment failed."
        );

    }

}


/* ==========================================
   LOAN HISTORY
========================================== */

function renderLoanHistory() {

    const container =
        document.getElementById(
            "loanHistory"
        );


    if (!container) {

        return;

    }


    if (
        loanHistory.length === 0
    ) {

        container.innerHTML =
            "<p>No loan history available.</p>";

        return;

    }


    container.innerHTML =
        loanHistory
            .map(
                loan => `

                    <div class="history-card">

                        <h3>
                            ${loan.loanType}
                        </h3>

                        <p>
                            Amount:
                            ${formatMoney(loan.amount)}
                        </p>

                        <p>
                            Balance:
                            ${formatMoney(loan.balance)}
                        </p>

                        <p>
                            Monthly:
                            ${formatMoney(loan.monthlyPayment)}
                        </p>

                        <p>
                            Status:
                            ${loan.status}
                        </p>

                        <p>
                            Duration:
                            ${loan.duration} Month(s)
                        </p>

                    </div>

                `
            )
            .join("");

}


/* ==========================================
   REFRESH DASHBOARD
========================================== */

async function refreshLoanDashboard() {

    /*
     * Reload the financial profile so the
     * latest loan limit is displayed.
     */

    if (
        typeof loadFinancialProfile ===
        "function"
    ) {

        const profile =
            await loadFinancialProfile();

        if (
            profile &&
            profile.loans
        ) {

            kcbLoan.limit =
                Number(
                    profile.loans.limit || 0
                );

        }

    }


    await loadLoanHistory();

    updateLoanDashboard();

}


/* ==========================================
   ACTIVE LOAN
========================================== */

function hasActiveLoan() {

    return kcbLoan.active;

}


/* ==========================================
   UPDATE LOAN LIMIT
========================================== */

function updateLoanLimit(newLimit) {

    kcbLoan.limit =
        Number(newLimit) || 0;


    const limit =
        document.getElementById(
            "loanLimit"
        );


    if (limit) {

        limit.textContent =
            formatMoney(
                kcbLoan.limit
            );

    }

}


/* ==========================================
   RESET LOAN FORM
========================================== */

function resetLoanForm() {

    const amount =
        document.getElementById(
            "loanAmount"
        );

    const months =
        document.getElementById(
            "loanMonths"
        );

    const pin =
        document.getElementById(
            "loanPIN"
        );

    const purpose =
        document.getElementById(
            "loanPurpose"
        );


    if (amount) {

        amount.value = "";

    }


    if (months) {

        months.selectedIndex = 0;

    }


    if (pin) {

        pin.value = "";

    }


    if (purpose) {

        purpose.value = "";

    }

}


/* ==========================================
   RESET REPAYMENT FORM
========================================== */

function resetRepaymentForm() {

    const amount =
        document.getElementById(
            "loanRepaymentAmount"
        );

    const pin =
        document.getElementById(
            "loanRepaymentPIN"
        );


    if (amount) {

        amount.value = "";

    }


    if (pin) {

        pin.value = "";

    }

}


/* ==========================================
   GET ACTIVE LOAN
========================================== */

function getActiveLoan() {

    return kcbLoan.active
        ? kcbLoan
        : null;

}


/* ==========================================
   EXPORTS
========================================== */

window.applyLoan =
    applyLoan;

window.repayLoan =
    repayLoan;

window.calculateLoan =
    calculateLoan;

window.refreshLoanDashboard =
    refreshLoanDashboard;

window.updateLoanLimit =
    updateLoanLimit;

window.getActiveLoan =
    getActiveLoan;

window.initializeLoans =
    initializeLoans;

window.loadLoanHistory =
    loadLoanHistory;


/* ==========================================
   READY
========================================== */

console.log(
    "✅ KCB Loans Module Loaded"
);