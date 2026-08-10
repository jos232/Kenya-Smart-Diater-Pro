/* ==========================================
   KENYA SMART DIALER PRO
   subscriptions.js
========================================== */

"use strict";

/* ==========================================
   SELECTED SUBSCRIPTION
========================================== */

let selectedSubscription = null;

/* ==========================================
   SUBSCRIPTION DATABASE
========================================== */

const SubscriptionPlans = [

    {
        name: "Daily Combo",

        price: 99,

        validity: "1 Day",

        airtime: 0,

        data: 2048,

        voice: 30,

        sms: 100
    },

    {
        name: "Weekly Combo",

        price: 499,

        validity: "7 Days",

        airtime: 0,

        data: 10240,

        voice: 200,

        sms: 500
    },

    {
        name: "Monthly Combo",

        price: 999,

        validity: "30 Days",

        airtime: 0,

        data: 20480,

        voice: 1000,

        sms: 3000
    },

    {
        name: "Premium Unlimited",

        price: 2999,

        validity: "30 Days",

        airtime: 0,

        data: 999999,

        voice: 999999,

        sms: 999999
    }

];
/* ==========================================
   RENDER PLANS
========================================== */

function renderSubscriptionPlans() {

    const container = document.getElementById("subscriptionPlans");

    if (!container) return;

    container.innerHTML = "";

    SubscriptionPlans.forEach(plan => {

        container.innerHTML += `

            <button
                class="bundle-offer"
                onclick="selectSubscription('${plan.name}')"
            >

                <h3>${plan.name}</h3>

                <strong>KSh ${plan.price}</strong>

                <small>${plan.validity}</small>

            </button>

        `;

    });

}
/* ==========================================
   SELECT SUBSCRIPTION
========================================== */

function selectSubscription(name) {

    selectedSubscription = SubscriptionPlans.find(

        p => p.name === name

    );

    if (!selectedSubscription) return;

    document.getElementById(

        "subscriptionName"

    ).textContent = selectedSubscription.name;

    document.getElementById(

        "subscriptionPrice"

    ).textContent = "KSh " + selectedSubscription.price;

    document.getElementById(

        "subscriptionValidity"

    ).textContent = selectedSubscription.validity;

}

/* ==========================================
   ACTIVATE SUBSCRIPTION
========================================== */

async function activateSubscription() {

    /* -------------------------
       CHECK PLAN
    ------------------------- */

    if (!selectedSubscription) {

        alert("Please select a subscription plan.");

        return;

    }

    try {

        /* -------------------------
           SAVE TO BACKEND
        ------------------------- */

        const result = await apiPost("/subscriptions", {

            name: selectedSubscription.name,

            price: selectedSubscription.price,

            validity: selectedSubscription.validity,

            data: selectedSubscription.data,

            voice: selectedSubscription.voice,

            sms: selectedSubscription.sms,

            airtime: selectedSubscription.airtime || 0,

            paymentMethod: "Wallet"

        });

        console.log(
            "SUBSCRIPTION PURCHASE RESULT:",
            result
        );

        if (!result.success) {

            showToast(
                result.message || "Subscription failed.",
                "error"
            );

            return;

        }

        /* -------------------------
           UPDATE TELECOM BALANCES
        ------------------------- */

        Telecom.data =
            (Telecom.data || 0) +
            Number(selectedSubscription.data || 0);

        Telecom.voice =
            (Telecom.voice || 0) +
            Number(selectedSubscription.voice || 0);

        Telecom.sms =
            (Telecom.sms || 0) +
            Number(selectedSubscription.sms || 0);

        Telecom.save();

        /* -------------------------
           LOCAL ACTIVE SUBSCRIPTION
        ------------------------- */

        localStorage.setItem(
            "activeSubscription",
            JSON.stringify({

                name: selectedSubscription.name,

                expiry: selectedSubscription.validity,

                activated:
                    new Date().toLocaleString()

            })
        );

        /* -------------------------
           LOCAL HISTORY
        ------------------------- */

        saveSubscriptionHistory(
            selectedSubscription
        );

        /* -------------------------
           REFRESH DASHBOARD
        ------------------------- */

        await refreshApp();

        /* -------------------------
           REFRESH SUBSCRIPTION UI
        ------------------------- */

        renderSubscriptionHistory();

        loadActiveSubscription();

        /* -------------------------
           SUCCESS
        ------------------------- */

        showToast(
            "⭐ " +
            selectedSubscription.name +
            " Activated"
        );

        /* -------------------------
           RESET
        ------------------------- */

        selectedSubscription = null;

    }

    catch (error) {

        console.error(
            "Subscription Purchase:",
            error
        );

        showToast(
            error.message ||
            "Unable to activate subscription.",
            "error"
        );

    }

}
/* ==========================================
   SAVE SUBSCRIPTION HISTORY
========================================== */

