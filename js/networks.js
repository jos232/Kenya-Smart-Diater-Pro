/* ==========================================================
   NETWORK DETECTION
========================================================== */

"use strict";

/* ==========================================================
   NETWORK PREFIXES
========================================================== */

const NETWORK_PREFIXES = {

    Safaricom: [
        "070", "071", "072", "074", "079",
        "010", "011"
    ],

    Airtel: [
        "073", "075", "078"
    ],

    Telkom: [
        "077"
    ],

    Faiba: [
        "0741"
    ]

};

/* ==========================================================
   UPDATE NETWORK
========================================================== */

function updateNetwork() {

    const input = document.getElementById("phoneNumber");

    const result = document.getElementById("networkResult");

    if (!input || !result) return;

    const number = input.value.trim();

    if (number.length < 3) {

        Dialer.currentNetwork = "Unknown Network";

        result.textContent = "Unknown Network";

        result.className = "network-result";

        return;

    }

    const prefix4 = number.substring(0, 4);

    const prefix3 = number.substring(0, 3);

    let network = "Unknown Network";

    if (NETWORK_PREFIXES.Faiba.includes(prefix4)) {

        network = "Faiba";

    }

    else if (NETWORK_PREFIXES.Safaricom.includes(prefix3)) {

        network = "Safaricom";

    }

    else if (NETWORK_PREFIXES.Airtel.includes(prefix3)) {

        network = "Airtel Kenya";

    }

    else if (NETWORK_PREFIXES.Telkom.includes(prefix3)) {

        network = "Telkom Kenya";

    }

    Dialer.currentNetwork = network;

    result.textContent = network;

    result.className = "network-result";

    switch (network) {

        case "Safaricom":

            result.classList.add("safaricom");

            break;

        case "Airtel Kenya":

            result.classList.add("airtel");

            break;

        case "Telkom Kenya":

            result.classList.add("telkom");

            break;

        case "Faiba":

            result.classList.add("faiba");

            break;

    }

}
/* ==========================================================
   DETECT NETWORK
========================================================== */
function detectNetwork(number) {

    if (!number) {

        return "Unknown Network";

    }

    number = String(number).trim();

    if (number.length < 3) {

        return "Unknown Network";

    }

    const prefix4 = number.substring(0, 4);

    const prefix3 = number.substring(0, 3);

    if (NETWORK_PREFIXES.Faiba.includes(prefix4)) {

        return "Faiba";

    }

    if (NETWORK_PREFIXES.Safaricom.includes(prefix3)) {

        return "Safaricom";

    }

    if (NETWORK_PREFIXES.Airtel.includes(prefix3)) {

        return "Airtel Kenya";

    }

    if (NETWORK_PREFIXES.Telkom.includes(prefix3)) {

        return "Telkom Kenya";

    }

    return "Unknown Network";

}
/* ==========================================================
   NORMALIZE NUMBER
========================================================== */

function normalizeNumber(number) {

    number = number.replace(/\s+/g, "");

    if (number.startsWith("+254")) {

        return "0" + number.substring(4);

    }

    if (number.startsWith("254")) {

        return "0" + number.substring(3);

    }

    return number;

}
/************************************************
 VALIDATE KENYAN NUMBER
************************************************/

function isValidKenyanNumber(number) {

    number = normalizeNumber(number);

    return /^0(1|7)[0-9]{8}$/.test(number);

}