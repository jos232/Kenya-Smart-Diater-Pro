/* ==========================================
   KENYA SMART DIALER PRO
   airtime.js
========================================== */

"use strict";

/* ==========================================
   API
========================================== */



let selectedAmount = 0;

/* ==========================================
   OPEN AIRTIME
========================================== */

function openAirtime() {

    showScreen("airtime");

    updateAirtimeSummary();

}

/* ==========================================
   SELECT AMOUNT
========================================== */

function selectAmount(amount) {

    selectedAmount = amount;

    document.querySelectorAll(".amount-options button").forEach(btn => {

        btn.classList.remove("active");

        if (btn.textContent.includes(amount)) {

            btn.classList.add("active");

        }

    });

    updateAirtimeSummary();

}

/* ==========================================
   UPDATE SUMMARY
========================================== */

function updateAirtimeSummary() {

    const phoneInput = document.getElementById("airtimeNumber");

    const customInput = document.getElementById("customAmount");

    const networkLabel = document.getElementById("summaryNetwork");

    const amountLabel = document.getElementById("summaryAmount");

    let amount = selectedAmount;

    if (customInput && customInput.value !== "") {

        amount = Number(customInput.value);

    }

    const phone = phoneInput ? phoneInput.value.trim() : "";

    const network = phone ? detectNetwork(phone) : "Unknown";

    if (networkLabel) {

        networkLabel.textContent = network;

    }

    if (amountLabel) {

        amountLabel.textContent = "KSh " + amount;

    }

}
/* ==========================
   Buy Airtime
========================== */
async function buyAirtime() {

    /* -------------------------
       GET PHONE NUMBER
    ------------------------- */

    const phone = document
        .getElementById("airtimeNumber")
        .value
        .trim();

    const normalizedPhone = normalizeNumber(phone);

    console.log("Original:", phone);
    console.log("Normalized:", normalizedPhone);

    /* -------------------------
       VALIDATE PHONE
    ------------------------- */

    if (!isValidKenyanNumber(normalizedPhone)) {

        alert("Enter a valid Kenyan phone number.");

        return;

    }

    /* -------------------------
       GET AMOUNT
    ------------------------- */

    let amount = selectedAmount;

    const customInput =
        document.getElementById("customAmount");

    if (customInput && customInput.value) {

        amount = Number(customInput.value);

    }

    if (amount <= 0) {

        alert("Please select or enter an amount.");

        return;

    }

    /* -------------------------
       DETECT NETWORK
    ------------------------- */

    const network = detectNetwork(normalizedPhone);

    try {

        /* -------------------------
           SEND TO BACKEND
        ------------------------- */

        const result = await apiPost("/airtime", {

            phone: normalizedPhone,
            network,
            amount

        });

        if (result.success === false) {

            alert(result.message || "Airtime purchase failed.");

            return;

        }

        /* -------------------------
           UPDATE LOCAL DATA
        ------------------------- */

        Telecom.airtime += amount;

        updateAirtimeDisplay();

        saveAirtimePurchase(amount);

        showToast("✅ Airtime Purchased Successfully");

        /* -------------------------
           RESET FORM
        ------------------------- */

        document.getElementById("airtimeNumber").value = "";

        if (customInput) {

            customInput.value = "";

        }

        selectedAmount = 0;

        document
            .querySelectorAll(".amount-options button")
            .forEach(btn => btn.classList.remove("active"));

        updateAirtimeSummary();

        renderAirtimeHistory();

    }

    catch (err) {

        console.error(err);

        showToast("Failed to buy airtime", "error");

    }

}
/* ==========================
   Render Airtime History
========================== */

async function renderAirtimeHistory() {

    const container = document.getElementById("airtimeHistory");

    if (!container) return;

    try {

        const history = await apiGet("/airtime");

        if (!Array.isArray(history) || history.length === 0) {

            container.innerHTML = `
                <p class="empty-text">
                    No airtime purchases yet.
                </p>
            `;

            return;

        }

        container.innerHTML = "";

        history.forEach(item => {

            const card = document.createElement("div");

            card.className = "airtime-item";

            card.innerHTML = `

                <div class="airtime-left">

                    <strong>${item.phone}</strong>

                    <br>

                    <small>${item.network}</small>

                </div>

                <div class="airtime-right">

                    <strong>KSh ${item.amount}</strong>

                    <br>

                    <small>${new Date(item.createdAt).toLocaleString()}</small>

                </div>

            `;

            container.appendChild(card);

        });

    }

    catch (error) {

        console.error("Airtime History:", error);

        container.innerHTML = `
            <p class="empty-text">
                Failed to load airtime history.
            </p>
        `;

    }

}
/* ==========================================
   SAVE AIRTIME PURCHASE (LOCAL CACHE)
========================================== */

function saveAirtimePurchase(amount) {

    const history = JSON.parse(
        localStorage.getItem("airtimeHistory") || "[]"
    );

    history.unshift({

        amount,

        network: detectNetwork(
            document.getElementById("airtimeNumber")?.value || ""
        ),

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "airtimeHistory",
        JSON.stringify(history)
    );

}

/* ==========================================
   CLEAR HISTORY
========================================== */

async function clearAirtimeHistory() {

    if (!confirm("Clear airtime history?")) return;

    try {

        await apiDelete("/airtime");

        renderAirtimeHistory();

        showToast("History Cleared");

    }

    catch (err) {

        console.error(err);

        showToast("Unable to clear history", "error");

    }

}

/* ==========================================
   SAVE RECENT CALL
========================================== */

function saveRecentCall(call) {

    if (typeof getRecentCalls !== "function") return;

    const recent = getRecentCalls();

    recent.unshift({

        id: Date.now(),

        name: call.name || "",

        number: call.number,

        network: call.network,

        type: call.type || "Outgoing",

        duration: call.duration || "00:00",

        date: new Date().toLocaleDateString(),

        time: new Date().toLocaleTimeString(),

        favorite: false

    });

    if (typeof saveRecentCalls === "function") {

        saveRecentCalls(recent);

    }

}
/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const phoneInput =
        document.getElementById("airtimeNumber");

    const customInput =
        document.getElementById("customAmount");

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            updateAirtimeSummary
        );

    }

    if (customInput) {

        customInput.addEventListener(
            "input",
            updateAirtimeSummary
        );

    }

    renderAirtimeHistory();

    updateAirtimeSummary();

});

/* ==========================================
   EXPORTS
========================================== */

window.selectAmount = selectAmount;
window.buyAirtime = buyAirtime;
window.renderAirtimeHistory = renderAirtimeHistory;
window.clearAirtimeHistory = clearAirtimeHistory;
window.openAirtime = openAirtime;