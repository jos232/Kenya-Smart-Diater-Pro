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

    /* Owner */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    /* Bank */

    bank: {

        type: String,

        enum: [

            "KCB",

            "EQUITY",

            "CO-OP",

            "WALLET"

        ],

        required: true

    },

    /* Transaction Type */

    service: {

        type: String,

        required: true

    },

    /* Sender */

    sender: {

        type: String,

        default: ""

    },

    /* Recipient */

    recipient: {

        type: String,

        default: ""

    },

    /* Reference */

    reference: {

        type: String,

        default: ""

    },

    /* Amount */

    amount: {

        type: Number,

        required: true,

        min: 0

    },

    /* Fee */

    fee: {

        type: Number,

        default: 0,

        min: 0

    },

    /* Total */

    total: {

        type: Number,

        required: true,

        min: 0

    },

    /* Balance After Transaction */

    balance: {

        type: Number,

        default: 0

    },

    /* Status */

    status: {

        type: String,

        enum: [

            "SUCCESS",

            "PENDING",

            "FAILED"

        ],

        default: "SUCCESS"

    },

    /* Receipt Number */

    receiptNumber: {

        type: String,

        unique: true

    },

    /* Extra Metadata */

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