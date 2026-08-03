/* ==========================================
   KENYA SMART DIALER PRO
   AIRTIME CONTROLLER
========================================== */

"use strict";

const Airtime = require("../models/Airtime");
const Transaction = require("../models/Transaction");

/* ==========================================
   BUY AIRTIME
========================================== */

exports.buyAirtime = async (req, res) => {

    try {

        const {

            network,
            phone,
            amount,
            paymentMethod

        } = req.body;

        if (!network || !phone || !amount) {

            return res.status(400).json({

                success: false,

                message: "Missing required fields."

            });

        }

        const purchase = await Airtime.create({

            user: req.user.userId,

            network,

            phone,

            amount,

            paymentMethod

        });

        await Transaction.create({

            user: req.user.userId,

            bank: paymentMethod || "WALLET",

            service: "AIRTIME",

            sender: paymentMethod || "Wallet",

            recipient: phone,

            amount,

            fee: 0,

            total: amount,

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
   AIRTIME HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await Airtime.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            count: history.length,

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