/* ==========================================
   KENYA SMART DIALER PRO
   voice.js
========================================== */

"use strict";

/* ==========================================
   STATE
========================================== */

let selectedVoicePackage = null;
let selectedVoiceCategory = "Daily";

/* ==========================================
   DATABASE
========================================== */

const VoicePackages = {

    Daily: [
        { name: "20 Minutes", minutes: 20, price: 20, expiry: "24 Hours" },
        { name: "50 Minutes", minutes: 50, price: 50, expiry: "24 Hours" },
        { name: "100 Minutes", minutes: 100, price: 100, expiry: "24 Hours" }
    ],

    Weekly: [
        { name: "200 Minutes", minutes: 200, price: 200, expiry: "7 Days" },
        { name: "500 Minutes", minutes: 500, price: 450, expiry: "7 Days" }
    ],

    Monthly: [
        { name: "1000 Minutes", minutes: 1000, price: 1000, expiry: "30 Days" },
        { name: "2500 Minutes", minutes: 2500, price: 2000, expiry: "30 Days" }
    ],

    Unlimited: [
        { name: "Unlimited Calls", minutes: 999999, price: 3000, expiry: "30 Days" }
    ]

};

/* ==========================================
   CATEGORY
========================================== */

function selectVoiceCategory(category) {

    selectedVoiceCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => {

        btn.classList.remove("active");

        if (btn.textContent.trim() === category) {

            btn.classList.add("active");

        }

    });

    renderVoicePackages(category);

}

/* ==========================================
   RENDER PACKAGES
========================================== */

function renderVoicePackages(category = "Daily") {

    const container = document.getElementById("voiceOffers");

    if (!container) return;

    container.innerHTML = "";

    VoicePackages[category].forEach(pkg => {

        container.innerHTML += `

        <button class="bundle-offer"

            onclick="chooseVoicePackage(
                '${pkg.name}',
                ${pkg.minutes},
                ${pkg.price},
                '${pkg.expiry}'
            )">

            <h3>${pkg.name}</h3>

            <p>${pkg.minutes} Minutes</p>

            <strong>KSh ${pkg.price}</strong>

            <small>${pkg.expiry}</small>

        </button>

        `;

    });

}

/* ==========================================
   CHOOSE PACKAGE
========================================== */

function chooseVoicePackage(name, minutes, price, expiry) {

    selectedVoicePackage = {

        name,
        minutes,
        price,
        expiry

    };

    const packageElement = document.getElementById("voiceSummaryPackage");
    const minutesElement = document.getElementById("voiceSummaryMinutes");
    const priceElement = document.getElementById("voiceSummaryPrice");

    if (packageElement)
        packageElement.textContent = name;

    if (minutesElement)
        minutesElement.textContent = minutes + " Min";

    if (priceElement)
        priceElement.textContent = "KSh " + price;

}

/* ==========================================
   BUY VOICE PACKAGE
========================================== */

