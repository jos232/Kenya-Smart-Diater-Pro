/* ==========================================
   KENYA SMART DIALER PRO
   TRANSACTION ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction

} = require("../controllers/transactionController");

/* ==========================================
   TRANSACTION ROUTES
========================================== */

// Get all transactions for logged-in user
router.get("/", auth, getTransactions);

// Get single transaction
router.get("/:id", auth, getTransaction);

// Create transaction
router.post("/", auth, createTransaction);

// Update transaction
router.put("/:id", auth, updateTransaction);

// Delete transaction
router.delete("/:id", auth, deleteTransaction);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;