/* ==========================================
   CO-OPERATIVE BANK
   WITHDRAW
========================================== */

"use strict";

/* ==========================
   STORAGE
========================== */

const COOP_WITHDRAW_HISTORY_KEY =
    "coop_withdraw_history";

const COOP_WITHDRAW_METHODS_KEY =
    "coop_withdraw_methods";

/* ==========================
   OPEN WITHDRAW
========================== */

function openCoopWithdraw() {

    loadCoopWithdrawHistory();

    loadCoopWithdrawMethods();

    showScreen("coopWithdraw");

}

/* ==========================
   SUBMIT WITHDRAW
========================== */

function submitCoopWithdraw() {

    const method =
        document.getElementById("coopWithdrawMethod").value;

    const amount =
        Number(document.getElementById("coopWithdrawAmount").value);

    const reference =
        document.getElementById("coopWithdrawReference").value.trim();

    const pin =
        document.getElementById("coopWithdrawPIN").value;

    if (reference === "") {

        alert("Enter withdrawal reference.");

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
        calculateFee("withdraw", amount);

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

        service: "WITHDRAW",

        sender: coopAccount.accountNumber,

        recipient: method,

        reference,

        amount,

        fee,

        total,

        balance: coopAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Withdrawal Successful",

        `${formatMoney(amount)} withdrawn successfully.`

    );

    saveCoopWithdrawHistory(transaction);

    loadCoopRecentTransactions();

    loadCoopWithdrawHistory();

    document.getElementById("coopWithdrawAmount").value = "";

    document.getElementById("coopWithdrawReference").value = "";

    document.getElementById("coopWithdrawPIN").value = "";

    document.getElementById("coopWithdrawMethod").selectedIndex = 0;

    showScreen("kcbReceipt");

}

/* ==========================
   HISTORY
========================== */

function getCoopWithdrawHistory() {

    return JSON.parse(

        localStorage.getItem(COOP_WITHDRAW_HISTORY_KEY)

    ) || [];

}

function saveCoopWithdrawHistory(transaction) {

    const history =
        getCoopWithdrawHistory();

    history.unshift(transaction);

    localStorage.setItem(

        COOP_WITHDRAW_HISTORY_KEY,

        JSON.stringify(history)

    );

}

function loadCoopWithdrawHistory() {

    const container =
        document.getElementById("coopWithdrawHistory");

    if (!container) return;

    const history =
        getCoopWithdrawHistory();

    container.innerHTML = "";

    history.slice(0, 5).forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <strong>${item.recipient}</strong>

            <small>${item.date}</small>

            <span>${formatMoney(item.amount)}</span>

        </div>

        `;

    });

}

/* ==========================
   SAVED METHODS
========================== */

function getCoopWithdrawMethods() {

    return JSON.parse(

        localStorage.getItem(COOP_WITHDRAW_METHODS_KEY)

    ) || [];

}

function saveCoopWithdrawMethods(data) {

    localStorage.setItem(

        COOP_WITHDRAW_METHODS_KEY,

        JSON.stringify(data)

    );

}

function addCoopWithdrawMethod() {

    const method =
        prompt("Withdrawal Method");

    if (!method) return;

    const methods =
        getCoopWithdrawMethods();

    methods.push(method);

    saveCoopWithdrawMethods(methods);

    loadCoopWithdrawMethods();

}

function loadCoopWithdrawMethods() {

    const list =
        document.getElementById("coopWithdrawMethods");

    if (!list) return;

    list.innerHTML = "";

    getCoopWithdrawMethods().forEach(method => {

        list.innerHTML += `

        <div class="contact-card"

             onclick="selectCoopWithdrawMethod('${method}')">

            <strong>${method}</strong>

        </div>

        `;

    });

}

function selectCoopWithdrawMethod(method) {

    document.getElementById(
        "coopWithdrawMethod"
    ).value = method;

}

/* ==========================
   QUICK AMOUNTS
========================== */

function selectCoopWithdrawAmount(amount) {

    document.getElementById(
        "coopWithdrawAmount"
    ).value = amount;

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopWithdraw = openCoopWithdraw;
window.submitCoopWithdraw = submitCoopWithdraw;

window.getCoopWithdrawHistory = getCoopWithdrawHistory;
window.saveCoopWithdrawHistory = saveCoopWithdrawHistory;
window.loadCoopWithdrawHistory = loadCoopWithdrawHistory;

window.getCoopWithdrawMethods = getCoopWithdrawMethods;
window.saveCoopWithdrawMethods = saveCoopWithdrawMethods;
window.loadCoopWithdrawMethods = loadCoopWithdrawMethods;
window.addCoopWithdrawMethod = addCoopWithdrawMethod;
window.selectCoopWithdrawMethod = selectCoopWithdrawMethod;

window.selectCoopWithdrawAmount = selectCoopWithdrawAmount;