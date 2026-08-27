/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA CONTROLLER
========================================== */

"use strict";

const Transaction =
    require("../models/Transaction");

const FinancialProfile =
    require("../models/FinancialProfile");


/* ==========================================
   HELPER: GET FINANCIAL PROFILE
========================================== */

async function getFinancialProfile(userId) {

    return await FinancialProfile.findOne({
        user: userId
    });

}


/* ==========================================
   HELPER: CREATE M-PESA TRANSACTION
========================================== */

async function createTransaction({

    userId,
    service,
    sender = "",
    recipient = "",
    reference = "",
    amount,
    fee = 0,
    balance,
    status = "SUCCESS",
    metadata = {}

}) {

    return await Transaction.create({

        user: userId,

        bank: "M-PESA",

        service:
            String(service).toUpperCase(),

        sender,

        recipient,

        reference,

        amount: Number(amount),

        fee: Number(fee),

        total:
            Number(amount) + Number(fee),

        balance:
            Number(balance),

        status,

        metadata

    });

}


/* ==========================================
   SEND MONEY
========================================== */

exports.sendMoney = async (req, res) => {

    try {

        const {
            recipient,
            recipientName,
            amount,
            description
        } = req.body;


        /* ==========================
           VALIDATION
        ========================== */

        const transferAmount =
            Number(amount);


        if (!recipient) {

            return res.status(400).json({

                success: false,

                message:
                    "Recipient phone number is required."

            });

        }


        if (
            !/^07\d{8}$/.test(
                String(recipient).trim()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid Kenyan phone number."

            });

        }


        if (
            !Number.isFinite(transferAmount) ||
            transferAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid amount."

            });

        }


        /* ==========================
           LOAD PROFILE
        ========================== */

        const profile =
            await getFinancialProfile(
                req.user.userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        const currentBalance =
            Number(
                profile.mpesa?.balance || 0
            );


        /* ==========================
           CHECK BALANCE
        ========================== */

        if (
            transferAmount >
            currentBalance
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient M-Pesa balance.",

                balance:
                    currentBalance

            });

        }


        /* ==========================
           CALCULATE NEW BALANCE
        ========================== */

        const newBalance =
            currentBalance -
            transferAmount;


        /* ==========================
           UPDATE M-PESA BALANCE
        ========================== */

        profile.mpesa.balance =
            newBalance;

        await profile.save();


        /* ==========================
           CREATE TRANSACTION
        ========================== */

        const transaction =
            await createTransaction({

                userId:
                    req.user.userId,

                service:
                    "SEND_MONEY",

                sender:
                    profile.mpesa.phoneNumber ||
                    profile.mpesa.accountNumber ||
                    "My M-Pesa",

                recipient:
                    recipient,

                reference:
                    "MPESA-" +
                    Date.now(),

                amount:
                    transferAmount,

                fee:
                    0,

                balance:
                    newBalance,

                metadata: {

                    recipientName:
                        recipientName || "",

                    description:
                        description || "",

                    direction:
                        "DEBIT",

                    source:
                        "Kenya Smart Dialer Pro"

                }

            });


        return res.status(201).json({

            success: true,

            message:
                "M-Pesa money sent successfully.",

            transaction,

            balance:
                newBalance

        });

    }

    catch (error) {

        console.error(
            "M-PESA SEND MONEY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not process the M-Pesa transfer.",

            error:
                error.message

        });

    }

};


/* ==========================================
   RECEIVE MONEY
========================================== */

exports.receiveMoney = async (req, res) => {

    try {

        const {
            sender,
            senderName,
            amount,
            description
        } = req.body;


        const receiveAmount =
            Number(amount);


        if (
            !Number.isFinite(receiveAmount) ||
            receiveAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid amount."

            });

        }


        const profile =
            await getFinancialProfile(
                req.user.userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        const currentBalance =
            Number(
                profile.mpesa?.balance || 0
            );


        const newBalance =
            currentBalance +
            receiveAmount;


        /* ==========================
           UPDATE BALANCE
        ========================== */

        profile.mpesa.balance =
            newBalance;

        await profile.save();


        /* ==========================
           RECORD TRANSACTION
        ========================== */

        const transaction =
            await createTransaction({

                userId:
                    req.user.userId,

                service:
                    "RECEIVE_MONEY",

                sender:
                    sender || "",

                recipient:
                    profile.mpesa.phoneNumber ||
                    profile.mpesa.accountNumber ||
                    "",

                reference:
                    "MPESA-" +
                    Date.now(),

                amount:
                    receiveAmount,

                fee:
                    0,

                balance:
                    newBalance,

                metadata: {

                    senderName:
                        senderName || "",

                    description:
                        description || "",

                    direction:
                        "CREDIT",

                    source:
                        "Kenya Smart Dialer Pro"

                }

            });


        return res.status(201).json({

            success: true,

            message:
                "Money received successfully.",

            transaction,

            balance:
                newBalance

        });

    }

    catch (error) {

        console.error(
            "M-PESA RECEIVE MONEY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not process the received money.",

            error:
                error.message

        });

    }

};


/* ==========================================
   BUY GOODS
========================================== */

