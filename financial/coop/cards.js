/* ==========================================
   CO-OPERATIVE BANK
   CARDS
========================================== */

"use strict";

/* ==========================
   CARD DETAILS
========================== */

let coopCard = {

    type: "Visa Debit",

    number: "**** **** **** 6734",

    expiry: "12/30",

    cvv: "***",

    status: "ACTIVE",

    frozen: false,

    blocked: false,

    onlinePayments: true,

    internationalPayments: false,

    contactlessPayments: true,

    atmLimit: 50000,

    posLimit: 150000,

    onlineLimit: 100000

};

/* ==========================
   OPEN CARDS
========================== */

function openCoopCards() {

    loadCoopCard();

    showScreen("coopCards");

}

/* ==========================
   LOAD CARD
========================== */

function loadCoopCard() {

    const number =
        document.getElementById("coopCardNumber");

    const type =
        document.getElementById("coopCardType");

    const expiry =
        document.getElementById("coopCardExpiry");

    const status =
        document.getElementById("coopCardStatus");

    if (number)
        number.textContent = coopCard.number;

    if (type)
        type.textContent = coopCard.type;

    if (expiry)
        expiry.textContent = coopCard.expiry;

    if (status)
        status.textContent = coopCard.status;

}

/* ==========================
   FREEZE CARD
========================== */

function freezeCoopCard() {

    if (coopCard.blocked) {

        alert("Card has already been blocked.");

        return;

    }

    coopCard.frozen = !coopCard.frozen;

    coopCard.status =
        coopCard.frozen ? "FROZEN" : "ACTIVE";

    loadCoopCard();

    addBankNotification(

        "Card Updated",

        `Your card is now ${coopCard.status}.`

    );

}

/* ==========================
   VIEW CARD DETAILS
========================== */

function viewCoopCardDetails() {

    const pin = prompt("Enter Transaction PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    alert(

        "Card Number:\n" +

        "4567 8901 2345 6734\n\n" +

        "Expiry: " + coopCard.expiry +

        "\nCVV: 456"

    );

}

/* ==========================
   BLOCK CARD
========================== */

function blockCoopCard() {

    if (!confirm("Block this card permanently?"))

        return;

    coopCard.blocked = true;

    coopCard.frozen = true;

    coopCard.status = "BLOCKED";

    loadCoopCard();

    addBankNotification(

        "Card Blocked",

        "Your Co-operative Bank card has been blocked."

    );

}

/* ==========================
   CHANGE CARD PIN
========================== */

function changeCoopCardPIN() {

    const currentPin =
        prompt("Enter Current PIN");

    const verify =
        verifyPIN(currentPin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const newPin =
        prompt("Enter New PIN");

    if (!newPin || newPin.length !== 4) {

        alert("PIN must contain exactly 4 digits.");

        return;

    }

    alert("Card PIN changed successfully.");

    addBankNotification(

        "PIN Changed",

        "Your Co-op card PIN has been updated."

    );

}

/* ==========================
   VIEW LIMITS
========================== */

function viewCoopCardLimits() {

    alert(

        "ATM Limit: " +

        formatMoney(coopCard.atmLimit) +

        "\nPOS Limit: " +

        formatMoney(coopCard.posLimit) +

        "\nOnline Limit: " +

        formatMoney(coopCard.onlineLimit)

    );

}

/* ==========================
   ONLINE PAYMENTS
========================== */

function toggleCoopOnlinePayments() {

    coopCard.onlinePayments =

        !coopCard.onlinePayments;

    alert(

        "Online Payments " +

        (coopCard.onlinePayments ?

            "Enabled" :

            "Disabled")

    );

}

/* ==========================
   INTERNATIONAL PAYMENTS
========================== */

function toggleCoopInternationalPayments() {

    coopCard.internationalPayments =

        !coopCard.internationalPayments;

    alert(

        "International Payments " +

        (coopCard.internationalPayments ?

            "Enabled" :

            "Disabled")

    );

}

/* ==========================
   CONTACTLESS
========================== */

function toggleCoopContactless() {

    coopCard.contactlessPayments =

        !coopCard.contactlessPayments;

    alert(

        "Contactless Payments " +

        (coopCard.contactlessPayments ?

            "Enabled" :

            "Disabled")

    );

}

/* ==========================
   REPLACE CARD
========================== */

function replaceCoopCard() {

    if (!confirm(

        "Request replacement card?"

    )) return;

    addBankNotification(

        "Replacement Requested",

        "Your replacement card request has been submitted."

    );

    alert(

        "Replacement request submitted."

    );

}

/* ==========================
   CARD STATUS
========================== */

function getCoopCardStatus() {

    if (coopCard.blocked)

        return "Blocked";

    if (coopCard.frozen)

        return "Frozen";

    return "Active";

}

/* ==========================
   REFRESH
========================== */

function refreshCoopCard() {

    loadCoopCard();

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopCards = openCoopCards;

window.loadCoopCard = loadCoopCard;

window.freezeCoopCard = freezeCoopCard;

window.viewCoopCardDetails = viewCoopCardDetails;

window.blockCoopCard = blockCoopCard;

window.changeCoopCardPIN = changeCoopCardPIN;

window.viewCoopCardLimits = viewCoopCardLimits;

window.toggleCoopOnlinePayments = toggleCoopOnlinePayments;

window.toggleCoopInternationalPayments = toggleCoopInternationalPayments;

window.toggleCoopContactless = toggleCoopContactless;

window.replaceCoopCard = replaceCoopCard;

window.getCoopCardStatus = getCoopCardStatus;

window.refreshCoopCard = refreshCoopCard;