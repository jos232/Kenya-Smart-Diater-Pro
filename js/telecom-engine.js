/* ==========================================
   KENYA SMART DIALER PRO
   telecom-engine.js
========================================== */

"use strict";

/* ==========================================
   TELECOM ENGINE
========================================== */

const Telecom = {

    airtime: Number(localStorage.getItem("airtimeBalance")) || 0,

    data: Number(localStorage.getItem("bundleBalance")) || 0,

    voice: Number(localStorage.getItem("voiceBalance")) || 0,

    sms: Number(localStorage.getItem("smsBalance")) || 0,

    /* ==========================
       SAVE
    ========================== */

    save() {

        localStorage.setItem("airtimeBalance", this.airtime);

        localStorage.setItem("bundleBalance", this.data);

        localStorage.setItem("voiceBalance", this.voice);

        localStorage.setItem("smsBalance", this.sms);

        checkTelecomBalances();

    }

};

/* ==========================================
   LOW BALANCE NOTIFICATIONS
========================================== */

function checkTelecomBalances() {

    if (Telecom.airtime < 10) {

        showToast(" Low Airtime");

    }

    if (Telecom.data < 100) {

        showToast(" Low Data Bundle");

    }

    if (Telecom.voice < 5) {

        showToast(" Low Voice Minutes");

    }

    if (Telecom.sms < 5) {

        showToast(" Low SMS");

    }

}

/* ==========================================
   AIRTIME
========================================== */

function addAirtime(amount) {

    Telecom.airtime += Number(amount);

    Telecom.save();

    refreshApp();

}

function consumeAirtime(amount) {

    Telecom.airtime = Math.max(

        0,

        Telecom.airtime - Number(amount)

    );

    Telecom.save();

    refreshApp();

}

/* ==========================================
   DATA
========================================== */

function addData(mb) {

    Telecom.data += Number(mb);

    Telecom.save();

    refreshApp();

}

function consumeData(mb) {

    Telecom.data = Math.max(

        0,

        Telecom.data - mb

    );

    Telecom.save();

    if (Telecom.data <= 500 && Telecom.data > 0) {

        showToast("️ Low Bundle Balance");

    }

    if (Telecom.data === 0) {

        showToast(" Bundle Exhausted");

    }

    refreshApp();

}

/* ==========================
   Simulate Internet Usage
========================== */

function browseInternet() {

    consumeData(2);

    showToast(" Browsing... -2 MB");

}

function watchVideo() {

    consumeData(50);

    showToast(" Video Streaming... -50 MB");

}

function downloadFile() {

    consumeData(100);

    showToast("⬇️ Download Complete -100 MB");

}

/* ==========================================
   VOICE
========================================== */

function addVoice(minutes) {

    Telecom.voice += Number(minutes);

    Telecom.save();

    refreshApp();

}

function consumeVoice(minutes = 1) {

    Telecom.voice = Math.max(

        0,

        Telecom.voice - Number(minutes)

    );

    Telecom.save();

    refreshApp();

}

/* ==========================================
   SMS
========================================== */

function addSMS(count) {

    Telecom.sms += Number(count);

    Telecom.save();

    refreshApp();

}

function consumeSMS(count = 1) {

    Telecom.sms = Math.max(

        0,

        Telecom.sms - Number(count)

    );

    Telecom.save();

    refreshApp();

}