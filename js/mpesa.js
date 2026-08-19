"use strict";

/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA / SEND MONEY MODULE
========================================== */

console.log("✅ M-Pesa Module Loaded");

/* ==========================================
   NETWORK DETECTION
========================================== */

function detectTransferNetwork() {

    const input = document.getElementById("sendMoneyNumber");
    const result = document.getElementById("transferNetwork");

    if (!input || !result) return;

    const phone = input.value.replace(/\D/g, "");

    if (phone.length < 3) {
        result.textContent = "Network : Unknown";
        return;
    }

    const prefix = phone.substring(0, 3);

    const networks = {
        "070": "Safaricom",
        "071": "Safaricom",
        "072": "Safaricom",
        "074": "Safaricom",
        "079": "Safaricom",
        "010": "Safaricom",
        "011": "Safaricom",

        "073": "Airtel",
        "075": "Airtel",
        "078": "Airtel",

        "077": "Telkom",

        "076": "Equitel"
    };

    const network = networks[prefix] || "Unknown";

    result.textContent = `Network : ${network}`;
}

/* ==========================================
   VALIDATE SEND MONEY
========================================== */

function validateTransfer() {

    const phone = document.getElementById("sendMoneyNumber")?.value.trim();
    const name = document.getElementById("recipientName")?.value.trim();
    const amount = Number(document.getElementById("sendAmount")?.value);
    const description = document.getElementById("sendDescription")?.value.trim();

    if (!phone) {
        showToast("Please enter recipient phone number", "error");
        return null;
    }

    if (!/^07\d{8}$/.test(phone)) {
        showToast("Enter a valid Kenyan phone number", "error");
        return null;
    }

    if (!name) {
        showToast("Please enter recipient name", "error");
        return null;
    }

    if (!amount || amount <= 0) {
        showToast("Enter a valid amount", "error");
        return null;
    }

    return {
        phone,
        name,
        amount,
        description
    };
}

/* ==========================================
   PREVIEW TRANSFER
========================================== */

function previewTransfer() {

    const transfer = validateTransfer();

    if (!transfer) return;

    const network =
        document.getElementById("transferNetwork")?.textContent
            ?.replace("Network :", "")
            .trim() || "Unknown";

    const confirmed = confirm(
        `Confirm M-Pesa Transfer\n\n` +
        `Recipient: ${transfer.name}\n` +
        `Phone: ${transfer.phone}\n` +
        `Network: ${network}\n` +
        `Amount: KES ${transfer.amount.toLocaleString()}\n` +
        `Description: ${transfer.description || "None"}`
    );

    if (!confirmed) return;

    processMpesaTransfer(transfer, network);
}

/* ==========================================
   PROCESS M-PESA TRANSACTION
========================================== */

async function processMpesaTransfer(transfer, network) {

    try {

        console.log("💰 Processing M-Pesa transfer:", transfer);

        const response = await fetch("/api/mpesa", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
            },

            body: JSON.stringify({

                service: "SEND_MONEY",

                sender: "My M-Pesa",

                recipient: transfer.phone,

                reference:
                    "MPESA-" +
                    Date.now(),

                amount: transfer.amount,

                fee: 0,

                status: "SUCCESS",

                metadata: {

                    recipientName: transfer.name,

                    network: network,

                    description:
                        transfer.description || "",

                    source:
                        "Kenya Smart Dialer Pro"
                }
            })
        });

        const data = await response.json();

        console.log("M-PESA RESPONSE:", data);

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "M-Pesa transaction failed"
            );
        }

        showToast(
            "M-Pesa transfer completed successfully",
            "success"
        );

        clearTransferForm();

        console.log(
            "✅ M-Pesa transfer recorded:",
            data.transaction
        );

    } catch (error) {

        console.error(
            "❌ M-Pesa transfer error:",
            error
        );

        showToast(
            error.message ||
            "Unable to process M-Pesa transfer",
            "error"
        );
    }
}

/* ==========================================
   CLEAR FORM
========================================== */

function clearTransferForm() {

    const fields = [
        "sendMoneyNumber",
        "recipientName",
        "sendAmount",
        "sendDescription"
    ];

    fields.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const network =
        document.getElementById("transferNetwork");

    if (network) {
        network.textContent =
            "Network : Unknown";
    }
}

/* ==========================================
   TOAST HELPER
========================================== */

function showToast(message, type = "info") {

    if (typeof window.showToast === "function") {
        window.showToast(message, type);
        return;
    }

    alert(message);
}

/* ==========================================
   EXPORT
========================================== */

window.detectTransferNetwork =
    detectTransferNetwork;

window.previewTransfer =
    previewTransfer;

window.processMpesaTransfer =
    processMpesaTransfer;

console.log("✅ M-Pesa functions exported");