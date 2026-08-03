/* ==========================================
   KENYA SMART DIALER PRO
   VOICE ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    buyVoice,
    getHistory,
    getVoiceById,
    deleteVoice

} = require("../controllers/voiceController");

/* ==========================================
   BUY VOICE PACKAGE
========================================== */

router.post("/", auth, buyVoice);

/* ==========================================
   VOICE HISTORY
========================================== */

router.get("/", auth, getHistory);

/* ==========================================
   GET SINGLE PURCHASE
========================================== */

router.get("/:id", auth, getVoiceById);

/* ==========================================
   DELETE PURCHASE
========================================== */

router.delete("/:id", auth, deleteVoice);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;