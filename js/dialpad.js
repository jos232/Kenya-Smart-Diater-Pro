/* ==========================================================
   DIAL PAD
========================================================== */

"use strict";

/* ==========================================================
   PRESS NUMBER
========================================================== */

function pressNumber(value) {

    const input = document.getElementById("phoneNumber");

    if (!input) return;

    if (input.value.length >= 13) return;

    input.value += value;

    Dialer.currentNumber = input.value;

    updateNetwork();

    updateContactPreview();

}

/* ==========================================================
   DELETE LAST DIGIT
========================================================== */

function deleteNumber() {

    const input = document.getElementById("phoneNumber");

    if (!input) return;

    input.value = input.value.slice(0, -1);

    Dialer.currentNumber = input.value;

    updateNetwork();

    updateContactPreview();

}

/* ==========================================================
   CLEAR NUMBER
========================================================== */

function clearNumber() {

    const input = document.getElementById("phoneNumber");

    if (!input) return;

    input.value = "";

    Dialer.currentNumber = "";

    updateNetwork();

    updateContactPreview();

}

/* ==========================================================
   LONG PRESS ZERO → +
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".dial-pad button");

    buttons.forEach(btn => {

        if (btn.textContent.trim() === "0") {

            let timer = null;

            btn.addEventListener("mousedown", () => {

                timer = setTimeout(() => {

                    pressNumber("+");

                }, 700);

            });

            btn.addEventListener("mouseup", () => {

                clearTimeout(timer);

            });

            btn.addEventListener("mouseleave", () => {

                clearTimeout(timer);

            });

        }

    });

});

/* ==========================================================
   USSD / CALL ACTION
========================================================== */

function processDialerAction() {

    const input =
        document.getElementById("phoneNumber");

    if (!input) return;

    const value =
        input.value.trim();

    if (!value) {

        showToast("Enter a phone number or USSD code");

        return;

    }


    /* ==========================
       USSD CODE
    ========================== */

    if (
        typeof handleDialerInput === "function" &&
        handleDialerInput(value)
    ) {

        return;

    }


    /* ==========================
       NORMAL PHONE CALL
    ========================== */

    startCall(value);

}