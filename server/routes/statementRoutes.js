/* ==========================================
   KENYA SMART DIALER
   Statement Routes
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const {

    getStatements,

    getStatement,

    createStatement,

    deleteStatement

} = require("../controllers/statementController");

/* ==========================
   GET ALL STATEMENTS
========================== */

router.get("/:bank", getStatements);

/* ==========================
   GET SINGLE STATEMENT
========================== */

router.get("/details/:id", getStatement);

/* ==========================
   CREATE STATEMENT
========================== */

router.post("/", createStatement);

/* ==========================
   DELETE STATEMENT
========================== */

router.delete("/:id", deleteStatement);

module.exports = router;