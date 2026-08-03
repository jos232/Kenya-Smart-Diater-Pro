/* ==========================================
   KCB CARDS
========================================== */

"use strict";

let cardFrozen = false;

let cardBlocked = false;

/* ==========================
   OPEN CARDS
========================== */

function openCards() {

    showScreen("kcbCards");

}

/* ==========================
   FREEZE CARD
========================== */

function toggleCardFreeze() {

    if (cardBlocked) {

        alert("Card has already been blocked.");

        return;

    }

    cardFrozen = !cardFrozen;

    if (cardFrozen) {

        addBankNotification(

            "Card Frozen",

            "Your KCB Debit Card has been frozen."

        );

        alert("Card Frozen Successfully.");

    }

    else {

        addBankNotification(

            "Card Activated",

            "Your KCB Debit Card is active."

        );

        alert("Card Activated.");

    }

}

/* ==========================
   VIEW CARD DETAILS
========================== */

function viewCardDetails() {

    const pin = prompt("Enter your PIN");

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    alert(

        "Card Number:\n" +

        "4567 8901 2345 6789\n\n" +

        "Expiry: 12/30\n\n" +

        "CVV: 456"

    );

}

/* ==========================
   BLOCK CARD
========================== */

function blockCard() {

    const confirmBlock = confirm(

        "Block this card permanently?"

    );

    if (!confirmBlock) return;

    cardBlocked = true;

    cardFrozen = true;

    addBankNotification(

        "Card Blocked",

        "Your KCB Debit Card has been blocked."

    );

    alert("Card blocked successfully.");

}
/* ==========================================
   CARD SETTINGS
========================================== */

let onlinePayments = true;
let internationalPayments = false;
let contactlessPayments = true;

/* ==========================
   CHANGE PIN
========================== */

function changeCardPIN() {

    const currentPin = prompt("Enter Current PIN");

    const verify = verifyPIN(currentPin);

    if (!verify.success) {

        alert(verify.message);
        return;

    }

    const newPin = prompt("Enter New PIN");

    if (!newPin || newPin.length !== 4) {

        alert("PIN must be 4 digits.");
        return;

    }

    alert("PIN changed successfully.");

    addBankNotification(

        "PIN Changed",

        "Your KCB card PIN has been updated."

    );

}

/* ==========================
   CARD LIMITS
========================== */

const cardLimits = {

    atm: 50000,

    pos: 150000,

    online: 100000

};

function viewCardLimits() {

    alert(

        "ATM Limit: " + formatMoney(cardLimits.atm) +

        "\nPOS Limit: " + formatMoney(cardLimits.pos) +

        "\nOnline Limit: " + formatMoney(cardLimits.online)

    );

}

/* ==========================
   ONLINE PAYMENTS
========================== */

function toggleOnlinePayments() {

    onlinePayments = !onlinePayments;

    alert(

        "Online Payments " +

        (onlinePayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   INTERNATIONAL PAYMENTS
========================== */

function toggleInternationalPayments() {

    internationalPayments = !internationalPayments;

    alert(

        "International Payments " +

        (internationalPayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   CONTACTLESS
========================== */

function toggleContactless() {

    contactlessPayments = !contactlessPayments;

    alert(

        "Contactless Payments " +

        (contactlessPayments ? "Enabled" : "Disabled")

    );

}

/* ==========================
   REPLACE CARD
========================== */

function replaceCard() {

    if (!confirm("Request replacement card?"))
        return;

    addBankNotification(

        "Replacement Requested",

        "Your replacement card request has been submitted."

    );

    alert("Replacement request submitted.");

}

/* ==========================
   CARD STATUS
========================== */

function getCardStatus() {

    if (cardBlocked)
        return "Blocked";

    if (cardFrozen)
        return "Frozen";

    return "Active";

}
/* ==========================================
   EXPORTS
========================================== */

window.openCards = openCards;

window.toggleCardFreeze = toggleCardFreeze;

window.viewCardDetails = viewCardDetails;

window.blockCard = blockCard;

window.changeCardPIN = changeCardPIN;

window.viewCardLimits = viewCardLimits;

window.toggleOnlinePayments = toggleOnlinePayments;

window.toggleInternationalPayments = toggleInternationalPayments;

window.toggleContactless = toggleContactless;

window.replaceCard = replaceCard;

window.getCardStatus = getCardStatus;

window.cardLimits = cardLimits;

window.cardFrozen = cardFrozen;

window.cardBlocked = cardBlocked;

window.onlinePayments = onlinePayments;

window.internationalPayments = internationalPayments;

window.contactlessPayments = contactlessPayments;