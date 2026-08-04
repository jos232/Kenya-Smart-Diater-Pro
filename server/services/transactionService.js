"use strict";

const Statement = require("../models/Statement");

/* ==========================================
   SAVE TRANSACTION + STATEMENT
========================================== */

async function processTransaction({

    bank,

    account,

    transaction

}) {

    /* -----------------------------
       SAVE STATEMENT
    ----------------------------- */

    const statement = new Statement({

        bank,

        accountNumber: account.accountNumber,

        transactionId: transaction.transactionId,

        reference: transaction.reference,

        type: transaction.service,

        description: transaction.service,

        sender: transaction.sender,

        recipient: transaction.recipient,

        amount: transaction.amount,

        charges: transaction.fee,

        balance: account.balance,

        status: "SUCCESS",

        channel: "APP"

    });

    await statement.save();

    return {

        success: true,

        statement

    };

}

module.exports = {

    processTransaction

};