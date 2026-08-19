/* ==========================================
   KENYA SMART DIALER PRO
   TRANSACTION MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

/* ==========================================
   TRANSACTION SCHEMA
========================================== */

const TransactionSchema = new mongoose.Schema({

    /* ==========================================
       OWNER
    ========================================== */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    /* ==========================================
       TRANSACTION SOURCE
    ========================================== */

    bank: {

        type: String,

        set: value => {

            if (!value) return value;

            return String(value)
                .trim()
                .toUpperCase();

        },

        enum: [

            "KCB",

            "EQUITY",

            "CO-OP",

            "WALLET",

            "M-PESA"

        ],

        required: true

    },

    /* ==========================================
       TRANSACTION TYPE / SERVICE
    ========================================== */

    service: {

        type: String,

        required: true

    },

    /* ==========================================
       SENDER
    ========================================== */

    sender: {

        type: String,

        default: ""

    },

    /* ==========================================
       RECIPIENT
    ========================================== */

    recipient: {

        type: String,

        default: ""

    },

    /* ==========================================
       REFERENCE
    ========================================== */

    reference: {

        type: String,

        default: ""

    },

    /* ==========================================
       AMOUNT
    ========================================== */

    amount: {

        type: Number,

        required: true,

        min: 0

    },

    /* ==========================================
       FEE
    ========================================== */

    fee: {

        type: Number,

        default: 0,

        min: 0

    },

    /* ==========================================
       TOTAL
    ========================================== */

    total: {

        type: Number,

        required: true,

        min: 0

    },

    /* ==========================================
       BALANCE AFTER TRANSACTION
    ========================================== */

    balance: {

        type: Number,

        default: 0

    },

    /* ==========================================
       STATUS
    ========================================== */

    status: {

        type: String,

        enum: [

            "SUCCESS",

            "PENDING",

            "FAILED"

        ],

        default: "SUCCESS"

    },

    /* ==========================================
       RECEIPT NUMBER
    ========================================== */

    receiptNumber: {

        type: String,

        unique: true

    },

    /* ==========================================
       EXTRA METADATA
    ========================================== */

    metadata: {

        type: Object,

        default: {}

    }

},

    {

        timestamps: true

    });

/* ==========================================
   INDEXES
========================================== */

TransactionSchema.index({

    createdAt: -1

});

TransactionSchema.index({

    bank: 1

});

TransactionSchema.index({

    service: 1

});

/* ==========================================
   AUTO RECEIPT NUMBER
========================================== */

TransactionSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "TXN" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();

});

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "Transaction",

    TransactionSchema

);