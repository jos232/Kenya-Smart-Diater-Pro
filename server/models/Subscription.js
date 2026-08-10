/*
==========================================
KENYA SMART DIALER PRO
SUBSCRIPTION MODEL
==========================================
*/

"use strict";

const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
    {
        /* ==========================
           OWNER
        ========================== */

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        /* ==========================
           PLAN
        ========================== */

        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        validity: {
            type: String,
            required: true
        },

        /* ==========================
           INCLUDED RESOURCES
        ========================== */

        data: {
            type: Number,
            default: 0,
            min: 0
        },

        voice: {
            type: Number,
            default: 0,
            min: 0
        },

        sms: {
            type: Number,
            default: 0,
            min: 0
        },

        airtime: {
            type: Number,
            default: 0,
            min: 0
        },

        /* ==========================
           ACTIVATION
        ========================== */

        activatedAt: {
            type: Date,
            default: Date.now
        },

        expiresAt: {
            type: Date,
            required: true
        },

        /* ==========================
           STATUS
        ========================== */

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "EXPIRED",
                "CANCELLED"
            ],
            default: "ACTIVE"
        },

        /* ==========================
           PAYMENT
        ========================== */

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

        /* ==========================
           RECEIPT
        ========================== */

        receiptNumber: {
            type: String,
            unique: true,
            sparse: true
        }
    },
    {
        timestamps: true
    }
);


/* ==========================================
AUTO RECEIPT NUMBER
========================================== */

SubscriptionSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "SUB" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();

});


/* ==========================================
EXPORT
========================================== */

module.exports = mongoose.model(
    "Subscription",
    SubscriptionSchema
);