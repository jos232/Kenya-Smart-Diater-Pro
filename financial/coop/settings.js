/* ==========================================
   CO-OPERATIVE BANK
   SETTINGS
========================================== */

"use strict";

/* ==========================
   SETTINGS STATE
========================== */

let coopBiometricEnabled = false;
let coopNotificationsEnabled = true;
let coopTwoFactorEnabled = false;

/* ==========================
   OPEN SETTINGS
========================== */

function openCoopSettings() {

    showScreen("coopSettings");

}

/* ==========================
   CHANGE TRANSACTION PIN
========================== */

function changeCoopPIN() {

    const oldPin =
        document.getElementById("coopOldPIN").value.trim();

    const newPin =
        document.getElementById("coopNewPIN").value.trim();

    const confirmPin =
        document.getElementById("coopConfirmPIN").value.trim();

    const verify = verifyPIN(oldPin);

    if (!verify.success) {

        alert("Current PIN is incorrect.");

        return;

    }

    if (newPin.length !== 4 || isNaN(newPin)) {

        alert("PIN must contain exactly 4 digits.");

        return;

    }

    if (newPin !== confirmPin) {

        alert("PIN confirmation does not match.");

        return;

    }

    if (newPin === oldPin) {

        alert("New PIN cannot be the same as the old PIN.");

        return;

    }

    localStorage.setItem("bankPIN", newPin);

    addBankNotification(

        "PIN Changed",

        "Your Co-operative Bank transaction PIN has been updated."

    );

    alert("PIN changed successfully.");

    document.getElementById("coopOldPIN").value = "";
    document.getElementById("coopNewPIN").value = "";
    document.getElementById("coopConfirmPIN").value = "";

}

/* ==========================
   CHANGE LOGIN PASSWORD
========================== */

function changeCoopPassword() {

    const oldPassword = prompt("Current Password");

    if (!oldPassword) return;

    const newPassword = prompt("New Password");

    if (!newPassword || newPassword.length < 6) {

        alert("Password must be at least 6 characters.");

        return;

    }

    addBankNotification(

        "Password Changed",

        "Your login password has been updated."

    );

    alert("Password changed successfully.");

}

/* ==========================
   BIOMETRIC LOGIN
========================== */

function toggleCoopBiometric() {

    coopBiometricEnabled = !coopBiometricEnabled;

    alert(

        coopBiometricEnabled

            ? "Biometric Login Enabled"

            : "Biometric Login Disabled"

    );

}

/* ==========================
   TWO FACTOR
========================== */

function toggleCoopTwoFactor() {

    coopTwoFactorEnabled = !coopTwoFactorEnabled;

    alert(

        coopTwoFactorEnabled

            ? "Two-Factor Authentication Enabled"

            : "Two-Factor Authentication Disabled"

    );

}

/* ==========================
   NOTIFICATIONS
========================== */

function toggleCoopNotifications() {

    coopNotificationsEnabled = !coopNotificationsEnabled;

    alert(

        coopNotificationsEnabled

            ? "Notifications Enabled"

            : "Notifications Disabled"

    );

}

/* ==========================
   DARK MODE
========================== */

function toggleCoopDarkMode() {

    document.body.classList.toggle("dark-theme");

}

/* ==========================
   LANGUAGE
========================== */

function changeCoopLanguage() {

    const language = prompt(

        "Choose Language\n\nEnglish\nSwahili"

    );

    if (!language) return;

    alert("Language changed to " + language);

}

/* ==========================
   MANAGE DEVICES
========================== */

function manageCoopDevices() {

    alert(

        "Trusted Devices\n\n" +

        "• Samsung Galaxy S24\n" +

        "• Windows Laptop\n\n" +

        "Device management coming soon."

    );

}

/* ==========================
   PRIVACY
========================== */

function coopPrivacySettings() {

    alert(

        "Privacy Settings\n\n" +

        "• Hide Balance\n" +

        "• Hide Account Number\n" +

        "• Disable Screenshots"

    );

}

/* ==========================
   LOGOUT ALL DEVICES
========================== */

function logoutCoopDevices() {

    if (!confirm("Logout from all devices?"))

        return;

    addBankNotification(

        "Security",

        "All active sessions have been terminated."

    );

    alert("Logged out from all devices.");

}

/* ==========================
   ACCOUNT CLOSURE
========================== */

function requestCoopAccountClosure() {

    if (!confirm("Request account closure?"))

        return;

    alert(

        "Your request has been submitted.\n" +

        "A Co-operative Bank representative will contact you."

    );

}

/* ==========================
   SECURITY STATUS
========================== */

function coopSecurityStatus() {

    alert(

        "Security Status\n\n" +

        "Biometric: " +

        (coopBiometricEnabled ? "Enabled" : "Disabled") +

        "\nTwo Factor: " +

        (coopTwoFactorEnabled ? "Enabled" : "Disabled") +

        "\nNotifications: " +

        (coopNotificationsEnabled ? "Enabled" : "Disabled")

    );

}

/* ==========================
   LOGOUT
========================== */

function logoutCoopBanking() {

    if (!confirm("Logout from Co-operative Bank?"))

        return;

    showScreen("financialServices");

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopSettings = openCoopSettings;

window.changeCoopPIN = changeCoopPIN;

window.changeCoopPassword = changeCoopPassword;

window.toggleCoopBiometric = toggleCoopBiometric;

window.toggleCoopTwoFactor = toggleCoopTwoFactor;

window.toggleCoopNotifications = toggleCoopNotifications;

window.toggleCoopDarkMode = toggleCoopDarkMode;

window.changeCoopLanguage = changeCoopLanguage;

window.manageCoopDevices = manageCoopDevices;

window.coopPrivacySettings = coopPrivacySettings;

window.logoutCoopDevices = logoutCoopDevices;

window.requestCoopAccountClosure = requestCoopAccountClosure;

window.coopSecurityStatus = coopSecurityStatus;

window.logoutCoopBanking = logoutCoopBanking;