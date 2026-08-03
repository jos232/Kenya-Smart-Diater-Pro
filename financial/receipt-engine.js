/* ==========================================
   KENYA SMART DIALER
   RECEIPT ENGINE
========================================== */

"use strict";

/* ==========================
   CURRENT RECEIPT
========================== */

let currentReceipt = null;

/* ==========================
   CREATE RECEIPT
========================== */

function createReceipt(transaction) {

    currentReceipt = {

        reference: transaction.reference,

        date: transaction.date,

        bank: transaction.bank,

        service: transaction.service,

        sender: transaction.sender,

        recipient: transaction.recipient,

        amount: transaction.amount,

        fee: transaction.fee,

        total: transaction.total,

        balance: transaction.balance,

        status: transaction.status

    };

    return currentReceipt;

}

/* ==========================
   GET RECEIPT
========================== */

function getReceipt() {

    return currentReceipt;

}

function showReceipt(receipt) {

    if (!receipt) return;

    hideFinancialScreens();

    document.getElementById("bankReceipt").style.display = "block";

    document.getElementById("receiptReference").textContent = receipt.reference;

    document.getElementById("receiptDate").textContent = receipt.date;

    document.getElementById("receiptBank").textContent = receipt.bank;

    document.getElementById("receiptService").textContent = receipt.service;

    document.getElementById("receiptSender").textContent = receipt.sender;

    document.getElementById("receiptRecipient").textContent = receipt.recipient;

    document.getElementById("receiptAmount").textContent = formatMoney(receipt.amount);

    document.getElementById("receiptFee").textContent = formatMoney(receipt.fee);

    document.getElementById("receiptTotal").textContent = formatMoney(receipt.total);

    document.getElementById("receiptBalance").textContent = formatMoney(receipt.balance);

    document.getElementById("receiptStatus").textContent = receipt.status;

}