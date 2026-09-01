/* ==========================================
   KENYA SMART DIALER PRO
   sms.js
========================================== */

"use strict";

/* ==========================================
   SELECTED SMS PACKAGE
========================================== */

let selectedSMSPackage = null;

let selectedSMSCategory = "Daily";

/* ==========================================
   SMS PACKAGE DATABASE
========================================== */

const SMSPackages = {

    Daily: [

        {
            name: "50 SMS",
            sms: 50,
            price: 20,
            expiry: "24 Hours"
        },

        {
            name: "100 SMS",
            sms: 100,
            price: 35,
            expiry: "24 Hours"
        },

        {
            name: "250 SMS",
            sms: 250,
            price: 50,
            expiry: "24 Hours"
        }

    ],

    Weekly: [

        {
            name: "500 SMS",
            sms: 500,
            price: 100,
            expiry: "7 Days"
        },

        {
            name: "1000 SMS",
            sms: 1000,
            price: 180,
            expiry: "7 Days"
        }

    ],

    Monthly: [

        {
            name: "3000 SMS",
            sms: 3000,
            price: 500,
            expiry: "30 Days"
        },

        {
            name: "Unlimited SMS",
            sms: 999999,
            price: 1000,
            expiry: "30 Days"
        }

    ]

};
/* ==========================================
   SELECT CATEGORY
========================================== */

function selectSMSCategory(category) {

    selectedSMSCategory = category;

    renderSMSPackages(category);

}
/* ==========================================
   RENDER SMS PACKAGES
========================================== */

function renderSMSPackages(category = "Daily") {

    const container = document.getElementById("smsOffers");

    if (!container) return;

    container.innerHTML = "";

    SMSPackages[category].forEach(pkg => {

        container.innerHTML += `

            <button

                class="bundle-offer"

                onclick="chooseSMSPackage(

                    '${pkg.name}',

                    ${pkg.sms},

                    ${pkg.price},

                    '${pkg.expiry}'

                )"

            >

                <h3>${pkg.name}</h3>

                <p>${pkg.sms} SMS</p>

                <strong>KSh ${pkg.price}</strong>

                <small>${pkg.expiry}</small>

            </button>

        `;

    });

}
/* ==========================================
   SELECT SMS PACKAGE
========================================== */

function chooseSMSPackage(

    name,

    sms,

    price,

    expiry

) {

    selectedSMSPackage = {

        name,

        sms,

        price,

        expiry

    };

    document.getElementById("smsSummaryPackage").textContent = name;

    document.getElementById("smsSummaryCount").textContent = sms + " SMS";

    document.getElementById("smsSummaryPrice").textContent = "KSh " + price;

}

/* ==========================================
   BUY SMS PACKAGE
========================================== */

