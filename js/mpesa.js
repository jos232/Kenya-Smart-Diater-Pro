"use strict";

/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA / SEND MONEY MODULE
========================================== */

console.log("M-Pesa Module Loaded");


/* ==========================================
   NETWORK DETECTION
========================================== */

function detectTransferNetwork() {

    const input = document.getElementById("sendMoneyNumber");
    const result = document.getElementById("transferNetwork");

    if (!input || !result) {
        console.warn(
            "M-Pesa network detection elements not found."
        );
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

    const network =
        networks[prefix] || "Unknown";

    result.textContent =
        `Network : ${network}`;
}


/* ==========================================
   M-PESA TOAST
========================================== */

function showMPesaToast(
    message,
    type = "info"
) {

    /*
       IMPORTANT:
       Do NOT call showToast() here.
       That caused the previous recursive
       Maximum call stack error.
    */

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    if (toast && toastMessage) {

        toastMessage.textContent =
            message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

        return;
    }


    /*
       Fallback if the toast HTML
       does not exist.
    */

    console.log(
        `[${type}] ${message}`
    );
}


/* ==========================================
   VALIDATE SEND MONEY
========================================== */

function validateTransfer() {

    const phoneElement =
        document.getElementById(
            "sendMoneyNumber"
        );

    const nameElement =
        document.getElementById(
            "recipientName"
        );

    const amountElement =
        document.getElementById(
            "sendAmount"
        );

    const descriptionElement =
        document.getElementById(
            "sendDescription"
        );


    const phone =
        phoneElement?.value.trim() || "";

    const name =
        nameElement?.value.trim() || "";

    const amount =
        Number(
            amountElement?.value || 0
        );

    const description =
        descriptionElement?.value.trim() || "";


    /* -------------------------
       PHONE
    ------------------------- */

    if (!phone) {

        showMPesaToast(
            "Please enter recipient phone number",
            "error"
        );

        return null;
    }


    if (!/^07\d{8}$/.test(phone)) {

        showMPesaToast(
            "Enter a valid Kenyan phone number",
            "error"
        );

        return null;
    }


    /* -------------------------
       NAME
    ------------------------- */

    if (!name) {

        showMPesaToast(
            "Please enter recipient name",
            "error"
        );

        return null;
    }


    /* -------------------------
       AMOUNT
    ------------------------- */

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showMPesaToast(
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

    const transfer =
        validateTransfer();


    if (!transfer) {
        return;
    }


    const networkElement =
        document.getElementById(
            "transferNetwork"
        );


    const network =
        networkElement?.textContent
            ?.replace(
                "Network :",
                ""
            )
            .trim() ||
        "Unknown";


    const confirmed =
        confirm(

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
   PROCESS M-PESA SEND MONEY
========================================== */

async function processMpesaTransfer(
    transfer,
    network
) {

    try {

        console.log(
            "Processing M-Pesa Send Money:",
            transfer
        );


        /* ==========================================
           AUTHENTICATION
        ========================================== */

        const token =
            localStorage.getItem("token") || "";


        if (!token) {

            showMPesaToast(
                "Please login again.",
                "error"
            );

            return null;
        }


        /* ==========================================
           SECURITY PIN
        ========================================== */

        const securityPin =
            prompt("Enter your 4-digit M-Pesa Security PIN:");

        if (!/^\d{4}$/.test(securityPin || "")) {

            showMPesaToast(
                "Please enter your 4-digit Security PIN.",
                "error"
            );

            return null;
        }


        /* ==========================================
           SEND REQUEST
        ========================================== */

        const response =
            await fetch(
                "/api/mpesa/send",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        recipient:
                            transfer.phone,

                        recipientName:
                            transfer.name,

                        amount:
                            transfer.amount,


                        securityPin:
                            securityPin,
                        description:
                            transfer.description || ""

                    })

                }
            );


        /* ==========================================
           READ RESPONSE
        ========================================== */

        const data =
            await response.json();


        console.log(
            "Send Money Response:",
            data
        );


        /* ==========================================
           HANDLE ERROR
        ========================================== */

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(

                data.message ||
                "M-Pesa transfer failed."

            );

        }


        /* ==========================================
           SUCCESS
        ========================================== */

        showMPesaToast(

            "Money sent successfully.",

            "success"

        );


        /* ==========================================
           UPDATE BALANCE IMMEDIATELY
        ========================================== */

        updateMpesaBalanceDisplay(
            data.balance
        );


        /* ==========================================
           SHOW RECEIPT
        ========================================== */

        showSendMoneyReceipt(
            data.transaction
        );


        /* ==========================================
           CLEAR FORM
        ========================================== */

        clearTransferForm();


        /* ==========================================
           REFRESH DASHBOARD
        ========================================== */

        if (
            typeof loadMpesaDashboard ===
            "function"
        ) {

            loadMpesaDashboard();

        }


        return data;

    }

    catch (error) {

        console.error(
            "M-Pesa Send Money Error:",
            error
        );


        showMPesaToast(

            error.message ||
            "Unable to send M-Pesa money.",

            "error"

        );


        return null;

    }

}

