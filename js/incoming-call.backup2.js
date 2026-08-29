```javascript
/* ==========================================
   KENYA SMART DIALER PRO
   REAL APP-TO-APP INCOMING CALL
========================================== */

"use strict";


let incomingCall = null;
let incomingTimeout = null;


/* ==========================================
   SHOW REAL INCOMING CALL
========================================== */

function showIncomingAppCall(data) {

    if (!data || !data.caller) {

        return;

    }


    incomingCall = {

        callId:
            data.callId,

        userId:
            data.caller.id,

        number:
            data.caller.phone,

        name:
            data.caller.fullName ||
            data.caller.phone,

        network:
            typeof detectNetwork ===
            "function"
                ? detectNetwork(
                    data.caller.phone
                ) || "Unknown"
                : "Unknown",

        photo:
            "assets/user.png"

    };


    /*
       If another call is already active,
       treat this as call waiting.
    */

    if (
        typeof Dialer !== "undefined" &&
        Dialer.isCalling
    ) {

        Dialer.waitingCall =
            incomingCall;


        const status =
            document.querySelector(
                ".incoming-status"
            );


        if (status) {

            status.textContent =
                "Call Waiting";

        }


        return;

    }


    const screen =
        document.getElementById(
            "incomingCallScreen"
        );


    if (screen) {

        screen.classList.add(
            "active"
        );

    }


    const photo =
        document.getElementById(
            "incomingPhoto"
        );


    if (photo) {

        photo.src =
            incomingCall.photo;

    }


    const name =
        document.getElementById(
            "incomingName"
        );


    if (name) {

        name.textContent =
            incomingCall.name;

    }


    const number =
        document.getElementById(
            "incomingNumber"
        );


    if (number) {

        number.textContent =
            incomingCall.number;

    }


    const network =
        document.getElementById(
            "incomingNetwork"
        );


    if (network) {

        network.textContent =
            incomingCall.network;

    }


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Incoming App Call"
        );

    }


    clearTimeout(
        incomingTimeout
    );


    incomingTimeout =
        setTimeout(
            () => {

                missedIncomingCall();

            },
            30000
        );

}


/* ==========================================
   ACCEPT
========================================== */

function acceptIncomingCall() {

    if (!incomingCall) {

        return;

    }


    clearTimeout(
        incomingTimeout
    );


    const screen =
        document.getElementById(
            "incomingCallScreen"
        );


    if (screen) {

        screen.classList.remove(
            "active"
        );

    }


    /*
       Tell the calling server that
       this user accepted the call.
    */

    if (
        typeof acceptAppCall ===
        "function"
    ) {

        acceptAppCall(
            incomingCall.userId
        );

    }


    /*
       Prepare the call screen.
    */

    if (
        typeof Dialer !==
        "undefined"
    ) {

        Dialer.currentCall = {

            number:
                incomingCall.number,

            name:
                incomingCall.name,

            network:
                incomingCall.network,

            photo:
                incomingCall.photo

        };


        Dialer.currentNumber =
            incomingCall.number;


        Dialer.currentContact =
            Dialer.currentCall;


        Dialer.isCalling =
            true;


        Dialer.callSeconds =
            0;

        Dialer.seconds =
            0;

    }


    /*
       Open call screen without
       starting another outgoing call.
    */

    if (
        typeof openCallScreen ===
        "function"
    ) {

        openCallScreen(
            incomingCall.number
        );

    }


    const status =
        document.getElementById(
            "callStatus"
        );


    if (status) {

        status.textContent =
            "Connecting...";

    }


    /*
       Keep the call information
       for the WebRTC layer.
    */

    activeCallId =
        incomingCall.callId;

}


/* ==========================================
   DECLINE
========================================== */

function declineIncomingCall() {

    clearTimeout(
        incomingTimeout
    );


    if (
        typeof rejectAppCall ===
        "function"
    ) {

        rejectAppCall();

    }


    const screen =
        document.getElementById(
            "incomingCallScreen"
        );


    if (screen) {

        screen.classList.remove(
            "active"
        );

    }


    saveIncomingHistory(
        "Declined"
    );


    incomingCall =
        null;


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Call Declined"
        );

    }

}


/* ==========================================
   MISSED
========================================== */

function missedIncomingCall() {

    clearTimeout(
        incomingTimeout
    );


    const screen =
        document.getElementById(
            "incomingCallScreen"
        );


    if (screen) {

        screen.classList.remove(
            "active"
        );

    }


    saveIncomingHistory(
        "Missed"
    );


    incomingCall =
        null;


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Missed Call"
        );

    }

}


/* ==========================================
   SAVE HISTORY
========================================== */

function saveIncomingHistory(
    type
) {

    if (!incomingCall) {

        return;

    }


    if (
        typeof saveCallHistory ===
        "function"
    ) {

        saveCallHistory(

            incomingCall.number,

            incomingCall.network,

            "00:00",

            type

        );

    }

}


/* ==========================================
   CONNECT SOCKET EVENT TO UI
========================================== */

window.addEventListener(
    "app-call-incoming",
    (event) => {

        showIncomingAppCall(
            event.detail
        );

    }
);


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.showIncomingAppCall =
    showIncomingAppCall;

window.acceptIncomingCall =
    acceptIncomingCall;

window.declineIncomingCall =
    declineIncomingCall;

window.missedIncomingCall =
    missedIncomingCall;
```
