/* ==========================================
   KENYA SMART DIALER PRO
   BUNDLE MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const BundleSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    bundleType: {
        type: String,
        enum: ["Data", "Voice", "SMS"],
        required: true
    },

    packageName: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    expiry: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        default: "Wallet"
    },

    status: {
        type: String,
        default: "SUCCESS"
    },

    receiptNumber: {
        type: String,
        unique: true
    }

}, {

    timestamps: true

});

BundleSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "BND" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();

});

module.exports = mongoose.model("Bundle", BundleSchema);