/* ==========================================
   UPDATE M-PESA BALANCE DISPLAY
========================================== */

function updateMpesaBalanceDisplay(
    balance
) {

    const balanceElements = [

        document.getElementById(
            "mpesaBalance"
        ),

        document.getElementById(
            "mpesaDashboardBalance"
        )

    ];


    balanceElements.forEach(
        element => {

            if (!element) {
                return;
            }


            const numericBalance =
                Number(balance) || 0;


            element.textContent =
                "KSh " +
                numericBalance.toLocaleString(
                    "en-KE",
                    {

                        minimumFractionDigits:
                            2,

                        maximumFractionDigits:
                            2

                    }
                );

        }
    );


    console.log(
        "M-Pesa balance updated:",
        balance
    );

}

/* ==========================================
   SEND MONEY RECEIPT
========================================== */

function showSendMoneyReceipt(
    transaction
) {

    if (!transaction) {
        return;
    }


    const recipient =
        transaction.metadata?.recipientName ||
        transaction.recipient ||
        "Recipient";


    const amount =
        Number(
            transaction.amount || 0
        );


    const balance =
        Number(
            transaction.balance || 0
        );


    const receipt =
        transaction.receiptNumber ||
        transaction.reference ||
        "M-PESA";


    const message =

        "M-PESA PAYMENT SUCCESSFUL\n\n" +

        "Recipient: " +
        recipient +
        "\n\n" +

        "Amount: KSh " +
        amount.toLocaleString(
            "en-KE",
            {
                minimumFractionDigits: 2
            }
        ) +
        "\n\n" +

        "Receipt: " +
        receipt +
        "\n\n" +

        "New Balance: KSh " +
        balance.toLocaleString(
            "en-KE",
            {
                minimumFractionDigits: 2
            }
        );


    console.log(
        message
    );

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
   M-PESA DASHBOARD
========================================== */

function openMpesaDashboard() {

    console.log(
        "Opening M-Pesa Dashboard..."
    );


    if (
        typeof window.showScreen ===
        "function"
    ) {

        window.showScreen(
            "mpesaDashboard"
        );

    }
    else {

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

    console.log("M-Pesa dashboard loaded");

    try {

        const token =
            localStorage.getItem("token") || "";

        if (!token) {

            console.warn(
                "No authentication token found."
            );

            return;
        }

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


        /* ==========================================
           REAL M-PESA BALANCE
        ========================================== */

        const transactions =
            data?.transactions ||
            data?.history ||
            [];

        let balance = 0;

        if (
            Array.isArray(transactions) &&
            transactions.length > 0
        ) {

            const latestTransaction =
                transactions[0];

            balance =
                Number(
                    latestTransaction.balance || 0
                );

        }


        /* ==========================================
           DISPLAY BALANCE
        ========================================== */

        const balanceElement =
            document.getElementById(
                "mpesaBalance"
            ) ||
            document.getElementById(
                "mpesaDashboardBalance"
            );

        if (balanceElement) {

            balanceElement.textContent =
                "KSh " +
                balance.toLocaleString(
                    "en-KE",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

        }


        /* ==========================================
           RENDER TRANSACTIONS
        ========================================== */

        renderMpesaTransactions(
            data
        );

    }

    catch (error) {

        console.error(
            "M-Pesa dashboard error:",
            error
        );

    }

}


/* ==========================================
   RENDER M-PESA TRANSACTIONS
========================================== */

function renderMpesaTransactions(data) {

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


    if (
        !Array.isArray(transactions) ||
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="mpesa-empty-state">

                <div class="empty-icon">
                    "M-Pesa transaction service ready";
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
                        transaction.amount || 0
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
                            <img src="assets/logo.png"
                                 alt="M-Pesa"
                                 class="transaction-icon-image">
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
   SEND MONEY
========================================== */

function openMpesaSendMoney() {

    console.log("Opening M-Pesa Send Money...");



    if (
        typeof window.showScreen ===
        "function"
    ) {

        window.showScreen(
            "sendMoneyService"
        );

    }
    else {

        console.error(
            "showScreen() is not available"
        );

    }
}

/* ==========================================
   RECEIVE MONEY
========================================== */

function openMpesaReceiveMoney() {

    console.log(
        "Opening Receive Money..."
    );

    openReceiveMoney();

}


/* ==========================================
   AIRTIME
========================================== */

function openMpesaAirtime() {

    if (typeof openAirtime === "function") {

        openAirtime();

        return;

    }

    showMPesaToast(
        "Airtime service is unavailable.",
        "error"
    );

}


/* ==========================================
   PAY BILL
========================================== */

function openMpesaPayBill() {

    if (typeof window.showScreen === "function") {

        window.showScreen("mpesaPayBill");

    }
    else {

        console.error(
            "showScreen() is not available"
        );

    }

}


/* ==========================================
   SUBMIT M-PESA PAY BILL
========================================== */

async function submitMpesaPayBill() {

    const business =
        document.getElementById("mpesaBillBusiness")?.value.trim();

    const billNumber =
        document.getElementById("mpesaBillNumber")?.value.trim();

    const account =
        document.getElementById("mpesaBillAccount")?.value.trim();

    const amount =
        Number(
            document.getElementById("mpesaBillAmount")?.value
        );

    const pin =
        document.getElementById("mpesaBillPIN")?.value.trim();


    if (!business) {
        showMPesaToast(
            "Enter the business name.",
            "error"
        );
        return;
    }


    if (!billNumber) {
        showMPesaToast(
            "Enter the Paybill number.",
            "error"
        );
        return;
    }


    if (!account) {
        showMPesaToast(
            "Enter the account number.",
            "error"
        );
        return;
    }


    if (!Number.isFinite(amount) || amount <= 0) {
        showMPesaToast(
            "Enter a valid amount.",
            "error"
        );
        return;
    }


    if (!/^\d{4}$/.test(pin)) {
        showMPesaToast(
            "Enter your 4-digit transaction PIN.",
            "error"
        );
        return;
    }


    const confirmed = window.confirm(
        "Pay KES " +
        amount.toLocaleString() +
        " to " +
        business +
        "?"
    );


    if (!confirmed) {
        return;
    }


    try {

        showMPesaToast(
            "Processing Pay Bill...",
            "info"
        );


        const token =
            typeof getToken === "function"
                ? getToken()
                : localStorage.getItem("token");


        const response =
            await fetch(
                "/api/mpesa/paybill",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                "Authorization":
                                    "Bearer " + token
                            }
                            : {})
                    },

                    body: JSON.stringify({

                        businessName:
                            business,

                        paybillNumber:
                            billNumber,

                        accountNumber:
                            account,

                        amount:
                            amount,

                        securityPin:
                            pin

                    })
                }
            );


        const data =
            await response
                .json()
                .catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Pay Bill transaction failed."
            );

        }


        showMPesaToast(
            data.message ||
            "Pay Bill successful.",
            "success"
        );


        const businessInput =
            document.getElementById(
                "mpesaBillBusiness"
            );

        const numberInput =
            document.getElementById(
                "mpesaBillNumber"
            );

        const accountInput =
            document.getElementById(
                "mpesaBillAccount"
            );

        const amountInput =
            document.getElementById(
                "mpesaBillAmount"
            );

        const pinInput =
            document.getElementById(
                "mpesaBillPIN"
            );


        if (businessInput)
            businessInput.value = "";

        if (numberInput)
            numberInput.value = "";

        if (accountInput)
            accountInput.value = "";

        if (amountInput)
            amountInput.value = "";

        if (pinInput)
            pinInput.value = "";


        if (
            typeof window.showScreen ===
            "function"
        ) {

            window.showScreen(
                "mpesaDashboard"
            );

        }


        if (
            typeof window.loadMpesaDashboard ===
            "function"
        ) {

            window.loadMpesaDashboard();

        }

    }
    catch (error) {

        console.error(
            "M-PESA PAY BILL ERROR:",
            error
        );

        showMPesaToast(
            error.message ||
            "Unable to process Pay Bill.",
            "error"
        );

    }

}


