/* ==========================================
   KENYA SMART DIALER
   Notification Service
========================================== */

"use strict";

const Notification = require("../models/Notification");

/* ==========================================
   CREATE NOTIFICATION
========================================== */

async function sendNotification({

    bank,

    accountNumber,

    title,

    message,

    type = "INFO"

}) {

    try {

        const notification = new Notification({

            bank,

            accountNumber,

            title,

            message,

            type,

            read: false,

            createdAt: new Date()

        });

        await notification.save();

        return {

            success: true,

            notification

        };

    }

    catch (error) {

        console.error(

            "Notification Service Error:",

            error

        );

        return {

            success: false,

            error

        };

    }

}

/* ==========================================
   GET NOTIFICATIONS
========================================== */

async function getNotifications(bank, accountNumber) {

    return await Notification.find({

        bank,

        accountNumber

    })

        .sort({

            createdAt: -1

        });

}

/* ==========================================
   MARK AS READ
========================================== */

async function markAsRead(id) {

    return await Notification.findByIdAndUpdate(

        id,

        {

            read: true

        },

        {

            new: true

        }

    );

}

/* ==========================================
   DELETE NOTIFICATION
========================================== */

async function deleteNotification(id) {

    return await Notification.findByIdAndDelete(id);

}

/* ==========================================
   CLEAR ALL
========================================== */

async function clearNotifications(bank, accountNumber) {

    return await Notification.deleteMany({

        bank,

        accountNumber

    });

}

/* ==========================================
   EXPORTS
========================================== */

module.exports = {

    sendNotification,

    getNotifications,

    markAsRead,

    deleteNotification,

    clearNotifications

};