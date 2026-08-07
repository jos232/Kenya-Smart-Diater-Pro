/* ==========================================
   KENYA SMART DIALER PRO
   dashboard.js
========================================== */

"use strict";

/* ==========================================
   LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const contacts = getContacts() || [];
        const recentCalls = getRecentCalls() || [];

        updateStatistics(contacts, recentCalls);

        updateDashboardActivity(recentCalls);

        renderFavoriteContacts();

        await loadAirtimeDashboard();

        await loadBundleDashboard();

        await loadVoiceDashboard();

        await loadSMSDashboard();

        updateTelecomDashboard();

    }

    catch (error) {

        console.error("Dashboard:", error);

    }

}

/* ==========================================
   AIRTIME CARD
========================================== */

async function loadAirtimeDashboard() {

    try {

        const result = await apiGet("/airtime");

        const history = result.history || result || [];

        const total = Array.isArray(history)

            ? history.reduce((sum, item) => {

                return sum + Number(item.amount || 0);

            }, 0)

            : 0;

        const card = document.getElementById("dashboardAirtime");

        if (card) {

            card.textContent = `KSh ${total}`;

        }

    }

    catch (error) {

        console.error("Airtime:", error);

    }

}

/* ==========================================
   DATA CARD
========================================== */

async function loadBundleDashboard() {

    try {

        const result = await apiGet("/bundles");

        const history = result.history || [];

        let totalMB = 0;

        if (Array.isArray(history)) {

            history.forEach(bundle => {

                totalMB += Number(bundle.quantity || 0);

            });

        }

        const card = document.getElementById("dashboardData");

        if (card) {

            card.textContent = totalMB + " MB";

        }

    }

    catch (error) {

        console.error("Bundles:", error);

    }

}

/* ==========================================
   LOAD VOICE DASHBOARD
========================================== */

async function loadVoiceDashboard() {

    try {

        const result = await apiGet("/voice");

        console.log("VOICE API RESULT:", result);

        const history = result.history || [];

        console.log("VOICE HISTORY:", history);

        let totalMinutes = 0;

        history.forEach(item => {

            console.log("VOICE ITEM:", item);

            totalMinutes += Number(item.minutes || 0);

        });

        console.log("TOTAL MINUTES:", totalMinutes);

        const card = document.getElementById("dashboardVoice");

        if (card) {

            card.textContent = totalMinutes + " Min";

        }

    }

    catch (error) {

        console.error("Voice Dashboard:", error);

    }

}

/* ==========================================
   SMS CARD
========================================== */

async function loadSMSDashboard() {

    try {

        const result = await apiGet("/sms");

        const history = result.history || result || [];

        let totalSMS = 0;

        if (Array.isArray(history)) {

            history.forEach(item => {

                totalSMS += Number(item.sms || 0);

            });

        }

        const card = document.getElementById("dashboardSMS");

        if (card) {

            card.textContent = totalSMS + " SMS";

        }

    }

    catch (error) {

        console.error("SMS:", error);

    }

}

/* ==========================================
   DASHBOARD STATISTICS
========================================== */

function updateStatistics(contacts = [], recentCalls = []) {

    const totalContacts =
        document.getElementById("totalContacts");

    const totalCalls =
        document.getElementById("totalCalls");

    const safaricom =
        document.getElementById("safaricomCount");

    const airtel =
        document.getElementById("airtelCount");

    if (totalContacts)
        totalContacts.textContent = contacts.length;

    if (totalCalls)
        totalCalls.textContent = recentCalls.length;

    if (safaricom) {

        safaricom.textContent = contacts.filter(c =>
            c.network === "Safaricom"
        ).length;

    }

    if (airtel) {

        airtel.textContent = contacts.filter(c =>
            c.network === "Airtel"
        ).length;

    }

}

/* ==========================================
   RECENT ACTIVITY
========================================== */

function updateDashboardActivity(recentCalls = []) {

    const container =
        document.getElementById("dashboardActivity");

    if (!container) return;

    if (recentCalls.length === 0) {

        container.innerHTML = `

            <p class="empty-text">

                No recent activity

            </p>

        `;

        return;

    }

    container.innerHTML = "";

    recentCalls.slice(0, 5).forEach(call => {

        container.innerHTML += `

            <div class="activity-item">

                <strong>${call.name || call.phone}</strong>

                <span>${call.network || "Unknown"}</span>

            </div>

        `;

    });

}
/* ==========================================
   FAVORITE CONTACTS
========================================== */

