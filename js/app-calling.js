"use strict";

/* ==========================================================
   KENYA SMART DIALER PRO
   APP-TO-APP CALLING CLIENT
========================================================== */

let callSocket = null;

let activeCallId = null;
let activeOtherUserId = null;
let activeCallRole = null;


/* ==========================================================
   CONNECT TO CALLING SERVER
========================================================== */

function initializeAppCalling() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        console.warn(
            "Calling: No authentication token."
        );

        return;

    }

    if (typeof io !== "function") {

        console.error(
            "Calling: Socket.IO client is not loaded."
        );

        return;

    }


    /* Prevent duplicate connections */

    if (
        callSocket &&
        callSocket.connected
    ) {

        return;

    }


    callSocket = io({

        auth: {

            token

        }

    });


    /* ======================================================
       CONNECTION
    ====================================================== */

    callSocket.on(
        "connect",
        () => {

            console.log(
                "Calling connected:",
                callSocket.id
            );

        }
    );


    /* ======================================================
       CALLING READY
    ====================================================== */

    callSocket.on(
        "call:ready",
        () => {

            console.log(
                "Calling service ready."
            );

        }
    );


    /* ======================================================
       INCOMING CALL
    ====================================================== */

    callSocket.on(
        "call:incoming",
        (data) => {

            console.log(
                "Incoming app call:",
                data
            );

            activeCallId =
                data.callId;

            activeOtherUserId =
                data.caller.id;

            activeCallRole =
                "receiver";


            /* Use existing incoming-call UI */

            if (
                typeof simulateIncomingCall ===
                "function"
            ) {

                simulateIncomingCall(
                    data.caller.phone
                );

            }

        }
    );


    /* ======================================================
       OUTGOING CALL RINGING
    ====================================================== */

    callSocket.on(
        "call:ringing",
        (data) => {

            console.log(
                "Call ringing:",
                data
            );

            activeCallId =
                data.callId;

            activeOtherUserId =
                data.receiver.id;

            activeCallRole =
                "caller";

        }
    );


    /* ======================================================
       CALL ACCEPTED
    ====================================================== */

    callSocket.on(
        "call:accepted",
        (data) => {

            console.log(
                "Call accepted:",
                data
            );

            if (
                typeof connectCall ===
                "function"
            ) {

                connectCall();

            }

        }
    );


    /* ======================================================
       CALL REJECTED
    ====================================================== */

    callSocket.on(
        "call:rejected",
        (data) => {

            console.log(
                "Call rejected:",
                data
            );

            activeCallId = null;
            activeOtherUserId = null;

            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    "Call declined"
                );

            }

        }
    );


    /* ======================================================
       CALL UNAVAILABLE
    ====================================================== */

    callSocket.on(
        "call:unavailable",
        (data) => {

            console.log(
                "Call unavailable:",
                data
            );

            activeCallId = null;
            activeOtherUserId = null;

            if (
                typeof showToast ===
                "function"
            ) {

                fallbackToPhoneCall(data.phone);

            }

        }
    );


    /* ======================================================
       CALL ENDED
    ====================================================== */

    callSocket.on(
        "call:ended",
        () => {

            console.log(
                "Remote call ended."
            );

            activeCallId = null;
            activeOtherUserId = null;

            if (
                typeof endCallFromRemote ===
                "function"
            ) {

                endCallFromRemote();

            } else {

                if (
                    typeof showToast ===
                    "function"
                ) {

                    showToast(
                        "Call ended"
                    );

                }

            }

        }
    );


    /* ======================================================
       CALL ERROR
    ====================================================== */

    callSocket.on(
        "call:error",
        (data) => {

            console.error(
                "Calling error:",
                data
            );

            const message =
                data?.message ||
                "Calling error";

            const shouldFallback =
                message.includes("not registered") ||
                message.includes("not available");

            if (shouldFallback) {

                fallbackToPhoneCall(
                    data?.phone ||
                    window.currentCallPhone
                );

                return;

            }

            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    message
                );

            }

        }
    );


    /* ======================================================
       DISCONNECT
    ====================================================== */

    callSocket.on(
        "disconnect",
        (reason) => {

            console.warn(
                "Calling disconnected:",
                reason
            );

        }
    );

}


function fallbackToPhoneCall(phone) { if (!phone) { if (typeof showToast === 'function') { showToast('Phone number is required.'); } return; } const normalizedPhone=String(phone).replace(/[^\d+]/g, ''); console.log('Falling back to normal phone call:',normalizedPhone); window.location.href='tel:'+normalizedPhone; }

/* ==========================================================
   START APP-TO-APP CALL
========================================================== */

function startAppCall(phone) {

    if (!callSocket) {

        initializeAppCalling();

    }


    if (
        !callSocket ||
        !callSocket.connected
    ) {

        showToast(
            "Calling service is not connected."
        );

        return;

    }


    if (!phone) {

        showToast(
            "Phone number is required."
        );

        return;

    }


    console.log(
        "Starting app call to:",
        phone
    );

    window.currentCallPhone = phone;


    callSocket.emit(
        "call:start",
        {

            phone

        }
    );

}


/* ==========================================================
   ACCEPT APP CALL
========================================================== */

function acceptAppCall(callerId) {

    if (
        !callSocket ||
        !callSocket.connected
    ) {

        return;

    }


    callSocket.emit(
        "call:accept",
        {

            callId:
                activeCallId,

            callerId:
                callerId ||
                activeOtherUserId

        }
    );

}


/* ==========================================================
   REJECT APP CALL
========================================================== */

function rejectAppCall() {

    if (
        !callSocket ||
        !callSocket.connected
    ) {

        return;

    }


    callSocket.emit(
        "call:reject",
        {

            callId:
                activeCallId,

            callerId:
                activeOtherUserId

        }
    );


    activeCallId = null;
    activeOtherUserId = null;

}


/* ==========================================================
   END APP CALL
========================================================== */

function endAppCall() {

    if (
        callSocket &&
        callSocket.connected &&
        activeCallId
    ) {

        callSocket.emit(
            "call:end",
            {

                callId:
                    activeCallId,

                otherUserId:
                    activeOtherUserId

            }
        );

    }


    activeCallId = null;
    activeOtherUserId = null;

}


/* ==========================================================
   REMOTE END CALL
========================================================== */

function endCallFromRemote() {

    activeCallId = null;
    activeOtherUserId = null;

    if (
        typeof Dialer !== "undefined"
    ) {

        Dialer.isCalling = false;

        if (Dialer.timer) {

            clearInterval(
                Dialer.timer
            );

        }

    }


    const screen =
        document.getElementById(
            "callScreen"
        );

    if (screen) {

        screen.classList.remove(
            "active"
        );

    }


    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Call ended"
        );

    }

}


/* ==========================================================
   INITIALIZE AFTER LOGIN
========================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const token =
            localStorage.getItem("token");

        if (token) {

            setTimeout(
                initializeAppCalling,
                500
            );

        }

    }
);


/* ==========================================================
   GLOBAL EXPORTS
========================================================== */

window.initializeAppCalling =
    initializeAppCalling;

window.startAppCall =
    startAppCall;

window.acceptAppCall =
    acceptAppCall;

window.rejectAppCall =
    rejectAppCall;

window.endAppCall =
    endAppCall;


