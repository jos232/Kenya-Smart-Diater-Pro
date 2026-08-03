/* ==========================================
   KENYA SMART DIALER PRO
   FINANCIAL ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    getProfile,
    getBalances,
    updateWallet,
    updateBankBalance

} = require("../controllers/financialController");

/* ==========================================
   FINANCIAL PROFILE
========================================== */

// Get complete financial profile
router.get("/profile", auth, getProfile);

// Get balances only
router.get("/balances", auth, getBalances);

// Update wallet balance
router.put("/wallet", auth, updateWallet);

// Update KCB / Equity / Co-op balance
router.put("/bank", auth, updateBankBalance);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;