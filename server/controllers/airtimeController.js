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

        /* -------------------------
           VALIDATE INPUT
        ------------------------- */

        if (!network || !phone || !amount) {

            return res.status(400).json({
                success: false,
                message: "Missing required fields."
            });

        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {

            return res.status(400).json({
                success: false,
                message: "A valid airtime amount is required."
            });

        }

        /* -------------------------
           VALIDATE PAYMENT METHOD
        ------------------------- */

        const allowedPaymentMethods = [
            "Wallet",
            "M-PESA",
            "KCB",
            "EQUITY",
            "CO-OP"
        ];

        const selectedMethod =
            paymentMethod || "Wallet";

        if (!allowedPaymentMethods.includes(selectedMethod)) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment method."
            });

        }

        /* -------------------------
           FIND FINANCIAL PROFILE
        ------------------------- */

        const FinancialProfile =
            require("../models/FinancialProfile");

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({
                success: false,
                message: "Financial profile not found."
            });

        }

        /* -------------------------
           SELECT PAYMENT ACCOUNT
        ------------------------- */

        let account;

        switch (selectedMethod) {

            case "Wallet":
                account = profile.wallet;
                break;

            case "M-PESA":
                account = profile.mpesa;
                break;

            case "KCB":
                account = profile.banks.kcb;
                break;

            case "EQUITY":
                account = profile.banks.equity;
                break;

            case "CO-OP":
                account = profile.banks.coop;
                break;

        }

        /* -------------------------
           CHECK BALANCE
        ------------------------- */

        const currentBalance =
            Number(account.balance || 0);

        if (currentBalance < numericAmount) {

            return res.status(400).json({
                success: false,
                message:
                    `${selectedMethod} balance is insufficient.`
            });

        }

        /* -------------------------
           DEDUCT BALANCE
        ------------------------- */

        const newBalance =
            currentBalance - numericAmount;

        account.balance = newBalance;

        /* -------------------------
           CREATE AIRTIME PURCHASE
        ------------------------- */

        const purchase = new Airtime({

            user: req.user.userId,

            network,

            phone,

            amount: numericAmount,

            paymentMethod: selectedMethod,

            status: "SUCCESS"

        });

        /* -------------------------
           SAVE FINANCIAL PROFILE
        ------------------------- */

        await profile.save();

        /* -------------------------
           CREATE TRANSACTION
        ------------------------- */

        const transaction =
            await Transaction.create({

                user: req.user.userId,

                bank:
                    selectedMethod === "Wallet"
                        ? "WALLET"
                        : selectedMethod,

                service: "AIRTIME",

                sender: selectedMethod,

                recipient: phone,

                amount: numericAmount,

                fee: 0,

                total: numericAmount,

                balance: newBalance,

                status: "SUCCESS",

                metadata: {

                    network,

                    paymentMethod: selectedMethod

                }

            });

        /* -------------------------
           SAVE AIRTIME PURCHASE
        ------------------------- */

        await purchase.save();

        /* -------------------------
           RESPONSE
        ------------------------- */

        return res.status(201).json({

            success: true,

            message: "Airtime purchased successfully.",

            purchase,

            transaction,

            paymentMethod: selectedMethod,

            balance: newBalance

        });

    }

    catch (error) {

        console.error(
            "Buy Airtime:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
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
