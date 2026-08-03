/* ==========================================
   KCB SETTINGS
========================================== */

"use strict";

let biometricEnabled = false;
let notificationsEnabled = true;

/* ==========================
   OPEN SETTINGS
========================== */

function openSettings() {

    showScreen("kcbSettings");

}

/* ==========================
   CHANGE PIN
========================== */

function changeTransactionPIN() {

    const current = prompt("Current PIN");

    const verify = verifyPIN(current);

    if (!verify.success) {

        alert("Incorrect PIN.");

        return;

    }

    const newPin = prompt("New 4-digit PIN");

    if (!newPin || newPin.length !== 4) {

        alert("PIN must contain exactly 4 digits.");

        return;

    }

    localStorage.setItem("bankPIN", newPin);

    alert("Transaction PIN changed successfully.");

}

/* ==========================
   BIOMETRIC
========================== */

function toggleBiometric() {

    biometricEnabled = !biometricEnabled;

    alert(

        biometricEnabled

            ? "Biometric Login Enabled"

            : "Biometric Login Disabled"

    );

}

/* ==========================
   DARK MODE
========================== */

function toggleDarkMode() {

    document.body.classList.toggle("dark-theme");

}

/* ==========================
   NOTIFICATIONS
========================== */

function toggleBankNotifications() {

    notificationsEnabled = !notificationsEnabled;

    alert(

        notificationsEnabled

            ? "Notifications Enabled"

            : "Notifications Disabled"

    );

}

/* ==========================
   LOGOUT
========================== */

function logoutBanking() {

    if (!confirm("Logout from KCB Mobile?")) return;

    showScreen("financialServices");

}
/* ==========================================
   CHANGE LOGIN PASSWORD
========================================== */

function changeLoginPassword() {

    const oldPassword = prompt("Enter Current Password");

    if (!oldPassword) return;

    const newPassword = prompt("Enter New Password");

    if (!newPassword || newPassword.length < 6) {

        alert("Password must be at least 6 characters.");

        return;

    }

    alert("Password changed successfully.");

    addBankNotification(
        "Password Changed",
        "Your KCB login password has been updated."
    );

}

/* ==========================================
   TWO FACTOR AUTHENTICATION
========================================== */

let twoFactorEnabled = false;

function toggleTwoFactor() {

    twoFactorEnabled = !twoFactorEnabled;

    alert(
        twoFactorEnabled
            ? "Two-Factor Authentication Enabled"
            : "Two-Factor Authentication Disabled"
    );

}

/* ==========================================
   LANGUAGE
========================================== */

function changeLanguage() {

    const language = prompt(

        "Choose Language:\n\nEnglish\nSwahili"

    );

    if (!language) return;

    alert("Language changed to " + language);

}

/* ==========================================
   MANAGE DEVICES
========================================== */

function manageDevices() {

    alert(

        "Trusted Devices\n\n" +

        "• Samsung Galaxy S24\n" +

        "• Windows Laptop\n\n" +

        "Device management coming soon."

    );

}

/* ==========================================
   PRIVACY
========================================== */

function privacySettings() {

    alert(

        "Privacy Settings\n\n" +

        "• Hide Balance\n" +

        "• Hide Account Number\n" +

        "• Disable Screenshots"

    );

}

/* ==========================================
   LOGOUT ALL DEVICES
========================================== */

function logoutAllDevices() {

    if (!confirm("Logout from all devices?"))
        return;

    alert("Logged out from all devices.");

    addBankNotification(

        "Security",

        "All active sessions have been terminated."

    );

}

/* ==========================================
   CLOSE ACCOUNT
========================================== */

function requestAccountClosure() {

    if (!confirm("Request account closure?"))
        return;

    alert(

        "Your request has been submitted.\n" +

        "KCB will contact you shortly."

    );

}

/* ==========================================
   SECURITY STATUS
========================================== */

function securityStatus() {

    alert(

        "Security Status\n\n" +

        "Biometric: " +

        (biometricEnabled ? "Enabled" : "Disabled") +

        "\n2FA: " +

        (twoFactorEnabled ? "Enabled" : "Disabled") +

        "\nNotifications: " +

        (notificationsEnabled ? "Enabled" : "Disabled")

    );

}
/* ==========================================
   EXPORTS
========================================== */

window.openSettings = openSettings;

window.changeTransactionPIN = changeTransactionPIN;

window.toggleBiometric = toggleBiometric;

window.toggleDarkMode = toggleDarkMode;

window.toggleBankNotifications = toggleBankNotifications;

window.logoutBanking = logoutBanking;

window.changeLoginPassword = changeLoginPassword;

window.toggleTwoFactor = toggleTwoFactor;

window.changeLanguage = changeLanguage;

window.manageDevices = manageDevices;

window.privacySettings = privacySettings;

window.logoutAllDevices = logoutAllDevices;

window.requestAccountClosure = requestAccountClosure;

window.securityStatus = securityStatus;

window.biometricEnabled = biometricEnabled;

window.notificationsEnabled = notificationsEnabled;

window.twoFactorEnabled = twoFactorEnabled;