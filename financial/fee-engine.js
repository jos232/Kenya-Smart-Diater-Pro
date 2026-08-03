/* ==========================================
   KENYA SMART DIALER
   FEE ENGINE
========================================== */

"use strict";

/* ==========================
   TRANSACTION FEES
========================== */

const BANK_FEES = {

    transfer: [

        { max: 100, fee: 0 },
        { max: 500, fee: 12 },
        { max: 1000, fee: 18 },
        { max: 2500, fee: 28 },
        { max: 5000, fee: 45 },
        { max: 10000, fee: 52 },
        { max: 20000, fee: 60 },
        { max: 35000, fee: 70 },
        { max: 50000, fee: 80 },
        { max: Infinity, fee: 105 }

    ],

    withdraw: [

        { max: 100, fee: 5 },
        { max: 500, fee: 15 },
        { max: 1000, fee: 25 },
        { max: 2500, fee: 35 },
        { max: 5000, fee: 50 },
        { max: 10000, fee: 60 },
        { max: Infinity, fee: 85 }

    ],

    deposit: 0,

    airtime: 0,

    bundles: 0,

    bills: 15,

    buygoods: 0

};

/* ==========================
   CALCULATE FEE
========================== */

function calculateFee(service, amount) {

    amount = Number(amount);

    if (service === "deposit") {

        return 0;

    }

    if (service === "airtime") {

        return 0;

    }

    if (service === "bundles") {

        return 0;

    }

    if (service === "buygoods") {

        return 0;

    }

    if (service === "bills") {

        return BANK_FEES.bills;

    }

    const table = BANK_FEES[service];

    if (!table) {

        return 0;

    }

    for (const row of table) {

        if (amount <= row.max) {

            return row.fee;

        }

    }

    return 0;

}

/* ==========================
   TOTAL DEBIT
========================== */

function calculateTotal(amount, fee) {

    return Number(amount) + Number(fee);

}