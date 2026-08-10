/* ==========================================
   KENYA SMART DIALER PRO
   app.js
========================================== */

"use strict";

/* ==========================================
   NAVIGATION
========================================== */

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");

function showScreen(screenId) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const screen = document.getElementById(screenId);

    if (screen) {
        screen.classList.add("active");
    }

    navButtons.forEach(button => {

        const click = button.getAttribute("onclick");

        if (click && click.includes(screenId)) {
            button.classList.add("active");
        }

    });

    switch (screenId) {

        case "history":

            if (typeof loadHistory === "function")
                loadHistory();

            break;

        case "contacts":

            if (typeof loadContacts === "function")
                loadContacts();

            break;

        case "speedDial":

            if (typeof renderSpeedDial === "function")
                renderSpeedDial();

            break;

    }

}

window.showScreen = showScreen;

/* ==========================================
   REFRESH APPLICATION
========================================== */

async function refreshApp() {

    try {

        if (typeof loadDashboard === "function")
            await loadDashboard();

        if (typeof loadContacts === "function")
            await loadContacts();

        if (typeof loadHistory === "function")
            await loadHistory();

        if (typeof renderAirtimeHistory === "function")
            renderAirtimeHistory();

        if (typeof renderBundleHistory === "function")
            renderBundleHistory();

        if (typeof loadSubscriptions === "function")
            loadSubscriptions();

        if (typeof updateTelecomDashboard === "function")
            updateTelecomDashboard();

        if (typeof updateBundleProgress === "function")
            updateBundleProgress();

    }

    catch (error) {

        console.error("Refresh App:", error);

    }

}

window.refreshApp = refreshApp;

/* ==========================================
   START APPLICATION
========================================== */

function startApplication() {

    console.log("🇰🇪 Kenya Smart Dialer Pro Started");

    if (typeof showLoader === "function") {
        showLoader("Loading Kenya Smart Dialer...");
    }

    setTimeout(async () => {

        if (typeof hideLoader === "function") {
            hideLoader();
        }

        await refreshApp();

        showScreen("dashboard");

        if (typeof showToast === "function") {
            showToast("Welcome to Kenya Smart Dialer Pro");
        }

    }, 500);

}

window.startApplication = startApplication;

/* ==========================================
   AUTH CHECK
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /*
       auth.js controls login.
       If a token exists we can safely
       start the application.
    */

    const token = localStorage.getItem("token");

    if (token) {

        startApplication();

    }

});

/* ==========================================
   NETWORK EVENTS
========================================== */

window.addEventListener("online", () => {

    if (typeof showToast === "function") {

        showToast("Internet Connected");

    }

});

window.addEventListener("offline", () => {

    if (typeof showToast === "function") {

        showToast("No Internet Connection", "error");

    }

});

/* ==========================================
   KEYBOARD SHORTCUTS
========================================== */

document.addEventListener("keydown", event => {

    if (!event.ctrlKey) return;

    switch (event.key) {

        case "1":
            showScreen("dashboard");
            break;

        case "2":
            showScreen("dialer");
            break;

        case "3":
            showScreen("contacts");
            break;

        case "4":
            showScreen("airtime");
            break;

        case "5":
            showScreen("bundles");
            break;

    }

});

/* ==========================================
   EXPORT BACKUP
========================================== */

function exportBackup() {

    const backup = {

        contacts: typeof getContacts === "function" ? getContacts() : [],
        recentCalls: typeof getRecentCalls === "function" ? getRecentCalls() : [],
        airtimeHistory: typeof getAirtimeHistory === "function" ? getAirtimeHistory() : [],
        bundleHistory: typeof getBundleHistory === "function" ? getBundleHistory() : [],
        subscriptions: typeof getSubscriptions === "function" ? getSubscriptions() : [],
        exported: new Date().toISOString()

    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "kenya-smart-dialer-backup.json";

    link.click();

}

window.exportBackup = exportBackup;

/* ==========================================
   IMPORT BACKUP
========================================== */

function importBackup(file) {

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const data = JSON.parse(event.target.result);

            if (data.contacts && typeof saveContacts === "function")
                saveContacts(data.contacts);

            if (data.recentCalls && typeof saveRecentCalls === "function")
                saveRecentCalls(data.recentCalls);

            if (data.airtimeHistory && typeof saveAirtimeHistory === "function")
                saveAirtimeHistory(data.airtimeHistory);

            if (data.bundleHistory && typeof saveBundleHistory === "function")
                saveBundleHistory(data.bundleHistory);

            if (data.subscriptions && typeof saveSubscriptions === "function")
                saveSubscriptions(data.subscriptions);

            refreshApp();

            if (typeof showToast === "function")
                showToast("Backup Imported Successfully");

        }

        catch (error) {

            console.error(error);

            if (typeof showToast === "function")
                showToast("Invalid Backup File", "error");

        }

    };

    reader.readAsText(file);

}
/* ==========================================
   LOGOUT
========================================== */

function logout() {

    console.log("🚪 Logging out...");

    // Remove authentication information only
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authUser");

    // Redirect to login screen
    const appContainer = document.getElementById("appContainer");
    const loginScreen = document.getElementById("loginScreen");

    if (appContainer) {
        appContainer.style.display = "none";
    }

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    // Clear login fields
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (email) email.value = "";
    if (password) password.value = "";

    console.log("✅ Logged out successfully.");
}


/* ==========================================
   LOGOUT BUTTON
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", logout);

        console.log("✅ Logout button ready.");

    }

});


window.logout = logout;

window.importBackup = importBackup;