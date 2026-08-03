/* ==========================================
   KENYA SMART DIALER PRO
   FINANCIAL CONTROLLER
========================================== */

"use strict";

const FinancialProfile = require("../models/FinancialProfile");

/* ==========================================
   GET FINANCIAL PROFILE
========================================== */

exports.getProfile = async (req, res) => {

    try {

        const profile = await FinancialProfile.findOne({

            user: req.user.userId

        });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Financial profile not found."

            });

        }

        res.json({

            success: true,

            profile

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
   UPDATE WALLET
========================================== */

exports.updateWallet = async (req, res) => {

    try {

        const { amount } = req.body;

        const profile = await FinancialProfile.findOne({

            user: req.user.userId

        });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Profile not found."

            });

        }

        profile.wallet.balance = amount;

        await profile.save();

        res.json({

            success: true,

            wallet: profile.wallet

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
   UPDATE BANK BALANCE
========================================== */

exports.updateBankBalance = async (req, res) => {

    try {

        const {

            bank,

            balance

        } = req.body;

        const profile = await FinancialProfile.findOne({

            user: req.user.userId

        });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Financial profile not found."

            });

        }

        if (!profile.banks[bank]) {

            return res.status(400).json({

                success: false,

                message: "Invalid bank."

            });

        }

        profile.banks[bank].balance = balance;

        await profile.save();

        res.json({

            success: true,

            bank: profile.banks[bank]

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
   GET BALANCES
========================================== */

exports.getBalances = async (req, res) => {

    try {

        const profile = await FinancialProfile.findOne({

            user: req.user.userId

        });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message: "Financial profile not found."

            });

        }

        res.json({

            success: true,

            balances: {
                wallet: profile.wallet.balance,
                kcb: profile.banks.kcb.balance,
                equity: profile.banks.equity.balance,
                coop: profile.banks.coop.balance
            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};