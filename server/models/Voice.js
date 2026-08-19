/* ==========================================
   KENYA SMART DIALER PRO
   VOICE MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema(
    {
        /* ==========================
           OWNER
        ========================== */
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        /* ==========================
           PHONE
        ========================== */

        phone: {
            type: String,
            required: true,
            trim: true
        },

        /* ==========================
           NETWORK
        ========================== */

        network: {
            type: String,
            enum: [
                "Safaricom",
                "Airtel",
                "Telkom",
                "Faiba",
                "Unknown"
            ],
            default: "Unknown"
        },

        /* ==========================
           PACKAGE
        ========================== */

        packageName: {
            type: String,
            required: true,
            trim: true
        },

        /* ==========================
           MINUTES
        ========================== */

        minutes: {
            type: Number,
            required: true,
            min: 1
        },

        /* ==========================
           PRICE
        ========================== */

        price: {
            type: Number,
            required: true,
            min: 1
        },

        /* ==========================
   PAYMENT
========================== */

        paymentMethod: {
            type: String,
            enum: [
                "WALLET",
                "KCB",
                "EQUITY",
                "CO-OP",
                "MPESA"
            ],
            default: "WALLET"
        },

        /* ==========================
           STATUS
        ========================== */

        status: {
            type: String,
            enum: [
                "SUCCESS",
                "PENDING",
                "FAILED"
            ],
            default: "SUCCESS"
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
   INDEX
========================================== */

VoiceSchema.index({
    user: 1,
    createdAt: -1
});

/* ==========================================
   RECEIPT
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
   EXPORT MODEL
========================================== */

module.exports =
    mongoose.models.Voice ||
    mongoose.model("Voice", VoiceSchema);