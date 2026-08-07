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
        default: "Data"
    },

    packageName: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    expiry: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED"],
        default: "ACTIVE"
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Bundle", BundleSchema);