async function buySMSPackage() {

    /* -------------------------
       CHECK PACKAGE
    ------------------------- */

    if (!selectedSMSPackage) {

        showToast(
            "Please select an SMS package.",
            "error"
        );

        return;

    }

    /* -------------------------
       GET PHONE NUMBER
    ------------------------- */

    const phoneInput =
        document.getElementById("smsNumber");

    if (!phoneInput) {

        showToast(
            "SMS phone number field not found.",
            "error"
        );

        return;

    }

    const phone =
        normalizeNumber(
            phoneInput.value.trim()
        );

    /* -------------------------
       VALIDATE PHONE
    ------------------------- */

    if (!isValidKenyanNumber(phone)) {

        showToast(
            "Please enter a valid Kenyan phone number.",
            "error"
        );

        return;

    }

    /* -------------------------
       DETECT NETWORK
    ------------------------- */

    const network = detectNetwork(phone);

    if (
        !network ||
        network === "Unknown Network" ||
        network === "Unknown"
    ) {

        showToast(
            "Unable to detect the mobile network.",
            "error"
        );

        return;

    }

    try {

        /* -------------------------
           SAVE TO BACKEND
        ------------------------- */

        const result = await apiPost("/sms", {

            phone: phone,

            network: network,

            packageName:
                selectedSMSPackage.name,

            sms:
                selectedSMSPackage.sms,

            price:
                selectedSMSPackage.price,

            paymentMethod: "Wallet"

        });

        /* -------------------------
           CHECK RESPONSE
        ------------------------- */

        if (!result.success) {

            showToast(
                result.message ||
                "SMS package purchase failed.",
                "error"
            );

            return;

        }

        /* -------------------------
           UPDATE LOCAL BALANCE
        ------------------------- */

        Telecom.sms =
            (Telecom.sms || 0) +
            Number(selectedSMSPackage.sms);

        Telecom.save();

        /* -------------------------
           SAVE LOCAL HISTORY
        ------------------------- */

        saveSMSPurchase(
            selectedSMSPackage
        );

        /* -------------------------
           REFRESH APP
        ------------------------- */

        if (
            typeof refreshApp === "function"
        ) {

            await refreshApp();

        }

        /* -------------------------
           REFRESH DASHBOARD
        ------------------------- */

        if (
            typeof refreshDashboardCards === "function"
        ) {

            await refreshDashboardCards();

        }

        if (
            typeof updateTelecomDashboard === "function"
        ) {

            updateTelecomDashboard();

        }

        /* -------------------------
           REFRESH HISTORY
        ------------------------- */

        renderSMSHistory();

        /* -------------------------
           RESET
        ------------------------- */

        phoneInput.value = "";

        selectedSMSPackage = null;

        const summaryPackage =
            document.getElementById(
                "smsSummaryPackage"
            );

        const summaryCount =
            document.getElementById(
                "smsSummaryCount"
            );

        const summaryPrice =
            document.getElementById(
                "smsSummaryPrice"
            );

        if (summaryPackage)
            summaryPackage.textContent = "--";

        if (summaryCount)
            summaryCount.textContent = "--";

        if (summaryPrice)
            summaryPrice.textContent = "--";

        /* -------------------------
           SUCCESS
        ------------------------- */

        showToast(
            " " +
            result.purchase.packageName +
            " activated successfully."
        );

    }

    catch (error) {

        console.error(
            "SMS Purchase:",
            error
        );

        showToast(

            error.message ||
            "Unable to activate SMS package.",

            "error"

        );

    }

}
/* ==========================================
   INITIALIZE
========================================== */
document.addEventListener("DOMContentLoaded", () => {

    renderSMSPackages("Daily");

    renderSMSHistory();

});
/* ==========================================
   SAVE SMS PURCHASE
========================================== */

function saveSMSPurchase(pkg) {

    const history = JSON.parse(

        localStorage.getItem("smsHistory")

    ) || [];

    history.unshift({

        name: pkg.name,

        sms: pkg.sms,

        price: pkg.price,

        expiry: pkg.expiry,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(

        "smsHistory",

        JSON.stringify(history)

    );

}
/* ==========================================
   SMS HISTORY
========================================== */

function renderSMSHistory() {

    const container = document.getElementById("smsHistory");

    if (!container) return;

    const history = JSON.parse(

        localStorage.getItem("smsHistory")

    ) || [];

    if (history.length === 0) {

        container.innerHTML =

            "<p class='empty-text'>No SMS purchases yet.</p>";

        return;

    }

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `

            <div class="history-item">

                <strong>${item.name}</strong>

                <span>${item.sms} SMS</span>

                <span>KSh ${item.price}</span>

                <small>${item.date}</small>

            </div>

        `;

    });

}
/* ==========================================
   CLEAR SMS HISTORY
========================================== */

function clearSMSHistory() {

    localStorage.removeItem("smsHistory");

    renderSMSHistory();

    showToast("SMS history cleared.");

}
/* ==========================================
   CONSUME SMS
========================================== */

function consumeSMS(count = 1) {

    Telecom.sms = Math.max(

        0,

        Telecom.sms - count

    );

    Telecom.save();

    if (Telecom.sms <= 10 && Telecom.sms > 0) {

        showToast("️ Low SMS Balance");

    }

    if (Telecom.sms === 0) {

        showToast(" SMS Balance Exhausted");

    }

    refreshApp();

}