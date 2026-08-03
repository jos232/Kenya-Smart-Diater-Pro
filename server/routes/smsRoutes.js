/* ==========================================
   KENYA SMART DIALER PRO
   SMS ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    buySMS,
    getHistory,
    deleteSMS

} = require("../controllers/smsController");

/* ==========================================
   BUY SMS
========================================== */

router.post("/", auth, buySMS);

/* ==========================================
   SMS HISTORY
========================================== */

router.get("/", auth, getHistory);

/* ==========================================
   DELETE HISTORY ITEM
========================================== */

router.delete("/:id", auth, deleteSMS);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;