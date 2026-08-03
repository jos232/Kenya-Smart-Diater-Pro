/* ==========================================
   KENYA SMART DIALER PRO
   CONTACT MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({

    /* Owner */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    /* Contact Name */

    name: {

        type: String,

        required: true,

        trim: true

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

        default: "Unknown"

    },

    /* Contact Photo */

    photo: {

        type: String,

        default: ""

    },

    /* Favourite */

    favorite: {

        type: Boolean,

        default: false

    }

},

    {

        timestamps: true

    });

/* ==========================================
   INDEXES
========================================== */

ContactSchema.index({

    user: 1,

    name: 1

});

ContactSchema.index({

    user: 1,

    phone: 1

});

/* ==========================================
   EXPORT
========================================== */

module.exports = mongoose.model(

    "Contact",

    ContactSchema

);