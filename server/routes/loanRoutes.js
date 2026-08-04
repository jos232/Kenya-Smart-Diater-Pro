"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    applyLoan,

    getLoans,

    repayLoan,

    calculateLoan

} = require("../controllers/loanController");

router.post("/apply", auth, applyLoan);

router.post("/calculate", auth, calculateLoan);

router.get("/", auth, getLoans);

router.put("/repay/:id", auth, repayLoan);

module.exports = router;