async function buyVoicePackage() {

    /* -------------------------
       CHECK PACKAGE
    ------------------------- */

    if (!selectedVoicePackage) {

        showToast(
            "Please select a voice package.",
            "error"
        );

        return;
    }

    /* -------------------------
       GET PHONE INPUT
    ------------------------- */

    const phoneInput =
        document.getElementById("voiceNumber");

    if (!phoneInput) {

        showToast(
            "Voice phone number field was not found.",
            "error"
        );

        return;
    }

    /* -------------------------
       NORMALIZE PHONE
    ------------------------- */

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

    if (!network || network === "Unknown Network") {

        showToast(
            "We could not identify the phone network.",
            "error"
        );

        return;
    }

    try {

        /* -------------------------
           SEND TO BACKEND
        ------------------------- */

        const result = await apiPost(
            "/voice",
            {
                phone: phone,

                network: network,

                packageName:
                    selectedVoicePackage.name,

                minutes:
                    selectedVoicePackage.minutes,

                price:
                    selectedVoicePackage.price,

                paymentMethod: "Wallet"
            }
        );

        /* -------------------------
           CHECK RESPONSE
        ------------------------- */

        if (!result || !result.success) {

            throw new Error(
                result?.message ||
                "Voice package activation failed."
            );

        }

        /* -------------------------
           UPDATE LOCAL TELECOM
        ------------------------- */

        if (typeof Telecom !== "undefined") {

            Telecom.voice =
                (Telecom.voice || 0) +
                Number(selectedVoicePackage.minutes);

            if (typeof Telecom.save === "function") {

                Telecom.save();

            }

        }

        /* -------------------------
           SAVE LOCAL HISTORY
        ------------------------- */

        saveVoicePurchase(
            selectedVoicePackage
        );

        /* -------------------------
           REFRESH DASHBOARD
        ------------------------- */

        if (
            typeof refreshDashboardCards ===
            "function"
        ) {

            await refreshDashboardCards();

        }

        if (
            typeof updateTelecomDashboard ===
            "function"
        ) {

            updateTelecomDashboard();

        }

        /* -------------------------
           REFRESH HISTORY
        ------------------------- */

        if (
            typeof renderVoiceHistory ===
            "function"
        ) {

            renderVoiceHistory();

        }

        /* -------------------------
           RESET
        ------------------------- */

        const activatedPackage =
            selectedVoicePackage.name;

        phoneInput.value = "";

        selectedVoicePackage = null;

        const packageElement =
            document.getElementById(
                "voiceSummaryPackage"
            );

        const minutesElement =
            document.getElementById(
                "voiceSummaryMinutes"
            );

        const priceElement =
            document.getElementById(
                "voiceSummaryPrice"
            );

        if (packageElement) {

            packageElement.textContent = "--";

        }

        if (minutesElement) {

            minutesElement.textContent = "--";

        }

        if (priceElement) {

            priceElement.textContent = "--";

        }

        /* -------------------------
           SUCCESS
        ------------------------- */
        showToast(
            "🎤 " +
            activatedPackage +
            " activated successfully."
        );

    }

    catch (error) {

        console.error(
            "Voice Purchase:",
            error
        );

        showToast(

            error.message ||
            "Unable to activate voice package.",

            "error"

        );

    }

}

/* ==========================================
   SAVE PURCHASE
========================================== */

function saveVoicePurchase(pkg) {

    const history =
        JSON.parse(
            localStorage.getItem("voiceHistory")
        ) || [];

    history.unshift({

        id: Date.now(),

        name: pkg.name,

        minutes: pkg.minutes,

        price: pkg.price,

        expiry: pkg.expiry,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "voiceHistory",
        JSON.stringify(history)
    );

}

/* ==========================================
   HISTORY
========================================== */

function renderVoiceHistory() {

    const container =
        document.getElementById("voiceHistory");

    if (!container) return;

    const history =
        JSON.parse(
            localStorage.getItem("voiceHistory")
        ) || [];

    if (history.length === 0) {

        container.innerHTML = `
        <div class="empty-state">
            No Voice Purchases Yet
        </div>
        `;

        return;

    }

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `

        <div class="history-card">

            <div>

                <strong>${item.name}</strong>

                <small>${item.date}</small>

            </div>

            <div>

                ${item.minutes} Min

                <br>

                <strong>KSh ${item.price}</strong>

            </div>

        </div>

        `;

    });

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderVoicePackages("Daily");

    renderVoiceHistory();

});

function detectVoiceNetwork() {

    const input = document.getElementById("voiceNumber");

    if (!input) return;

    const network = detectNetwork(input.value);

    const label = document.getElementById("voiceNetwork");

    if (label) {

        label.textContent = network;

    }

}

/* ==========================================
   EXPORTS
========================================== */

window.selectVoiceCategory = selectVoiceCategory;
window.renderVoicePackages = renderVoicePackages;
window.chooseVoicePackage = chooseVoicePackage;
window.buyVoicePackage = buyVoicePackage;
window.renderVoiceHistory = renderVoiceHistory;
window.saveVoicePurchase = saveVoicePurchase;