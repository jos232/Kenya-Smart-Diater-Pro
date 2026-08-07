/* ==========================================
   CO-OPERATIVE BANK
   BUNDLES
========================================== */

"use strict";

/* ==========================
   OPEN BUNDLES
========================== */

function openCoopBundles() {

    showScreen("coopBundles");

}

/* ==========================
   BUY BUNDLE
========================== */

function submitCoopBundle() {

    const phone =
        document.getElementById("coopBundleNumber").value.trim();

    const bundle =
        document.getElementById("coopBundlePackage").value;

    const amount =
        Number(document.getElementById("coopBundleAmount").value);

    const pin =
        document.getElementById("coopBundlePIN").value;

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
        calculateFee("bundles", amount);

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

        service: "DATA BUNDLE",

        sender: coopAccount.accountNumber,

        recipient: phone,

        amount,

        fee,

        total,

        balance: coopAccount.balance,

        bundle

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bundle Purchase Successful",

        `${bundle} purchased successfully.`

    );

    addCoopBundleContact(phone);

    loadCoopRecentTransactions();

    loadCoopBundleHistory();

    document.getElementById("coopBundleNumber").value = "";

    document.getElementById("coopBundleAmount").value = "";

    document.getElementById("coopBundlePIN").value = "";

    document.getElementById("coopBundlePackage").selectedIndex = 0;

    showScreen("kcbReceipt");

}

/* ==========================
   BUY FOR SELF
========================== */

function buyCoopBundleForSelf() {

    const phone =
        localStorage.getItem("userPhone");

    if (phone) {

        document.getElementById("coopBundleNumber").value =
            phone;

    }

}

/* ==========================
   VERIFY PHONE
========================== */

function verifyCoopBundlePhone() {

    const phone =
        document.getElementById("coopBundleNumber").value.trim();

    if (!phone) return;

    detectNetwork(phone);

}

/* ==========================
   QUICK PACKAGES
========================== */

function showPopularCoopBundles() {

    return [

        {

            name: "Daily 1GB",

            amount: 99

        },

        {

            name: "Weekly 7GB",

            amount: 299

        },

        {

            name: "Monthly 15GB",

            amount: 999

        },

        {

            name: "Monthly 25GB",

            amount: 1499

        },

        {

            name: "Monthly Unlimited",

            amount: 2999

        }

    ];

}

function selectCoopBundlePackage(packageName, amount) {

    document.getElementById("coopBundlePackage").value =
        packageName;

    document.getElementById("coopBundleAmount").value =
        amount;

}

/* ==========================
   HISTORY
========================== */

function loadCoopBundleHistory() {

    if (typeof getBankTransactions === "function") {

        return getBankTransactions(

            "CO-OP",

            "DATA BUNDLE"

        );

    }

    return [];

}

/* ==========================
   SAVED NUMBERS
========================== */

function loadCoopBundleContacts() {

    return JSON.parse(

        localStorage.getItem(

            "coop_bundle_contacts"

        ) || "[]"

    );

}

function saveCoopBundleContacts(list) {

    localStorage.setItem(

        "coop_bundle_contacts",

        JSON.stringify(list)

    );

}

function addCoopBundleContact(phone) {

    const contacts =
        loadCoopBundleContacts();

    if (!contacts.includes(phone)) {

        contacts.unshift(phone);

        saveCoopBundleContacts(

            contacts.slice(0, 20)

        );

    }

}

/* ==========================
   REFRESH
========================== */

function refreshCoopBundles() {

    document.getElementById("coopBundleNumber").value = "";

    document.getElementById("coopBundleAmount").value = "";

    document.getElementById("coopBundlePIN").value = "";

    document.getElementById("coopBundlePackage").selectedIndex = 0;

    loadCoopBundleHistory();

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopBundles = openCoopBundles;

window.submitCoopBundle = submitCoopBundle;

window.loadCoopBundleHistory = loadCoopBundleHistory;

window.loadCoopBundleContacts = loadCoopBundleContacts;

window.saveCoopBundleContacts = saveCoopBundleContacts;

window.addCoopBundleContact = addCoopBundleContact;

window.buyCoopBundleForSelf = buyCoopBundleForSelf;

window.verifyCoopBundlePhone = verifyCoopBundlePhone;

window.showPopularCoopBundles = showPopularCoopBundles;

window.selectCoopBundlePackage = selectCoopBundlePackage;

window.refreshCoopBundles = refreshCoopBundles;