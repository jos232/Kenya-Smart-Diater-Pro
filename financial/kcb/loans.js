/* ==========================================
   KCB MOBILE BANKING
   LOANS
========================================== */

"use strict";

/* ==========================
   LOAN DATA
========================== */

let kcbLoan = {

    limit: 100000,

    active: false,

    amount: 0,

    repayment: 0,

    months: 0

};

/* ==========================
   APPLY LOAN
========================== */

function applyLoan() {

    const amount =
        Number(document.getElementById("loanAmount").value);

    const months =
        Number(document.getElementById("loanMonths").value);

    const pin =
        document.getElementById("loanPIN").value;

    if (amount <= 0) {

        alert("Enter a valid loan amount.");

        return;

    }

    if (amount > kcbLoan.limit) {

        alert("Requested amount exceeds your loan limit.");

        return;

    }

    if (kcbLoan.active) {

        alert("You already have an active loan.");

        return;

    }

    const verify =
        verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    /* -------------------------
       Interest Calculation
    ------------------------- */

    const interestRate = 0.08;

    const interest =
        amount * interestRate;

    const totalRepayment =
        amount + interest;

    const monthlyRepayment =
        totalRepayment / months;

    /* -------------------------
       Activate Loan
    ------------------------- */

    kcbLoan.active = true;

    kcbLoan.amount = amount;

    kcbLoan.months = months;

    kcbLoan.repayment = monthlyRepayment;

    /* -------------------------
       Credit Customer Account
    ------------------------- */

    kcbAccount.balance += amount;

    updateKCBBalance();

    updateLoanDashboard();

    /* -------------------------
       Create Transaction
    ------------------------- */

    const transaction = createTransaction({

        bank: "KCB",

        service: "LOAN",

        sender: "KCB",

        recipient: kcbAccount.accountNumber,

        amount: amount,

        fee: interest,

        total: totalRepayment,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Loan Approved",

        `${formatMoney(amount)} has been credited to your account.`

    );

    loadKCBRecentTransactions();

    /* -------------------------
       Clear Form
    ------------------------- */

    document.getElementById("loanAmount").value = "";

    document.getElementById("loanPIN").value = "";

    document.getElementById("loanMonths").selectedIndex = 0;

    /* -------------------------
       Success Message
    ------------------------- */

    alert(

        "Loan Approved!\n\n" +

        "Amount: " + formatMoney(amount) + "\n" +

        "Interest: " + formatMoney(interest) + "\n" +

        "Monthly Repayment: " +

        formatMoney(monthlyRepayment)

    );

    showScreen("kcbReceipt");

}
/* ==========================
   REPAY LOAN
========================== */

function repayLoan() {

    if (!kcbLoan.active) {

        alert("You do not have an active loan.");

        return;

    }

    const amount =
        Number(document.getElementById("loanRepaymentAmount").value);

    const pin =
        document.getElementById("loanRepaymentPIN").value;

    if (amount <= 0) {

        alert("Enter a valid repayment amount.");

        return;

    }

    const verify =
        verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    if (amount > kcbAccount.balance) {

        alert("Insufficient account balance.");

        return;

    }

    kcbAccount.balance -= amount;

    kcbLoan.amount -= amount;

    if (kcbLoan.amount <= 0) {

        kcbLoan.amount = 0;

        kcbLoan.active = false;

    }

    updateKCBBalance();

    updateLoanDashboard();

    const transaction = createTransaction({

        bank: "KCB",

        service: "LOAN REPAYMENT",

        sender: kcbAccount.accountNumber,

        recipient: "KCB Loan",

        amount: amount,

        fee: 0,

        total: amount,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Loan Repayment",

        `${formatMoney(amount)} loan repayment received.`

    );

    loadKCBRecentTransactions();

    document.getElementById("loanRepaymentAmount").value = "";

    document.getElementById("loanRepaymentPIN").value = "";

    showScreen("kcbReceipt");

}