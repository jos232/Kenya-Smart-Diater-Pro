/* ==========================================
   KCB MOBILE BANKING
   AIRTIME
========================================== */

"use strict";

/* ==========================
   OPEN AIRTIME
========================== */

function openAirtime() {

    showScreen("kcbAirtime");

}

/* ==========================
   BUY AIRTIME
========================== */

function submitAirtime() {

    const phone =
        document.getElementById("airtimePhone").value.trim();

    const amount =
        Number(document.getElementById("airtimeAmount").value);

    const pin =
        document.getElementById("airtimePIN").value;

    if (phone === "") {

        alert("Enter phone number.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid amount.");

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

    if (total > kcbAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    // Deduct Account Balance

    kcbAccount.balance -= total;

    updateKCBBalance();

    // Create Transaction

    const transaction = createTransaction({

        bank: "KCB",

        service: "AIRTIME",

        sender: kcbAccount.accountNumber,

        recipient: phone,

        amount: amount,

        fee: fee,

        total: total,

        balance: kcbAccount.balance

    });

    // Save Transaction

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Airtime Purchase",

        `${formatMoney(amount)} airtime purchased for ${phone}.`

    );

    loadKCBRecentTransactions();

    // Clear Form

    document.getElementById("airtimePhone").value = "";

    document.getElementById("airtimeAmount").value = "";

    document.getElementById("airtimePIN").value = "";

    // Open Receipt

    showScreen("kcbReceipt");

}
/* ==========================================
   AIRTIME HISTORY
========================================== */

function loadKCBAirtimeHistory() {

    return getBankStatements("KCB")

        .filter(item => item.service === "AIRTIME");

}

/* ==========================================
   QUICK AMOUNTS
========================================== */

function quickAirtime(amount) {

    const amountInput =
        document.getElementById("airtimeAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   SAVED CONTACTS
========================================== */

let kcbAirtimeContacts = [];

function loadKCBAirtimeContacts() {

    const saved =
        localStorage.getItem("kcbAirtimeContacts");

    kcbAirtimeContacts =
        saved ? JSON.parse(saved) : [];

}

function saveKCBAirtimeContacts() {

    localStorage.setItem(

        "kcbAirtimeContacts",

        JSON.stringify(kcbAirtimeContacts)

    );

}

function addKCBAirtimeContact(name, phone) {

    kcbAirtimeContacts.push({

        name,

        phone

    });

    saveKCBAirtimeContacts();

}

/* ==========================================
   BUY FOR SELF
========================================== */

function buyAirtimeForSelf() {

    const phoneInput =
        document.getElementById("airtimePhone");

    if (!phoneInput) return;

    const userPhone =
        localStorage.getItem("userPhone") || "";

    phoneInput.value = userPhone;

}

/* ==========================================
   VERIFY PHONE
========================================== */

function verifyAirtimePhone(phone) {

    if (!phone || phone.length < 10) {

        alert("Invalid phone number.");

        return false;

    }

    return true;

}

/* ==========================================
   POPULAR AMOUNTS
========================================== */

function showPopularAirtime() {

    alert(

        "Popular Airtime\n\n" +

        "KSh 20\n" +

        "KSh 50\n" +

        "KSh 100\n" +

        "KSh 500"

    );

}

/* ==========================================
   REFRESH
========================================== */

function refreshKCBAirtime() {

    loadKCBRecentTransactions();

    addBankNotification(

        "Airtime Updated",

        "Airtime history refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadKCBAirtimeHistory = loadKCBAirtimeHistory;
window.quickAirtime = quickAirtime;
window.loadKCBAirtimeContacts = loadKCBAirtimeContacts;
window.saveKCBAirtimeContacts = saveKCBAirtimeContacts;
window.addKCBAirtimeContact = addKCBAirtimeContact;
window.buyAirtimeForSelf = buyAirtimeForSelf;
window.verifyAirtimePhone = verifyAirtimePhone;
window.showPopularAirtime = showPopularAirtime;
window.refreshKCBAirtime = refreshKCBAirtime;