/*
==========================================
KENYA SMART DIALER PRO
SUBSCRIPTION ROUTES
==========================================
*/

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    activateSubscription,
    getActiveSubscription,
    getHistory,
    deleteSubscription,
    checkSubscriptionExpiry
} = require("../controllers/subscriptionController");


/* ==========================================
   ACTIVATE SUBSCRIPTION
========================================== */

router.post(
    "/",
    auth,
    activateSubscription
);


/* ==========================================
   ACTIVE SUBSCRIPTION
========================================== */

router.get(
    "/active",
    auth,
    getActiveSubscription
);


/* ==========================================
   SUBSCRIPTION HISTORY
========================================== */

router.get(
    "/",
    auth,
    getHistory
);


/* ==========================================
   CHECK EXPIRY
========================================== */

router.get(
    "/expiry",
    auth,
    checkSubscriptionExpiry
);


/* ==========================================
   DELETE HISTORY ITEM
========================================== */

router.delete(
    "/:id",
    auth,
    deleteSubscription
);


/* ==========================================
   EXPORT
========================================== */

module.exports = router;