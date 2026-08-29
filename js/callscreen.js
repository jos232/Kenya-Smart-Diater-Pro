/* ==========================================================
   KENYA SMART DIALER PRO
   APP-TO-APP CALL SCREEN
========================================================== */

"use strict";


/* ==========================================================
   START CALL
========================================================== */

function startCall(number = null) {

    if (!number) {

        number =
            Dialer.currentNumber;

    }


    if (!number || number.length < 10) {

        if (typeof showToast === "function") {

            showToast(
                "Enter a valid phone number"
            );

        }

        return;

    }


    /*
       Store the number being called.
    */

    Dialer.currentNumber =
        number;


    Dialer.isCalling =
        true;


    /*
       Open the existing call screen.
    */

    openCallScreen(number);


    /*
       If the Socket.IO calling client
       is available, make a real
       app-to-app call.
    */

    if (
        typeof startAppCall ===
        "function"
    ) {

        startAppCall(number);

    }

}


/* ==========================================================
   OPEN CALL SCREEN
========================================================== */

function openCallScreen(number) {

    const screen =
        document.getElementById(
            "callScreen"
        );


    if (!screen) return;


    screen.classList.add(
        "active"
    );


    const callName =
        document.getElementById(
            "callName"
        );


    const callPhone =
        document.getElementById(
            "callPhone"
        );


    const callNumber =
        document.getElementById(
            "callNumber"
        );


    const callNetwork =
        document.getElementById(
            "callNetwork"
        );


    const callStatus =
        document.getElementById(
            "callStatus"
        );


    const callTimer =
        document.getElementById(
            "callTimer"
        );


    if (callName) {

        callName.textContent =
            Dialer.currentContact
                ? Dialer.currentContact.name
                : number;

    }


    if (callPhone) {

        callPhone.textContent =
            number;

    }


    if (callNumber) {

        callNumber.textContent =
            number;

    }


    if (callNetwork) {

        callNetwork.textContent =
            Dialer.currentNetwork ||
            "Unknown";

    }


    if (callStatus) {

        callStatus.textContent =
            "Calling...";

    }


    if (callTimer) {

        callTimer.textContent =
            "00:00";

    }


    const photo =
        document.getElementById(
            "callPhoto"
        );


    if (
        photo &&
        Dialer.currentContact &&
        Dialer.currentContact.photo
    ) {

        photo.src =
            Dialer.currentContact.photo;

    }

    else if (photo) {

        photo.src =
            "assets/user.png";

    }

}


/* ==========================================================
   CALL CONNECTED
========================================================== */

function connectCall() {

    const status =
        document.getElementById(
            "callStatus"
        );


    if (status) {

        status.textContent =
            "Connected";

    }


    Dialer.callSeconds =
        Dialer.callSeconds || 0;


    Dialer.seconds =
        Dialer.callSeconds;


    if (Dialer.timer) {

        clearInterval(
            Dialer.timer
        );

    }


    Dialer.timer =
        setInterval(
            updateCallTimer,
            1000
        );

}


/* ==========================================================
   TIMER
========================================================== */

function updateCallTimer() {

    if (
        typeof Dialer ===
        "undefined"
    ) {

        return;

    }


    Dialer.callSeconds =
        (Dialer.callSeconds || 0) + 1;


    Dialer.seconds =
        Dialer.callSeconds;


    const mins =
        String(
            Math.floor(
                Dialer.callSeconds / 60
            )
        ).padStart(
            2,
            "0"
        );


    const secs =
        String(
            Dialer.callSeconds % 60
        ).padStart(
            2,
            "0"
        );


    const timer =
        document.getElementById(
            "callTimer"
        );


    if (timer) {

        timer.textContent =
            `${mins}:${secs}`;

    }


    const bannerTimer =
        document.getElementById(
            "bannerTimer"
        );


    if (bannerTimer) {

        bannerTimer.textContent =
            `${mins}:${secs}`;

    }

}


/* ==========================================================
   END CALL
========================================================== */

function endCall() {

    /*
       Tell the other user that
       the call has ended.
    */

    if (
        typeof endAppCall ===
        "function"
    ) {

        endAppCall();

    }


    /*
       Handle held call.
    */

    if (Dialer.heldCall) {

        Dialer.currentCall =
            Dialer.heldCall;


        Dialer.heldCall =
            null;


        Dialer.seconds =
            0;


        const swapButton =
            document.getElementById(
                "swapButton"
            );


        if (swapButton) {

            swapButton.classList.remove(
                "show"
            );

        }


        const callName =
            document.getElementById(
                "callName"
            );


        const callNumber =
            document.getElementById(
                "callNumber"
            );


        const callNetwork =
            document.getElementById(
                "callNetwork"
            );


        if (callName) {

            callName.textContent =
                Dialer.currentCall.name;

        }


        if (callNumber) {

            callNumber.textContent =
                Dialer.currentCall.number;

        }


        if (callNetwork) {

            callNetwork.textContent =
                Dialer.currentCall.network;

        }


        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                "Returned to first call"
            );

        }


        return;

    }


    /*
       Save call history BEFORE
       resetting the call state.
    */

    saveCallRecord();


    /*
       Stop timer.
    */

    if (Dialer.timer) {

        clearInterval(
            Dialer.timer
        );

        Dialer.timer =
            null;

    }


    /*
       Calculate voice minutes.
    */

    const secondsUsed =
        Dialer.seconds ||
        Dialer.callSeconds ||
        0;


    const minutesUsed =
        Math.max(
            1,
            Math.ceil(
                secondsUsed / 60
            )
        );


    /*
       Consume voice minutes.
    */

    if (
        typeof consumeVoice ===
        "function"
    ) {

        consumeVoice(
            minutesUsed
        );

    }


    /*
       Reset call state.
    */

    Dialer.isCalling =
        false;

    Dialer.callSeconds =
        0;

    Dialer.seconds =
        0;


    /*
       Close call screen.
    */

    const screen =
        document.getElementById(
            "callScreen"
        );


    if (screen) {

        screen.classList.remove(
            "active"
        );

    }


    /*
       Refresh application data.
    */

    if (
        typeof refreshApp ===
        "function"
    ) {

        refreshApp();

    }


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Call Ended"
        );

    }

}


/* ==========================================================
   SAVE CALL RECORD
========================================================== */

function saveCallRecord() {

    if (
        typeof saveCallHistory !==
        "function"
    ) {

        return;

    }


    saveCallHistory(

        Dialer.currentCall?.number ||
        Dialer.currentNumber,

        Dialer.currentCall?.network ||
        Dialer.currentNetwork,

        document.getElementById(
            "callTimer"
        )?.textContent ||
        "00:00",

        "Outgoing"

    );

}


/* ==========================================================
   GLOBAL EXPORTS
========================================================== */

window.startCall =
    startCall;

window.openCallScreen =
    openCallScreen;

window.connectCall =
    connectCall;

window.updateCallTimer =
    updateCallTimer;

window.endCall =
    endCall;
