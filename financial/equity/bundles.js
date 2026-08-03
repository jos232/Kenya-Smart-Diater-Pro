/* ==========================================
   EQUITY MOBILE BANKING
   BUNDLES
========================================== */

"use strict";

/* ==========================
   OPEN BUNDLES
========================== */

function openEquityBundles() {

    showScreen("equityBundles");

}

/* ==========================
   BUY BUNDLE
========================== */

function submitEquityBundle() {

    const phone =
        document.getElementById("equityBundleNumber").value.trim();

    const bundle =
        document.getElementById("equityBundlePackage").value;

    const amount =
        Number(document.getElementById("equityBundleAmount").value);

    const pin =
        document.getElementById("equityBundlePIN").value;

    if (phone === "") {

        alert("Enter phone number.");

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
        calculateFee("bundles", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "DATA BUNDLE",

        sender: equityAccount.accountNumber,

        recipient: phone,

        amount,

        fee,

        total,

        balance: equityAccount.balance,

        bundle

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bundle Purchase Successful",

        `${bundle} purchased successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityBundleNumber").value = "";

    document.getElementById("equityBundleAmount").value = "";

    document.getElementById("equityBundlePIN").value = "";

    document.getElementById("equityBundlePackage").selectedIndex = 0;

    showScreen("kcbReceipt");

}
/* ==========================================
   BUNDLE HISTORY
========================================== */

function loadEquityBundleHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "DATA BUNDLE");

}

/* ==========================================
   QUICK BUNDLE AMOUNTS
========================================== */

function quickEquityBundle(amount) {

    const amountInput =
        document.getElementById("equityBundleAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   SAVED NUMBERS
========================================== */

let equityBundleContacts = [];

function loadEquityBundleContacts() {

    const saved =
        localStorage.getItem("equityBundleContacts");

    equityBundleContacts =
        saved ? JSON.parse(saved) : [];

}

function saveEquityBundleContacts() {

    localStorage.setItem(

        "equityBundleContacts",

        JSON.stringify(equityBundleContacts)

    );

}

function addEquityBundleContact(name, phone) {

    equityBundleContacts.push({

        name,

        phone

    });

    saveEquityBundleContacts();

}

/* ==========================================
   BUY FOR SELF
========================================== */

function buyBundleForSelf() {

    const phoneInput =
        document.getElementById("equityBundleNumber");

    if (!phoneInput) return;

    const userPhone =
        localStorage.getItem("userPhone") || "";

    phoneInput.value = userPhone;

}

/* ==========================================
   POPULAR PACKAGES
========================================== */

function showPopularBundles() {

    alert(

        "Popular Bundles\n\n" +

        "• Daily 1GB\n" +

        "• Weekly 5GB\n" +

        "• Monthly 10GB\n" +

        "• Unlimited"

    );

}

/* ==========================================
   VERIFY PHONE
========================================== */

function verifyBundlePhone(phone) {

    if (!phone || phone.length < 10) {

        alert("Invalid phone number.");

        return false;

    }

    return true;

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityBundles() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Bundles Updated",

        "Bundle purchase history refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityBundleHistory = loadEquityBundleHistory;
window.quickEquityBundle = quickEquityBundle;
window.loadEquityBundleContacts = loadEquityBundleContacts;
window.saveEquityBundleContacts = saveEquityBundleContacts;
window.addEquityBundleContact = addEquityBundleContact;
window.buyBundleForSelf = buyBundleForSelf;
window.showPopularBundles = showPopularBundles;
window.verifyBundlePhone = verifyBundlePhone;
window.refreshEquityBundles = refreshEquityBundles;