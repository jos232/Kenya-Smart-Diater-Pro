/* ==========================================
   KCB MOBILE BANKING
   CARDS MODULE
   Part 1 - Initialization & Card Loading
========================================== */

"use strict";

/* ==========================================
   CARD STATE
========================================== */

let kcbCard = {
    id: null,
    type: "KCB Debit Card",
    holderName: "Joshua Nkario",
    number: "4567 8901 2345 6789",
    expiry: "12/30",
    cvv: "456",

    frozen: false,
    blocked: false,

    onlinePayments: true,
    internationalPayments: false,
    contactlessPayments: true,

    limits: {
        atm: 50000,
        pos: 150000,
        online: 100000
    }
};

/* ==========================================
   LOAD KCB CARD FROM BACKEND
========================================== */

async function loadKCBCard() {

    try {

        /* -------------------------
           GET TOKEN
        ------------------------- */

        const token = localStorage.getItem("token");

        if (!token) {

            console.warn("No authentication token found.");

            updateCardDashboard();

            return;

        }

        /* -------------------------
           FETCH CARD
        ------------------------- */
        const response = await fetch(

            API.BASE_URL + API.ENDPOINTS.cards,

            {

                method: "GET",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                }

            }

        );


        if (!response.ok) {

            throw new Error(

                `Server Error ${response.status}`

            );

        }

        const data = await response.json();

        /* -------------------------
           UPDATE LOCAL OBJECT
        ------------------------- */

        if (data) {

            kcbCard = {

                ...kcbCard,

                ...data

            };

        }

        console.log("✅ Card Loaded From Backend");

    }

    catch (error) {

        console.warn(

            "Using Local Card:",

            error.message

        );

    }

    /* -------------------------
       REFRESH UI
    ------------------------- */

    updateCardDashboard();

}

/* ==========================================
   SAVE CARD
========================================== */

async function saveKCBCard() {

    try {

        await fetch("/api/kcb/cards", {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(kcbCard)

        });

    }

    catch (error) {

        console.warn("Card sync failed.");

    }

}

/* ==========================================
   OPEN CARD SCREEN
========================================== */

function openCards() {

    updateCardDashboard();

    showScreen("kcbCards");

}

/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateCardDashboard() {

    const statusElement =
        document.getElementById("cardStatus");

    if (statusElement) {

        if (kcbCard.blocked) {

            statusElement.textContent = "Blocked";

            statusElement.className = "status blocked";

        }

        else if (kcbCard.frozen) {

            statusElement.textContent = "Frozen";

            statusElement.className = "status frozen";

        }

        else {

            statusElement.textContent = "Active";

            statusElement.className = "status active";

        }

    }

    const holder =
        document.getElementById("cardHolder");

    if (holder)
        holder.textContent = kcbCard.holderName;

    const number =
        document.getElementById("cardNumber");

    if (number)
        number.textContent = kcbCard.number;

    const expiry =
        document.getElementById("cardExpiry");

    if (expiry)
        expiry.textContent = kcbCard.expiry;

}

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadKCBCard();

});
/* ==========================================
   PART 2
   CARD DETAILS & FREEZE
========================================== */

/* ==========================
   VIEW CARD DETAILS
========================== */

async function viewCardDetails() {

    const pin = prompt("Enter Transaction PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);
        return;

    }

    alert(

        "Card Holder\n" +
        kcbCard.holderName +

        "\n\nCard Number\n" +
        kcbCard.number +

        "\n\nExpiry\n" +
        kcbCard.expiry +

        "\n\nCVV\n" +
        kcbCard.cvv +

        "\n\nStatus\n" +
        getCardStatus()

    );

}

/* ==========================
   FREEZE / UNFREEZE
========================== */

