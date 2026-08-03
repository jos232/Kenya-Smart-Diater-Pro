/* ==========================================================
   CALL CONTROLS
========================================================== */

"use strict";

/* ==========================================================
   MUTE
========================================================== */
function toggleMute() {

    Dialer.muted = !Dialer.muted;

    const btn = document.getElementById("muteButton");

    if (!btn) return;

    if (Dialer.muted) {

        btn.classList.add("active");
        btn.innerHTML = `
            🎤🚫
            <span class="label">Muted</span>
        `;

    } else {

        btn.classList.remove("active");
        btn.innerHTML = `
            🔇
            <span class="label">Mute</span>
        `;

    }

}

/* ==========================================================
   SPEAKER
========================================================== */
function toggleSpeaker() {

    Dialer.speaker = !Dialer.speaker;

    const btn = document.getElementById("speakerButton");

    if (!btn) return;

    if (Dialer.speaker) {

        btn.classList.add("active");

        btn.innerHTML = `
            🔊
            <span class="label">Speaker On</span>
        `;

    } else {

        btn.classList.remove("active");

        btn.innerHTML = `
            🔊
            <span class="label">Speaker</span>
        `;

    }

}

/* ==========================================================
   HOLD
========================================================== */
function toggleHold() {

    Dialer.hold = !Dialer.hold;

    const btn = document.getElementById("holdButton");

    const status = document.getElementById("callStatus");

    if (Dialer.hold) {

        clearInterval(Dialer.timer);

        btn.classList.add("active");

        btn.innerHTML = `
            ▶️
            <span class="label">Resume</span>
        `;

        status.textContent = "On Hold";

    }

    else {

        btn.classList.remove("active");

        btn.innerHTML = `
            ⏸
            <span class="label">Hold</span>
        `;

        status.textContent = "Connected";

        Dialer.timer = setInterval(updateCallTimer, 1000);

    }

}

/* ==========================================================
   BLUETOOTH
========================================================== */
function toggleBluetooth() {

    const btn = document.getElementById("bluetoothButton");

    if (!btn) return;

    btn.classList.toggle("active");

}
/* ==========================================================
   KEYPAD
========================================================== */

function toggleKeypad() {

    const overlay = document.getElementById("keypadOverlay");

    overlay.classList.toggle("show");

}
function pressDuringCall(key) {

    console.log("DTMF:", key);

    showToast("Pressed " + key);

}
/* ==========================================================
   ADD CALL
========================================================== */

function addCall() {

    document
        .getElementById("callScreen")
        .classList.remove("active");

    const banner = document.getElementById("activeCallBanner");

    banner.classList.add("show");

    document.getElementById("bannerName").textContent =
        document.getElementById("callName").textContent;

    showScreen("dialer");

    showToast("Add another call");

}
document.addEventListener("click", function (e) {

    const overlay = document.getElementById("keypadOverlay");

    if (!overlay) return;

    if (
        e.target === overlay
    ) {

        overlay.classList.remove("show");

    }

});
function returnToCall() {

    document
        .getElementById("callScreen")
        .classList.add("active");

    document
        .getElementById("activeCallBanner")
        .classList.remove("show");

}
/* ==========================================
   SWAP CALLS
========================================== */

function swapCalls() {

    if (!Dialer.heldCall) return;

    const temp = Dialer.currentCall;

    const currentSeconds = Dialer.seconds;

    Dialer.currentCall = Dialer.heldCall;

    Dialer.heldCall = temp;

    Dialer.seconds = Dialer.heldCall.seconds || 0;

    document.getElementById("callName").textContent =
        Dialer.currentCall.name;

    document.getElementById("callNumber").textContent =
        Dialer.currentCall.number;

    document.getElementById("callNetwork").textContent =
        Dialer.currentCall.network;

    showToast("Switched Call");

}