/* ==========================================
   EQUITY MOBILE BANKING
   LOANS
========================================== */

"use strict";

/* ==========================
   LOAN DETAILS
========================== */

let equityLoan = {

    limit: 100000,

    active: false,

    balance: 0,

    repaymentMonths: 0

};

/* ==========================
   OPEN LOANS
========================== */

function openEquityLoans() {

    updateEquityLoanStatus();

    showScreen("equityLoans");

}

/* ==========================
   UPDATE LOAN STATUS
========================== */

function updateEquityLoanStatus() {

    const limit =
        document.getElementById("equityLoanLimit");

    const status =
        document.getElementById("equityLoanStatus");

    if (limit)
        limit.textContent =
            formatMoney(equityLoan.limit);

    if (status) {

        if (equityLoan.active) {

            status.textContent =
                `Outstanding Loan: ${formatMoney(equityLoan.balance)}`;

        } else {

            status.textContent =
                "No Active Loan";

        }

    }

}

/* ==========================
   APPLY LOAN
========================== */

function applyEquityLoan() {

    const amount =
        Number(document.getElementById("equityLoanAmount").value);

    const months =
        Number(document.getElementById("equityLoanMonths").value);

    const pin =
        document.getElementById("equityLoanPIN").value;

    if (amount <= 0) {

        alert("Enter valid loan amount.");

        return;

    }

    if (amount > equityLoan.limit) {

        alert("Loan exceeds your limit.");

        return;

    }

    const verify =
        verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    equityAccount.balance += amount;

    updateEquityBalance();

    equityLoan.active = true;

    equityLoan.balance = amount;

    equityLoan.repaymentMonths = months;

    updateEquityLoanStatus();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "LOAN",

        sender: "Equity Bank",

        recipient: equityAccount.accountNumber,

        amount,

        fee: 0,

        total: amount,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Loan Approved",

        `${formatMoney(amount)} has been credited to your account.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityLoanAmount").value = "";

    document.getElementById("equityLoanPIN").value = "";

    document.getElementById("equityLoanMonths").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   REPAY LOAN
========================================== */

function repayEquityLoan() {

    if (!equityLoan.active) {

        alert("No active loan.");

        return;

    }

    const amount = Number(

        prompt("Enter repayment amount")

    );

    if (amount <= 0) {

        alert("Invalid amount.");

        return;

    }

    if (amount > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= amount;

    equityLoan.balance -= amount;

    if (equityLoan.balance <= 0) {

        equityLoan.balance = 0;

        equityLoan.active = false;

    }

    updateEquityBalance();

    updateEquityLoanStatus();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "LOAN REPAYMENT",

        sender: equityAccount.accountNumber,

        recipient: "Equity Bank",

        amount,

        fee: 0,

        total: amount,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Loan Repayment",

        `${formatMoney(amount)} loan repayment completed.`

    );

    loadEquityRecentTransactions();

}

/* ==========================================
   LOAN HISTORY
========================================== */

function loadEquityLoanHistory() {

    return getBankStatements("EQUITY")

        .filter(item =>

            item.service === "LOAN" ||

            item.service === "LOAN REPAYMENT"

        );

}

/* ==========================================
   LOAN CALCULATOR
========================================== */

function calculateEquityLoan(months, amount) {

    const rate = 0.09;

    const interest = amount * rate;

    const total = amount + interest;

    return {

        interest,

        total,

        monthly: total / months

    };

}

/* ==========================================
   CHECK ELIGIBILITY
========================================== */

function checkEquityLoanEligibility() {

    alert(

        "Eligible Loan Limit\n\n" +

        formatMoney(equityLoan.limit)

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
   EXPORTS
========================================== */

window.repayEquityLoan = repayEquityLoan;
window.loadEquityLoanHistory = loadEquityLoanHistory;
window.calculateEquityLoan = calculateEquityLoan;
window.checkEquityLoanEligibility = checkEquityLoanEligibility;
window.refreshEquityLoans = refreshEquityLoans;