/* ==========================================
   EQUITY MOBILE BANKING
   LOANS
========================================== */

"use strict";

/* ==========================================
   LOAN DETAILS
========================================== */

let equityLoan = {

    limit: 0,

    active: false,

    balance: 0,

    repaymentMonths: 0

};


/* ==========================================
   OPEN LOANS
========================================== */

function openEquityLoans() {

    updateEquityLoanStatus();

    showScreen("equityLoans");

}


/* ==========================================
   UPDATE LOAN STATUS
========================================== */

function updateEquityLoanStatus() {

    const limit =
        document.getElementById("equityLoanLimit");

    const status =
        document.getElementById("equityLoanStatus");


    /* --------------------------------------
       LOAN LIMIT
    -------------------------------------- */

    if (limit) {

        limit.textContent =
            formatMoney(equityLoan.limit);

    }


    /* --------------------------------------
       LOAN STATUS
    -------------------------------------- */

    if (status) {

        if (equityLoan.active) {

            status.textContent =
                `Outstanding Loan: ${formatMoney(
                    equityLoan.balance
                )}`;

        } else {

            status.textContent =
                "No Active Loan";

        }

    }

}


/* ==========================================
   UPDATE LOAN LIMIT
========================================== */

function updateEquityLoanLimit(newLimit) {

    equityLoan.limit =
        Number(newLimit) || 0;


    updateEquityLoanStatus();

}


/* ==========================================
   APPLY LOAN
========================================== */

function applyEquityLoan() {

    const amount =
        Number(
            document.getElementById(
                "equityLoanAmount"
            ).value
        );


    const months =
        Number(
            document.getElementById(
                "equityLoanMonths"
            ).value
        );


    const pin =
        document.getElementById(
            "equityLoanPIN"
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
       CHECK LIMIT
    -------------------------------------- */

    if (amount > equityLoan.limit) {

        alert(
            "Loan exceeds your available limit."
        );

        return;

    }


    /* --------------------------------------
       CHECK ACTIVE LOAN
    -------------------------------------- */

    if (equityLoan.active) {

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

        alert(verify.message);

        return;

    }


    /* --------------------------------------
       CREDIT ACCOUNT
    -------------------------------------- */

    equityAccount.balance += amount;

    updateEquityBalance();


    /* --------------------------------------
       SAVE LOAN
    -------------------------------------- */

    equityLoan.active = true;

    equityLoan.balance = amount;

    equityLoan.repaymentMonths = months;


    updateEquityLoanStatus();


    /* --------------------------------------
       TRANSACTION
    -------------------------------------- */

    const transaction =
        createTransaction({

            bank: "EQUITY",

            service: "LOAN",

            sender: "Equity Bank",

            recipient:
                equityAccount.accountNumber,

            amount,

            fee: 0,

            total: amount,

            balance:
                equityAccount.balance

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


    /* --------------------------------------
       NOTIFICATION
    -------------------------------------- */

    addBankNotification(

        "Loan Approved",

        `${formatMoney(amount)} has been credited to your account.`

    );


    /* --------------------------------------
       REFRESH TRANSACTIONS
    -------------------------------------- */

    loadEquityRecentTransactions();


    /* --------------------------------------
       RESET FORM
    -------------------------------------- */

    document.getElementById(
        "equityLoanAmount"
    ).value = "";


    document.getElementById(
        "equityLoanPIN"
    ).value = "";


    document.getElementById(
        "equityLoanMonths"
    ).selectedIndex = 0;


    /* --------------------------------------
       RECEIPT
    -------------------------------------- */

    showScreen(
        "kcbReceipt"
    );

}


/* ==========================================
   REPAY LOAN
========================================== */

function repayEquityLoan() {

    if (!equityLoan.active) {

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


    if (amount <= 0) {

        alert(
            "Invalid repayment amount."
        );

        return;

    }


    if (amount > equityAccount.balance) {

        alert(
            "Insufficient balance."
        );

        return;

    }


    /* --------------------------------------
       REPAY
    -------------------------------------- */

    equityAccount.balance -= amount;

    equityLoan.balance -= amount;


    /* --------------------------------------
       CHECK COMPLETION
    -------------------------------------- */

    if (equityLoan.balance <= 0) {

        equityLoan.balance = 0;

        equityLoan.active = false;

    }


    updateEquityBalance();

    updateEquityLoanStatus();


    /* --------------------------------------
       TRANSACTION
    -------------------------------------- */

    const transaction =
        createTransaction({

            bank: "EQUITY",

            service: "LOAN REPAYMENT",

            sender:
                equityAccount.accountNumber,

            recipient:
                "Equity Bank",

            amount,

            fee: 0,

            total: amount,

            balance:
                equityAccount.balance

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


    /* --------------------------------------
       NOTIFICATION
    -------------------------------------- */

    addBankNotification(

        "Loan Repayment",

        `${formatMoney(amount)} loan repayment completed.`

    );


    /* --------------------------------------
       REFRESH
    -------------------------------------- */

    loadEquityRecentTransactions();

}


/* ==========================================
   LOAN HISTORY
========================================== */

function loadEquityLoanHistory() {

    return getBankStatements(
        "EQUITY"
    ).filter(

        item =>
            item.service === "LOAN" ||
            item.service === "LOAN REPAYMENT"

    );

}


/* ==========================================
   LOAN CALCULATOR
========================================== */

function calculateEquityLoan(
    months,
    amount
) {

    const rate = 0.09;

    const interest =
        amount * rate;

    const total =
        amount + interest;


    return {

        interest,

        total,

        monthly:
            months > 0
                ? total / months
                : 0

    };

}


/* ==========================================
   CHECK ELIGIBILITY
========================================== */

function checkEquityLoanEligibility() {

    alert(

        "Eligible Loan Limit\n\n" +

        formatMoney(
            equityLoan.limit
        )

    );

}


/* ==========================================
   REFRESH
========================================== */

function refreshEquityLoans() {

    updateEquityLoanStatus();

    loadEquityRecentTransactions();

}


/* ==========================================
   GET EQUITY LOAN
========================================== */

function getEquityLoan() {

    return equityLoan;

}


/* ==========================================
   EXPORTS
========================================== */

window.openEquityLoans =
    openEquityLoans;

window.updateEquityLoanStatus =
    updateEquityLoanStatus;

window.updateEquityLoanLimit =
    updateEquityLoanLimit;

window.applyEquityLoan =
    applyEquityLoan;

window.repayEquityLoan =
    repayEquityLoan;

window.loadEquityLoanHistory =
    loadEquityLoanHistory;

window.calculateEquityLoan =
    calculateEquityLoan;

window.checkEquityLoanEligibility =
    checkEquityLoanEligibility;

window.refreshEquityLoans =
    refreshEquityLoans;

window.getEquityLoan =
    getEquityLoan;


console.log(
    " Equity Loans Module Loaded"
);