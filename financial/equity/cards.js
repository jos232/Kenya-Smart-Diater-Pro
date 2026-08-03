/* ==========================================
   EQUITY MOBILE BANKING
   CARDS
========================================== */

"use strict";

/* ==========================
   CARD DETAILS
========================== */

let equityCard = {

    type: "Visa Debit",

    number: "**** **** **** 4587",

    expiry: "12/30",

    status: "ACTIVE",

    frozen: false

};

/* ==========================
   OPEN CARDS
========================== */

function openEquityCards() {

    loadEquityCard();

    showScreen("equityCards");

}

/* ==========================
   LOAD CARD
========================== */

function loadEquityCard() {

    const number =
        document.getElementById("equityCardNumber");

    const type =
        document.getElementById("equityCardType");

    const expiry =
        document.getElementById("equityCardExpiry");

    const status =
        document.getElementById("equityCardStatus");

    if (number)
        number.textContent =
            equityCard.number;

    if (type)
        type.textContent =
            equityCard.type;

    if (expiry)
        expiry.textContent =
            equityCard.expiry;

    if (status)
        status.textContent =
            equityCard.status;

}

/* ==========================
   FREEZE CARD
========================== */

function freezeEquityCard() {

    equityCard.frozen = !equityCard.frozen;

    equityCard.status =
        equityCard.frozen
            ? "FROZEN"
            : "ACTIVE";

    loadEquityCard();

    addBankNotification(

        "Card Updated",

        `Your card is now ${equityCard.status}.`

    );

}
/* ==========================================
   VIEW FULL CARD DETAILS
========================================== */

function viewEquityCardDetails() {

    const pin = prompt("Enter your PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    alert(

        "Card Number:\n" +

        "4587 1234 5678 9012\n\n" +

        "Expiry: " + equityCard.expiry +

        "\n\nCVV: 456"

    );

}

/* ==========================================
   BLOCK CARD
========================================== */

function blockEquityCard() {

    if (!confirm("Block this card permanently?")) {

        return;

    }

    equityCard.status = "BLOCKED";

    equityCard.frozen = true;

    loadEquityCard();

    addBankNotification(

        "Card Blocked",

        "Your Equity Visa Debit Card has been blocked."

    );

}

/* ==========================================
   REPLACE CARD
========================================== */

function replaceEquityCard() {

    if (!confirm("Request a replacement card?")) {

        return;

    }

    addBankNotification(

        "Replacement Requested",

        "Your replacement card request has been submitted."

    );

    alert(

        "Replacement request submitted successfully."

    );

}

/* ==========================================
   CHANGE CARD PIN
========================================== */

function changeEquityCardPIN() {

    const current = prompt("Current PIN");

    const verify = verifyPIN(current);

    if (!verify.success) {

        alert("Incorrect PIN.");

        return;

    }

    const newPin = prompt("Enter new 4-digit PIN");

    if (!newPin || newPin.length !== 4) {

        alert("PIN must contain exactly 4 digits.");

        return;

    }

    localStorage.setItem("bankPIN", newPin);

    addBankNotification(

        "PIN Changed",

        "Your card PIN has been changed successfully."

    );

    alert("Card PIN changed successfully.");

}

/* ==========================================
   CARD LIMITS
========================================== */

function manageEquityCardLimits() {

    alert(

        "Daily Card Limits\n\n" +

        "ATM: KSh 100,000\n" +

        "POS: KSh 300,000\n" +

        "Online: KSh 200,000"

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.viewEquityCardDetails = viewEquityCardDetails;
window.blockEquityCard = blockEquityCard;
window.replaceEquityCard = replaceEquityCard;
window.changeEquityCardPIN = changeEquityCardPIN;
window.manageEquityCardLimits = manageEquityCardLimits;