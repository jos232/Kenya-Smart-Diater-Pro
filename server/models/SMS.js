/*
==========================================
KENYA SMART DIALER PRO
SMS MODEL
==========================================
*/

"use strict";

const mongoose = require("mongoose");

const SMSSchema = new mongoose.Schema(
    {
        // Owner
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Phone number
        phone: {
            type: String,
            required: true,
            trim: true
        },

        // Network
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

        // Package name
        packageName: {
            type: String,
            required: true,
            trim: true
        },

        // SMS quantity
        sms: {
            type: Number,
            required: true,
            min: 1
        },

        // Price
        price: {
            type: Number,
            required: true,
            min: 1
        },

        // Payment method
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

        // Purchase status
        status: {
            type: String,
            enum: [
                "SUCCESS",
                "PENDING",
                "FAILED"
            ],
            default: "SUCCESS"
        },

        // Receipt
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

// Auto-generate receipt
SMSSchema.pre("save", function (next) {

    if (!this.receiptNumber) {

        this.receiptNumber =
            "SMS" +
            Date.now() +
            Math.floor(Math.random() * 1000);

    }

    next();
});

module.exports = mongoose.model("SMS", SMSSchema);