/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA ROUTES
========================================== */

"use strict";

const express = require("express");

const router =
    express.Router();

const mpesaController =
    require("../controllers/mpesaController");

const auth =
    require("../middleware/auth");


/* ==========================================
   BALANCE
========================================== */

router.get(
    "/balance",
    auth,
    mpesaController.getMpesaBalance
);


/* ==========================================
   SEND MONEY
========================================== */

router.post(
    "/send",
    auth,
    mpesaController.sendMoney
);


/* ==========================================
   RECEIVE MONEY
========================================== */

router.post(
    "/receive",
    auth,
    mpesaController.receiveMoney
);


/* ==========================================
   BUY GOODS
========================================== */

router.post(
    "/buy-goods",
    auth,
    mpesaController.buyGoods
);


/* ==========================================
   PAY BILL
========================================== */

router.post(
    "/paybill",
    auth,
    mpesaController.payBill
);


/* ==========================================
   M-PESA TRANSACTIONS
========================================== */

router.get(
    "/",
    auth,
    mpesaController.getMpesaTransactions
);


/* ==========================================
   SINGLE TRANSACTION
========================================== */

router.get(
    "/:id",
    auth,
    mpesaController.getMpesaTransaction
);


/* ==========================================
   DELETE TRANSACTION
========================================== */

router.delete(
    "/:id",
    auth,
    mpesaController.deleteMpesaTransaction
);


module.exports = router;