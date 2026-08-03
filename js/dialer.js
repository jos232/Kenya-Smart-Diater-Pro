/* ==========================================================
   KENYA SMART DIALER PRO
   Main Dialer Controller
========================================================== */

"use strict";

/* ==========================================================
   APP STATE
========================================================== */

const Dialer = {

    isCalling: false,

    muted: false,

    speaker: false,

    hold: false,

    bluetooth: false,

    timer: null,

    seconds: 0,

    currentCall: null,

    heldCall: null,

    waitingCall: null

};

/* ==========================================================
   INITIALIZATION
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeDialer

);

function initializeDialer() {

    console.log(

        "✅ Kenya Smart Dialer Loaded"

    );

    const input = document.getElementById(

        "phoneNumber"

    );

    if (input) {

        input.addEventListener(

            "input",

            () => {

                updateNetwork();

                updateContactPreview();

            }

        );

    }

}
/* ==========================================
   SAVE CALL HISTORY
========================================== */

function saveCallHistory(number, network, duration, type = "Outgoing") {

    const history = JSON.parse(localStorage.getItem("callHistory")) || [];

    // Find contact name
    let contacts = [];

    if (typeof getContacts === "function") {

        contacts = getContacts();

    } else {

        contacts = JSON.parse(localStorage.getItem("ksd_contacts")) || [];

    }

    const contact = contacts.find(contact =>

        contact.phone === number ||

        contact.number === number

    );
    const now = new Date();

    history.unshift({

        name: contact ? contact.name : "Unknown Caller",

        number: number,

        network: network,

        duration: duration,

        type: type,

        date: now.toLocaleDateString("en-GB", {

            weekday: "short",

            day: "2-digit",

            month: "short",

            year: "numeric"

        }),

        time: now.toLocaleTimeString("en-GB", {

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",

            hour12: false

        })

    });

    localStorage.setItem("callHistory", JSON.stringify(history));

}