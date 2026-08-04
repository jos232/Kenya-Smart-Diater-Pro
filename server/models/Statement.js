/* ==========================================
   KENYA SMART DIALER
   Statement Model
========================================== */

const mongoose = require("mongoose");

const statementSchema = new mongoose.Schema({

    bank: {
        type: String,
        required: true,
        enum: [
            "KCB",
            "Equity",
            "Coop",
            "ABSA",
            "NCBA",
            "Standard"
        ]
    },

    accountNumber: {
        type: String,
        required: true,
        index: true
    },

    transactionId: {
        type: String,
        required: true,
        unique: true
    },

    reference: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    sender: {
        type: String,
        default: ""
    },

    recipient: {
        type: String,
        default: ""
    },

    amount: {
        type: Number,
        required: true,
        default: 0
    },

    charges: {
        type: Number,
        default: 0
    },

    balance: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "KES"
    },

    status: {
        type: String,
        enum: [
            "SUCCESS",
            "FAILED",
            "PENDING"
        ],
        default: "SUCCESS"
    },

    channel: {
        type: String,
        enum: [
            "APP",
            "ATM",
            "CARD",
            "USSD",
            "AGENT",
            "BANK"
        ],
        default: "APP"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Statement",
    statementSchema
);