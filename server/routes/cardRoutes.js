/* ==========================================
   KENYA SMART DIALER PRO
   CARD ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    getCards,

    createCard,

    freezeCard,

    unfreezeCard,

    blockCard,

    changePIN,

    updateLimits,

    updateSettings,

    replaceCard

} = require("../controllers/cardController");

/* ==========================================
   GET USER CARDS
========================================== */

router.get("/", auth, getCards);

/* ==========================================
   CREATE NEW CARD
========================================== */

router.post("/create", auth, createCard);

/* ==========================================
   FREEZE CARD
========================================== */

router.put("/freeze/:id", auth, freezeCard);

/* ==========================================
   UNFREEZE CARD
========================================== */

router.put("/unfreeze/:id", auth, unfreezeCard);

/* ==========================================
   BLOCK CARD
========================================== */

router.put("/block/:id", auth, blockCard);

/* ==========================================
   CHANGE PIN
========================================== */

router.put("/pin/:id", auth, changePIN);

/* ==========================================
   UPDATE LIMITS
========================================== */

router.put("/limits/:id", auth, updateLimits);

/* ==========================================
   UPDATE SETTINGS
========================================== */

router.put("/settings/:id", auth, updateSettings);

/* ==========================================
   REPLACE CARD
========================================== */

router.post("/replace/:id", auth, replaceCard);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;