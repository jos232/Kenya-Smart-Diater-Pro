/* ==========================================
   EQUITY MOBILE BANKING
   WITHDRAW
========================================== */

"use strict";

/* ==========================
   OPEN WITHDRAW
========================== */

function openEquityWithdraw() {

    showScreen("equityWithdraw");

}

/* ==========================
   SUBMIT WITHDRAW
========================== */

function submitEquityWithdraw() {

    const method =
        document.getElementById("equityWithdrawMethod").value;

    const amount =
        Number(document.getElementById("equityWithdrawAmount").value);

    const reference =
        document.getElementById("equityWithdrawReference").value.trim();

    const pin =
        document.getElementById("equityWithdrawPIN").value;

    if (reference === "") {

        alert("Enter withdrawal reference.");

        return;

    }

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

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    // Deduct balance

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "WITHDRAW",

        sender: equityAccount.accountNumber,

        recipient: method,

        reference: reference,

        amount: amount,

        fee: fee,

        total: total,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Withdrawal Successful",

        `${formatMoney(amount)} withdrawn successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityWithdrawAmount").value = "";

    document.getElementById("equityWithdrawReference").value = "";

    document.getElementById("equityWithdrawPIN").value = "";

    document.getElementById("equityWithdrawMethod").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   WITHDRAWAL HISTORY
========================================== */

function loadEquityWithdrawalHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "WITHDRAW");

}

/* ==========================================
   QUICK WITHDRAW
========================================== */

function quickEquityWithdraw(amount) {

    const amountInput =
        document.getElementById("equityWithdrawAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   VERIFY WITHDRAWAL
========================================== */

function verifyWithdrawalReference(reference) {

    if (!reference || reference.length < 5) {

        alert("Invalid Withdrawal Reference.");

        return false;

    }

    return true;

}

/* ==========================================
   ATM WITHDRAWAL
========================================== */

function withdrawFromATM() {

    alert(

        "ATM Withdrawal\n\n" +

        "Use your Equity Debit Card\n" +

        "at any Equity ATM."

    );

}

/* ==========================================
   AGENT WITHDRAWAL
========================================== */

function withdrawFromAgent() {

    alert(

        "Equity Agent Withdrawal\n\n" +

        "Visit the nearest Equity Agent."

    );

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityWithdrawal() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Withdrawal Updated",

        "Withdrawal records refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityWithdrawalHistory = loadEquityWithdrawalHistory;
window.quickEquityWithdraw = quickEquityWithdraw;
window.verifyWithdrawalReference = verifyWithdrawalReference;
window.withdrawFromATM = withdrawFromATM;
window.withdrawFromAgent = withdrawFromAgent;
window.refreshEquityWithdrawal = refreshEquityWithdrawal;