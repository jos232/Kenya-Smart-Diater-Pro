/* ==========================================
   KENYA SMART DIALER PRO
   AUTOMATIC SUBSCRIPTION EXPIRY JOB
========================================== */

"use strict";

const {
    expireSubscriptions
} = require("../controllers/subscriptionController");


/* ==========================================
   RUN EXPIRY CHECK
========================================== */

async function runSubscriptionExpiry() {

    console.log(
        "⏰ Checking subscription expiry..."
    );

    await expireSubscriptions();

}


/* ==========================================
   START JOB
========================================== */

function startSubscriptionExpiryJob() {

    /*
       Check immediately when server starts
    */

    runSubscriptionExpiry();


    /*
       Then check every 60 seconds
    */

    setInterval(
        runSubscriptionExpiry,
        60 * 1000
    );

    console.log(
        " Subscription expiry job started."
    );

}


/* ==========================================
   EXPORT
========================================== */

module.exports =
    startSubscriptionExpiryJob;