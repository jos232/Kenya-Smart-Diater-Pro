/* ==========================================
   KCB MOBILE BANKING
   PAY BILLS
========================================== */

"use strict";

/* ==========================
   OPEN PAY BILLS
========================== */

function openBills() {

    showScreen("kcbBills");

}

/* ==========================
   PAY BILL
========================== */

function submitBillPayment() {

    const business =
        document.getElementById("billBusiness").value.trim();

    const paybill =
        document.getElementById("billNumber").value.trim();

    const account =
        document.getElementById("billAccount").value.trim();

    const amount =
        Number(document.getElementById("billAmount").value);

    const pin =
        document.getElementById("billPIN").value;

    if (
        business === "" ||
        paybill === "" ||
        account === ""
    ) {

        alert("Fill in all fields.");

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
        calculateFee("bill", amount);

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

        service: "PAY BILL",

        sender: kcbAccount.accountNumber,

        recipient: `${business} (${paybill})`,

        amount: amount,

        fee: fee,

        total: total,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bill Paid",

        `${formatMoney(amount)} paid to ${business}.`

    );

    loadKCBRecentTransactions();

    // Clear form
    document.getElementById("billBusiness").value = "";
    document.getElementById("billNumber").value = "";
    document.getElementById("billAccount").value = "";
    document.getElementById("billAmount").value = "";
    document.getElementById("billPIN").value = "";

    showScreen("kcbReceipt");

}
/* ==========================================
   BILL HISTORY
========================================== */

function loadKCBBillHistory() {

    return getBankStatements("KCB")

        .filter(item => item.service === "PAY BILL");

}

/* ==========================================
   SAVE FAVOURITE PAYBILLS
========================================== */

let kcbFavouriteBills = [];

function loadFavouriteBills() {

    const saved =
        localStorage.getItem("kcbFavouriteBills");

    kcbFavouriteBills =
        saved ? JSON.parse(saved) : [];

}

function saveFavouriteBills() {

    localStorage.setItem(

        "kcbFavouriteBills",

        JSON.stringify(kcbFavouriteBills)

    );

}

function addFavouriteBill(name, paybill, account) {

    kcbFavouriteBills.push({

        name,

        paybill,

        account

    });

    saveFavouriteBills();

}

/* ==========================================
   RECENT PAYBILLS
========================================== */

function getRecentBills() {

    return loadKCBBillHistory()

        .slice(0, 5);

}

/* ==========================================
   VERIFY PAYBILL
========================================== */

function verifyPaybill(paybill) {

    if (!paybill || paybill.length < 5) {

        alert("Invalid PayBill Number.");

        return false;

    }

    return true;

}

/* ==========================================
   QUICK BILL AMOUNTS
========================================== */

function quickBillAmount(amount) {

    const input =
        document.getElementById("billAmount");

    if (input) {

        input.value = amount;

    }

}

/* ==========================================
   REFRESH
========================================== */

function refreshBills() {

    loadKCBRecentTransactions();

    addBankNotification(

        "Bills Updated",

        "Recent bill payments refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadKCBBillHistory = loadKCBBillHistory;
window.loadFavouriteBills = loadFavouriteBills;
window.saveFavouriteBills = saveFavouriteBills;
window.addFavouriteBill = addFavouriteBill;
window.getRecentBills = getRecentBills;
window.verifyPaybill = verifyPaybill;
window.quickBillAmount = quickBillAmount;
window.refreshBills = refreshBills;