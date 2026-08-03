/* ==========================================
   KENYA SMART DIALER
   BANKING ENGINE
========================================== */

"use strict";

/* ==========================
   TRANSACTION TYPES
========================== */

const TRANSACTION_TYPES = {

    TRANSFER: "TRANSFER",

    DEPOSIT: "DEPOSIT",

    WITHDRAW: "WITHDRAW",

    BILL: "PAY BILL",

    BUYGOODS: "BUY GOODS",

    AIRTIME: "AIRTIME",

    BUNDLES: "BUNDLES",

    LOAN: "LOAN"

};

/* ==========================
   GENERATE REFERENCE
========================== */

function generateReference() {

    return "KSD" +

        Date.now() +

        Math.floor(Math.random() * 1000);

}

/* ==========================
   CURRENT DATE
========================== */

function currentDate() {

    return new Date().toLocaleString();

}

/* ==========================
   MONEY FORMAT
========================== */

function formatMoney(amount) {

    return "KSh " +

        Number(amount).toLocaleString(undefined, {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        });

}

/* ==========================
   TRANSACTION OBJECT
========================== */

function createTransaction(data) {

    return {

        reference: generateReference(),

        date: currentDate(),

        bank: data.bank,

        service: data.service,

        sender: data.sender,

        recipient: data.recipient,

        amount: Number(data.amount),

        fee: Number(data.fee),

        total: Number(data.total),

        balance: Number(data.balance),

        status: "SUCCESS"

    };

}
/* ==========================
   TRANSACTION STORAGE
========================== */

let bankTransactions = [];
/* ==========================================
   SAVE BANK TRANSACTION
========================================== */

function saveBankTransaction(transaction) {

    // Add transaction to memory
    bankTransactions.unshift(transaction);

    // Save to local storage
    localStorage.setItem(
        "bankTransactions",
        JSON.stringify(bankTransactions)
    );

}
/* ==========================
   GET TRANSACTIONS
========================== */

function getBankStatements(bank) {

    return bankTransactions.filter(item => item.bank === bank);

}
/* ==========================
   UPDATE ACCOUNT BALANCE
========================== */

function updateAccountBalance(account, amount) {

    account.balance -= Number(amount);

}
/* ==========================
   DEPOSIT
========================== */

function depositMoney(account, amount) {

    account.balance += Number(amount);

}
/* ==========================================
   EXECUTE TRANSFER
========================================== */

function executeTransfer(account, transferData) {

    const transaction = createTransaction({

        bank: "KCB",

        service: TRANSACTION_TYPES.TRANSFER,

        sender: account.holder,

        recipient: transferData.recipient,

        amount: transferData.amount,

        fee: 22,

        total: Number(transferData.amount) + 22,

        balance: account.balance - Number(transferData.amount)

    });

    updateAccountBalance(account, transferData.amount);

    saveTransaction(transaction);

    return transaction;

}
/* ==========================================
   RECEIPT ENGINE
========================================== */

function generateReceipt(transaction) {

    document.getElementById("receiptReference").textContent =
        transaction.reference;

    document.getElementById("receiptRecipient").textContent =
        transaction.recipient;

    document.getElementById("receiptBank").textContent =
        transaction.bank;

    document.getElementById("receiptAmount").textContent =
        formatMoney(transaction.amount);

    document.getElementById("receiptDate").textContent =
        transaction.date;

    document.getElementById("receiptTime").textContent =
        new Date().toLocaleTimeString();

}
/* ==========================================
   LOAD STATEMENT
========================================== */

function loadStatement(bank) {

    const container =
        document.getElementById("statementContainer");

    if (!container) return;

    container.innerHTML = "";

    const transactions =
        getBankStatements(bank);

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">📄</div>

            <h3>No Transactions Found</h3>

        </div>

        `;

        return;

    }

    transactions.forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div>

                <strong>${item.service}</strong>

                <small>${item.date}</small>

            </div>

            <div>

                <strong>${formatMoney(item.amount)}</strong><br>

                <small>${item.reference}</small>

            </div>

        </div>

        `;

    });

}
/* ==========================================
   SEARCH STATEMENT
========================================== */

function searchStatement() {

    const keyword =
        document.getElementById("statementSearch")
            .value
            .toLowerCase();

    const cards =
        document.querySelectorAll("#statementContainer .transaction-card");

    cards.forEach(card => {

        card.style.display =
            card.innerText.toLowerCase().includes(keyword)
                ? "flex"
                : "none";

    });

}
/* ==========================================
   SAVE TRANSACTION
========================================== */

function saveTransaction(transaction) {

    return saveBankTransaction(transaction);

}

window.saveTransaction = saveTransaction;