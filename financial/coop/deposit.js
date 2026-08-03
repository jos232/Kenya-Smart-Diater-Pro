/* ==========================================
   CO-OPERATIVE BANK
   DEPOSIT
========================================== */

"use strict";

/* ==========================
   OPEN DEPOSIT
========================== */

function openCoopDeposit() {

    showScreen("coopDeposit");

}

/* ==========================
   SUBMIT DEPOSIT
========================== */

function submitCoopDeposit() {

    const method =
        document.getElementById("coopDepositMethod").value;

    const amount =
        Number(document.getElementById("coopDepositAmount").value);

    const reference =
        document.getElementById("coopDepositReference").value.trim();

    if (reference === "") {

        alert("Enter deposit reference.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    // Credit account

    coopAccount.balance += amount;

    updateCoopBalance();

    const transaction = createTransaction({

        bank: "CO-OP",

        service: "DEPOSIT",

        sender: method,

        recipient: coopAccount.accountNumber,

        reference: reference,

        amount: amount,

        fee: 0,

        total: amount,

        balance: coopAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Deposit Successful",

        `${formatMoney(amount)} deposited successfully.`

    );

    loadCoopRecentTransactions();

    document.getElementById("coopDepositAmount").value = "";

    document.getElementById("coopDepositReference").value = "";

    document.getElementById("coopDepositMethod").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   EXPORTS
========================================== */

window.openCoopDeposit = openCoopDeposit;
window.submitCoopDeposit = submitCoopDeposit;
window.updateCoopBalance = updateCoopBalance;