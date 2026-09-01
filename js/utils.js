/* ==========================================
   KENYA SMART DIALER PRO
   utils.js
========================================== */

"use strict";

/* ==========================
   Toast Notification
========================== */

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/* ==========================
   Loading Overlay
========================== */

function showLoader(text = "Loading...") {

    let loader = document.getElementById("loadingOverlay");

    if (!loader) {

        loader = document.createElement("div");

        loader.id = "loadingOverlay";

        loader.className = "loading-overlay";

        loader.innerHTML = `
        <div class="loader-box">
            <div class="spinner"></div>
            <p id="loaderText">${text}</p>
        </div>
        `;

        document.body.appendChild(loader);

    }

    loader.style.display = "flex";

    document.getElementById("loaderText").textContent = text;

}

function hideLoader() {

    const loader = document.getElementById("loadingOverlay");

    if (loader) {

        loader.style.display = "none";

    }

}

/* ==========================
   Currency
========================== */

function formatCurrency(amount) {

    return `KSh ${Number(amount).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

}

/* Banking modules use formatMoney() */

function formatMoney(amount) {

    return formatCurrency(amount);

}

/* ==========================
   Date
========================== */

function formatDate(date = new Date()) {

    return new Date(date).toLocaleString("en-KE", {

        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"

    });

}

/* ==========================
   Generate IDs
========================== */

function generateId() {

    return Date.now() + Math.floor(Math.random() * 100000);

}

/* ==========================
   Confirm
========================== */

function confirmAction(message) {

    return confirm(message);

}

/* ==========================
   Clipboard
========================== */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast("Copied Successfully");

    }

    catch (err) {

        console.error(err);

        showToast("Copy Failed", "error");

    }

}

/* ==========================
   Network Colors
========================== */

function getNetworkColor(network) {

    switch (network) {

        case "Safaricom":

            return "#00C853";

        case "Airtel":

            return "#E53935";

        case "Telkom":

            return "#2962FF";

        case "Faiba":

            return "#9C27B0";

        default:

            return "#64748B";

    }

}

/* ==========================
   Network Logos
========================== */

function getNetworkLogo(network) {

    switch (network) {

        case "Safaricom":

            return "assets/safaricom.png";

        case "Airtel":

            return "assets/airtel.png";

        case "Telkom":

            return "assets/telkom.png";

        case "Faiba":

            return "assets/faiba.png";

        default:

            return "assets/logo.png";

    }

}

/* ==========================
   Phone Validation
========================== */

function normalizePhone(phone) {

    phone = phone.replace(/\s+/g, "");

    if (phone.startsWith("+254")) {

        return "0" + phone.substring(4);

    }

    if (phone.startsWith("254")) {

        return "0" + phone.substring(3);

    }

    return phone;

}

function isValidPhone(phone) {

    phone = normalizePhone(phone);

    return /^0(1|7)[0-9]{8}$/.test(phone);

}

/* ==========================
   Random Reference
========================== */

function generateReference(prefix = "TXN") {

    return `${prefix}${Date.now()}`;

}

/* ==========================================
   GLOBAL REFRESH
========================================== */

function refreshApp() {

    console.log(" Refreshing application...");

    if (typeof refreshDashboard === "function") {
        refreshDashboard();
    }

    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    if (typeof loadContacts === "function") {
        loadContacts();
    }

    if (typeof loadRecentCalls === "function") {
        loadRecentCalls();
    }

    if (typeof renderVoiceHistory === "function") {
        renderVoiceHistory();
    }

    if (typeof renderBundleHistory === "function") {
        renderBundleHistory();
    }

    if (typeof renderAirtimeHistory === "function") {
        renderAirtimeHistory();
    }

}

/* ==========================================
   EXPORTS
========================================== */

window.showToast = showToast;
window.showLoader = showLoader;
window.hideLoader = hideLoader;

window.formatCurrency = formatCurrency;
window.formatMoney = formatMoney;
window.formatDate = formatDate;

window.generateId = generateId;
window.generateReference = generateReference;

window.confirmAction = confirmAction;
window.copyToClipboard = copyToClipboard;

window.getNetworkColor = getNetworkColor;
window.getNetworkLogo = getNetworkLogo;

window.normalizePhone = normalizePhone;
window.isValidPhone = isValidPhone;