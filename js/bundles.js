/* ==========================================
   KENYA SMART DIALER PRO
   bundles.js
========================================== */

"use strict";

/* ==========================================
   SELECTED BUNDLE
========================================== */

let selectedBundle = null;

let selectedCategory = "Daily";

/* ==========================================
   BUNDLE DATABASE
========================================== */

const BundlePackages = {

    Daily: [

        {
            name: "1 GB Daily",
            mb: 1024,
            price: 50,
            expiry: "24 Hours"
        },

        {
            name: "2 GB Daily",
            mb: 2048,
            price: 99,
            expiry: "24 Hours"
        },

        {
            name: "3 GB Daily",
            mb: 3072,
            price: 150,
            expiry: "24 Hours"
        }

    ],

    Weekly: [

        {
            name: "5 GB Weekly",
            mb: 5120,
            price: 250,
            expiry: "7 Days"
        },

        {
            name: "10 GB Weekly",
            mb: 10240,
            price: 500,
            expiry: "7 Days"
        },

        {
            name: "15 GB Weekly",
            mb: 15360,
            price: 700,
            expiry: "7 Days"
        }

    ],

    Monthly: [

        {
            name: "10 GB Monthly",
            mb: 10240,
            price: 500,
            expiry: "30 Days"
        },

        {
            name: "20 GB Monthly",
            mb: 20480,
            price: 1000,
            expiry: "30 Days"
        },

        {
            name: "50 GB Monthly",
            mb: 51200,
            price: 2000,
            expiry: "30 Days"
        }

    ],

    Unlimited: [

        {
            name: "Unlimited Basic",
            mb: 100000,
            price: 3000,
            expiry: "30 Days"
        },

        {
            name: "Unlimited Premium",
            mb: 200000,
            price: 5000,
            expiry: "30 Days"
        }

    ]

};
/* ==========================================
   SELECT CATEGORY
========================================== */

function selectBundleCategory(category) {

    selectedCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => {

        btn.classList.remove("active");

        if (btn.textContent.trim() === category) {

            btn.classList.add("active");

        }

    });

    renderBundles(category);

}

/* ==========================================
   RENDER BUNDLES
========================================== */

function renderBundles(category = "Daily") {

    const container = document.getElementById("bundleOffers");

    if (!container) return;

    container.innerHTML = "";

    const bundles = BundlePackages[category];

    bundles.forEach(bundle => {

        container.innerHTML += `

            <button
                class="bundle-offer"
                onclick="selectBundle(
                    '${bundle.name}',
                    ${bundle.mb},
                    ${bundle.price},
                    '${bundle.expiry}'
                )"
            >

                <h3>${bundle.name}</h3>

                <p>${bundle.mb} MB</p>

                <strong>KSh ${bundle.price}</strong>

                <small>${bundle.expiry}</small>

            </button>

        `;

    });

}
/* ==========================================
   SELECT BUNDLE
========================================== */

function selectBundle(name, mb, price, expiry) {

    selectedBundle = {

        name,

        mb,

        price,

        expiry

    };

    document.getElementById("bundleSummaryName").textContent = name;

    document.getElementById("bundleSummarySize").textContent = mb + " MB";

    document.getElementById("bundleSummaryPrice").textContent = "KSh " + price;

}
/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderBundles("Daily");

});

/* ==========================================
   BUY BUNDLE
========================================== */

async function buyBundle() {

    if (!selectedBundle) {

        alert("Please select a bundle first.");

        return;

    }

    try {

        /* -------------------------
           SAVE TO BACKEND
        ------------------------- */

        const result = await apiPost("/bundles", {

            bundleType: "Data",

            packageName: selectedBundle.name,

            amount: selectedBundle.price,

            quantity: selectedBundle.mb,

            expiry: selectedBundle.expiry,

            paymentMethod: "Wallet"

        });

        if (!result.success) {

            alert(result.message || "Unable to purchase bundle.");

            return;

        }

        /* -------------------------
           UPDATE LOCAL TELECOM ENGINE
        ------------------------- */

        Telecom.data = Number(Telecom.data || 0) + Number(selectedBundle.mb);

        if (typeof addData === "function") {

            addData(selectedBundle.mb);

        }

        /* -------------------------
           SAVE LOCAL HISTORY
        ------------------------- */

        saveBundlePurchase(selectedBundle);

        /* -------------------------
           REFRESH EVERYTHING
        ------------------------- */

        if (typeof loadBundleDashboard === "function") {

            await loadBundleDashboard();

        }

        if (typeof refreshDashboardCards === "function") {

            await refreshDashboardCards();

        }

        if (typeof updateTelecomDashboard === "function") {

            updateTelecomDashboard();

        }

        if (typeof renderBundleHistory === "function") {

            renderBundleHistory();

        }

        /* -------------------------
           RESET SELECTION
        ------------------------- */

        selectedBundle = null;

        document.getElementById("bundleSummaryName").textContent = "-";
        document.getElementById("bundleSummarySize").textContent = "-";
        document.getElementById("bundleSummaryPrice").textContent = "-";

        /* -------------------------
           SUCCESS MESSAGE
        ------------------------- */

        showToast(" Bundle activated successfully!");

    }

    catch (error) {

        console.error("Bundle Purchase Error:", error);

        alert("Unable to purchase bundle. Please try again.");

    }

}
/* ==========================================
   SAVE BUNDLE PURCHASE
========================================== */

function saveBundlePurchase(bundle) {

    const history = JSON.parse(

        localStorage.getItem("bundleHistory")

    ) || [];

    history.unshift({

        name: bundle.name,

        dataAmount: bundle.mb + "MB",

        mb: bundle.mb,

        price: bundle.price,

        expiry: bundle.expiry,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(

        "bundleHistory",

        JSON.stringify(history)

    );

}
/* ==========================================
   BUNDLE HISTORY
========================================== */

function renderBundleHistory() {

    const container =

        document.getElementById("bundleHistory");

    if (!container) return;


    const history = JSON.parse(

        localStorage.getItem("bundleHistory")

    ) || [];

    if (history.length === 0) {

        container.innerHTML =

            "<p class='empty-text'>No bundle purchases yet.</p>";

        return;

    }

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `

            <div class="history-item">

                <strong>${item.name}</strong>

                <span>${item.mb} MB</span>

                <span>KSh ${item.price}</span>

                <small>${item.date}</small>

            </div>

        `;

    });

}
document.addEventListener("DOMContentLoaded", () => {

    renderBundles("Daily");

    renderBundleHistory();

});
/* ==========================================
   UPDATE BUNDLE PROGRESS
========================================== */

function updateBundleProgress() {

    const progress = document.getElementById("bundleProgress");

    if (!progress) return;

    const maxBundle = Telecom.data > 0
        ? Telecom.data
        : 1;

    const remaining = Telecom.data;

    const percentage = Math.max(
        0,
        Math.min(
            100,
            (remaining / maxBundle) * 100
        )
    );

    progress.style.width = percentage + "%";

}
/* ==========================================
   DETECT BUNDLE NETWORK
========================================== */

function detectBundleNetwork() {

    const input = document.getElementById("bundleNumber");

    if (!input) return;

    const number = normalizeNumber(input.value);

    const network = detectNetwork(number);

    const label = document.getElementById("bundleNetwork");

    if (label) {

        label.textContent = network || "Unknown";

    }

}