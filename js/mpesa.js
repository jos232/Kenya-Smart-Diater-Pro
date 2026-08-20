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

    if (!input || !result) {
        console.warn("M-Pesa network detection elements not found.");
        return;
    }

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

    const phoneElement =
        document.getElementById("sendMoneyNumber");

    const nameElement =
        document.getElementById("recipientName");

    const amountElement =
        document.getElementById("sendAmount");

    const descriptionElement =
        document.getElementById("sendDescription");

    const phone =
        phoneElement?.value.trim() || "";

    const name =
        nameElement?.value.trim() || "";

    const amount =
        Number(amountElement?.value || 0);

    const description =
        descriptionElement?.value.trim() || "";


    if (!phone) {

        showToast(
            "Please enter recipient phone number",
            "error"
        );

        return null;
    }


    if (!/^07\d{8}$/.test(phone)) {

        showToast(
            "Enter a valid Kenyan phone number",
            "error"
        );

        return null;
    }


    if (!name) {

        showToast(
            "Please enter recipient name",
            "error"
        );

        return null;
    }


    if (!amount || amount <= 0) {

        showToast(
            "Enter a valid amount",
            "error"
        );

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

    if (!transfer) {
        return;
    }

    const networkElement =
        document.getElementById("transferNetwork");

    const network =
        networkElement?.textContent
            ?.replace("Network :", "")
            .trim() || "Unknown";


    const confirmed = confirm(

        `Confirm M-Pesa Transfer\n\n` +

        `Recipient: ${transfer.name}\n` +

        `Phone: ${transfer.phone}\n` +

        `Network: ${network}\n` +

        `Amount: KES ${transfer.amount.toLocaleString()}\n` +

        `Description: ${transfer.description || "None"
        }`
    );


    if (!confirmed) {
        return;
    }


    processMpesaTransfer(
        transfer,
        network
    );
}


/* ==========================================
   PROCESS M-PESA TRANSACTION
========================================== */

async function processMpesaTransfer(
    transfer,
    network
) {

    try {

        console.log(
            "💰 Processing M-Pesa transfer:",
            transfer
        );


        const token =
            localStorage.getItem("token") || "";


        const response =
            await fetch("/api/mpesa", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({

                    service: "SEND_MONEY",

                    sender: "My M-Pesa",

                    recipient:
                        transfer.phone,

                    reference:
                        "MPESA-" +
                        Date.now(),

                    amount:
                        transfer.amount,

                    fee: 0,

                    status: "SUCCESS",

                    metadata: {

                        recipientName:
                            transfer.name,

                        network:
                            network,

                        description:
                            transfer.description || "",

                        source:
                            "Kenya Smart Dialer Pro"
                    }
                })
            });


        const data =
            await response.json();


        console.log(
            "M-PESA RESPONSE:",
            data
        );


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


        return data;


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


        return null;
    }
}


/* ==========================================
   CLEAR SEND MONEY FORM
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
        document.getElementById(
            "transferNetwork"
        );


    if (network) {

        network.textContent =
            "Network : Unknown";
    }
}


/* ==========================================
   TOAST HELPER
========================================== */

function showToast(
    message,
    type = "info"
) {

    if (
        typeof window.showToast ===
        "function"
    ) {

        window.showToast(
            message,
            type
        );

        return;
    }


    alert(message);
}


/* ==========================================
   M-PESA DASHBOARD
========================================== */

function openMpesaDashboard() {

    console.log(
        "💚 Opening M-Pesa Dashboard..."
    );


    if (
        typeof window.showScreen ===
        "function"
    ) {

        window.showScreen(
            "mpesaDashboard"
        );

    } else {

        console.error(
            "showScreen() is not available"
        );

        return;
    }


    loadMpesaDashboard();
}


/* ==========================================
   LOAD M-PESA DASHBOARD
========================================== */

