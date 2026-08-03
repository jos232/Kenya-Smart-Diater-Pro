/* ==========================================
   KENYA SMART DIALER
   SECURITY ENGINE
========================================== */

"use strict";

/* ==========================
   STORAGE KEYS
========================== */

const PIN_KEY = "KSD_BANK_PIN";

const FAILED_KEY = "KSD_BANK_FAILED_ATTEMPTS";

const LOCK_KEY = "KSD_BANK_LOCK";

/* ==========================
   DEFAULT PIN
========================== */

function initializePIN() {

    if (!localStorage.getItem(PIN_KEY)) {

        localStorage.setItem(PIN_KEY, "1234");

    }

}

initializePIN();

/* ==========================
   GET PIN
========================== */

function getPIN() {

    return localStorage.getItem(PIN_KEY);

}

/* ==========================
   VERIFY PIN
========================== */

function verifyPIN(pin) {

    if (isAccountLocked()) {

        return {

            success: false,

            message: "Account is temporarily locked."

        };

    }

    if (pin === getPIN()) {

        resetAttempts();

        return {

            success: true

        };

    }

    increaseAttempts();

    return {

        success: false,

        message: "Incorrect PIN."

    };

}

/* ==========================
   CHANGE PIN
========================== */

function changePIN(oldPIN, newPIN) {

    if (oldPIN !== getPIN()) {

        return false;

    }

    localStorage.setItem(PIN_KEY, newPIN);

    return true;

}

/* ==========================
   FAILED ATTEMPTS
========================== */

function increaseAttempts() {

    let attempts = Number(

        localStorage.getItem(FAILED_KEY) || 0

    );

    attempts++;

    localStorage.setItem(

        FAILED_KEY,

        attempts

    );

    if (attempts >= 3) {

        localStorage.setItem(

            LOCK_KEY,

            "true"

        );

    }

}

/* ==========================
   RESET ATTEMPTS
========================== */

function resetAttempts() {

    localStorage.setItem(

        FAILED_KEY,

        0

    );

    localStorage.removeItem(LOCK_KEY);

}

/* ==========================
   ACCOUNT LOCK
========================== */

function isAccountLocked() {

    return localStorage.getItem(LOCK_KEY) === "true";

}

/* ==========================
   UNLOCK
========================== */

function unlockAccount() {

    resetAttempts();

}