/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA BUY GOODS MODULE
========================================== */

"use strict";

let buyGoodsData = null;

function openMpesaBuyGoods() {
    buyGoodsData = null;

    const existing = document.getElementById("mpesaBuyGoodsModal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "mpesaBuyGoodsModal";
    modal.className = "mpesa-modal";

    modal.innerHTML = `
        <div class="mpesa-modal-content">

            <div class="mpesa-modal-header">
                <h2>🛒 Buy Goods</h2>

                <button
                    type="button"
                    class="mpesa-close-button"
                    onclick="closeMpesaBuyGoods()">
                    ×
                </button>
            </div>

            <div class="mpesa-form-group">
                <label>Till Number</label>

                <input
                    id="mpesaBuyGoodsTill"
                    class="mpesa-form-input"
                    type="text"
                    inputmode="numeric"
                    maxlength="10"
                    placeholder="Enter Till Number">
            </div>

            <div class="mpesa-form-group">
                <label>Merchant Name</label>

                <input
                    id="mpesaBuyGoodsMerchant"
                    class="mpesa-form-input"
                    type="text"
                    placeholder="Merchant name">
            </div>

            <div class="mpesa-form-group">
                <label>Amount</label>

                <input
                    id="mpesaBuyGoodsAmount"
                    class="mpesa-form-input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter amount">
            </div>

            <button
                type="button"
                class="mpesa-primary-button"
                onclick="previewMpesaBuyGoods()">
                Continue
            </button>

        </div>
    `;

    document.body.appendChild(modal);
}

function closeMpesaBuyGoods() {
    const modal = document.getElementById("mpesaBuyGoodsModal");

    if (modal) {
        modal.remove();
    }

    buyGoodsData = null;
}

function previewMpesaBuyGoods() {

    const tillNumber =
        document.getElementById("mpesaBuyGoodsTill")?.value.trim();

    const merchantName =
        document.getElementById("mpesaBuyGoodsMerchant")?.value.trim();

    const amount =
        Number(
            document.getElementById("mpesaBuyGoodsAmount")?.value
        );

    if (!tillNumber) {
        alert("Please enter the Till Number.");
        return;
    }

    if (!/^\d{5,10}$/.test(tillNumber)) {
        alert("Please enter a valid Till Number.");
        return;
    }

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    buyGoodsData = {
        tillNumber,
        merchantName: merchantName || "Merchant",
        amount
    };

    const confirmed = confirm(
        "Confirm Buy Goods payment\n\n" +
        "Merchant: " +
        buyGoodsData.merchantName +
        "\nTill Number: " +
        buyGoodsData.tillNumber +
        "\nAmount: KSh " +
        buyGoodsData.amount.toLocaleString("en-KE") +
        "\n\nProceed with payment?"
    );

    if (confirmed) {
        processMpesaBuyGoods();
    }
}

async function processMpesaBuyGoods() {

    if (!buyGoodsData) {
        return;
    }

    const button =
        document.querySelector(
            "#mpesaBuyGoodsModal .mpesa-primary-button"
        );

    try {

        if (button) {
            button.disabled = true;
            button.textContent = "Processing...";
        }

        const response = await fetch(
            "/api/mpesa/buy-goods",
            {
                method: "POST",

                headers:
                    typeof getHeaders === "function"
                        ? getHeaders()
                        : {
                            "Content-Type": "application/json",
                            "Authorization":
                                `Bearer ${
                                    localStorage.getItem("token") || ""
                                }`
                        },

                body: JSON.stringify(buyGoodsData)
            }
        );

        const data = await response.json();

        console.log(
            "Buy Goods Response:",
            data
        );

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Buy Goods payment failed."
            );
        }

        if (
            typeof updateMpesaBalanceDisplay ===
            "function"
        ) {
            updateMpesaBalanceDisplay(data.balance);
        }

        closeMpesaBuyGoods();

        showMpesaBuyGoodsReceipt(data);

        if (
            typeof loadMpesaDashboard ===
            "function"
        ) {
            loadMpesaDashboard();
        }

        buyGoodsData = null;

    } catch (error) {

        console.error(
            "M-Pesa Buy Goods Error:",
            error
        );

        alert(
            error.message ||
            "Unable to process Buy Goods payment."
        );

        if (button) {
            button.disabled = false;
            button.textContent = "Continue";
        }
    }
}

function showMpesaBuyGoodsReceipt(data) {

    const transaction =
        data.transaction || {};

    const amount =
        Number(
            transaction.amount ||
            buyGoodsData?.amount ||
            0
        );

    const tillNumber =
        transaction.recipient ||
        buyGoodsData?.tillNumber ||
        "";

    const merchantName =
        transaction.metadata?.merchantName ||
        buyGoodsData?.merchantName ||
        "Merchant";

    const reference =
        transaction.reference ||
        "MPESA";

    const balance =
        Number(data.balance || 0);

    const receipt =
        document.createElement("div");

    receipt.id =
        "mpesaBuyGoodsReceipt";

    receipt.className =
        "mpesa-receipt";

    receipt.innerHTML = `
        <div class="mpesa-receipt-content">

            <div class="receipt-success">
                ✓
            </div>

            <h2>
                Payment Successful
            </h2>

            <p>
                Buy Goods payment completed successfully.
            </p>

            <div class="receipt-amount">
                KSh
                ${amount.toLocaleString(
                    "en-KE",
                    {
                        minimumFractionDigits: 2
                    }
                )}
            </div>

            <div class="receipt-details">

                <div>
                    <span>Merchant</span>
                    <strong>
                        ${escapeMpesaBuyGoodsHtml(merchantName)}
                    </strong>
                </div>

                <div>
                    <span>Till Number</span>
                    <strong>
                        ${escapeMpesaBuyGoodsHtml(tillNumber)}
                    </strong>
                </div>

                <div>
                    <span>Reference</span>
                    <strong>
                        ${escapeMpesaBuyGoodsHtml(reference)}
                    </strong>
                </div>

                <div>
                    <span>New Balance</span>
                    <strong>
                        KSh
                        ${balance.toLocaleString(
                            "en-KE",
                            {
                                minimumFractionDigits: 2
                            }
                        )}
                    </strong>
                </div>

            </div>

            <button
                type="button"
                class="mpesa-primary-button"
                onclick="closeMpesaBuyGoodsReceipt()">
                Done
            </button>

        </div>
    `;

    document.body.appendChild(receipt);
}

function closeMpesaBuyGoodsReceipt() {

    const receipt =
        document.getElementById(
            "mpesaBuyGoodsReceipt"
        );

    if (receipt) {
        receipt.remove();
    }
}

function escapeMpesaBuyGoodsHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.openMpesaBuyGoods =
    openMpesaBuyGoods;

window.closeMpesaBuyGoods =
    closeMpesaBuyGoods;

window.previewMpesaBuyGoods =
    previewMpesaBuyGoods;

window.processMpesaBuyGoods =
    processMpesaBuyGoods;

window.closeMpesaBuyGoodsReceipt =
    closeMpesaBuyGoodsReceipt;

console.log(
    "✓ M-Pesa Buy Goods module loaded"
);
