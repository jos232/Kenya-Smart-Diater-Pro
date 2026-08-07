/* ==========================================
   CO-OPERATIVE BANK
   AIRTIME
========================================== */

"use strict";

/* ==========================
   OPEN AIRTIME
========================== */

function openCoopAirtime() {

    showScreen("coopAirtime");

}

/* ==========================
   BUY AIRTIME
========================== */

function submitCoopAirtime() {

    const phone =
        document.getElementById("coopAirtimeNumber").value.trim();

    const amount =
        Number(document.getElementById("coopAirtimeAmount").value);

    const pin =
        document.getElementById("coopAirtimePIN").value;

    if (phone === "") {

        alert("Enter phone number.");

        return;

    }
    console.log("Phone before validation:", phone);

    const normalizedPhone = normalizeNumber(phone);

    console.log("Phone after normalization:", normalizedPhone);

    if (!isValidKenyanNumber(normalizedPhone)) {

        alert("Invalid phone: " + normalizedPhone);

        return;

    }


    if (amount <= 0) {

        alert("Enter valid amount.");

        return;

    }

    const verify =
        verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("airtime", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > coopAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    coopAccount.balance -= total;

    updateCoopBalance();

    const transaction = createTransaction({

        bank: "CO-OP",

        service: "AIRTIME",

        sender: coopAccount.accountNumber,

        recipient: phone,

        amount,

        fee,

        total,

        balance: coopAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Airtime Purchased",

        `${formatMoney(amount)} airtime sent to ${phone}.`

    );

    addCoopAirtimeContact(phone);

    loadCoopRecentTransactions();

    loadCoopAirtimeHistory();

    document.getElementById("coopAirtimeNumber").value = "";

    document.getElementById("coopAirtimeAmount").value = "";

    document.getElementById("coopAirtimePIN").value = "";

    showScreen("kcbReceipt");

}

/* ==========================
   BUY AIRTIME FOR SELF
========================== */

function buyCoopAirtimeForSelf() {

    const phone = localStorage.getItem("userPhone");

    if (phone) {

        document.getElementById("coopAirtimeNumber").value = phone;

    }

}

/* ==========================
   QUICK AMOUNTS
========================== */

function selectCoopAirtimeAmount(amount) {

    document.getElementById("coopAirtimeAmount").value = amount;

}

/* ==========================
   VERIFY PHONE
========================== */

function verifyCoopAirtimePhone() {

    const phone =
        document.getElementById("coopAirtimeNumber").value.trim();

    if (!phone) return;

    detectNetwork(phone);

}

/* ==========================
   POPULAR AMOUNTS
========================== */

function showPopularCoopAirtime() {

    return [

        10,

        20,

        50,

        100,

        200,

        500,

        1000

    ];

}

/* ==========================
   HISTORY
========================== */

function loadCoopAirtimeHistory() {

    if (typeof getBankTransactions === "function") {

        return getBankTransactions("CO-OP", "AIRTIME");

    }

    return [];

}

/* ==========================
   SAVED CONTACTS
========================== */

function loadCoopAirtimeContacts() {

    return JSON.parse(

        localStorage.getItem(

            "coop_airtime_contacts"

        ) || "[]"

    );

}

function saveCoopAirtimeContacts(contacts) {

    localStorage.setItem(

        "coop_airtime_contacts",

        JSON.stringify(contacts)

    );

}

function addCoopAirtimeContact(phone) {

    const contacts =
        loadCoopAirtimeContacts();

    if (!contacts.includes(phone)) {

        contacts.unshift(phone);

        saveCoopAirtimeContacts(

            contacts.slice(0, 20)

        );

    }

}

/* ==========================
   REFRESH
========================== */

function refreshCoopAirtime() {

    document.getElementById("coopAirtimeNumber").value = "";

    document.getElementById("coopAirtimeAmount").value = "";

    document.getElementById("coopAirtimePIN").value = "";

    loadCoopAirtimeHistory();

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopAirtime = openCoopAirtime;

window.submitCoopAirtime = submitCoopAirtime;

window.loadCoopAirtimeHistory = loadCoopAirtimeHistory;

window.loadCoopAirtimeContacts = loadCoopAirtimeContacts;

window.saveCoopAirtimeContacts = saveCoopAirtimeContacts;

window.addCoopAirtimeContact = addCoopAirtimeContact;

window.buyCoopAirtimeForSelf = buyCoopAirtimeForSelf;

window.selectCoopAirtimeAmount = selectCoopAirtimeAmount;

window.verifyCoopAirtimePhone = verifyCoopAirtimePhone;

window.showPopularCoopAirtime = showPopularCoopAirtime;

window.refreshCoopAirtime = refreshCoopAirtime;