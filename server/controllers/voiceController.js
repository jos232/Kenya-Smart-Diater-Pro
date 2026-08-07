/* ==========================================
   KENYA SMART DIALER PRO
   VOICE CONTROLLER
========================================== */

"use strict";

const Voice = require("../models/Voice");
const Transaction = require("../models/Transaction");

/* ==========================================
   BUY VOICE PACKAGE
========================================== */

exports.buyVoice = async (req, res) => {

    try {

        console.log("================================");
        console.log("VOICE REQUEST BODY");
        console.log(req.body);
        console.log("================================");

        const {

            phone,
            network,
            packageName,
            minutes,
            price,
            paymentMethod

        } = req.body;

        console.log("phone:", phone);
        console.log("network:", network);
        console.log("packageName:", packageName);
        console.log("minutes:", minutes);
        console.log("price:", price);
        console.log("paymentMethod:", paymentMethod);

        if (
            !phone ||
            !network ||
            !packageName ||
            !minutes ||
            !price
        ) {

            return res.status(400).json({

                success: false,

                message: "Missing required fields."

            });

        }

        const voicePurchase = await Voice.create({

            user: req.user.userId,

            phone,

            network,

            packageName,

            minutes,

            price,

            paymentMethod

        });

        await Transaction.create({

            user: req.user.userId,

            bank: paymentMethod || "Wallet",

            service: "VOICE",

            sender: paymentMethod || "Wallet",

            recipient: phone,

            amount: price,

            fee: 0,

            total: price,

            status: "SUCCESS"

        });

        res.status(201).json({

            success: true,

            message: "Voice package activated successfully.",

            voice: voicePurchase

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
   VOICE HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await Voice.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            count: history.length,

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

/* ==========================================
   GET SINGLE PURCHASE
========================================== */

exports.getVoiceById = async (req, res) => {

    try {

        const voice = await Voice.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!voice) {

            return res.status(404).json({

                success: false,

                message: "Voice purchase not found."

            });

        }

        res.json({

            success: true,

            voice

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
   DELETE HISTORY ITEM
========================================== */

exports.deleteVoice = async (req, res) => {

    try {

        const voice = await Voice.findOneAndDelete({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!voice) {

            return res.status(404).json({

                success: false,

                message: "Voice purchase not found."

            });

        }

        res.json({

            success: true,

            message: "Voice history deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};