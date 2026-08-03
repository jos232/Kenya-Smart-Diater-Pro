/* ==========================================================
   CALL SCREEN
========================================================== */

"use strict";

/* ==========================================================
   START CALL
========================================================== */

function startCall(number = null) {

    if (!number) {

        number = Dialer.currentNumber;

    }

    if (!number || number.length < 10) {

        showToast("Enter a valid phone number");

        return;

    }

    Dialer.isCalling = true;

    openCallScreen(number);

}

/* ==========================================================
   OPEN CALL SCREEN
========================================================== */

function openCallScreen(number) {

    const screen = document.getElementById("callScreen");

    if (!screen) return;

    screen.classList.add("active");

    document.getElementById("callName").textContent =
        Dialer.currentContact
            ? Dialer.currentContact.name
            : number;

    document.getElementById("callPhone").textContent =
        number;

    document.getElementById("callNetwork").textContent =
        Dialer.currentNetwork;

    document.getElementById("callStatus").textContent =
        "Calling...";

    document.getElementById("callTimer").textContent =
        "00:00";

    const photo = document.getElementById("callPhoto");

    if (Dialer.currentContact &&
        Dialer.currentContact.photo) {

        photo.src = Dialer.currentContact.photo;

    } else {

        photo.src = "assets/user.png";

    }

    setTimeout(connectCall, 2500);

}

/* ==========================================================
   CONNECT CALL
========================================================== */

function connectCall() {

    document.getElementById("callStatus").textContent =
        "Connected";

    Dialer.callSeconds = 0;

    if (Dialer.timer) {

        clearInterval(Dialer.timer);

    }

    Dialer.timer = setInterval(updateCallTimer, 1000);

}

/* ==========================================================
   TIMER
========================================================== */

function updateCallTimer() {

    Dialer.callSeconds++;

    const mins = String(
        Math.floor(Dialer.callSeconds / 60)
    ).padStart(2, "0");

    const secs = String(
        Dialer.callSeconds % 60
    ).padStart(2, "0");

    document.getElementById("callTimer").textContent =
        `${mins}:${secs}`;

}
const bannerTimer = document.getElementById("bannerTimer");

if (bannerTimer) {

    bannerTimer.textContent =
        document.getElementById("callTimer").textContent;

}

/* ==========================================================
   END CALL
========================================================== */
function endCall() {

    if (Dialer.heldCall) {

        Dialer.currentCall = Dialer.heldCall;

        Dialer.heldCall = null;

        Dialer.seconds = 0;

        document.getElementById("swapButton")
            .classList.remove("show");

        document.getElementById("callName").textContent =
            Dialer.currentCall.name;

        document.getElementById("callNumber").textContent =
            Dialer.currentCall.number;

        document.getElementById("callNetwork").textContent =
            Dialer.currentCall.network;

        showToast("Returned to first call");

        return;

    }

    Dialer.isCalling = false;

    // Save call before closing
    saveCallRecord();

    clearInterval(Dialer.timer);

    document.getElementById("callScreen")
        .classList.remove("active");

    showToast("Call Ended");
    // Deduct voice minutes
    const minutesUsed = Math.max(
        1,
        Math.ceil(Dialer.seconds / 60)
    );

    if (typeof consumeVoice === "function") {

        consumeVoice(minutesUsed);

    }

}
const minutes =
    Math.ceil(Dialer.seconds / 60);

Telecom.voice =
    Math.max(0, Telecom.voice - minutes);

Telecom.save();

refreshApp();

/* ==========================================================
   SAVE CALL
========================================================== */

function saveCallRecord() {

    if (typeof saveCallHistory !== "function")
        return;

    saveCallHistory(

        Dialer.currentCall?.number || Dialer.currentNumber,

        Dialer.currentCall?.network || Dialer.currentNetwork,

        document.getElementById("callTimer").textContent,

        "Outgoing"

    );

}