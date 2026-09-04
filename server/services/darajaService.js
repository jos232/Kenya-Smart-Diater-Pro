"use strict";

/*
   KENYA SMART DIALER PRO
   SAFARICOM DARAJA SERVICE
*/

const DARAJA_BASE_URL =
    process.env.DARAJA_ENVIRONMENT === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";


function getDarajaConfig() {

    return {
        consumerKey:
            process.env.DARAJA_CONSUMER_KEY || "",

        consumerSecret:
            process.env.DARAJA_CONSUMER_SECRET || "",

        shortcode:
            process.env.DARAJA_SHORTCODE || "",

        passkey:
            process.env.DARAJA_PASSKEY || "",

        callbackUrl:
            process.env.DARAJA_CALLBACK_URL || "",

        environment:
            process.env.DARAJA_ENVIRONMENT || "sandbox"
    };

}


function validateDarajaConfig(options = {}) {

    const config = getDarajaConfig();

    const missing = [];

    // Required for OAuth
    if (!config.consumerKey) {
        missing.push("DARAJA_CONSUMER_KEY");
    }

    if (!config.consumerSecret) {
        missing.push("DARAJA_CONSUMER_SECRET");
    }

    // Required for STK Push
    if (options.requireStk === true) {

        if (!config.shortcode) {
            missing.push("DARAJA_SHORTCODE");
        }

        if (!config.passkey) {
            missing.push("DARAJA_PASSKEY");
        }

        if (!config.callbackUrl) {
            missing.push("DARAJA_CALLBACK_URL");
        }

    }

    if (missing.length > 0) {

        throw new Error(
            "Missing Daraja configuration: " +
            missing.join(", ")
        );

    }

    return config;
}


async function getAccessToken() {

    const config =
        validateDarajaConfig();

    const credentials =
        Buffer.from(
            config.consumerKey +
            ":" +
            config.consumerSecret
        ).toString("base64");

    const response =
        await fetch(
            DARAJA_BASE_URL +
            "/oauth/v1/generate?grant_type=client_credentials",
            {
                method: "GET",

                headers: {
                    Authorization:
                        "Basic " +
                        credentials
                }
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data?.errorMessage ||
            "Daraja authentication failed."
        );

    }

    if (!data?.access_token) {

        throw new Error(
            "Daraja did not return an access token."
        );

    }

    return data.access_token;

}


/*
   Generate Daraja STK Push password.

   Format:
   Base64(
       BusinessShortCode +
       Passkey +
       Timestamp
   )
*/

function generateStkPassword(shortcode, passkey, timestamp) {

    return Buffer.from(
        String(shortcode) +
        String(passkey) +
        String(timestamp)
    ).toString("base64");

}


/*
   Generate Daraja timestamp.

   Format:
   YYYYMMDDHHmmss
*/

function generateTimestamp() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    return (
        String(year) +
        month +
        day +
        hours +
        minutes +
        seconds
    );

}


/*
   M-Pesa Express / STK Push
*/

async function stkPush({

    amount,
    phoneNumber,
    accountReference = "KSDP",
    transactionDesc = "M-Pesa payment"

}) {

    const config =
        validateDarajaConfig({
            requireStk: true
        });

    const token =
        await getAccessToken();

    const timestamp =
        generateTimestamp();

    const password =
        generateStkPassword(
            config.shortcode,
            config.passkey,
            timestamp
        );

    const normalizedPhone =
        String(phoneNumber)
            .replace(/\D/g, "");

    if (!/^2547\d{8}$/.test(normalizedPhone)) {

        throw new Error(
            "Invalid M-Pesa phone number. Use 2547XXXXXXXX."
        );

    }

    const numericAmount =
        Number(amount);

    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {

        throw new Error(
            "Invalid M-Pesa amount."
        );

    }

    const body = {

        BusinessShortCode:
            Number(config.shortcode),

        Password:
            password,

        Timestamp:
            timestamp,

        TransactionType:
            "CustomerPayBillOnline",

        Amount:
            Math.round(numericAmount),

        PartyA:
            normalizedPhone,

        PartyB:
            Number(config.shortcode),

        PhoneNumber:
            normalizedPhone,

        CallBackURL:
            config.callbackUrl,

        AccountReference:
            String(accountReference)
                .substring(0, 12),

        TransactionDesc:
            String(transactionDesc)
                .substring(0, 13)

    };


    const response =
        await fetch(
            DARAJA_BASE_URL +
            "/mpesa/stkpush/v1/processrequest",
            {

                method: "POST",

                headers: {

                    Authorization:
                        "Bearer " +
                        token,

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(body)

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.errorMessage ||
            data?.ResponseDescription ||
            "Daraja STK Push request failed."
        );

    }


    return {

        ...data,

        timestamp,

        phoneNumber:
            normalizedPhone,

        amount:
            Math.round(numericAmount)

    };

}


module.exports = {

    getDarajaConfig,

    validateDarajaConfig,

    getAccessToken,

    generateStkPassword,

    generateTimestamp,

    stkPush

};