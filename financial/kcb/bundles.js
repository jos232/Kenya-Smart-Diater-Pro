/* ==========================================
   KCB MOBILE BANKING
   DATA BUNDLES
========================================== */

"use strict";

/* ==========================
   OPEN BUNDLES
========================== */

function openBundles() {

    showScreen("kcbBundles");

}

/* ==========================
   BUY DATA BUNDLE
========================== */

function submitBundles() {

    const phone =
        document.getElementById("bundlePhone").value.trim();

    const amount =
        Number(document.getElementById("bundlePackage").value);

    const pin =
        document.getElementById("bundlePIN").value;

    if (phone === "") {

        alert("Enter phone number.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("bundles", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > kcbAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    // Deduct account balance
    kcbAccount.balance -= total;

    updateKCBBalance();

    // Create transaction
    const transaction = createTransaction({

        bank: "KCB",

        service: "BUNDLES",

        sender: kcbAccount.accountNumber,

        recipient: phone,

        amount: amount,

        fee: fee,

        total: total,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bundle Purchase",

        `Bundle worth ${formatMoney(amount)} purchased for ${phone}.`

    );

    loadKCBRecentTransactions();

    // Clear form
    document.getElementById("bundlePhone").value = "";

    document.getElementById("bundlePIN").value = "";

    document.getElementById("bundlePackage").selectedIndex = 0;

    // Show receipt
    showScreen("kcbReceipt");

}
/* ==========================================
   BUNDLE HISTORY
========================================== */

function loadKCBBundleHistory() {

    return getBankStatements("KCB")

        .filter(item => item.service === "BUNDLES");

}

/* ==========================================
   SAVED BUNDLE CONTACTS
========================================== */

let kcbBundleContacts = [];

function loadKCBBundleContacts() {

    const saved = localStorage.getItem("kcbBundleContacts");

    kcbBundleContacts = saved ? JSON.parse(saved) : [];

}

function saveKCBBundleContacts() {

    localStorage.setItem(

        "kcbBundleContacts",

        JSON.stringify(kcbBundleContacts)

    );

}

function addKCBBundleContact(name, phone) {

    kcbBundleContacts.push({

        name,

        phone

    });

    saveKCBBundleContacts();

}

/* ==========================================
   BUY FOR SELF
========================================== */

function buyBundleForSelf() {

    const phone = localStorage.getItem("userPhone") || "";

    const input = document.getElementById("bundlePhone");

    if (input) {

        input.value = phone;

    }

}

/* ==========================================
   VERIFY NUMBER
========================================== */

function verifyBundlePhone(phone) {

    if (!phone || phone.length < 10) {

        alert("Invalid phone number.");

        return false;

    }

    return true;

}

/* ==========================================
   POPULAR BUNDLES
========================================== */

function showPopularBundles() {

    alert(

        "Popular Bundles\n\n" +

        "1GB - KSh 99\n" +

        "2GB - KSh 199\n" +

        "5GB - KSh 499\n" +

        "10GB - KSh 999"

    );

}

/* ==========================================
   QUICK PACKAGE
========================================== */

function selectBundlePackage(value) {

    const select = document.getElementById("bundlePackage");

    if (select) {

        select.value = value;

    }

}

/* ==========================================
   REFRESH
========================================== */

function refreshBundles() {

    loadKCBRecentTransactions();

    addBankNotification(

        "Bundles Updated",

        "Bundle history refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadKCBBundleHistory = loadKCBBundleHistory;
window.loadKCBBundleContacts = loadKCBBundleContacts;
window.saveKCBBundleContacts = saveKCBBundleContacts;
window.addKCBBundleContact = addKCBBundleContact;
window.buyBundleForSelf = buyBundleForSelf;
window.verifyBundlePhone = verifyBundlePhone;
window.showPopularBundles = showPopularBundles;
window.selectBundlePackage = selectBundlePackage;
window.refreshBundles = refreshBundles;