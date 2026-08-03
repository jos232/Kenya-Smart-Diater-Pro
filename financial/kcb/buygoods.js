/* ==========================================
   KCB MOBILE BANKING
   BUY GOODS
========================================== */

"use strict";

/* ==========================
   OPEN BUY GOODS
========================== */

function openBuyGoods() {

    showScreen("kcbBuyGoods");

}

/* ==========================
   SUBMIT BUY GOODS
========================== */

function submitBuyGoods() {

    const business =
        document.getElementById("goodsBusiness").value.trim();

    const till =
        document.getElementById("goodsTill").value.trim();

    const amount =
        Number(document.getElementById("goodsAmount").value);

    const pin =
        document.getElementById("goodsPIN").value;

    if (business === "" || till === "") {

        alert("Fill in all fields.");

        return;

    }

    if (amount <= 0) {

        alert("Enter a valid amount.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    const fee =
        calculateFee("buygoods", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > kcbAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    kcbAccount.balance -= total;

    updateKCBBalance();

    const transaction = createTransaction({

        bank: "KCB",

        service: "BUY GOODS",

        sender: kcbAccount.accountNumber,

        recipient: `${business} (${till})`,

        amount,

        fee,

        total,

        balance: kcbAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Buy Goods Successful",

        `${formatMoney(amount)} paid to ${business}.`

    );

    loadKCBRecentTransactions();

    document.getElementById("goodsBusiness").value = "";

    document.getElementById("goodsTill").value = "";

    document.getElementById("goodsAmount").value = "";

    document.getElementById("goodsPIN").value = "";

    showScreen("kcbReceipt");

}
/* ==========================================
   BUY GOODS HISTORY
========================================== */

function loadKCBBuyGoodsHistory() {

    return getBankStatements("KCB")

        .filter(item => item.service === "BUY GOODS");

}

/* ==========================================
   FAVOURITE MERCHANTS
========================================== */

let kcbFavouriteMerchants = [];

function loadFavouriteMerchants() {

    const saved =
        localStorage.getItem("kcbFavouriteMerchants");

    kcbFavouriteMerchants =
        saved ? JSON.parse(saved) : [];

}

function saveFavouriteMerchants() {

    localStorage.setItem(

        "kcbFavouriteMerchants",

        JSON.stringify(kcbFavouriteMerchants)

    );

}

function addFavouriteMerchant(name, till) {

    kcbFavouriteMerchants.push({

        name,

        till

    });

    saveFavouriteMerchants();

}

/* ==========================================
   VERIFY TILL NUMBER
========================================== */

function verifyTillNumber(till) {

    if (!till || till.length < 5) {

        alert("Invalid Till Number.");

        return false;

    }

    return true;

}

/* ==========================================
   RECENT MERCHANTS
========================================== */

function getRecentMerchants() {

    return loadKCBBuyGoodsHistory()

        .slice(0, 5);

}

/* ==========================================
   QUICK AMOUNTS
========================================== */

function quickGoodsAmount(amount) {

    const input =
        document.getElementById("goodsAmount");

    if (input) {

        input.value = amount;

    }

}

/* ==========================================
   REFRESH
========================================== */

function refreshBuyGoods() {

    loadKCBRecentTransactions();

    addBankNotification(

        "Buy Goods Updated",

        "Recent merchant payments refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadKCBBuyGoodsHistory = loadKCBBuyGoodsHistory;
window.loadFavouriteMerchants = loadFavouriteMerchants;
window.saveFavouriteMerchants = saveFavouriteMerchants;
window.addFavouriteMerchant = addFavouriteMerchant;
window.verifyTillNumber = verifyTillNumber;
window.getRecentMerchants = getRecentMerchants;
window.quickGoodsAmount = quickGoodsAmount;
window.refreshBuyGoods = refreshBuyGoods;