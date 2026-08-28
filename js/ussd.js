/* ==========================================================
   KENYA SMART DIALER PRO
   USSD ENGINE
========================================================== */

"use strict";


/* ==========================================================
   USSD STATE
========================================================== */

let currentUSSDCode = "";

let currentUSSDService = "";

let currentUSSDMenu = "main";


/* ==========================================================
   USSD MENUS
========================================================== */

const USSD_CODES = {

    "*100#": {

        title: "Safaricom",

        menu:
            "1. Check Balance\n" +
            "2. Buy Airtime\n" +
            "3. Buy Data\n" +
            "4. M-PESA\n" +
            "5. Loans\n" +
            "6. Other Services"

    },

    "*222#": {

        title: "Airtel",

        menu:
            "1. Check Balance\n" +
            "2. Buy Airtime\n" +
            "3. Buy Data\n" +
            "4. Airtel Money\n" +
            "5. Loans\n" +
            "6. Other Services"

    }

};


/* ==========================================================
   DETECT USSD
========================================================== */

function isUSSDCode(value) {

    if (!value) return false;

    const code =
        String(value).trim();

    return (
        code.startsWith("*") &&
        code.endsWith("#")
    );

}


/* ==========================================================
   EXECUTE USSD
========================================================== */

function executeUSSD(code) {

    code =
        String(code).trim();

    if (!isUSSDCode(code)) {

        return false;

    }

    currentUSSDCode = code;

    Dialer.ussdCode = code;

    Dialer.isUSSD = true;


    const service =
        USSD_CODES[code];


    if (!service) {

        openUSSDScreen(

            "USSD Service",

            "USSD code " +
            code +
            " is not currently supported."

        );

        return true;

    }


    currentUSSDService =
        service.title;

    currentUSSDMenu =
        "main";


    openUSSDScreen(

        service.title,

        service.menu

    );


    return true;

}


/* ==========================================================
   OPEN USSD SCREEN
========================================================== */

function openUSSDScreen(title, message) {

    const screen =
        document.getElementById("ussdScreen");

    if (!screen) {

        alert(
            title +
            "\n\n" +
            message
        );

        return;

    }


    const titleElement =
        document.getElementById("ussdTitle");

    const codeElement =
        document.getElementById("ussdCodeDisplay");

    const welcomeElement =
        document.getElementById("ussdWelcome");

    const messageElement =
        document.getElementById("ussdMessage");

    const input =
        document.getElementById("ussdInput");


    if (titleElement)
        titleElement.textContent =
            title;


    if (codeElement)
        codeElement.textContent =
            currentUSSDCode;


    if (welcomeElement)
        welcomeElement.textContent =
            title;


    if (messageElement)
        messageElement.textContent =
            message;


    if (input) {

        input.value = "";

        setTimeout(() => {

            input.focus();

        }, 100);

    }


    /* ==========================================
        OPEN INSIDE APP SCREEN SYSTEM
    ========================================== */

    if (typeof showScreen === "function") {

        showScreen("ussdScreen");

    } else {

        screen.classList.add("active");

    }

}


/* ==========================================================
   SUBMIT USSD OPTION
========================================================== */

function submitUSSDOption() {

    const input =
        document.getElementById("ussdInput");

    if (!input) return;


    const option =
        input.value.trim();


    if (!option) {

        if (typeof showToast === "function") {

            showToast(
                "Enter a menu option"
            );

        }

        return;

    }


    processUSSDOption(option);

}


/* ==========================================================
   PROCESS USSD OPTION
========================================================== */

function processUSSDOption(option) {

    option =
        String(option).trim();


    /* ==========================
       MAIN MENU
    ========================== */

    if (currentUSSDMenu === "main") {

        switch (option) {

            case "1":

                showUSSDResult(

                    "Balance",

                    "Your current balance will be displayed here."

                );

                break;


            case "2":

                showUSSDResult(

                    "Buy Airtime",

                    "Airtime purchase service selected."

                );

                break;


            case "3":

                showUSSDResult(

                    "Data",

                    "Data bundle service selected."

                );

                break;


            case "4":

                showUSSDResult(

                    "M-PESA",

                    "M-PESA service selected."

                );

                break;


            case "5":

                showUSSDResult(

                    "Loans",

                    "Loan service selected."

                );

                break;


            case "6":

                showUSSDResult(

                    "Other Services",

                    "Other services selected."

                );

                break;


            default:

                showUSSDResult(

                    "Invalid Option",

                    "Please enter a valid menu number."

                );

        }

        return;

    }

}


/* ==========================================================
   SHOW RESULT
========================================================== */

function showUSSDResult(title, message) {

    openUSSDScreen(

        title,

        message

    );

}


/* ==========================================================
   CLOSE USSD
========================================================== */

function closeUSSD() {

    const screen =
        document.getElementById("ussdScreen");

    if (screen) {

        screen.classList.remove("active");

    }


    const input =
        document.getElementById("ussdInput");

    if (input) {

        input.value = "";

    }


    currentUSSDCode = "";

    currentUSSDService = "";

    currentUSSDMenu = "main";

    Dialer.ussdCode = "";

    Dialer.isUSSD = false;

}


/* ==========================================================
   HANDLE DIALER INPUT
========================================================== */

function handleDialerInput(value) {

    if (!value) return false;


    const input =
        String(value).trim();


    if (isUSSDCode(input)) {

        executeUSSD(input);

        return true;

    }


    Dialer.isUSSD = false;

    return false;

}


/* ==========================================================
   EXPORTS
========================================================== */

window.USSD_CODES =
    USSD_CODES;

window.isUSSDCode =
    isUSSDCode;

window.executeUSSD =
    executeUSSD;

window.openUSSDScreen =
    openUSSDScreen;

window.submitUSSDOption =
    submitUSSDOption;

window.processUSSDOption =
    processUSSDOption;

window.showUSSDResult =
    showUSSDResult;

window.closeUSSD =
    closeUSSD;

window.handleDialerInput =
    handleDialerInput;