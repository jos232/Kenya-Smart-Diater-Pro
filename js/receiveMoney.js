/* ==========================================
   KENYA SMART DIALER PRO
   RECEIVE MONEY
========================================== */

"use strict";

console.log("💚 Receive Money Module Loaded");


/* ==========================================
   STATE
========================================== */

let receiveMoneyData = null;


/* ==========================================
   OPEN RECEIVE MONEY
========================================== */

function openReceiveMoney() {

    console.log("💚 Opening M-Pesa Receive Money...");

    const modal = document.getElementById(
        "receiveMoneyModal"
    );

    if (modal) {

        modal.style.display = "flex";

        return;

    }

    createReceiveMoneyModal();

}


/* ==========================================
   CREATE MODAL
========================================== */

function createReceiveMoneyModal() {

    const modal =
        document.createElement("div");

    modal.id =
        "receiveMoneyModal";

    modal.className =
        "mpesa-modal";

    modal.innerHTML = `

        <div class="mpesa-modal-content">

            <div class="mpesa-modal-header">

                <h2>
                    Receive Money
                </h2>

                <button
                    type="button"
                    onclick="closeReceiveMoney()"
                >
                    ×
                </button>

            </div>


            <div class="mpesa-form">

                <label>
                    Sender Phone Number
                </label>

                <input
                    type="tel"
                    id="receiveSender"
                    placeholder="0712345678"
                    maxlength="13"
                >


                <label>
                    Sender Name
                </label>

                <input
                    type="text"
                    id="receiveSenderName"
                    placeholder="Sender name"
                >


                <label>
                    Amount
                </label>

                <input
                    type="number"
                    id="receiveAmount"
                    placeholder="KES 0"
                    min="1"
                    step="1"
                >


                <label>
                    Description
                </label>

                <input
                    type="text"
                    id="receiveDescription"
                    placeholder="Optional description"
                >


                <button
                    type="button"
                    class="mpesa-primary-button"
                    onclick="previewReceiveMoney()"
                >
                    Continue
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

}


/* ==========================================
   CLOSE
========================================== */

function closeReceiveMoney() {

    const modal =
        document.getElementById(
            "receiveMoneyModal"
        );

    if (modal) {

        modal.style.display = "none";

    }

}


/* ==========================================
   PREVIEW
========================================== */

function previewReceiveMoney() {

    const sender =
        document.getElementById(
            "receiveSender"
        )?.value.trim();

    const senderName =
        document.getElementById(
            "receiveSenderName"
        )?.value.trim();

    const amount =
        Number(
            document.getElementById(
                "receiveAmount"
            )?.value
        );

    const description =
        document.getElementById(
            "receiveDescription"
        )?.value.trim();


    /* ==========================
       VALIDATION
    ========================== */

    if (!sender) {

        alert(
            "Please enter the sender phone number."
        );

        return;

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;

    }


    receiveMoneyData = {

        sender,

        senderName,

        amount,

        description

    };


    console.log(
        "Processing Receive Money:",
        receiveMoneyData
    );


    processReceiveMoney();

}


/* ==========================================
   PROCESS RECEIVE MONEY
========================================== */

async function processReceiveMoney() {

    if (!receiveMoneyData) {

        return;

    }


    try {

        /* ==========================
           LOADING
        ========================== */

        showReceiveMoneyLoading();


        const response =
            await fetch(
                "/api/mpesa/receive",
                {

                    method: "POST",

                    headers:
                        typeof getHeaders === "function"
                            ? getHeaders()
                            : {
                                "Content-Type":
                                    "application/json"
                            },

                    body:
                        JSON.stringify(
                            receiveMoneyData
                        )

                }
            );


        const data =
            await response.json();


        console.log(
            "Receive Money Response:",
            data
        );


        /* ==========================
           ERROR
        ========================== */

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Could not receive money."
            );

        }


        /* ==========================
           UPDATE BALANCE
        ========================== */

        if (
            typeof updateMpesaBalanceDisplay ===
            "function"
        ) {

            updateMpesaBalanceDisplay(
                data.balance
            );

        }


        /* ==========================
           SHOW RECEIPT
        ========================== */

        showReceiveMoneyReceipt(data);


        /* ==========================
           REFRESH FINANCIAL DATA
        ========================== */

        if (
            typeof loadFinancialProfile ===
            "function"
        ) {

            loadFinancialProfile();

        }


    }

    catch (error) {

        console.error(
            "Receive Money Error:",
            error
        );


        alert(
            error.message ||
            "We could not receive the money."
        );

    }

}


/* ==========================================
   LOADING
========================================== */

function showReceiveMoneyLoading() {

    const button =
        document.querySelector(
            "#receiveMoneyModal .mpesa-primary-button"
        );

    if (!button) {

        return;

    }

    button.disabled = true;

    button.textContent =
        "Processing...";

}


/* ==========================================
   RECEIPT
========================================== */

function showReceiveMoneyReceipt(data) {

    closeReceiveMoney();


    const transaction =
        data.transaction || {};


    const amount =
        Number(
            data.balance !== undefined &&
                receiveMoneyData
                ? receiveMoneyData.amount
                : transaction.amount || 0
        );


    const sender =
        receiveMoneyData?.sender ||
        transaction.sender ||
        "";


    const senderName =
        receiveMoneyData?.senderName ||
        transaction.metadata?.senderName ||
        "";


    const reference =
        transaction.reference ||
        "MPESA";


    const receipt =
        document.createElement("div");

    receipt.id =
        "receiveMoneyReceipt";

    receipt.className =
        "mpesa-receipt";


    receipt.innerHTML = `

        <div class="mpesa-receipt-content">

            <div class="receipt-success">
                ✓
            </div>

            <h2>
                Money Received
            </h2>

            <p>
                M-Pesa money received successfully.
            </p>


            <div class="receipt-amount">

                KES
                ${amount.toLocaleString(
        "en-KE"
    )}

            </div>


            <div class="receipt-details">

                <div>
                    <span>
                        Sender
                    </span>

                    <strong>
                        ${escapeReceiveMoneyHtml(
        senderName ||
        sender
    )}
                    </strong>
                </div>


                <div>
                    <span>
                        Phone
                    </span>

                    <strong>
                        ${escapeReceiveMoneyHtml(
        sender
    )}
                    </strong>
                </div>


                <div>
                    <span>
                        Reference
                    </span>

                    <strong>
                        ${escapeReceiveMoneyHtml(
        reference
    )}
                    </strong>
                </div>


                <div>
                    <span>
                        New Balance
                    </span>

                    <strong>
                        KES
                        ${Number(
        data.balance || 0
    ).toLocaleString(
        "en-KE"
    )}
                    </strong>
                </div>

            </div>


            <button
                type="button"
                onclick="closeReceiveMoneyReceipt()"
                class="mpesa-primary-button"
            >
                Done
            </button>

        </div>

    `;


    document.body.appendChild(
        receipt
    );

}


/* ==========================================
   CLOSE RECEIPT
========================================== */

function closeReceiveMoneyReceipt() {

    const receipt =
        document.getElementById(
            "receiveMoneyReceipt"
        );

    if (receipt) {

        receipt.remove();

    }

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeReceiveMoneyHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.openReceiveMoney =
    openReceiveMoney;

window.closeReceiveMoney =
    closeReceiveMoney;

window.previewReceiveMoney =
    previewReceiveMoney;

window.processReceiveMoney =
    processReceiveMoney;

window.closeReceiveMoneyReceipt =
    closeReceiveMoneyReceipt;


console.log(
    "✅ Receive Money functions exported"
);