/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const mpesaController =
    require("../controllers/mpesaController");

const auth =
    require("../middleware/auth");

/* ==========================================
   M-PESA TRANSACTIONS
========================================== */

router.get(
    "/",
    auth,
    mpesaController.getMpesaTransactions
);

router.post(
    "/",
    auth,
    mpesaController.createMpesaTransaction
);

router.get(
    "/:id",
    auth,
    mpesaController.getMpesaTransaction
);

router.delete(
    "/:id",
    auth,
    mpesaController.deleteMpesaTransaction
);

module.exports = router;