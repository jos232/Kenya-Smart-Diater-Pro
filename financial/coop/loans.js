/* ==========================================
   CO-OPERATIVE BANK
   LOANS
========================================== */

"use strict";


/* ==========================================
   LOAN ACCOUNT
========================================== */

let coopLoan = {

    limit: 0,

    active: false,

    balance: 0,

    repaymentMonths: 0,

    monthlyRepayment: 0

};


/* ==========================================
   OPEN LOANS
========================================== */

function openCoopLoans() {

    updateCoopLoanStatus();

    showScreen("coopLoans");

}


/* ==========================================
   UPDATE LOAN STATUS
========================================== */

function updateCoopLoanStatus() {

    const limit =
        document.getElementById(
            "coopLoanLimit"
        );

    const status =
        document.getElementById(
            "coopLoanStatus"
        );


    /* --------------------------------------
       LOAN LIMIT
    -------------------------------------- */

    if (limit) {

        limit.textContent =
            formatMoney(
                coopLoan.limit
            );

    }


    /* --------------------------------------
       LOAN STATUS
    -------------------------------------- */

    if (!status) {

        return;

    }


    if (coopLoan.active) {

        status.innerHTML = `

            Outstanding Loan<br>

            <strong>
                ${formatMoney(
            coopLoan.balance
        )}
            </strong>

        `;

    }

    else {

        status.textContent =
            "No Active Loan";

    }

}


/* ==========================================
   UPDATE LOAN LIMIT
========================================== */

function updateCoopLoanLimit(newLimit) {

    coopLoan.limit =
        Number(newLimit) || 0;

    updateCoopLoanStatus();

}


/* ==========================================
   CALCULATE REPAYMENT
========================================== */

function calculateCoopLoanRepayment(
    amount,
    months
) {

    const interestRate = 0.12;

    const total =
        amount +
        (amount * interestRate);


    return months > 0
        ? total / months
        : 0;

}


/* ==========================================
   APPLY LOAN
========================================== */

function applyCoopLoan() {

    const amount =
        Number(
            document.getElementById(
                "coopLoanAmount"
            ).value
        );


    const months =
        Number(
            document.getElementById(
                "coopLoanMonths"
            ).value
        );


    const pin =
        document.getElementById(
            "coopLoanPIN"
        ).value;


    /* --------------------------------------
       VALIDATE AMOUNT
    -------------------------------------- */

    if (amount <= 0) {

        alert(
            "Enter a valid loan amount."
        );

        return;

    }


    /* --------------------------------------
       CHECK LOAN LIMIT
    -------------------------------------- */

    if (amount > coopLoan.limit) {

        alert(
            "Loan exceeds your available limit."
        );

        return;

    }


    /* --------------------------------------
       CHECK ACTIVE LOAN
    -------------------------------------- */

    if (coopLoan.active) {

        alert(
            "You already have an active loan."
        );

        return;

    }


    /* --------------------------------------
       VERIFY PIN
    -------------------------------------- */

    const verify =
        verifyPIN(pin);


    if (!verify.success) {

        alert(
            verify.message
        );

        return;

    }


    /* --------------------------------------
       CREDIT CO-OP ACCOUNT
    -------------------------------------- */

    coopAccount.balance += amount;


    /* --------------------------------------
       SAVE LOAN
    -------------------------------------- */

    coopLoan.active = true;

    coopLoan.balance = amount;

    coopLoan.repaymentMonths =
        months;

    coopLoan.monthlyRepayment =
        calculateCoopLoanRepayment(
            amount,
            months
        );


    updateCoopBalance();

    updateCoopLoanStatus();


    /* ======================================
       TRANSACTION
    ====================================== */

    if (
        typeof createTransaction ===
        "function"
    ) {

        const transaction =
            createTransaction({

                bank: "CO-OP",

                service: "LOAN",

                sender:
                    "CO-OPERATIVE BANK",

                recipient:
                    coopAccount.accountNumber,

                amount,

                fee: 0,

                total: amount,

                balance:
                    coopAccount.balance

            });


        if (
            typeof saveBankTransaction ===
            "function"
        ) {

            saveBankTransaction(
                transaction
            );

        }


        if (
            typeof addStatement ===
            "function"
        ) {

            addStatement(
                transaction
            );

        }


        if (
            typeof generateReceipt ===
            "function"
        ) {

            generateReceipt(
                transaction
            );

        }

    }


    /* ======================================
       NOTIFICATION
    ====================================== */

    if (
        typeof addBankNotification ===
        "function"
    ) {

        addBankNotification(

            "Loan Approved",

            `${formatMoney(
                amount
            )} credited successfully.`

        );

    }


    /* ======================================
       REFRESH TRANSACTIONS
    ====================================== */

    if (
        typeof loadCoopRecentTransactions ===
        "function"
    ) {

        loadCoopRecentTransactions();

    }


    /* ======================================
       RESET FORM
    ====================================== */

    const amountField =
        document.getElementById(
            "coopLoanAmount"
        );

    const pinField =
        document.getElementById(
            "coopLoanPIN"
        );

    const monthsField =
        document.getElementById(
            "coopLoanMonths"
        );


    if (amountField) {

        amountField.value = "";

    }


    if (pinField) {

        pinField.value = "";

    }


    if (monthsField) {

        monthsField.selectedIndex = 0;

    }


    /* ======================================
       RECEIPT
    ====================================== */

    showScreen(
        "kcbReceipt"
    );

}


/* ==========================================
   REPAY LOAN
========================================== */

function repayCoopLoan() {

    if (!coopLoan.active) {

        alert(
            "No active loan."
        );

        return;

    }


    const amount =
        Number(
            prompt(
                "Enter repayment amount"
            )
        );


    if (!amount || amount <= 0) {

        return;

    }


    if (amount > coopAccount.balance) {

        alert(
            "Insufficient balance."
        );

        return;

    }


    /* --------------------------------------
       REPAY
    -------------------------------------- */

    coopAccount.balance -= amount;

    coopLoan.balance -= amount;


    /* --------------------------------------
       CHECK COMPLETION
    -------------------------------------- */

    if (coopLoan.balance <= 0) {

        coopLoan.balance = 0;

        coopLoan.active = false;

    }


    updateCoopBalance();

    updateCoopLoanStatus();


    /* --------------------------------------
       NOTIFICATION
    -------------------------------------- */

    if (
        typeof addBankNotification ===
        "function"
    ) {

        addBankNotification(

            "Loan Repayment",

            `${formatMoney(
                amount
            )} repaid successfully.`

        );

    }

}


/* ==========================================
   LOAN HISTORY
========================================== */

function loadCoopLoanHistory() {

    return [];

}


/* ==========================================
   GET CO-OP LOAN
========================================== */

function getCoopLoan() {

    return coopLoan;

}


/* ==========================================
   EXPORTS
========================================== */

window.openCoopLoans =
    openCoopLoans;

window.updateCoopLoanStatus =
    updateCoopLoanStatus;

window.updateCoopLoanLimit =
    updateCoopLoanLimit;

window.calculateCoopLoanRepayment =
    calculateCoopLoanRepayment;

window.applyCoopLoan =
    applyCoopLoan;

window.repayCoopLoan =
    repayCoopLoan;

window.loadCoopLoanHistory =
    loadCoopLoanHistory;

window.getCoopLoan =
    getCoopLoan;


console.log(
    "✅ Co-operative Bank Loans Module Loaded"
);