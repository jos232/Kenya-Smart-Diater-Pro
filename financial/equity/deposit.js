/* ==========================================
   EQUITY MOBILE BANKING
   DEPOSIT
========================================== */

"use strict";

/* ==========================
   OPEN DEPOSIT
========================== */

function openEquityDeposit() {

    showScreen("equityDeposit");

}

/* ==========================
   SUBMIT DEPOSIT
========================== */

function submitEquityDeposit() {

    const method =
        document.getElementById("equityDepositMethod").value;

    const amount =
        Number(document.getElementById("equityDepositAmount").value);

    const reference =
        document.getElementById("equityDepositReference").value.trim();

    if (reference === "") {

        alert("Enter the deposit reference.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    // Credit account

    equityAccount.balance += amount;

    updateEquityBalance();

    // Create transaction

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "DEPOSIT",

        sender: method,

        recipient: equityAccount.accountNumber,

        reference: reference,

        amount: amount,

        fee: 0,

        total: amount,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Deposit Successful",

        `${formatMoney(amount)} deposited successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityDepositAmount").value = "";

    document.getElementById("equityDepositReference").value = "";

    document.getElementById("equityDepositMethod").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   DEPOSIT HISTORY
========================================== */

function loadEquityDepositHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "DEPOSIT");

}

/* ==========================================
   QUICK CASH DEPOSIT
========================================== */

function quickCashDeposit(amount) {

    const amountInput =
        document.getElementById("equityDepositAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   VERIFY DEPOSIT
========================================== */

function verifyDepositReference(reference) {

    if (!reference || reference.length < 5) {

        alert("Invalid Deposit Reference.");

        return false;

    }

    return true;

}

/* ==========================================
   REFRESH DEPOSIT
========================================== */

function refreshEquityDeposit() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Deposit Updated",

        "Deposit records refreshed."

    );

}

/* ==========================================
   MOBILE MONEY DEPOSIT
========================================== */

function depositFromMobileMoney() {

    alert(

        "Deposit via M-Pesa\n\n" +

        "Paybill: 247247\n" +

        "Account: " +

        equityAccount.accountNumber

    );

}

/* ==========================================
   BANK CHEQUE DEPOSIT
========================================== */

function depositCheque() {

    alert(

        "Cheque Deposit\n\n" +

        "Visit your nearest Equity branch."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityDepositHistory = loadEquityDepositHistory;
window.quickCashDeposit = quickCashDeposit;
window.refreshEquityDeposit = refreshEquityDeposit;
window.depositFromMobileMoney = depositFromMobileMoney;
window.depositCheque = depositCheque;
window.verifyDepositReference = verifyDepositReference;