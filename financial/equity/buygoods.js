/* ==========================================
   EQUITY MOBILE BANKING
   BUY GOODS
========================================== */

"use strict";

/* ==========================
   OPEN BUY GOODS
========================== */

function openEquityBuyGoods() {

    showScreen("equityBuyGoods");

}

/* ==========================
   BUY GOODS
========================== */

function submitEquityBuyGoods() {

    const till =
        document.getElementById("equityTillNumber").value.trim();

    const amount =
        Number(document.getElementById("equityGoodsAmount").value);

    const pin =
        document.getElementById("equityGoodsPIN").value;

    if (till === "") {

        alert("Enter Till Number.");

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

    const fee = calculateFee("buygoods", amount);

    const total = calculateTotal(amount, fee);

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "BUY GOODS",

        sender: equityAccount.accountNumber,

        recipient: till,

        amount,

        fee,

        total,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Buy Goods Successful",

        `${formatMoney(amount)} paid successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityTillNumber").value = "";

    document.getElementById("equityGoodsAmount").value = "";

    document.getElementById("equityGoodsPIN").value = "";

    showScreen("kcbReceipt");

}
/* ==========================================
   BUY GOODS HISTORY
========================================== */

function loadEquityBuyGoodsHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "BUY GOODS");

}

/* ==========================================
   QUICK PAYMENT
========================================== */

function quickEquityBuyGoods(amount) {

    const amountInput =
        document.getElementById("equityGoodsAmount");

    if (amountInput) {

        amountInput.value = amount;

    }

}

/* ==========================================
   SAVED TILL NUMBERS
========================================== */

let equityTillNumbers = [];

function loadEquityTillNumbers() {

    const saved = localStorage.getItem("equityTillNumbers");

    equityTillNumbers = saved
        ? JSON.parse(saved)
        : [];

}

function saveEquityTillNumbers() {

    localStorage.setItem(

        "equityTillNumbers",

        JSON.stringify(equityTillNumbers)

    );

}

function addEquityTill(name, till) {

    equityTillNumbers.push({

        name,

        till

    });

    saveEquityTillNumbers();

}

/* ==========================================
   POPULAR MERCHANTS
========================================== */

function showPopularMerchants() {

    alert(

        "Popular Merchants\n\n" +

        "• Naivas\n" +

        "• Carrefour\n" +

        "• Quickmart\n" +

        "• Java House\n" +

        "• Shell\n" +

        "• Rubis"

    );

}

/* ==========================================
   VERIFY TILL
========================================== */

function verifyTillNumber(till) {

    if (!till || till.length < 5) {

        alert("Invalid Till Number.");

        return false;

    }

    return true;

}

/* ==========================================
   REFRESH BUY GOODS
========================================== */

function refreshEquityBuyGoods() {

    loadEquityRecentTransactions();

    addBankNotification(

        "Buy Goods Updated",

        "Merchant payments refreshed."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityBuyGoodsHistory = loadEquityBuyGoodsHistory;
window.quickEquityBuyGoods = quickEquityBuyGoods;
window.loadEquityTillNumbers = loadEquityTillNumbers;
window.saveEquityTillNumbers = saveEquityTillNumbers;
window.addEquityTill = addEquityTill;
window.showPopularMerchants = showPopularMerchants;
window.verifyTillNumber = verifyTillNumber;
window.refreshEquityBuyGoods = refreshEquityBuyGoods;