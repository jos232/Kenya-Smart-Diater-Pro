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

function activateSubscription() {

    if (!selectedSubscription) {

        alert("Please select a subscription plan.");

        return;

    }

    // Credit Telecom Balances

    Telecom.data += selectedSubscription.data;

    Telecom.voice += selectedSubscription.voice;

    Telecom.sms += selectedSubscription.sms;

    Telecom.save();

    // Save Active Subscription

    localStorage.setItem(

        "activeSubscription",

        JSON.stringify({

            name: selectedSubscription.name,

            expiry: selectedSubscription.validity,

            activated: new Date().toLocaleString()

        })

    );

    // Save History

    saveSubscriptionHistory(selectedSubscription);

    refreshApp();

    renderSubscriptionHistory();

    loadActiveSubscription();

    showToast("⭐ Subscription Activated");

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