/* ==========================================
   KCB MOBILE BANKING
   DEPOSIT
========================================== */

"use strict";

/* ==========================
   OPEN DEPOSIT
========================== */

function openDeposit() {

    showScreen("kcbDeposit");

}

/* ==========================
   SUBMIT DEPOSIT
========================== */

function submitDeposit() {

    const method =
        document.getElementById("depositMethod").value;

    const amount =
        Number(document.getElementById("depositAmount").value);

    const reference =
        document.getElementById("depositReference").value.trim();
    if (reference === "") {

        alert("Enter the deposit reference.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    // Update account balance
    kcbAccount.balance += amount;

    updateKCBBalance();

    // Create transaction
    const transaction = createTransaction({

        bank: "KCB",

        service: "DEPOSIT",

        sender: method,

        recipient: kcbAccount.accountNumber,

        reference: reference,

        amount: amount,

        fee: 0,

        total: amount,

        balance: kcbAccount.balance

    });

    // Save transaction
    saveBankTransaction(transaction);

    // Add to statement
    addStatement(transaction);

    generateReceipt(transaction);

    alert("Deposit Successful");

    showScreen("kcbDashboard");

}