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

            user: req.user.userId,

            bundleType: req.body.bundleType,

            packageName: req.body.packageName,

            amount: Number(req.body.amount),

            quantity: Number(req.body.quantity),

            expiry: req.body.expiry,

            paymentMethod: req.body.paymentMethod || "WALLET",

            status: "SUCCESS"

        });

        await Transaction.create({

            user: req.user.userId,

            bank: "WALLET",

            service: "BUNDLE",

            sender: "Wallet",

            recipient: req.body.packageName,

            amount: Number(req.body.amount),

            fee: 0,

            total: Number(req.body.amount),

            balance: 0,

            status: "SUCCESS",

            metadata: {

                packageName: req.body.packageName,

                quantity: req.body.quantity,

                expiry: req.body.expiry

            }

        });

        res.status(201).json({

            success: true,

            bundle

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   GET BUNDLE HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await Bundle.find({

            user: req.user.userId

        })

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            history

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};