/* ==========================================
   KENYA SMART DIALER PRO
   LOAN CONTROLLER
========================================== */

"use strict";

const Loan = require("../models/Loan");

const Transaction = require("../models/Transaction");

/* ==========================================
   APPLY
========================================== */

exports.applyLoan = async (req, res) => {

    try {

        const {

            loanType,

            amount,

            duration,

            purpose

        } = req.body;

        const interestRate = 12;

        const interest = amount * (interestRate / 100);

        const totalRepayment = amount + interest;

        const monthlyPayment = totalRepayment / duration;

        const repaymentDate = new Date();

        repaymentDate.setMonth(

            repaymentDate.getMonth() + duration

        );

        const loan = await Loan.create({

            user: req.user.userId,

            loanType,

            amount,

            duration,

            purpose,

            interestRate,

            monthlyPayment,

            totalRepayment,

            balance: totalRepayment,

            repaymentDate,

            status: "ACTIVE"

        });

        await Transaction.create({

            user: req.user.userId,

            bank: "KCB",

            service: "LOAN",

            sender: "KCB",

            recipient: req.user.userId,

            amount,

            fee: interest,

            total: totalRepayment,

            status: "SUCCESS"

        });

        res.status(201).json({

            success: true,

            message: "Loan Approved",

            loan

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
   HISTORY
========================================== */

exports.getLoans = async (req, res) => {

    try {

        const loans = await Loan.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            loans

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
   REPAY
========================================== */

exports.repayLoan = async (req, res) => {

    try {

        const loan = await Loan.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!loan) {

            return res.status(404).json({

                success: false,

                message: "Loan not found"

            });

        }

        const payment = Number(req.body.amount);

        loan.balance -= payment;

        if (loan.balance <= 0) {

            loan.balance = 0;

            loan.status = "COMPLETED";

        }

        await loan.save();

        await Transaction.create({

            user: req.user.userId,

            bank: "KCB",

            service: "LOAN REPAYMENT",

            sender: req.user.userId,

            recipient: "KCB",

            amount: payment,

            fee: 0,

            total: payment,

            status: "SUCCESS"

        });

        res.json({

            success: true,

            message: "Loan Repayment Successful",

            loan

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
   CALCULATOR
========================================== */

exports.calculateLoan = async (req, res) => {

    try {

        const {

            amount,

            duration

        } = req.body;

        const interestRate = 12;

        const interest = amount * (interestRate / 100);

        const totalRepayment = amount + interest;

        const monthlyPayment =

            totalRepayment / duration;

        res.json({

            success: true,

            interestRate,

            interest,

            totalRepayment,

            monthlyPayment

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};