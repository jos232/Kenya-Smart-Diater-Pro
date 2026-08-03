/* ==========================================
   KENYA SMART DIALER PRO
   VOICE MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({

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

    /* Package */

    packageName: {

        type: String,

        required: true

    },

    /* Minutes */

    minutes: {

        type: Number,

        required: true,

        min: 1

    },

    /* Price */

    price: {

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

    /* Receipt */

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

VoiceSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "VOC" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();

});

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "Voice",

    VoiceSchema

);