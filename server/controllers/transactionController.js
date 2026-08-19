/* ==========================================
   KENYA SMART DIALER PRO
   TRANSACTION CONTROLLER
========================================== */

"use strict";

const Transaction = require("../models/Transaction");

/* ==========================================
   GET USER TRANSACTIONS
========================================== */

exports.getTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            count: transactions.length,

            transactions

        });

    }

    catch (error) {

        console.error("GET TRANSACTIONS ERROR:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   GET SINGLE TRANSACTION
========================================== */

exports.getTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        res.json({

            success: true,

            transaction

        });

    }

    catch (error) {

        console.error("GET TRANSACTION ERROR:", error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   CREATE TRANSACTION
========================================== */

exports.createTransaction = async (req, res) => {

    try {

        const {

            bank,

            service,

            sender,

            recipient,

            reference,

            amount,

            fee,

            total,

            balance,

            status,

            metadata

        } = req.body;

        const transaction = await Transaction.create({

            user: req.user.userId,

            bank,

            service,

            sender,

            recipient,

            reference,

            amount,

            fee,

            total,

            balance,

            status,

            metadata

        });

        res.status(201).json({

            success: true,

            transaction

        });

    }

    catch (error) {

        console.error("CREATE TRANSACTION ERROR:", error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   UPDATE TRANSACTION
========================================== */

exports.updateTransaction = async (req, res) => {

    try {

        const allowedFields = [

            "bank",

            "service",

            "sender",

            "recipient",

            "reference",

            "amount",

            "fee",

            "total",

            "balance",

            "status",

            "metadata"

        ];

        const updates = {};

        allowedFields.forEach(field => {

            if (req.body[field] !== undefined) {

                updates[field] = req.body[field];

            }

        });

        const transaction = await Transaction.findOneAndUpdate(

            {

                _id: req.params.id,

                user: req.user.userId

            },

            updates,

            {

                new: true,

                runValidators: true

            }

        );

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        res.json({

            success: true,

            transaction

        });

    }

    catch (error) {

        console.error("UPDATE TRANSACTION ERROR:", error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   DELETE TRANSACTION
========================================== */

exports.deleteTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findOneAndDelete({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        res.json({

            success: true,

            message: "Transaction deleted successfully."

        });

    }

    catch (error) {

        console.error("DELETE TRANSACTION ERROR:", error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};