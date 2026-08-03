/* ==========================================
   KENYA SMART DIALER PRO
   AIRTIME ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

   buyAirtime,
   getHistory

} = require("../controllers/airtimeController");

/* ==========================================
   AIRTIME ROUTES
========================================== */

// Buy airtime
router.post("/", auth, buyAirtime);

// Airtime purchase history
router.get("/", auth, getHistory);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;