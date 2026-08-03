/* ==========================================
   EQUITY MOBILE BANKING
   PAY BILLS
========================================== */

"use strict";

/* ==========================
   OPEN BILLS
========================== */

function openEquityBills() {

    showScreen("equityBills");

}

/* ==========================
   PAY BILL
========================== */

function submitEquityBill() {

    const bill =
        document.getElementById("equityBillType").value;

    const account =
        document.getElementById("equityBillAccount").value.trim();

    const amount =
        Number(document.getElementById("equityBillAmount").value);

    const pin =
        document.getElementById("equityBillPIN").value;

    if (account === "") {

        alert("Enter Account Number.");

        return;

    }

    if (amount <= 0) {

        alert("Enter valid amount.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee = calculateFee("bill", amount);

    const total = calculateTotal(amount, fee);

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "PAY BILL",

        sender: equityAccount.accountNumber,

        recipient: account,

        amount,

        fee,

        total,

        balance: equityAccount.balance,

        billType: bill

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bill Payment Successful",

        `${formatMoney(amount)} paid successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityBillAccount").value = "";

    document.getElementById("equityBillAmount").value = "";

    document.getElementById("equityBillPIN").value = "";

    document.getElementById("equityBillType").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   BILL HISTORY
========================================== */

function loadEquityBillHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "PAY BILL");

}

/* ==========================================
   QUICK BILL PAYMENT
========================================== */

function quickEquityBill(amount) {

    const amountInput =
        document.getElementById("equityBillAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   SAVED BILLERS
========================================== */

let equityBillers = [];

function loadEquityBillers() {

    const saved = localStorage.getItem("equityBillers");

    equityBillers = saved
        ? JSON.parse(saved)
        : [];

}

function saveEquityBillers() {

    localStorage.setItem(

        "equityBillers",

        JSON.stringify(equityBillers)

    );

}

function addEquityBiller(name, account) {

    equityBillers.push({

        name,

        account

    });

    saveEquityBillers();

}

/* ==========================================
   POPULAR BILLERS
========================================== */

function showPopularBillers() {

    alert(

        "Popular Billers\n\n" +

        "• Kenya Power\n" +

        "• Nairobi Water\n" +

        "• DSTV\n" +

        "• GOtv\n" +

        "• Zuku\n" +

        "• Safaricom PostPay"

    );

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityBills() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Bills Updated",

        "Bill payment records refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityBillHistory = loadEquityBillHistory;
window.quickEquityBill = quickEquityBill;
window.loadEquityBillers = loadEquityBillers;
window.saveEquityBillers = saveEquityBillers;
window.addEquityBiller = addEquityBiller;
window.showPopularBillers = showPopularBillers;
window.refreshEquityBills = refreshEquityBills;