/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA CONTROLLER
========================================== */

"use strict";

const Transaction = require("../models/Transaction");

/* ==========================================
   CREATE M-PESA TRANSACTION
========================================== */

exports.createMpesaTransaction = async (req, res) => {

    try {

        const {
            service,
            sender,
            recipient,
            reference,
            amount,
            fee,
            balance,
            status,
            metadata
        } = req.body;

        /* ==========================
           VALIDATION
        ========================== */

        if (!service) {

            return res.status(400).json({

                success: false,

                message: "Please select an M-Pesa service."

            });

        }

        if (
            amount === undefined ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid amount."

            });

        }

        /* ==========================
           CALCULATE TOTAL
        ========================== */

        const transactionAmount = Number(amount);

        const transactionFee =
            fee !== undefined
                ? Number(fee)
                : 0;

        const total =
            transactionAmount + transactionFee;

        /* ==========================
           CREATE TRANSACTION
        ========================== */

        const transaction =
            await Transaction.create({

                user: req.user.userId,

                bank: "M-PESA",

                service: service.toUpperCase(),

                sender: sender || "",

                recipient: recipient || "",

                reference: reference || "",

                amount: transactionAmount,

                fee: transactionFee,

                total,

                balance:
                    balance !== undefined
                        ? Number(balance)
                        : 0,

                status:
                    status || "SUCCESS",

                metadata:
                    metadata || {}

            });

        /* ==========================
           RESPONSE
        ========================== */

        return res.status(201).json({

            success: true,

            message:
                "M-Pesa transaction recorded successfully.",

            transaction

        });

    }

    catch (error) {

        console.error(
            "M-PESA TRANSACTION ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not process the M-Pesa transaction."

        });

    }

};


/* ==========================================
   GET M-PESA TRANSACTIONS
========================================== */

exports.getMpesaTransactions = async (req, res) => {

    try {

        const transactions =
            await Transaction.find({

                user: req.user.userId,

                bank: "M-PESA"

            }).sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            count: transactions.length,

            transactions

        });

    }

    catch (error) {

        console.error(
            "M-PESA HISTORY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load M-Pesa transactions."

        });

    }

};


/* ==========================================
   GET SINGLE M-PESA TRANSACTION
========================================== */

exports.getMpesaTransaction = async (req, res) => {

    try {

        const transaction =
            await Transaction.findOne({

                _id: req.params.id,

                user: req.user.userId,

                bank: "M-PESA"

            });

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "M-Pesa transaction not found."

            });

        }

        return res.status(200).json({

            success: true,

            transaction

        });

    }

    catch (error) {

        console.error(
            "M-PESA LOOKUP ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not load this M-Pesa transaction."

        });

    }

};


/* ==========================================
   DELETE M-PESA TRANSACTION
========================================== */

exports.deleteMpesaTransaction = async (req, res) => {

    try {

        const transaction =
            await Transaction.findOneAndDelete({

                _id: req.params.id,

                user: req.user.userId,

                bank: "M-PESA"

            });

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message:
                    "M-Pesa transaction not found."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "M-Pesa transaction deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "M-PESA DELETE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not delete this M-Pesa transaction."

        });

    }

};