function renderFavoriteContacts() {

    const container = document.getElementById("favoriteContacts");

    if (!container) return;

    const contacts = getContacts() || [];

    const favorites = contacts.filter(c => c.favorite);

    if (favorites.length === 0) {

        container.innerHTML = `
            <p class="empty-text">
                No favorite contacts
            </p>
        `;

        return;

    }

    container.innerHTML = "";

    favorites.slice(0, 6).forEach(contact => {

        const initials = contact.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        container.innerHTML += `

            <div class="favorite-card"
                 onclick="callFavorite('${contact.phone}')">

                <div class="favorite-avatar">

                    ${contact.photo
                ? `<img src="${contact.photo}" class="contact-photo">`
                : initials}

                </div>

                <div class="favorite-name">

                    ${contact.name}

                </div>

            </div>

        `;

    });

}

/* ==========================================
   CALL FAVORITE
========================================== */

function callFavorite(number) {

    const input = document.getElementById("phoneNumber");

    if (!input) return;

    input.value = number;

    if (typeof detectNetwork === "function") {

        detectNetwork(number);

    }

    if (typeof showScreen === "function") {

        showScreen("dialer");

    }

}

/* ==========================================
   TELECOM DASHBOARD
========================================== */

function updateTelecomDashboard() {

    if (typeof Telecom === "undefined") return;

    const airtime =
        document.getElementById("telecomAirtime");

    const data =
        document.getElementById("telecomData");

    const voice =
        document.getElementById("telecomVoice");

    const sms =
        document.getElementById("telecomSMS");

    if (airtime)
        airtime.textContent =
            formatMoney(Telecom.airtime || 0);

    if (data)
        data.textContent =
            (Telecom.data || 0) + " MB";

    if (voice)
        voice.textContent =
            (Telecom.voice || 0) + " Min";

    if (sms)
        sms.textContent =
            (Telecom.sms || 0) + " SMS";

}

/* ==========================================
   QUICK ACTIONS
========================================== */

function dashboardBuyAirtime() {

    showScreen("airtime");

}

function dashboardBuyBundles() {

    showScreen("bundles");

}

function dashboardBuyVoice() {

    showScreen("voice");

}

function dashboardBuySMS() {

    showScreen("sms");

}

/* ==========================================
   REFRESH CARDS
========================================== */

async function refreshDashboardCards() {

    await loadAirtimeDashboard();

    await loadBundleDashboard();

    await loadVoiceDashboard();

    await loadSMSDashboard();

    updateTelecomDashboard();

}
/* ==========================================
   REFRESH DASHBOARD
========================================== */

async function refreshDashboard() {

    try {

        await loadDashboard();

        refreshDashboardCards();

    }

    catch (error) {

        console.error("Dashboard Refresh:", error);

    }

}

/* ==========================================
   REFRESH ENTIRE APP
========================================== */

async function refreshApp() {

    try {


        if (typeof loadContacts === "function") {

            await loadContacts();

        }

        await loadDashboard();

    }

    catch (error) {

        console.error("App Refresh:", error);

    }

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    console.log("✅ Dashboard Initialized");

    await refreshApp();

});

/* ==========================================
   EXPORTS
========================================== */

window.loadDashboard = loadDashboard;

window.refreshDashboard = refreshDashboard;

window.refreshDashboardCards = refreshDashboardCards;

window.refreshApp = refreshApp;

window.updateStatistics = updateStatistics;

window.updateDashboardActivity = updateDashboardActivity;

window.renderFavoriteContacts = renderFavoriteContacts;

window.callFavorite = callFavorite;

window.updateTelecomDashboard = updateTelecomDashboard;

window.dashboardBuyAirtime = dashboardBuyAirtime;

window.dashboardBuyBundles = dashboardBuyBundles;

window.dashboardBuyVoice = dashboardBuyVoice;

window.dashboardBuySMS = dashboardBuySMS;