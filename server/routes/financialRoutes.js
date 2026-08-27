/* ==========================================
   KENYA SMART DIALER PRO
   FINANCIAL ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth =
   require("../middleware/auth");

const {
   getProfile,
   getBalances,
   getAccountInformation,
   updateWallet,
   updateMpesa,
   updateBankBalance
} = require(
   "../controllers/financialController"
);


/* ==========================================
   GET COMPLETE FINANCIAL PROFILE
========================================== */

router.get(
   "/profile",
   auth,
   getProfile
);


/* ==========================================
   GET BALANCES
========================================== */

router.get(
   "/balances",
   auth,
   getBalances
);


/* ==========================================
   GET ACCOUNT INFORMATION
========================================== */

router.get(
   "/accounts",
   auth,
   getAccountInformation
);


/* ==========================================
   UPDATE WALLET
========================================== */

router.put(
   "/wallet",
   auth,
   updateWallet
);

/* ==========================================
   UPDATE M-PESA
========================================== */

router.put(
   "/mpesa",
   auth,
   updateMpesa
);


/* ==========================================
   UPDATE BANK BALANCE
========================================== */

router.put(
   "/bank",
   auth,
   updateBankBalance
);


module.exports = router;