async function loadMpesaDashboard() {

    console.log(
        "💚 Loading M-Pesa Dashboard..."
    );


    try {

        const token =
            localStorage.getItem("token") || "";


        const response =
            await fetch(
                "/api/mpesa",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (!response.ok) {

            console.warn(
                "M-Pesa dashboard API:",
                response.status
            );

            return;
        }


        const data =
            await response.json();


        console.log(
            "M-Pesa Dashboard API:",
            data
        );


        renderMpesaTransactions(
            data
        );


    } catch (error) {

        console.error(
            "M-Pesa dashboard error:",
            error
        );
    }
}


/* ==========================================
   RENDER M-PESA TRANSACTIONS
========================================== */

function renderMpesaTransactions(
    data
) {

    const container =
        document.getElementById(
            "mpesaRecentTransactions"
        );


    if (!container) {

        console.warn(
            "mpesaRecentTransactions container not found."
        );

        return;
    }


    const transactions =
        data?.transactions ||
        data?.history ||
        [];


    if (!Array.isArray(transactions) ||
        transactions.length === 0) {

        container.innerHTML = `

            <div class="mpesa-empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <p>
                    No transactions yet
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        transactions
            .slice(0, 5)
            .map(transaction => {

                const amount =
                    Number(
                        transaction.amount ||
                        0
                    );


                const recipient =
                    transaction.recipient ||

                    transaction
                        .metadata
                        ?.recipientName ||

                    "M-Pesa Transaction";


                const reference =
                    transaction.reference ||
                    "M-PESA";


                const status =
                    transaction.status ||
                    "SUCCESS";


                return `

                    <div class="mpesa-transaction">

                        <div class="transaction-icon">
                            💸
                        </div>


                        <div class="transaction-details">

                            <strong>
                                ${recipient}
                            </strong>

                            <small>
                                ${reference}
                            </small>

                            <small>
                                ${status}
                            </small>

                        </div>


                        <div class="transaction-amount">

                            - KSh
                            ${amount.toLocaleString()}

                        </div>

                    </div>

                `;

            })
            .join("");
}


/* ==========================================
   M-PESA SEND MONEY
========================================== */

function openMpesaSendMoney() {

    console.log(
        "💸 Opening M-Pesa Send Money..."
    );


    if (
        typeof window.showScreen ===
        "function"
    ) {

        window.showScreen(
            "sendMoneyService"
        );

    } else {

        console.error(
            "showScreen() is not available"
        );
    }
}


/* ==========================================
   M-PESA RECEIVE MONEY
========================================== */

function openMpesaReceiveMoney() {

    alert(
        "Receive Money feature will be added next."
    );
}


/* ==========================================
   M-PESA AIRTIME
========================================== */

function openMpesaAirtime() {

    alert(
        "M-Pesa Airtime feature will be connected next."
    );
}


/* ==========================================
   M-PESA PAY BILL
========================================== */

function openMpesaPayBill() {

    alert(
        "M-Pesa Pay Bill feature will be connected next."
    );
}


/* ==========================================
   M-PESA BUY GOODS
========================================== */

function openMpesaBuyGoods() {

    alert(
        "M-Pesa Buy Goods feature will be connected next."
    );
}


/* ==========================================
   M-PESA TRANSACTIONS
========================================== */

function openMpesaTransactions() {

    alert(
        "M-Pesa transaction history will be connected next."
    );
}


/* ==========================================
   M-PESA STATEMENT
========================================== */

function openMpesaStatement() {

    alert(
        "M-Pesa mini statement will be connected next."
    );
}


/* ==========================================
   M-PESA SETTINGS
========================================== */

function openMpesaSettings() {

    alert(
        "M-Pesa account settings will be connected next."
    );
}


/* ==========================================
   M-PESA SECURITY
========================================== */

function openMpesaSecurity() {

    alert(
        "M-Pesa security settings will be connected next."
    );
}


/* ==========================================
   EXPORT SEND MONEY FUNCTIONS
========================================== */

window.detectTransferNetwork =
    detectTransferNetwork;

window.validateTransfer =
    validateTransfer;

window.previewTransfer =
    previewTransfer;

window.processMpesaTransfer =
    processMpesaTransfer;

window.clearTransferForm =
    clearTransferForm;


/* ==========================================
   EXPORT DASHBOARD FUNCTIONS
========================================== */

window.openMpesaDashboard =
    openMpesaDashboard;

window.loadMpesaDashboard =
    loadMpesaDashboard;

window.renderMpesaTransactions =
    renderMpesaTransactions;

window.openMpesaSendMoney =
    openMpesaSendMoney;

window.openMpesaReceiveMoney =
    openMpesaReceiveMoney;

window.openMpesaAirtime =
    openMpesaAirtime;

window.openMpesaPayBill =
    openMpesaPayBill;

window.openMpesaBuyGoods =
    openMpesaBuyGoods;

window.openMpesaTransactions =
    openMpesaTransactions;

window.openMpesaStatement =
    openMpesaStatement;

window.openMpesaSettings =
    openMpesaSettings;

window.openMpesaSecurity =
    openMpesaSecurity;


/* ==========================================
   FINAL MODULE CHECK
========================================== */

console.log(
    "✅ M-Pesa functions exported"
);

console.log(
    "✅ M-Pesa Dashboard Controller Loaded"
);