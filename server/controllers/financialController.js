/* ==========================================
   KENYA SMART DIALER PRO
   FINANCIAL CONTROLLER
========================================== */

"use strict";

const FinancialProfile =
    require("../models/FinancialProfile");


/* ==========================================
   GET FINANCIAL PROFILE
========================================== */

exports.getProfile = async (req, res) => {

    try {

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        return res.status(200).json({

            success: true,

            profile

        });

    }

    catch (error) {

        console.error(
            "Get Financial Profile:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load financial profile.",

            error: error.message

        });

    }

};


/* ==========================================
   GET BALANCES
========================================== */

exports.getBalances = async (req, res) => {

    try {

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        return res.status(200).json({

            success: true,

            balances: {

                mpesa:
                    profile.mpesa.balance,
                wallet:
                    profile.wallet.balance,

                kcb:
                    profile.banks.kcb.balance,

                equity:
                    profile.banks.equity.balance,

                coop:
                    profile.banks.coop.balance

            }

        });

    }

    catch (error) {

        console.error(
            "Get Financial Balances:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load balances.",

            error: error.message

        });

    }

};


/* ==========================================
   UPDATE WALLET
========================================== */

exports.updateWallet = async (req, res) => {

    try {

        const { amount } = req.body;

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid wallet amount is required."

            });

        }

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        profile.wallet.balance =
            Number(amount);

        await profile.save();

        return res.status(200).json({

            success: true,

            message:
                "Wallet updated successfully.",

            wallet:
                profile.wallet

        });

    }

    catch (error) {

        console.error(
            "Update Wallet:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update wallet.",

            error: error.message

        });

    }

};

/* ==========================================
   UPDATE M-PESA
========================================== */

exports.updateMpesa = async (req, res) => {

    try {

        const {
            phoneNumber,
            accountNumber,
            balance
        } = req.body;

        if (
            balance === undefined ||
            balance === null ||
            Number(balance) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid M-Pesa balance is required."

            });

        }

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        if (phoneNumber !== undefined) {

            profile.mpesa.phoneNumber =
                String(phoneNumber);

        }

        if (accountNumber !== undefined) {

            profile.mpesa.accountNumber =
                String(accountNumber);

        }

        profile.mpesa.balance =
            Number(balance);

        await profile.save();

        return res.status(200).json({

            success: true,

            message:
                "M-Pesa information updated successfully.",

            mpesa:
                profile.mpesa

        });

    }

    catch (error) {

        console.error(
            "Update M-Pesa:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update M-Pesa information.",

            error: error.message

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

        const allowedBanks = [
            "kcb",
            "equity",
            "coop"
        ];

        if (!allowedBanks.includes(bank)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid bank."

            });

        }

        if (
            balance === undefined ||
            balance === null ||
            Number(balance) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid balance is required."

            });

        }

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        profile.banks[bank].balance =
            Number(balance);

        await profile.save();

        return res.status(200).json({

            success: true,

            message:
                "Bank balance updated successfully.",

            bank:
                profile.banks[bank]

        });

    }

    catch (error) {

        console.error(
            "Update Bank Balance:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update bank balance.",

            error: error.message

        });

    }

};


/* ==========================================
   GET ACCOUNT INFORMATION
========================================== */

exports.getAccountInformation = async (
    req,
    res
) => {

    try {

        const profile =
            await FinancialProfile.findOne({
                user: req.user.userId
            });

        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }

        return res.status(200).json({

            success: true,

            accounts: {

                mpesa: {

                    phoneNumber:
                        profile.mpesa.phoneNumber,

                    accountNumber:
                        profile.mpesa.accountNumber,

                    balance:
                        profile.mpesa.balance

                },

                kcb: {

                    accountNumber:
                        profile.banks.kcb.accountNumber,

                    balance:
                        profile.banks.kcb.balance

                },

                equity: {

                    accountNumber:
                        profile.banks.equity.accountNumber,

                    balance:
                        profile.banks.equity.balance

                },

                coop: {

                    accountNumber:
                        profile.banks.coop.accountNumber,

                    balance:
                        profile.banks.coop.balance

                }

            },

            loans: {
                limit: profile.loans.limit,
                outstanding: profile.loans.outstanding,
                approved: profile.loans.approved
            }

        });

    }

    catch (error) {

        console.error(
            "Get Account Information:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load account information.",

            error: error.message

        });

    }

};