exports.buyGoods = async (req, res) => {

    try {

        const {
            tillNumber,
            merchantName,
            amount,
            description
        } = req.body;


        const purchaseAmount =
            Number(amount);


        if (!tillNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Till number is required."

            });

        }


        if (
            !Number.isFinite(purchaseAmount) ||
            purchaseAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid amount."

            });

        }


        const profile =
            await getFinancialProfile(
                req.user.userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        const currentBalance =
            Number(
                profile.mpesa?.balance || 0
            );


        if (
            purchaseAmount >
            currentBalance
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient M-Pesa balance.",

                balance:
                    currentBalance

            });

        }


        const newBalance =
            currentBalance -
            purchaseAmount;


        profile.mpesa.balance =
            newBalance;

        await profile.save();


        const transaction =
            await createTransaction({

                userId:
                    req.user.userId,

                service:
                    "BUY_GOODS",

                sender:
                    profile.mpesa.phoneNumber ||
                    "My M-Pesa",

                recipient:
                    tillNumber,

                reference:
                    "MPESA-" +
                    Date.now(),

                amount:
                    purchaseAmount,

                fee:
                    0,

                balance:
                    newBalance,

                metadata: {

                    merchantName:
                        merchantName || "",

                    tillNumber:
                        tillNumber,

                    description:
                        description || "",

                    direction:
                        "DEBIT",

                    source:
                        "Kenya Smart Dialer Pro"

                }

            });


        return res.status(201).json({

            success: true,

            message:
                "Buy Goods payment completed successfully.",

            transaction,

            balance:
                newBalance

        });

    }

    catch (error) {

        console.error(
            "M-PESA BUY GOODS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not process the Buy Goods payment.",

            error:
                error.message

        });

    }

};


/* ==========================================
   PAY BILL
========================================== */

exports.payBill = async (req, res) => {

    try {

        const {
            paybillNumber,
            accountNumber,
            amount,
            description
        } = req.body;


        const billAmount =
            Number(amount);


        if (!paybillNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Paybill number is required."

            });

        }


        if (!accountNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Account number is required."

            });

        }


        if (
            !Number.isFinite(billAmount) ||
            billAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid amount."

            });

        }


        const profile =
            await getFinancialProfile(
                req.user.userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        const currentBalance =
            Number(
                profile.mpesa?.balance || 0
            );


        if (
            billAmount >
            currentBalance
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient M-Pesa balance.",

                balance:
                    currentBalance

            });

        }


        const newBalance =
            currentBalance -
            billAmount;


        profile.mpesa.balance =
            newBalance;

        await profile.save();


        const transaction =
            await createTransaction({

                userId:
                    req.user.userId,

                service:
                    "PAYBILL",

                sender:
                    profile.mpesa.phoneNumber ||
                    "My M-Pesa",

                recipient:
                    paybillNumber,

                reference:
                    "MPESA-" +
                    Date.now(),

                amount:
                    billAmount,

                fee:
                    0,

                balance:
                    newBalance,

                metadata: {

                    paybillNumber:
                        paybillNumber,

                    accountNumber:
                        accountNumber,

                    description:
                        description || "",

                    direction:
                        "DEBIT",

                    source:
                        "Kenya Smart Dialer Pro"

                }

            });


        return res.status(201).json({

            success: true,

            message:
                "Paybill payment completed successfully.",

            transaction,

            balance:
                newBalance

        });

    }

    catch (error) {

        console.error(
            "M-PESA PAYBILL ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "We could not process the Paybill payment.",

            error:
                error.message

        });

    }

};


/* ==========================================
   GET M-PESA BALANCE
========================================== */

exports.getMpesaBalance = async (req, res) => {

    try {

        const profile =
            await getFinancialProfile(
                req.user.userId
            );


        if (!profile) {

            return res.status(404).json({

                success: false,

                message:
                    "Financial profile not found."

            });

        }


        const balance =
            Number(
                profile.mpesa?.balance || 0
            );


        return res.status(200).json({

            success: true,

            balance,

            mpesa:
                profile.mpesa || {}

        });

    }

    catch (error) {

        console.error(
            "M-PESA BALANCE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Could not load M-Pesa balance."

        });

    }

};


/* ==========================================
   GET M-PESA TRANSACTIONS
========================================== */

exports.getMpesaTransactions = async (
    req,
    res
) => {

    try {

        const transactions =
            await Transaction.find({

                user:
                    req.user.userId,

                bank:
                    "M-PESA"

            }).sort({

                createdAt:
                    -1

            });


        return res.status(200).json({

            success: true,

            count:
                transactions.length,

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

exports.getMpesaTransaction =
    async (req, res) => {

        try {

            const transaction =
                await Transaction.findOne({

                    _id:
                        req.params.id,

                    user:
                        req.user.userId,

                    bank:
                        "M-PESA"

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

exports.deleteMpesaTransaction =
    async (req, res) => {

        try {

            const transaction =
                await Transaction.findOneAndDelete({

                    _id:
                        req.params.id,

                    user:
                        req.user.userId,

                    bank:
                        "M-PESA"

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