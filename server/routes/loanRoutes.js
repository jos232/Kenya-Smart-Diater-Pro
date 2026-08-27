"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    applyLoan,
    getLoans,
    repayLoan,
    calculateLoan,
    getLoanEligibility
} = require("../controllers/loanController");


/* ==========================================
   APPLY LOAN
========================================== */

router.post(
    "/apply",
    auth,
    applyLoan
);


/* ==========================================
   CALCULATE LOAN
========================================== */

router.post(
    "/calculate",
    auth,
    calculateLoan
);


/* ==========================================
   LOAN ELIGIBILITY
========================================== */

router.get(
    "/eligibility",
    auth,
    getLoanEligibility
);


/* ==========================================
   LOAN HISTORY
========================================== */

router.get(
    "/",
    auth,
    getLoans
);


/* ==========================================
   REPAY LOAN
========================================== */

router.put(
    "/repay/:id",
    auth,
    repayLoan
);


module.exports = router;