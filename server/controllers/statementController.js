/* ==========================================
   KENYA SMART DIALER
   Statement Controller
========================================== */

"use strict";

const Statement = require("../models/Statement");

/* ==========================
   GET ALL STATEMENTS
========================== */

exports.getStatements = async (req, res) => {

    try {

        const bank = req.params.bank;

        const accountNumber = req.query.account;

        const filter = {};

        if (bank) {

            filter.bank = bank.toUpperCase();

        }

        if (accountNumber) {

            filter.accountNumber = accountNumber;

        }

        const statements = await Statement
            .find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(statements);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to fetch statements."

        });

    }

};

/* ==========================
   GET SINGLE STATEMENT
========================== */

exports.getStatement = async (req, res) => {

    try {

        const statement = await Statement.findById(req.params.id);

        if (!statement) {

            return res.status(404).json({

                success: false,

                message: "Statement not found."

            });

        }

        res.json(statement);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================
   CREATE STATEMENT
========================== */

exports.createStatement = async (req, res) => {

    try {

        const statement = new Statement(req.body);

        await statement.save();

        res.status(201).json({

            success: true,

            message: "Statement saved.",

            statement

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================
   DELETE STATEMENT
========================== */

exports.deleteStatement = async (req, res) => {

    try {

        await Statement.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Statement deleted."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};