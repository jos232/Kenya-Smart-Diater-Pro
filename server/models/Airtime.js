/* ==========================================
   KENYA SMART DIALER PRO
   AIRTIME MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const AirtimeSchema = new mongoose.Schema({

    /* Owner */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    /* Phone Number */

    phone: {

        type: String,

        required: true,

        trim: true

    },

    /* Network */

    network: {

        type: String,

        enum: [

            "Safaricom",

            "Airtel",

            "Telkom",

            "Faiba",

            "Unknown"

        ],

        required: true

    },

    /* Amount */

    amount: {

        type: Number,

        required: true,

        min: 1

    },

    /* Payment Method */

    paymentMethod: {

        type: String,

        enum: [

            "Wallet",

            "KCB",

            "EQUITY",

            "CO-OP",

            "M-PESA"

        ],

        default: "Wallet"

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

    }

},

    {

        timestamps: true

    });

/* ==========================================
   AUTO RECEIPT NUMBER
========================================== */

AirtimeSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "AIR" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();

});

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "Airtime",

    AirtimeSchema

);