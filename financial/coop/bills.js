/* ==========================================
   CO-OPERATIVE BANK
   BILLS
========================================== */

"use strict";

/* ==========================
   OPEN BILLS
========================== */

function openCoopBills() {

    showScreen("coopBills");

}

/* ==========================
   PAY BILL
========================== */

function submitCoopBill() {

    const provider =
        document.getElementById("coopBillProvider").value;

    const account =
        document.getElementById("coopBillAccount").value.trim();

    const amount =
        Number(document.getElementById("coopBillAmount").value);

    const pin =
        document.getElementById("coopBillPIN").value;

    if (account === "") {

        alert("Enter Account Number.");

        return;

    }

    if (amount <= 0) {

        alert("Enter valid amount.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("bill", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > coopAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    coopAccount.balance -= total;

    updateCoopBalance();

    const transaction = createTransaction({

        bank: "CO-OP",

        service: "BILL PAYMENT",

        sender: coopAccount.accountNumber,

        recipient: provider,

        reference: account,

        amount,

        fee,

        total,

        balance: coopAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Bill Paid",

        `${provider} bill paid successfully.`

    );

    addCoopBillAccount(provider, account);

    loadCoopRecentTransactions();

    loadCoopBillHistory();

    document.getElementById("coopBillAccount").value = "";

    document.getElementById("coopBillAmount").value = "";

    document.getElementById("coopBillPIN").value = "";

    document.getElementById("coopBillProvider").selectedIndex = 0;

    showScreen("kcbReceipt");

}

/* ==========================
   BILL HISTORY
========================== */

function loadCoopBillHistory() {

    if (typeof getBankTransactions === "function") {

        return getBankTransactions(

            "CO-OP",

            "BILL PAYMENT"

        );

    }

    return [];

}

/* ==========================
   SAVED BILL ACCOUNTS
========================== */

function loadCoopBillAccounts() {

    return JSON.parse(

        localStorage.getItem(

            "coop_bill_accounts"

        ) || "[]"

    );

}

function saveCoopBillAccounts(accounts) {

    localStorage.setItem(

        "coop_bill_accounts",

        JSON.stringify(accounts)

    );

}

function addCoopBillAccount(provider, account) {

    const accounts = loadCoopBillAccounts();

    const exists = accounts.some(

        item =>

            item.provider === provider &&

            item.account === account

    );

    if (!exists) {

        accounts.unshift({

            provider,

            account

        });

        saveCoopBillAccounts(

            accounts.slice(0, 20)

        );

    }

}

/* ==========================
   QUICK BILL PROVIDERS
========================== */

function getPopularCoopBillProviders() {

    return [

        "KPLC",

        "NWSC",

        "DStv",

        "GOtv",

        "Zuku",

        "Safaricom",

        "Airtel"

    ];

}

/* ==========================
   SELECT PROVIDER
========================== */

function selectCoopBillProvider(provider) {

    document.getElementById(

        "coopBillProvider"

    ).value = provider;

}

/* ==========================
   REFRESH
========================== */

function refreshCoopBills() {

    document.getElementById("coopBillAccount").value = "";

    document.getElementById("coopBillAmount").value = "";

    document.getElementById("coopBillPIN").value = "";

    document.getElementById("coopBillProvider").selectedIndex = 0;

    loadCoopBillHistory();

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopBills = openCoopBills;

window.submitCoopBill = submitCoopBill;

window.loadCoopBillHistory = loadCoopBillHistory;

window.loadCoopBillAccounts = loadCoopBillAccounts;

window.saveCoopBillAccounts = saveCoopBillAccounts;

window.addCoopBillAccount = addCoopBillAccount;

window.getPopularCoopBillProviders = getPopularCoopBillProviders;

window.selectCoopBillProvider = selectCoopBillProvider;

window.refreshCoopBills = refreshCoopBills;