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

    /* ==========================================
       USER
    ========================================== */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true

    },

    /* ==========================================
       WALLET
    ========================================== */

    wallet: {

        balance: {

            type: Number,

            default: 0,

            min: 0

        }

    },

    /* ==========================================
   M-PESA
========================================== */

    mpesa: {

        phoneNumber: {

            type: String,

            default: ""

        },

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

    /* ==========================================
       BANK ACCOUNTS
    ========================================== */

    banks: {

        /* -------------------------
           KCB
        ------------------------- */

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

        /* -------------------------
           EQUITY
        ------------------------- */

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

        /* -------------------------
           CO-OPERATIVE
        ------------------------- */

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

    /* ==========================================
       AIRTIME
    ========================================== */

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

    /* ==========================================
       BUNDLES
    ========================================== */

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

    /* ==========================================
       LOANS
    ========================================== */

    loans: {

        /* Current unpaid loan */

        outstanding: {

            type: Number,

            default: 0,

            min: 0

        },

        /* Maximum amount approved */

        limit: {

            type: Number,

            default: 0,

            min: 0

        },

        /* Whether the customer has been approved */

        approved: {

            type: Boolean,

            default: false

        }

    },

    /* ==========================================
       CARDS
    ========================================== */

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

    /* ==========================================
       SAVINGS
    ========================================== */

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
   EXPORT
========================================== */

module.exports = mongoose.model(

    "FinancialProfile",

    FinancialProfileSchema

);