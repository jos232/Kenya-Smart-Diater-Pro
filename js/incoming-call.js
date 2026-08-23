/* ==========================================
   KENYA SMART DIALER PRO
   incoming-call.js
========================================== */

"use strict";

let incomingCall = null;
let incomingTimeout = null;

/* ==========================================
   SIMULATE INCOMING CALL
========================================== */

function simulateIncomingCall(number = "0712345678") {

    if (typeof Dialer !== "undefined" && Dialer.isCalling) {

        Dialer.waitingCall = {

            number,
            name: number,
            network: "Unknown",
            photo: "assets/user.png"

        };

        const status = document.querySelector(".incoming-status");

        if (status) {

            status.textContent = "Call Waiting";

        }

        return;
    }

    let name = number;
    let photo = "assets/user.png";
    let network = "Unknown";

    /* ==========================
       CONTACT LOOKUP
    ========================== */

    if (Array.isArray(window.contacts)) {

        const contact = window.contacts.find(c => c.phone === number);

        if (contact) {

            name = contact.name || number;
            photo = contact.photo || "assets/user.png";

        }

    }

    /* ==========================
       NETWORK DETECTION
    ========================== */

    if (typeof detectNetwork === "function") {

        network = detectNetwork(number) || "Unknown";

    }

    incomingCall = {

        number,
        name,
        network,
        photo

    };

    const screen = document.getElementById("incomingCallScreen");

    if (screen) {

        screen.classList.add("active");

    }

    const photoElement = document.getElementById("incomingPhoto");

    if (photoElement) {

        photoElement.src = photo;

    }

    const nameElement = document.getElementById("incomingName");

    if (nameElement) {

        nameElement.textContent = name;

    }

    const numberElement = document.getElementById("incomingNumber");

    if (numberElement) {

        numberElement.textContent = number;

    }

    const networkElement = document.getElementById("incomingNetwork");

    if (networkElement) {

        networkElement.textContent = network;

    }

    if (typeof showToast === "function") {

        showToast("📞 Incoming Call");

    }

    clearTimeout(incomingTimeout);

    incomingTimeout = setTimeout(() => {

        missedIncomingCall();

    }, 30000);

}

/* ==========================================
   ACCEPT CALL
========================================== */

function acceptIncomingCall() {

    clearTimeout(incomingTimeout);

    const screen = document.getElementById("incomingCallScreen");

    if (screen) {

        screen.classList.remove("active");

    }

    if (typeof Dialer !== "undefined") {

        if (Dialer.isCalling) {

            Dialer.heldCall = {

                ...Dialer.currentCall,

                seconds: Dialer.seconds

            };

            const swapButton = document.getElementById("swapButton");

            if (swapButton) {

                swapButton.classList.add("show");

            }

        }

        Dialer.currentCall = {

            number: incomingCall.number,
            name: incomingCall.name,
            network: incomingCall.network,
            photo: incomingCall.photo

        };

        Dialer.seconds = 0;

    }

    if (typeof startCall === "function") {

        startCall(incomingCall.number);

    }

}

/* ==========================================
   DECLINE
========================================== */

function declineIncomingCall() {

    clearTimeout(incomingTimeout);

    const screen = document.getElementById("incomingCallScreen");

    if (screen) {

        screen.classList.remove("active");

    }

    saveIncomingHistory("Declined");

    if (typeof showToast === "function") {

        showToast("❌ Call Declined");

    }

}

/* ==========================================
   MISSED
========================================== */

function missedIncomingCall() {

    const screen = document.getElementById("incomingCallScreen");

    if (screen) {

        screen.classList.remove("active");

    }

    saveIncomingHistory("Missed");

    if (typeof showToast === "function") {

        showToast("📵 Missed Call");

    }

}

/* ==========================================
   SAVE CALL HISTORY
========================================== */

function saveIncomingHistory(type) {

    if (!incomingCall) return;

    if (typeof saveCallHistory === "function") {

        saveCallHistory(

            incomingCall.number,
            incomingCall.network,
            "00:00",
            type

        );

    }

}