function saveSubscriptionHistory(plan) {

    const history = JSON.parse(

        localStorage.getItem("subscriptionHistory")

    ) || [];

    history.unshift({

        name: plan.name,

        price: plan.price,

        validity: plan.validity,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(

        "subscriptionHistory",

        JSON.stringify(history)

    );

}
/* ==========================================
   ACTIVE SUBSCRIPTION
========================================== */

function loadActiveSubscription() {

    const active = JSON.parse(

        localStorage.getItem("activeSubscription")

    );

    if (!active) return;

    document.getElementById(

        "activeSubscription"

    ).textContent = active.name;

    document.getElementById(

        "subscriptionExpiry"

    ).textContent =

        "Valid for " + active.expiry;

}
/* ==========================================
   SUBSCRIPTION HISTORY
========================================== */

function renderSubscriptionHistory() {

    const container =

        document.getElementById("subscriptionHistory");

    if (!container) return;

    const history = JSON.parse(

        localStorage.getItem("subscriptionHistory")

    ) || [];

    if (history.length === 0) {

        container.innerHTML =

            "<p class='empty-text'>No subscriptions yet.</p>";

        return;

    }

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `

            <div class="history-item">

                <strong>${item.name}</strong>

                <span>KSh ${item.price}</span>

                <small>${item.validity}</small>

                <small>${item.date}</small>

            </div>

        `;

    });

}
/* ==========================================
   CLEAR HISTORY
========================================== */

function clearSubscriptionHistory() {

    localStorage.removeItem("subscriptionHistory");

    renderSubscriptionHistory();

    showToast("Subscription history cleared.");

}
/* ==========================================
   INITIALIZE
========================================== */
document.addEventListener("DOMContentLoaded", () => {

    renderSubscriptionPlans();

    renderSubscriptionHistory();

    loadActiveSubscription();

});
/* ==========================================
   LOAD SUBSCRIPTION DASHBOARD
========================================== */

async function loadSubscriptionDashboard() {

    try {

        /* ==========================
           LOAD HISTORY
        ========================== */

        const historyResult =
            await apiGet("/subscriptions");

        console.log(
            "SUBSCRIPTION HISTORY API:",
            historyResult
        );

        const history =
            historyResult.history || [];


        /* ==========================
           LOAD ACTIVE SUBSCRIPTION
        ========================== */

        const activeResult =
            await apiGet("/subscriptions/active");

        console.log(
            "ACTIVE SUBSCRIPTION API:",
            activeResult
        );

        const active =
            activeResult.active
                ? activeResult.subscription
                : null;


        /* ==========================
           ACTIVE PLAN
        ========================== */

        const activeName =
            document.getElementById(
                "activeSubscription"
            );

        const expiry =
            document.getElementById(
                "subscriptionExpiry"
            );


        if (active) {

            if (activeName) {

                activeName.textContent =
                    active.name;

            }

            if (expiry) {

                expiry.textContent =
                    "Valid until " +
                    new Date(
                        active.expiresAt
                    ).toLocaleString();

            }

        }

        else {

            if (activeName) {

                activeName.textContent =
                    "No Active Subscription";

            }

            if (expiry) {

                expiry.textContent =
                    "No active plan";

            }

        }


        /* ==========================
           RENDER HISTORY
        ========================== */

        renderSubscriptionHistoryFromBackend(
            history
        );


        /* ==========================
           UPDATE ACTIVE COUNT
        ========================== */

        const dashboardSubscriptions =
            document.getElementById(
                "dashboardSubscriptions"
            );

        const activeCount =
            active ? 1 : 0;

        console.log(
            "ACTIVE SUBSCRIPTION COUNT:",
            activeCount
        );

        if (dashboardSubscriptions) {

            dashboardSubscriptions.textContent =
                activeCount + " Active";

        }

    }

    catch (error) {

        console.error(
            "Subscription Dashboard:",
            error
        );

    }

}
/* ==========================================
   RENDER BACKEND SUBSCRIPTION HISTORY
========================================== */

function renderSubscriptionHistoryFromBackend(
    history = []
) {

    const container =
        document.getElementById(
            "subscriptionHistory"
        );

    if (!container) return;

    if (!history.length) {

        container.innerHTML =
            "<p class='empty-text'>No subscriptions yet.</p>";

        return;

    }

    container.innerHTML = "";

    history.forEach(item => {

        const date = item.createdAt
            ? new Date(
                item.createdAt
            ).toLocaleString()
            : "--";

        container.innerHTML += `

            <div class="history-item">

                <strong>
                    ${item.planName || item.name}
                </strong>

                <span>
                    KSh ${item.price}
                </span>

                <small>
                    ${item.validity || "--"}
                </small>

                <small>
                    ${date}
                </small>

            </div>

        `;

    });

}