/* ==========================================
   BUY GOODS
========================================== */

function openMpesaBuyGoods() {

    showMPesaToast(
        "M-Pesa Buy Goods feature will be connected next.",
        "info"
    );
}


/* ==========================================
   TRANSACTIONS
========================================== */

/* ==========================================
   LOAD M-PESA TRANSACTIONS
========================================== */

async function loadMpesaTransactions() {

    const container =
        document.getElementById(
            "mpesaAllTransactions"
        );

    if (!container) {
        console.warn(
            "mpesaAllTransactions container not found."
        );
        return;
    }

    container.innerHTML = `
        <div class="mpesa-empty-state">
            <div class="empty-icon">
                &#x23F3;
            </div>
            <p>Loading transactions...</p>
        </div>
    `;

    try {

        const token =
            localStorage.getItem("token") || "";

        if (!token) {
            throw new Error(
                "Authentication required."
            );
        }

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

        const data =
            await response
                .json()
                .catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load M-Pesa transactions."
            );
        }

        const transactions =
            data?.transactions ||
            data?.history ||
            [];

        if (
            !Array.isArray(transactions) ||
            transactions.length === 0
        ) {

            container.innerHTML = `
                <div class="mpesa-empty-state">

                    <div class="empty-icon">
                        &#x1F4CA;
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
                .map(transaction => {

                    const amount =
                        Number(
                            transaction.amount || 0
                        );

                    const service =
                        transaction.service ||
                        "M-PESA";

                    const recipient =
                        transaction.recipient ||
                        transaction.sender ||
                        transaction.metadata
                            ?.recipientName ||
                        "M-Pesa Transaction";

                    const reference =
                        transaction.reference ||
                        "M-PESA";

                    const status =
                        transaction.status ||
                        "SUCCESS";

                    const direction =
                        transaction.metadata
                            ?.direction ||
                        "DEBIT";

                    const date =
                        transaction.createdAt
                            ? new Date(
                                transaction.createdAt
                            ).toLocaleString(
                                "en-KE"
                            )
                            : "";

                    const prefix =
                        direction === "CREDIT"
                            ? "+ KSh "
                            : "- KSh ";

                    const icon =
                        '<img src="assets/logo.png" ' +
                        'alt="M-Pesa" ' +
                        'class="transaction-icon-image">';

                    return `
                        <div class="mpesa-transaction">

                            <div class="transaction-icon">
                                ${icon}
                            </div>

                            <div class="transaction-details">

                                <strong>
                                    ${recipient}
                                </strong>

                                <small>
                                    ${service}
                                </small>

                                <small>
                                    ${reference}
                                </small>

                                <small>
                                    ${status}
                                </small>

                                <small>
                                    ${date}
                                </small>

                            </div>

                            <div class="transaction-amount">

                                ${prefix}
                                ${amount.toLocaleString(
                        "en-KE"
                    )}

                            </div>

                        </div>
                    `;

                })
                .join("");

    }
    catch (error) {

        console.error(
            "M-Pesa Transactions Error:",
            error
        );

        container.innerHTML = `
            <div class="mpesa-empty-state">

                <div class="empty-icon">
                    &#x26A0;
                </div>

                <p>
                    ${error.message ||
            "Unable to load transactions."}
                </p>

            </div>
        `;

    }

}


/* ==========================================
   TRANSACTIONS
========================================== */
function openMpesaTransactions() {

    if (typeof window.showScreen === "function") {

        window.showScreen("mpesaTransactions");

    }
    else {

        console.error(
            "showScreen() is not available"
        );

        return;
    }

    loadMpesaTransactions();

}


/* ==========================================
   STATEMENT
========================================== */

function openMpesaStatement() {

    if (typeof window.showScreen === "function") {

        window.showScreen("mpesaStatement");

    }
    else {

        console.error(
            "showScreen() is not available"
        );

        return;

    }

    if (
        typeof window.loadMpesaStatement ===
        "function"
    ) {

        window.loadMpesaStatement();

    }

}


/* ==========================================
   SETTINGS
========================================== */

function openMpesaSettings() {

    if (typeof window.showScreen === "function") {

        window.showScreen("mpesaSettings");

    }
    else {

        console.error(
            "showScreen() is not available"
        );

        return;

    }

}


/* ==========================================
   SECURITY
========================================== */

function openMpesaSecurity() {

    if (typeof window.showScreen === "function") {

        window.showScreen("mpesaSecurity");

    }
    else {

        console.error(
            "showScreen() is not available"
        );

        return;

    }

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.detectTransferNetwork =
    detectTransferNetwork;

window.validateTransfer =
    validateTransfer;

window.previewTransfer =
    previewTransfer;

window.processMpesaTransfer =
    processMpesaTransfer;

window.updateMpesaBalanceDisplay =
    updateMpesaBalanceDisplay;

window.showSendMoneyReceipt =
    showSendMoneyReceipt;

window.clearTransferForm =
    clearTransferForm;

window.showMPesaToast =
    showMPesaToast;


/* ==========================================
   DASHBOARD EXPORTS
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

window.submitMpesaPayBill =
    submitMpesaPayBill;

window.openMpesaBuyGoods =
    openMpesaBuyGoods;

window.openMpesaTransactions =
    openMpesaTransactions;

window.openMpesaStatement =
    openMpesaStatement;

window.openMpesaSettings =
    openMpesaSettings;


/* ==========================================
   SAVE M-PESA SECURITY
========================================== */

async function saveMpesaSecurity() {

    const pin =
        document.getElementById("mpesaSecurityPIN")?.value.trim();

    const confirmPin =
        document.getElementById("mpesaSecurityConfirmPIN")?.value.trim();


    if (!/^\d{4}$/.test(pin)) {

        showMPesaToast(
            "Enter a valid 4-digit M-Pesa PIN.",
            "error"
        );

        return;
    }


    if (pin !== confirmPin) {

        showMPesaToast(
            "M-Pesa PINs do not match.",
            "error"
        );

        return;
    }


    try {

        showMPesaToast(
            "Saving M-Pesa security settings...",
            "info"
        );


        const token =
            typeof getToken === "function"
                ? getToken()
                : localStorage.getItem("token");


        const response =
            await fetch(
                "/api/mpesa/security",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                "Authorization":
                                    "Bearer " + token
                            }
                            : {})
                    },

                    body: JSON.stringify({
                        pin: pin
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not save M-Pesa security settings."
            );

        }


        showMPesaToast(
            data.message ||
            "M-Pesa security settings saved successfully.",
            "success"
        );


        const pinInput =
            document.getElementById(
                "mpesaSecurityPIN"
            );


        const confirmInput =
            document.getElementById(
                "mpesaSecurityConfirmPIN"
            );


        if (pinInput) {

            pinInput.value = "";

        }


        if (confirmInput) {

            confirmInput.value = "";

        }

    }

    catch (error) {

        console.error(
            "M-PESA SECURITY ERROR:",
            error
        );


        showMPesaToast(
            error.message ||
            "Could not save M-Pesa security settings.",
            "error"
        );

    }

}

window.saveMpesaSecurity = saveMpesaSecurity;

window.openMpesaSecurity =
    openMpesaSecurity;


/* ==========================================
   FINAL MODULE CHECK
========================================== */

console.log(
    console.log("M-Pesa functions exported")
);

console.log(
    console.log("M-Pesa Dashboard Controller Loaded")
);