async function toggleCardFreeze() {

    if (kcbCard.blocked) {

        alert("This card has already been blocked.");

        return;

    }

    const pin = prompt("Enter Transaction PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    kcbCard.frozen = !kcbCard.frozen;

    await saveKCBCard();

    updateCardDashboard();

    const transaction = createTransaction({

        bank: "KCB",

        service: kcbCard.frozen
            ? "CARD FREEZE"
            : "CARD ACTIVATED",

        sender: kcbAccount.accountNumber,

        recipient: "KCB Cards",

        amount: 0,

        fee: 0,

        total: 0,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    if (kcbCard.frozen) {

        addBankNotification(

            "Card Frozen",

            "Your KCB Debit Card has been frozen successfully."

        );

        alert("Card Frozen Successfully.");

    }

    else {

        addBankNotification(

            "Card Activated",

            "Your KCB Debit Card has been activated."

        );

        alert("Card Activated Successfully.");

    }

    loadKCBRecentTransactions();

}

/* ==========================
   CARD STATUS
========================== */

function getCardStatus() {

    if (kcbCard.blocked)
        return "Blocked";

    if (kcbCard.frozen)
        return "Frozen";

    return "Active";

}
/* ==========================================
   PART 3
   BLOCK CARD • CHANGE PIN • CARD LIMITS
========================================== */

/* ==========================
   BLOCK CARD
========================== */

async function blockCard() {

    if (kcbCard.blocked) {

        alert("Card is already blocked.");

        return;

    }

    const confirmBlock = confirm(
        "This action cannot be undone.\n\nBlock this card permanently?"
    );

    if (!confirmBlock)
        return;

    const pin = prompt("Enter Transaction PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    kcbCard.blocked = true;

    kcbCard.frozen = true;

    await saveKCBCard();

    updateCardDashboard();

    const transaction = createTransaction({

        bank: "KCB",

        service: "CARD BLOCKED",

        sender: kcbAccount.accountNumber,

        recipient: "KCB Cards",

        amount: 0,

        fee: 0,

        total: 0,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Card Blocked",

        "Your KCB Debit Card has been blocked permanently."

    );

    loadKCBRecentTransactions();

    alert("Card Blocked Successfully.");

}

/* ==========================
   CHANGE CARD PIN
========================== */

async function changeCardPIN() {

    const currentPIN = prompt("Enter Current PIN");

    const verify = verifyPIN(currentPIN);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const newPIN = prompt("Enter New 4-Digit PIN");

    if (!newPIN || newPIN.length !== 4) {

        alert("PIN must contain exactly 4 digits.");

        return;

    }

    await saveKCBCard();

    const transaction = createTransaction({

        bank: "KCB",

        service: "CARD PIN CHANGE",

        sender: kcbAccount.accountNumber,

        recipient: "KCB Cards",

        amount: 0,

        fee: 0,

        total: 0,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "PIN Changed",

        "Your Debit Card PIN has been changed successfully."

    );

    loadKCBRecentTransactions();

    alert("PIN Changed Successfully.");

}

/* ==========================
   VIEW CARD LIMITS
========================== */

function viewCardLimits() {

    alert(

        "ATM Limit : " +

        formatMoney(kcbCard.limits.atm) +

        "\n\nPOS Limit : " +

        formatMoney(kcbCard.limits.pos) +

        "\n\nOnline Limit : " +

        formatMoney(kcbCard.limits.online)

    );

}

/* ==========================
   UPDATE CARD LIMITS
========================== */

async function updateCardLimits() {

    const atm =
        Number(prompt("ATM Daily Limit", kcbCard.limits.atm));

    const pos =
        Number(prompt("POS Daily Limit", kcbCard.limits.pos));

    const online =
        Number(prompt("Online Daily Limit", kcbCard.limits.online));

    if (isNaN(atm) || isNaN(pos) || isNaN(online)) {

        alert("Invalid limits.");

        return;

    }

    kcbCard.limits.atm = atm;

    kcbCard.limits.pos = pos;

    kcbCard.limits.online = online;

    await saveKCBCard();

    addBankNotification(

        "Card Limits Updated",

        "Your Debit Card transaction limits have been updated."

    );

    alert("Limits Updated Successfully.");

}
/* ==========================================
   PART 4
   CARD SETTINGS • REPLACEMENT • EXPORTS
========================================== */

/* ==========================
   ONLINE PAYMENTS
========================== */

async function toggleOnlinePayments() {

    kcbCard.onlinePayments = !kcbCard.onlinePayments;

    await saveKCBCard();

    addBankNotification(

        "Online Payments",

        "Online Payments " +

        (kcbCard.onlinePayments ? "Enabled" : "Disabled")

    );

    alert(

        "Online Payments " +

        (kcbCard.onlinePayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   INTERNATIONAL PAYMENTS
========================== */

async function toggleInternationalPayments() {

    kcbCard.internationalPayments =

        !kcbCard.internationalPayments;

    await saveKCBCard();

    addBankNotification(

        "International Payments",

        "International Payments " +

        (kcbCard.internationalPayments ? "Enabled" : "Disabled")

    );

    alert(

        "International Payments " +

        (kcbCard.internationalPayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   CONTACTLESS PAYMENTS
========================== */

async function toggleContactless() {

    kcbCard.contactlessPayments =

        !kcbCard.contactlessPayments;

    await saveKCBCard();

    addBankNotification(

        "Contactless Payments",

        "Contactless Payments " +

        (kcbCard.contactlessPayments ? "Enabled" : "Disabled")

    );

    alert(

        "Contactless Payments " +

        (kcbCard.contactlessPayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   REPLACE CARD
========================== */

async function replaceCard() {

    if (!confirm(

        "Request a replacement card?"

    )) return;

    const pin = prompt(

        "Enter Transaction PIN"

    );

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    await saveKCBCard();

    const transaction = createTransaction({

        bank: "KCB",

        service: "CARD REPLACEMENT",

        sender: kcbAccount.accountNumber,

        recipient: "KCB Cards",

        amount: 0,

        fee: 0,

        total: 0,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Replacement Requested",

        "Your replacement card request has been submitted."

    );

    loadKCBRecentTransactions();

    alert(

        "Replacement Card Request Submitted."

    );

}

/* ==========================
   EXPORTS
========================== */

window.openCards = openCards;

window.loadKCBCard = loadKCBCard;

window.updateCardDashboard = updateCardDashboard;

window.viewCardDetails = viewCardDetails;

window.toggleCardFreeze = toggleCardFreeze;

window.blockCard = blockCard;

window.changeCardPIN = changeCardPIN;

window.viewCardLimits = viewCardLimits;

window.updateCardLimits = updateCardLimits;

window.toggleOnlinePayments = toggleOnlinePayments;

window.toggleInternationalPayments = toggleInternationalPayments;

window.toggleContactless = toggleContactless;

window.replaceCard = replaceCard;

window.getCardStatus = getCardStatus;

window.kcbCard = kcbCard;

/* ==========================
   AUTO LOAD
========================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadKCBCard();

    }

);

console.log(

    "✅ KCB Cards Module Loaded"

);