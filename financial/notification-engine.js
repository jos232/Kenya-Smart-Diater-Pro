/* ==========================================
   KENYA SMART DIALER
   NOTIFICATION ENGINE
========================================== */

"use strict";

/* ==========================
   STORAGE
========================== */

const NOTIFICATION_KEY = "KSD_BANK_NOTIFICATIONS";

/* ==========================
   LOAD NOTIFICATIONS
========================== */

function getNotifications() {

    const data =
        localStorage.getItem(NOTIFICATION_KEY);

    return data
        ? JSON.parse(data)
        : [];

}

/* ==========================
   SAVE NOTIFICATIONS
========================== */

function saveNotifications(list) {

    localStorage.setItem(

        NOTIFICATION_KEY,

        JSON.stringify(list)

    );

}

/* ==========================
   ADD NOTIFICATION
========================== */

function addBankNotification(title, message) {

    const notifications =
        getNotifications();

    notifications.unshift({

        id: Date.now(),

        title,

        message,

        date: new Date().toLocaleString(),

        read: false

    });

    saveNotifications(notifications);

}

/* ==========================
   MARK AS READ
========================== */

function markNotificationRead(id) {

    const notifications =
        getNotifications();

    notifications.forEach(item => {

        if (item.id === id) {

            item.read = true;

        }

    });

    saveNotifications(notifications);

}

/* ==========================
   CLEAR NOTIFICATIONS
========================== */

function clearNotifications() {

    localStorage.removeItem(

        NOTIFICATION_KEY

    );

}