/* ==========================================
   KENYA SMART DIALER PRO
   M-PESA CONTROLLER
========================================== */

"use strict";
const User =
    require("../models/User");

const bcrypt =
    require("bcrypt");


const Transaction =
    require("../models/Transaction");

const FinancialProfile =
    require("../models/FinancialProfile");


/* ==========================================
   HELPER: GET FINANCIAL PROFILE
========================================== */


/* ==========================================
   SAVE M-PESA APP SECURITY PIN
========================================== */

exports.saveMpesaSecurity = async (req, res) => {

    try {

        const userId =
            req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const pin =
            String(req.body?.pin || "").trim();

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({
                message:
                    "Security PIN must contain exactly 4 digits."
            });
        }

        const user =
            await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User account not found."
            });
        }

        const hashedPin =
            await bcrypt.hash(pin, 12);

        user.securityPin =
            hashedPin;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "App security PIN saved successfully."
        });

    }

    catch (error) {

        console.error(
            "SAVE M-PESA SECURITY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Could not save app security PIN."
        });

    }

};
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
            securityPin,
            description
        } = req.body;


        /* ==========================
           VALIDATION
        ========================== */

        const transferAmount =
            Number(amount);


        /* ==========================
           VERIFY M-PESA SECURITY PIN
        ========================== */

        if (!/^\d{4}$/.test(String(securityPin || "").trim())) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter your 4-digit M-Pesa Security PIN."

            });

        }


        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User account not found."

            });

        }


        if (!user.securityPin) {

            return res.status(400).json({

                success: false,

                message:
                    "M-Pesa Security PIN has not been set."

            });

        }


        const pinMatches =
            await bcrypt.compare(
                String(securityPin).trim(),
                user.securityPin
            );


        if (!pinMatches) {

            return res.status(401).json({

                success: false,

                message:
                    "Incorrect M-Pesa Security PIN."

            });

        }



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
            description,
            securityPin
        } = req.body;


        if (!/^\d{4}$/.test(String(securityPin || ""))) {
            return res.status(400).json({
                success: false,
                message: "Enter your 4-digit transaction PIN."
            });
        }


        const user = await User.findById(req.user.userId);


        if (!user || !user.securityPin) {
            return res.status(400).json({
                success: false,
                message: "Transaction PIN is not configured."
            });
        }


        const pinValid = await bcrypt.compare(
            String(securityPin),
            user.securityPin
        );


        if (!pinValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid transaction PIN."
            });
        }


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

        const securityPin = String(req.body.securityPin || "").trim();

        if (!/^\d{4}$/.test(securityPin)) {

            return res.status(400).json({
                success: false,
                message: "Enter your 4-digit transaction PIN."
            });

        }

        const user = await User.findById(req.user.userId);

        if (!user || !user.securityPin) {

            return res.status(400).json({
                success: false,
                message: "Transaction PIN is not configured."
            });

        }

        const pinValid = await bcrypt.compare(
            securityPin,
            user.securityPin
        );

        if (!pinValid) {

            return res.status(401).json({
                success: false,
                message: "Invalid transaction PIN."
            });

        }



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

/*
   REAL DARAJA STK PUSH
   ------------------------------------------
   Creates a PENDING transaction first.
   Daraja callback later changes it to
   SUCCESS or FAILED.
*/

const darajaService =
    require("../services/darajaService");


