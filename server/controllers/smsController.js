/* ==========================================
   KENYA SMART DIALER PRO
   SMS CONTROLLER
========================================== */

"use strict";

const SMS = require("../models/SMS");
const Transaction = require("../models/Transaction");

/* ==========================================
   BUY SMS PACKAGE
========================================== */

exports.buySMS = async (req, res) => {

    try {

        const {

            phone,
            network,
            packageName,
            sms,
            price,
            paymentMethod

        } = req.body;

        if (
            !phone ||
            !network ||
            !packageName ||
            !sms ||
            !price
        ) {

            return res.status(400).json({

                success: false,

                message: "Missing required fields."

            });

        }

        const purchase = await SMS.create({

            user: req.user.userId,

            phone,

            network,

            packageName,

            sms,

            price,

            paymentMethod

        });

        await Transaction.create({

            user: req.user.userId,

            bank: paymentMethod || "Wallet",

            service: "SMS",

            sender: paymentMethod || "Wallet",

            recipient: phone,

            amount: price,

            fee: 0,

            total: price,

            status: "SUCCESS"

        });

        res.status(201).json({

            success: true,

            purchase

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
   SMS HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await SMS.find({

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

/* ==========================================
   DELETE SMS PURCHASE
========================================== */

exports.deleteSMS = async (req, res) => {

    try {

        await SMS.findOneAndDelete({

            _id: req.params.id,

            user: req.user.userId

        });

        res.json({

            success: true,

            message: "SMS history deleted."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};