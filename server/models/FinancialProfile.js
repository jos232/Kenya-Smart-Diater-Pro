/* ==========================================
   KENYA SMART DIALER PRO
   FINANCIAL PROFILE MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

/* ==========================================
   FINANCIAL PROFILE
========================================== */

const FinancialProfileSchema = new mongoose.Schema({

    /* User */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true

    },

    /* Wallet */

    wallet: {

        balance: {

            type: Number,

            default: 0,

            min: 0

        }

    },

    /* Bank Accounts */

    banks: {

        kcb: {

            accountNumber: {

                type: String,

                default: ""

            },

            balance: {

                type: Number,

                default: 0,

                min: 0

            }

        },

        equity: {

            accountNumber: {

                type: String,

                default: ""

            },

            balance: {

                type: Number,

                default: 0,

                min: 0

            }

        },

        coop: {

            accountNumber: {

                type: String,

                default: ""

            },

            balance: {

                type: Number,

                default: 0,

                min: 0

            }

        }

    },

    /* Airtime */

    airtime: {

        safaricom: {

            type: Number,

            default: 0,

            min: 0

        },

        airtel: {

            type: Number,

            default: 0,

            min: 0

        },

        telkom: {

            type: Number,

            default: 0,

            min: 0

        }

    },

    /* Bundles */

    bundles: {

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

        }

    },

    /* Loans */

    loans: {

        outstanding: {

            type: Number,

            default: 0,

            min: 0

        },

        limit: {

            type: Number,

            default: 100000

        }

    },

    /* Cards */

    cards: {

        active: {

            type: Boolean,

            default: true

        },

        frozen: {

            type: Boolean,

            default: false

        }

    },

    /* Savings */

    savings: {

        balance: {

            type: Number,

            default: 0,

            min: 0

        }

    }

},

    {

        timestamps: true

    });

/* ==========================================
   INDEXES
========================================== */

FinancialProfileSchema.index({

    user: 1

});

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "FinancialProfile",

    FinancialProfileSchema

);