exports.stkPush = async (req, res) => {

    let transaction = null;

    try {

        const {
            amount,
            phoneNumber,
            accountReference,
            transactionDesc
        } = req.body;


        if (!amount || !phoneNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Amount and phone number are required."

            });

        }


        const numericAmount =
            Number(amount);


        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid M-Pesa amount."

            });

        }


        /*
           Normalize phone number.
           Accept both:

           07XXXXXXXX
           2547XXXXXXXX
        */

        let normalizedPhone =
            String(phoneNumber)
                .replace(/\D/g, "");


        if (
            normalizedPhone.startsWith("07") &&
            normalizedPhone.length === 10
        ) {

            normalizedPhone =
                "254" +
                normalizedPhone.substring(1);

        }


        if (!/^2547\d{8}$/.test(normalizedPhone)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid M-Pesa phone number."

            });

        }


        /*
           Create PENDING transaction
           BEFORE contacting Daraja.
        */

        transaction =
            await createTransaction({

                userId:
                    req.user.userId,

                service:
                    "STK_PUSH",

                sender:
                    normalizedPhone,

                recipient:
                    "M-PESA",

                reference:
                    accountReference ||
                    "KSDP",

                amount:
                    Math.round(numericAmount),

                fee:
                    0,

                balance:
                    0,

                status:
                    "PENDING",

                metadata: {

                    paymentProvider:
                        "DARAJA",

                    phoneNumber:
                        normalizedPhone,

                    accountReference:
                        accountReference ||
                        "KSDP",

                    transactionDesc:
                        transactionDesc ||
                        "M-Pesa payment"

                }

            });


        /*
           Send STK Push to Safaricom.
        */

        const result =
            await darajaService.stkPush({

                amount:
                    Math.round(numericAmount),

                phoneNumber:
                    normalizedPhone,

                accountReference:
                    accountReference ||
                    "KSDP",

                transactionDesc:
                    transactionDesc ||
                    "M-Pesa payment"

            });


        /*
           Store Daraja identifiers.
        */

        transaction.metadata = {

            ...transaction.metadata,

            merchantRequestId:
                result.MerchantRequestID ||
                "",

            checkoutRequestId:
                result.CheckoutRequestID ||
                "",

            responseCode:
                result.ResponseCode ??
                "",

            responseDescription:
                result.ResponseDescription ||
                "",

            customerMessage:
                result.CustomerMessage ||
                ""

        };


        await transaction.save();


        return res.status(200).json({

            success: true,

            message:
                result.CustomerMessage ||
                result.ResponseDescription ||
                "STK Push sent successfully.",

            transactionId:
                transaction._id,

            status:
                transaction.status,

            data: {

                MerchantRequestID:
                    result.MerchantRequestID,

                CheckoutRequestID:
                    result.CheckoutRequestID,

                ResponseCode:
                    result.ResponseCode,

                ResponseDescription:
                    result.ResponseDescription,

                CustomerMessage:
                    result.CustomerMessage

            }

        });


    } catch (error) {

        console.error(
            "DARAJA STK PUSH ERROR:",
            error.message
        );


        /*
           If the transaction was already created,
           mark it FAILED instead of leaving it
           permanently PENDING.
        */

        if (transaction) {

            try {

                transaction.status =
                    "FAILED";

                transaction.metadata = {

                    ...transaction.metadata,

                    error:
                        error.message

                };

                await transaction.save();

            } catch (saveError) {

                console.error(
                    "FAILED TO UPDATE STK TRANSACTION:",
                    saveError.message
                );

            }

        }


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to initiate M-Pesa STK Push."

        });

    }

};

/*
   REAL DARAJA STK CALLBACK
   ------------------------------------------
   Safaricom calls this endpoint after the
   customer completes or cancels the STK prompt.
*/

exports.stkCallback = async (req, res) => {

    try {

        console.log("DARAJA STK CALLBACK RECEIVED");

        const callback =
            req.body?.Body?.stkCallback;

        if (!callback) {

            console.error(
                "Invalid Daraja callback body."
            );

            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: "Accepted"
            });

        }

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc
        } = callback;

        console.log(
            "CheckoutRequestID:",
            CheckoutRequestID
        );

        console.log(
            "ResultCode:",
            ResultCode
        );

        console.log(
            "ResultDesc:",
            ResultDesc
        );

        const transaction =
            await Transaction.findOne({

                bank: "M-PESA",

                service: "STK_PUSH",

                status: "PENDING",

                "metadata.checkoutRequestId":
                    CheckoutRequestID

            });

        if (!transaction) {

            console.warn(
                "No matching pending STK transaction found:",
                CheckoutRequestID
            );

            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: "Accepted"
            });

        }

        if (Number(ResultCode) === 0) {

            let receiptNumber = "";

            const items =
                callback
                    ?.CallbackMetadata
                    ?.Item;

            if (Array.isArray(items)) {

                const receiptItem =
                    items.find(
                        item =>
                            item.Name ===
                            "MpesaReceiptNumber"
                    );

                if (receiptItem) {

                    receiptNumber =
                        String(
                            receiptItem.Value || ""
                        );

                }

            }

            transaction.status =
                "SUCCESS";

            transaction.metadata = {

                ...transaction.metadata,

                merchantRequestId:
                    MerchantRequestID ||
                    transaction.metadata
                        ?.merchantRequestId ||
                    "",

                checkoutRequestId:
                    CheckoutRequestID,

                resultCode:
                    ResultCode,

                resultDesc:
                    ResultDesc,

                callbackReceived:
                    true,

                callbackReceivedAt:
                    new Date()

            };

            if (receiptNumber) {

                transaction.receiptNumber =
                    receiptNumber;

            }

            await transaction.save();

            console.log(
                "STK PAYMENT SUCCESS:",
                transaction._id.toString()
            );

        } else {

            transaction.status =
                "FAILED";

            transaction.metadata = {

                ...transaction.metadata,

                merchantRequestId:
                    MerchantRequestID ||
                    transaction.metadata
                        ?.merchantRequestId ||
                    "",

                checkoutRequestId:
                    CheckoutRequestID,

                resultCode:
                    ResultCode,

                resultDesc:
                    ResultDesc,

                callbackReceived:
                    true,

                callbackReceivedAt:
                    new Date()

            };

            await transaction.save();

            console.log(
                "STK PAYMENT FAILED:",
                ResultDesc
            );

        }

        return res.status(200).json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    } catch (error) {

        console.error(
            "DARAJA CALLBACK ERROR:",
            error.message
        );

        return res.status(200).json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    }

};

