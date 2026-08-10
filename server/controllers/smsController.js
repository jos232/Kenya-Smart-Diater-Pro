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

        /* -------------------------
           VALIDATION
        ------------------------- */

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Please enter a phone number."
            });
        }

        if (!network) {
            return res.status(400).json({
                success: false,
                message: "Unable to detect the mobile network."
            });
        }

        if (!packageName) {
            return res.status(400).json({
                success: false,
                message: "Please select an SMS package."
            });
        }

        if (!sms || Number(sms) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid SMS package quantity."
            });
        }

        if (!price || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid SMS package price."
            });
        }

        /* -------------------------
           CREATE SMS PURCHASE
        ------------------------- */

        const purchase = await SMS.create({

            user: req.user.userId,

            phone,

            network,

            packageName,

            sms: Number(sms),

            price: Number(price),

            paymentMethod: paymentMethod || "Wallet",

            status: "SUCCESS"

        });

        /* -------------------------
           SAVE TRANSACTION
        ------------------------- */

        await Transaction.create({

            user: req.user.userId,

            bank: paymentMethod || "WALLET",

            service: "SMS",

            sender: paymentMethod || "Wallet",

            recipient: phone,

            amount: Number(price),

            fee: 0,

            total: Number(price),

            status: "SUCCESS"

        });

        /* -------------------------
           SUCCESS
        ------------------------- */

        return res.status(201).json({

            success: true,

            message: "SMS package activated successfully.",

            purchase

        });

    }

    catch (error) {

        console.error("SMS Purchase Error:", error);

        return res.status(500).json({

            success: false,

            message: "We could not activate the SMS package. Please try again."

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

        return res.status(200).json({

            success: true,

            count: history.length,

            history

        });

    }

    catch (error) {

        console.error("SMS History Error:", error);

        return res.status(500).json({

            success: false,

            message: "Unable to load SMS history."

        });

    }

};


/* ==========================================
   DELETE SMS HISTORY
========================================== */

exports.deleteSMS = async (req, res) => {

    try {

        const purchase = await SMS.findOneAndDelete({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!purchase) {

            return res.status(404).json({

                success: false,

                message: "SMS purchase was not found."

            });

        }

        return res.json({

            success: true,

            message: "SMS history item deleted successfully."

        });

    }

    catch (error) {

        console.error("Delete SMS Error:", error);

        return res.status(500).json({

            success: false,

            message: "Unable to delete SMS history."

        });

    }

};