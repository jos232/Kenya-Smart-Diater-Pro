/* ==========================================
   CO-OPERATIVE BANK
   LOANS
========================================== */

"use strict";

/* ==========================================
   LOAN ACCOUNT
========================================== */

let coopLoan = {

    limit: 100000,

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
   UPDATE STATUS
========================================== */

function updateCoopLoanStatus() {

    const limit = document.getElementById("coopLoanLimit");
    const status = document.getElementById("coopLoanStatus");

    if (limit) {

        limit.textContent = formatMoney(coopLoan.limit);

    }

    if (!status) return;

    if (coopLoan.active) {

        status.innerHTML = `

            Outstanding Loan<br>

            <strong>${formatMoney(coopLoan.balance)}</strong>

        `;

    }

    else {

        status.textContent = "No Active Loan";

    }

}

/* ==========================================
   CALCULATE REPAYMENT
========================================== */

function calculateCoopLoanRepayment(amount, months) {

    const interestRate = 0.12;

    const total = amount + (amount * interestRate);

    return total / months;

}

/* ==========================================
   APPLY LOAN
========================================== */

function applyCoopLoan() {

    const amount = Number(

        document.getElementById("coopLoanAmount").value

    );

    const months = Number(

        document.getElementById("coopLoanMonths").value

    );

    const pin =

        document.getElementById("coopLoanPIN").value;

    if (amount <= 0) {

        alert("Enter valid amount.");

        return;

    }

    if (amount > coopLoan.limit) {

        alert("Loan exceeds your limit.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    coopAccount.balance += amount;

    coopLoan.active = true;

    coopLoan.balance = amount;

    coopLoan.repaymentMonths = months;

    coopLoan.monthlyRepayment = calculateCoopLoanRepayment(

        amount,

        months

    );

    updateCoopBalance();

    updateCoopLoanStatus();

    if (typeof createTransaction === "function") {

        const transaction = createTransaction({

            bank: "CO-OP",

            service: "LOAN",

            sender: "CO-OPERATIVE BANK",

            recipient: coopAccount.accountNumber,

            amount,

            fee: 0,

            total: amount,

            balance: coopAccount.balance

        });

        if (typeof saveBankTransaction === "function") {

            saveBankTransaction(transaction);

        }

        if (typeof addStatement === "function") {

            addStatement(transaction);

        }

        if (typeof generateReceipt === "function") {

            generateReceipt(transaction);

        }

    }

    if (typeof addBankNotification === "function") {

        addBankNotification(

            "Loan Approved",

            `${formatMoney(amount)} credited successfully.`

        );

    }

    if (typeof loadCoopRecentTransactions === "function") {

        loadCoopRecentTransactions();

    }

    document.getElementById("coopLoanAmount").value = "";

    document.getElementById("coopLoanPIN").value = "";

    document.getElementById("coopLoanMonths").selectedIndex = 0;

    showScreen("kcbReceipt");

}

/* ==========================================
   REPAY LOAN
========================================== */

function repayCoopLoan() {

    if (!coopLoan.active) {

        alert("No active loan.");

        return;

    }

    const amount = Number(

        prompt("Enter repayment amount")

    );

    if (!amount || amount <= 0) {

        return;

    }

    if (amount > coopAccount.balance) {

        alert("Insufficient balance.");

        return;

    }

    coopAccount.balance -= amount;

    coopLoan.balance -= amount;

    if (coopLoan.balance <= 0) {

        coopLoan.balance = 0;

        coopLoan.active = false;

    }

    updateCoopBalance();

    updateCoopLoanStatus();

    if (typeof addBankNotification === "function") {

        addBankNotification(

            "Loan Repayment",

            `${formatMoney(amount)} repaid successfully.`

        );

    }

}

/* ==========================================
   LOAN HISTORY PLACEHOLDER
========================================== */

function loadCoopLoanHistory() {

    return [];

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopLoans = openCoopLoans;

window.updateCoopLoanStatus = updateCoopLoanStatus;

window.calculateCoopLoanRepayment = calculateCoopLoanRepayment;

window.applyCoopLoan = applyCoopLoan;

window.repayCoopLoan = repayCoopLoan;

window.loadCoopLoanHistory = loadCoopLoanHistory;