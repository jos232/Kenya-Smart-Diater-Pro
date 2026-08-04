/* ==========================================
   KENYA SMART DIALER PRO
   CARD MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

/* ==========================================
   CARD SCHEMA
========================================== */

const CardSchema = new mongoose.Schema(

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        bank: {

            type: String,

            required: true,

            default: "KCB"

        },

        cardType: {

            type: String,

            enum: [

                "Debit",

                "Credit",

                "Virtual"

            ],

            default: "Debit"

        },

        cardNumber: {

            type: String,

            required: true

        },

        expiry: {

            type: String,

            required: true

        },

        cvv: {

            type: String,

            required: true

        },

        frozen: {

            type: Boolean,

            default: false

        },

        blocked: {

            type: Boolean,

            default: false

        },

        status: {

            type: String,

            enum: [

                "ACTIVE",

                "FROZEN",

                "BLOCKED"

            ],

            default: "ACTIVE"

        },

        onlinePayments: {

            type: Boolean,

            default: true

        },

        internationalPayments: {

            type: Boolean,

            default: false

        },

        contactlessPayments: {

            type: Boolean,

            default: true

        },

        limits: {

            atm: {

                type: Number,

                default: 50000

            },

            pos: {

                type: Number,

                default: 150000

            },

            online: {

                type: Number,

                default: 100000

            }

        }

    },

    {

        timestamps: true

    }

);

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "Card",

    CardSchema

);