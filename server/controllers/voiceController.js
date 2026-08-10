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

        const {
            phone,
            network,
            packageName,
            minutes,
            price,
            paymentMethod
        } = req.body;

        /* ==========================
           VALIDATION
        ========================== */

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Please enter a phone number."
            });
        }

        if (!network) {
            return res.status(400).json({
                success: false,
                message: "We could not detect the phone network."
            });
        }

        if (!packageName) {
            return res.status(400).json({
                success: false,
                message: "Please select a voice package."
            });
        }

        if (!minutes || Number(minutes) <= 0) {
            return res.status(400).json({
                success: false,
                message: "The selected voice package has no valid minutes."
            });
        }

        if (!price || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "The selected voice package has an invalid price."
            });
        }

        /* ==========================
           CREATE VOICE PURCHASE
        ========================== */

        const voicePurchase = await Voice.create({

            user: req.user.userId,

            phone,

            network,

            packageName,

            minutes: Number(minutes),

            price: Number(price),

            paymentMethod: paymentMethod || "Wallet",

            status: "SUCCESS"

        });

        /* ==========================
           TRANSACTION
        ========================== */

        await Transaction.create({

            user: req.user.userId,

            bank: paymentMethod || "Wallet",

            service: "VOICE",

            sender: paymentMethod || "Wallet",

            recipient: phone,

            amount: Number(price),

            fee: 0,

            total: Number(price),

            status: "SUCCESS"

        });

        /* ==========================
           SUCCESS
        ========================== */

        return res.status(201).json({

            success: true,

            message:
                `${packageName} activated successfully.`,

            voice: voicePurchase

        });

    }

    catch (error) {

        console.error(
            "VOICE PURCHASE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not activate the voice package. Please try again."

        });

    }

};


/* ==========================================
   GET VOICE HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history = await Voice.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            count: history.length,

            history

        });

    }

    catch (error) {

        console.error(
            "VOICE HISTORY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load your voice history."

        });

    }

};


/* ==========================================
   GET SINGLE VOICE PURCHASE
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

                message:
                    "Voice purchase not found."

            });

        }

        return res.json({

            success: true,

            voice

        });

    }

    catch (error) {

        console.error(
            "VOICE LOOKUP ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load this voice purchase."

        });

    }

};


/* ==========================================
   DELETE VOICE PURCHASE
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

                message:
                    "Voice purchase not found."

            });

        }

        return res.json({

            success: true,

            message:
                "Voice purchase removed successfully."

        });

    }

    catch (error) {

        console.error(
            "VOICE DELETE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not remove this voice purchase."

        });

    }

};