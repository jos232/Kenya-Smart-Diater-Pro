/*
==========================================
KENYA SMART DIALER PRO
SUBSCRIPTION CONTROLLER
==========================================
*/

"use strict";

const Subscription = require("../models/Subscription");
const Transaction = require("../models/Transaction");


/* ==========================================
   ACTIVATE SUBSCRIPTION
========================================== */

exports.activateSubscription = async (req, res) => {

    try {

        const {
            name,
            price,
            validity,
            data,
            voice,
            sms,
            airtime,
            paymentMethod
        } = req.body;


        /* ==========================
           VALIDATE REQUEST
        ========================== */

        if (
            !name ||
            price === undefined ||
            !validity
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select a valid subscription plan."

            });

        }


        /* ==========================
           CALCULATE EXPIRY
        ========================== */

        const activatedAt = new Date();

        const expiresAt = new Date(activatedAt);


        if (validity.includes("Day")) {

            const days =
                parseInt(validity) || 1;

            expiresAt.setDate(
                expiresAt.getDate() + days
            );

        }


        /* ==========================
           CREATE SUBSCRIPTION
        ========================== */

        const subscription =
            await Subscription.create({

                user: req.user.userId,

                name,

                price,

                validity,

                data: Number(data) || 0,

                voice: Number(voice) || 0,

                sms: Number(sms) || 0,

                airtime: Number(airtime) || 0,

                activatedAt,

                expiresAt,

                paymentMethod:
                    paymentMethod || "Wallet",

                status: "ACTIVE"

            });
        console.log("NEW SUBSCRIPTION:", {
            id: subscription._id,
            name: subscription.name,
            status: subscription.status,
            activatedAt: subscription.activatedAt,
            expiresAt: subscription.expiresAt,
            now: new Date()
        });


        /* ==========================
           RECORD TRANSACTION
        ========================== */

        await Transaction.create({

            user: req.user.userId,

            bank:
                (paymentMethod || "WALLET").toUpperCase(),

            service: "SUBSCRIPTION",

            sender:
                paymentMethod || "Wallet",

            recipient: "Subscription",

            amount: price,

            fee: 0,

            total: price,

            status: "SUCCESS"

        });



        /* ==========================
           RESPONSE
        ========================== */

        return res.status(201).json({

            success: true,

            message:
                "Subscription activated successfully.",

            subscription

        });

    }

    catch (error) {

        console.error(
            "Subscription Activation Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not activate your subscription. Please try again."

        });

    }

};


/* ==========================================
   GET ACTIVE SUBSCRIPTION
========================================== */

exports.getActiveSubscription = async (req, res) => {

    try {

        const subscription =
            await Subscription.findOne({

                user: req.user.userId,

                status: "ACTIVE",

                expiresAt: {
                    $gt: new Date()
                }

            }).sort({

                createdAt: -1

            });


        if (!subscription) {

            return res.status(200).json({

                success: true,

                active: false,

                message:
                    "You do not have an active subscription."

            });

        }


        return res.status(200).json({

            success: true,

            active: true,

            subscription

        });

    }

    catch (error) {

        console.error(
            "Active Subscription Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load your subscription."

        });

    }

};


/* ==========================================
   SUBSCRIPTION HISTORY
========================================== */

exports.getHistory = async (req, res) => {

    try {

        const history =
            await Subscription.find({

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
            "Subscription History Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load subscription history."

        });

    }

};


/* ==========================================
   DELETE SUBSCRIPTION HISTORY
========================================== */

exports.deleteSubscription = async (req, res) => {

    try {

        const subscription =
            await Subscription.findOneAndDelete({

                _id: req.params.id,

                user: req.user.userId

            });


        if (!subscription) {

            return res.status(404).json({

                success: false,

                message:
                    "Subscription record was not found."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Subscription record deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Subscription Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not delete the subscription record."

        });

    }

};


/* ==========================================
   CHECK EXPIRY
========================================== */

exports.checkSubscriptionExpiry = async (req, res) => {

    try {

        const result =
            await Subscription.updateMany(

                {
                    user: req.user.userId,

                    status: "ACTIVE",

                    expiresAt: {
                        $lte: new Date()
                    }
                },

                {
                    $set: {
                        status: "EXPIRED"
                    }
                }

            );


        return res.status(200).json({

            success: true,

            expired:
                result.modifiedCount

        });

    }

    catch (error) {

        console.error(
            "Subscription Expiry Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not check subscription expiry."

        });

    }

};
/* ==========================================
   AUTOMATIC EXPIRY PROCESS
========================================== */

exports.expireSubscriptions = async () => {

    try {

        const result =
            await Subscription.updateMany(

                {
                    status: "ACTIVE",

                    expiresAt: {
                        $lte: new Date()
                    }

                },

                {
                    $set: {
                        status: "EXPIRED"
                    }
                }

            );

        if (result.modifiedCount > 0) {

            console.log(
                `⏰ ${result.modifiedCount} subscription(s) expired automatically.`
            );

        }

        return result.modifiedCount;

    }

    catch (error) {

        console.error(
            "Automatic Subscription Expiry Error:",
            error
        );

        return 0;

    }

};