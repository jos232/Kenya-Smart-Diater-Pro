/* ==========================================
   KCB MOBILE BANKING
   WITHDRAW
========================================== */

"use strict";

/* ==========================
   OPEN WITHDRAW
========================== */

function openWithdraw() {

    showScreen("kcbWithdraw");

}

/* ==========================
   SUBMIT WITHDRAWAL
========================== */

function submitWithdraw() {

    alert("Withdraw function started");

}

function submitWithdraw() {

    const method =
        document.getElementById("withdrawMethod").value;

    const amount =
        Number(document.getElementById("withdrawAmount").value);

    const pin =
        document.getElementById("withdrawPIN").value;

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("withdraw", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > kcbAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    // Deduct balance
    kcbAccount.balance -= total;

    updateKCBBalance();

    // Create transaction
    const transaction = createTransaction({

        bank: "KCB",

        service: "WITHDRAW",

        sender: kcbAccount.accountNumber,

        recipient: method,

        amount,

        fee,

        total,

        balance: kcbAccount.balance

    });

    // Save transaction
    saveBankTransaction(transaction);

    // Statement
    addStatement(transaction);

    // Receipt
    generateReceipt(transaction);

    // Notification
    addBankNotification(

        "Withdrawal Successful",

        `${formatMoney(amount)} withdrawn successfully.`

    );

    // Refresh dashboard
    loadKCBRecentTransactions();

    // Clear form
    document.getElementById("withdrawAmount").value = "";

    document.getElementById("withdrawPIN").value = "";

    document.getElementById("withdrawMethod").selectedIndex = 0;

    // Open receipt
    showScreen("kcbReceipt");

}