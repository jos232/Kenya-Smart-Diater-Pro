/* ==========================================
   EQUITY MOBILE BANKING
   SETTINGS
========================================== */

"use strict";

/* ==========================
   OPEN SETTINGS
========================== */

function openEquitySettings() {

    loadEquitySettings();

    showScreen("equitySettings");

}

/* ==========================
   LOAD SETTINGS
========================== */

function loadEquitySettings() {

    const holder =
        document.getElementById("equitySettingsHolder");

    const account =
        document.getElementById("equitySettingsAccount");

    const branch =
        document.getElementById("equitySettingsBranch");

    if (holder)
        holder.textContent = equityAccount.holder;

    if (account)
        account.textContent = equityAccount.accountNumber;

    if (branch)
        branch.textContent = equityAccount.branch;

}

/* ==========================
   CHANGE PIN
========================== */

function changeEquityPIN() {

    const oldPIN =
        document.getElementById("equityOldPIN").value;

    const newPIN =
        document.getElementById("equityNewPIN").value;

    const confirmPIN =
        document.getElementById("equityConfirmPIN").value;

    const verify = verifyPIN(oldPIN);

    if (!verify.success) {

        alert("Old PIN is incorrect.");

        return;

    }

    if (newPIN.length !== 4) {

        alert("PIN must contain 4 digits.");

        return;

    }

    if (newPIN !== confirmPIN) {

        alert("PIN confirmation does not match.");

        return;

    }

    localStorage.setItem("bankPIN", newPIN);

    addBankNotification(

        "PIN Changed",

        "Your transaction PIN has been updated."

    );

    alert("PIN changed successfully.");

    document.getElementById("equityOldPIN").value = "";
    document.getElementById("equityNewPIN").value = "";
    document.getElementById("equityConfirmPIN").value = "";

}
/* ==========================================
   TOGGLE BIOMETRIC LOGIN
========================================== */

let equityBiometric = false;

function toggleEquityBiometric() {

    equityBiometric = !equityBiometric;

    addBankNotification(

        "Biometric Login",

        equityBiometric
            ? "Biometric login enabled."
            : "Biometric login disabled."

    );

    alert(

        equityBiometric
            ? "Biometric Enabled."
            : "Biometric Disabled."

    );

}

/* ==========================================
   TOGGLE DARK MODE
========================================== */

function toggleEquityDarkMode() {

    document.body.classList.toggle("dark-theme");

    addBankNotification(

        "Theme Updated",

        "Application theme changed."

    );

}

/* ==========================================
   TOGGLE NOTIFICATIONS
========================================== */

let equityNotifications = true;

function toggleEquityNotifications() {

    equityNotifications = !equityNotifications;

    addBankNotification(

        "Notifications",

        equityNotifications
            ? "Notifications enabled."
            : "Notifications disabled."

    );

}

/* ==========================================
   CHANGE ACCOUNT NAME
========================================== */

function changeEquityAccountName() {

    const newName = prompt(

        "Enter new account name"

    );

    if (!newName) return;

    equityAccount.holder = newName;

    loadEquitySettings();

    addBankNotification(

        "Profile Updated",

        "Account holder name updated."

    );

}

/* ==========================================
   LOGOUT
========================================== */

function logoutEquity() {

    if (!confirm("Logout from Equity Mobile Banking?")) {

        return;

    }

    showScreen("financialServices");

}

/* ==========================================
   APP VERSION
========================================== */

function showEquityVersion() {

    alert(

        "Equity Mobile Banking\n\nVersion 1.0.0"

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.toggleEquityBiometric = toggleEquityBiometric;
window.toggleEquityDarkMode = toggleEquityDarkMode;
window.toggleEquityNotifications = toggleEquityNotifications;
window.changeEquityAccountName = changeEquityAccountName;
window.logoutEquity = logoutEquity;
window.showEquityVersion = showEquityVersion;