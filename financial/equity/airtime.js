/* ==========================================
   EQUITY MOBILE BANKING
   AIRTIME
========================================== */

"use strict";

/* ==========================
   OPEN AIRTIME
========================== */

function openEquityAirtime() {

    showScreen("equityAirtime");

}

/* ==========================
   BUY AIRTIME
========================== */

function submitEquityAirtime() {

    const phone =
        document.getElementById("equityAirtimeNumber").value.trim();

    const amount =
        Number(document.getElementById("equityAirtimeAmount").value);

    const pin =
        document.getElementById("equityAirtimePIN").value;

    if (phone === "") {

        alert("Enter phone number.");

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

    const fee = calculateFee("airtime", amount);

    const total = calculateTotal(amount, fee);

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "AIRTIME",

        sender: equityAccount.accountNumber,

        recipient: phone,

        amount,

        fee,

        total,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Airtime Purchase Successful",

        `${formatMoney(amount)} airtime purchased successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityAirtimeNumber").value = "";

    document.getElementById("equityAirtimeAmount").value = "";

    document.getElementById("equityAirtimePIN").value = "";

    showScreen("kcbReceipt");

}
/* ==========================================
   AIRTIME HISTORY
========================================== */

function loadEquityAirtimeHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "AIRTIME");

}

/* ==========================================
   QUICK AMOUNTS
========================================== */

function quickEquityAirtime(amount) {

    const amountInput =
        document.getElementById("equityAirtimeAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   SAVED NUMBERS
========================================== */

let equityAirtimeContacts = [];

function loadEquityAirtimeContacts() {

    const saved =
        localStorage.getItem("equityAirtimeContacts");

    equityAirtimeContacts =
        saved ? JSON.parse(saved) : [];

}

function saveEquityAirtimeContacts() {

    localStorage.setItem(

        "equityAirtimeContacts",

        JSON.stringify(equityAirtimeContacts)

    );

}

function addEquityAirtimeContact(name, phone) {

    equityAirtimeContacts.push({

        name,

        phone

    });

    saveEquityAirtimeContacts();

}

/* ==========================================
   BUY FOR SELF
========================================== */

function buyAirtimeForSelf() {

    const phoneInput =
        document.getElementById("equityAirtimeNumber");

    if (!phoneInput) return;

    const userPhone =
        localStorage.getItem("userPhone") || "";

    phoneInput.value = userPhone;

}

/* ==========================================
   VERIFY PHONE
========================================== */

function verifyEquityPhone(phone) {

    if (!phone || phone.length < 10) {

        alert("Invalid phone number.");

        return false;

    }

    return true;

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityAirtime() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Airtime Updated",

        "Airtime purchase history refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityAirtimeHistory = loadEquityAirtimeHistory;
window.quickEquityAirtime = quickEquityAirtime;
window.loadEquityAirtimeContacts = loadEquityAirtimeContacts;
window.saveEquityAirtimeContacts = saveEquityAirtimeContacts;
window.addEquityAirtimeContact = addEquityAirtimeContact;
window.buyAirtimeForSelf = buyAirtimeForSelf;
window.verifyEquityPhone = verifyEquityPhone;
window.refreshEquityAirtime = refreshEquityAirtime;