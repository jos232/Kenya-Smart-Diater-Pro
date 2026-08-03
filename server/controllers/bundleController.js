/* ==========================================
   KENYA SMART DIALER PRO
   BUNDLE CONTROLLER
========================================== */

"use strict";

const Bundle = require("../models/Bundle");
const Transaction = require("../models/Transaction");

/* ==========================================
   BUY BUNDLE
========================================== */

exports.buyBundle = async (req, res) => {

    try {

        const bundle = await Bundle.create({

            ...req.body,

            user: req.user.userId

        });

        await Transaction.create({

            user: req.user.userId,

            bank: req.body.paymentMethod || "Wallet",

            service: "BUNDLE",

            sender: req.body.paymentMethod || "Wallet",

            recipient: req.body.bundleType,

            amount: req.body.amount,

            fee: 0,

            total: req.body.amount,

            status: "SUCCESS"

        });

        res.status(201).json({

            success: true,

            bundle

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await Bundle.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            history

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};