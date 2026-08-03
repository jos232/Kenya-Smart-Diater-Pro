/* ==========================================
   CO-OPERATIVE BANK
   BUY GOODS
========================================== */

"use strict";

/* ==========================
   OPEN BUY GOODS
========================== */

function openCoopBuyGoods() {

    showScreen("coopBuyGoods");

}

/* ==========================
   BUY GOODS
========================== */

function submitCoopBuyGoods() {

    const till =
        document.getElementById("coopTillNumber").value.trim();

    const amount =
        Number(document.getElementById("coopGoodsAmount").value);

    const pin =
        document.getElementById("coopGoodsPIN").value;

    if (till === "") {

        alert("Enter Till Number.");

        return;

    }

    if (amount <= 0) {

        alert("Enter valid amount.");

        return;

    }

    const verify =
        verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("buygoods", amount);

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

        service: "BUY GOODS",

        sender: coopAccount.accountNumber,

        recipient: till,

        amount,

        fee,

        total,

        balance: coopAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Payment Successful",

        `${formatMoney(amount)} paid successfully.`

    );

    addCoopBuyGoodsMerchant(till);

    loadCoopRecentTransactions();

    loadCoopBuyGoodsHistory();

    document.getElementById("coopTillNumber").value = "";

    document.getElementById("coopGoodsAmount").value = "";

    document.getElementById("coopGoodsPIN").value = "";

    showScreen("kcbReceipt");

}

/* ==========================
   HISTORY
========================== */

function loadCoopBuyGoodsHistory() {

    if (typeof getBankTransactions === "function") {

        return getBankTransactions(

            "CO-OP",

            "BUY GOODS"

        );

    }

    return [];

}

/* ==========================
   SAVED MERCHANTS
========================== */

function loadCoopBuyGoodsMerchants() {

    return JSON.parse(

        localStorage.getItem(

            "coop_buygoods_merchants"

        ) || "[]"

    );

}

function saveCoopBuyGoodsMerchants(list) {

    localStorage.setItem(

        "coop_buygoods_merchants",

        JSON.stringify(list)

    );

}

function addCoopBuyGoodsMerchant(till) {

    const merchants =
        loadCoopBuyGoodsMerchants();

    if (!merchants.includes(till)) {

        merchants.unshift(till);

        saveCoopBuyGoodsMerchants(

            merchants.slice(0, 20)

        );

    }

}

/* ==========================
   RECENT MERCHANTS
========================== */

function getRecentCoopMerchants() {

    return loadCoopBuyGoodsMerchants();

}

/* ==========================
   SELECT MERCHANT
========================== */

function selectCoopMerchant(till) {

    document.getElementById(

        "coopTillNumber"

    ).value = till;

}

/* ==========================
   QUICK AMOUNTS
========================== */

function selectCoopGoodsAmount(amount) {

    document.getElementById(

        "coopGoodsAmount"

    ).value = amount;

}

/* ==========================
   POPULAR AMOUNTS
========================== */

function showPopularCoopGoodsAmounts() {

    return [

        100,

        200,

        500,

        1000,

        2000,

        5000,

        10000

    ];

}

/* ==========================
   REFRESH
========================== */

function refreshCoopBuyGoods() {

    document.getElementById("coopTillNumber").value = "";

    document.getElementById("coopGoodsAmount").value = "";

    document.getElementById("coopGoodsPIN").value = "";

    loadCoopBuyGoodsHistory();

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopBuyGoods = openCoopBuyGoods;

window.submitCoopBuyGoods = submitCoopBuyGoods;

window.loadCoopBuyGoodsHistory = loadCoopBuyGoodsHistory;

window.loadCoopBuyGoodsMerchants = loadCoopBuyGoodsMerchants;

window.saveCoopBuyGoodsMerchants = saveCoopBuyGoodsMerchants;

window.addCoopBuyGoodsMerchant = addCoopBuyGoodsMerchant;

window.getRecentCoopMerchants = getRecentCoopMerchants;

window.selectCoopMerchant = selectCoopMerchant;

window.selectCoopGoodsAmount = selectCoopGoodsAmount;

window.showPopularCoopGoodsAmounts = showPopularCoopGoodsAmounts;

window.refreshCoopBuyGoods = refreshCoopBuyGoods;