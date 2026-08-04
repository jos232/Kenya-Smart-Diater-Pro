/* ==========================================
   KENYA SMART DIALER PRO
   LOAN MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    loanType: {

        type: String,

        enum: [

            "Personal",

            "Business",

            "Emergency",

            "Salary Advance"

        ],

        default: "Personal"

    },

    amount: {

        type: Number,

        required: true

    },

    interestRate: {

        type: Number,

        default: 12

    },

    duration: {

        type: Number,

        required: true

    },

    monthlyPayment: {

        type: Number,

        default: 0

    },

    totalRepayment: {

        type: Number,

        default: 0

    },

    balance: {

        type: Number,

        default: 0

    },

    purpose: {

        type: String,

        default: ""

    },

    status: {

        type: String,

        enum: [

            "PENDING",

            "APPROVED",

            "ACTIVE",

            "COMPLETED",

            "REJECTED"

        ],

        default: "ACTIVE"

    },

    repaymentDate: {

        type: Date

    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Loan", loanSchema);