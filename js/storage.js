/* ==========================================
   KENYA SMART DIALER PRO
   storage.js
========================================== */

"use strict";

const STORAGE_KEYS = {

    CONTACTS: "ksd_contacts",

    RECENT_CALLS: "ksd_recent_calls",

    AIRTIME_HISTORY: "ksd_airtime_history",

    BUNDLE_HISTORY: "ksd_bundle_history",

    SUBSCRIPTIONS: "ksd_subscriptions",

    SPEED_DIAL: "ksd_speed_dial"

};

/* ==========================
   Save Data
========================== */

function saveData(key, data) {

    localStorage.setItem(

        key,

        JSON.stringify(data)

    );

}

/* ==========================
   Load Data
========================== */

function loadData(key) {

    const data = localStorage.getItem(key);

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    }

    catch (error) {

        console.error("Storage Error:", error);

        return [];

    }

}

/* ==========================
   Remove Data
========================== */

function removeData(key) {

    localStorage.removeItem(key);

}

/* ==========================
   Clear Everything
========================== */

function clearAllData() {

    Object.values(STORAGE_KEYS).forEach(key => {

        localStorage.removeItem(key);

    });

}

/* ==========================
   Helpers
========================== */

function getContacts() {

    return loadData(STORAGE_KEYS.CONTACTS);

}

function saveContacts(data) {

    saveData(STORAGE_KEYS.CONTACTS, data);

}

function getRecentCalls() {

    return loadData(STORAGE_KEYS.RECENT_CALLS);

}

function saveRecentCalls(data) {

    saveData(STORAGE_KEYS.RECENT_CALLS, data);

}
/* ==========================
   Get Airtime History
========================== */

function getAirtimeHistory() {

    const history = loadData(STORAGE_KEYS.AIRTIME_HISTORY);

    if (Array.isArray(history)) {
        return history;
    }

    return [];

}

/* ==========================
   Save Airtime History
========================== */

function saveAirtimeHistory(history) {

    saveData(STORAGE_KEYS.AIRTIME_HISTORY, history);

}

function getBundleHistory() {

    return loadData(STORAGE_KEYS.BUNDLE_HISTORY);

}

function saveBundleHistory(data) {

    saveData(STORAGE_KEYS.BUNDLE_HISTORY, data);

}

function getSubscriptions() {

    return loadData(STORAGE_KEYS.SUBSCRIPTIONS);

}

function saveSubscriptions(data) {

    saveData(STORAGE_KEYS.SUBSCRIPTIONS, data);

}
/* ==========================
   Speed Dial
========================== */

function getSpeedDial() {

    return loadData(STORAGE_KEYS.SPEED_DIAL);

}

function saveSpeedDial(data) {

    saveData(STORAGE_KEYS.SPEED_DIAL, data);

}