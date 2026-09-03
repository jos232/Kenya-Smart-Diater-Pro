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


function validateDarajaConfig() {

    const config =
        getDarajaConfig();

    const missing = [];

    if (!config.consumerKey) {
        missing.push("DARAJA_CONSUMER_KEY");
    }

    if (!config.consumerSecret) {
        missing.push("DARAJA_CONSUMER_SECRET");
    }

    if (!config.shortcode) {
        missing.push("DARAJA_SHORTCODE");
    }

    if (!config.passkey) {
        missing.push("DARAJA_PASSKEY");
    }

    if (!config.callbackUrl) {
        missing.push("DARAJA_CALLBACK_URL");
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


module.exports = {
    getDarajaConfig,
    validateDarajaConfig,
    getAccessToken
};
