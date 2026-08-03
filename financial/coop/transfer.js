/* ==========================================
   CO-OPERATIVE BANK
   TRANSFER
========================================== */

"use strict";

/* ==========================
   STORAGE
========================== */

const COOP_TRANSFER_HISTORY_KEY =
    "coop_transfer_history";

const COOP_TRANSFER_CONTACTS_KEY =
    "coop_transfer_contacts";

/* ==========================
   OPEN TRANSFER
========================== */

function openCoopTransfer() {

    loadCoopTransferHistory();

    loadCoopTransferContacts();

    showScreen("coopTransfer");

}

/* ==========================
   SUBMIT TRANSFER
========================== */

function submitCoopTransfer() {

    const recipient =
        document.getElementById("coopTransferAccount").value.trim();

    const amount =
        Number(document.getElementById("coopTransferAmount").value);

    const reference =
        document.getElementById("coopTransferReference").value.trim();

    const pin =
        document.getElementById("coopTransferPIN").value;

    if (recipient === "") {

        alert("Enter recipient account.");

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
        calculateFee("transfer", amount);

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

        service: "TRANSFER",

        sender: coopAccount.accountNumber,

        recipient,

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

        "Transfer Successful",

        `${formatMoney(amount)} transferred successfully.`

    );

    saveCoopTransferHistory(transaction);

    loadCoopRecentTransactions();

    loadCoopTransferHistory();

    document.getElementById("coopTransferAccount").value = "";

    document.getElementById("coopTransferAmount").value = "";

    document.getElementById("coopTransferReference").value = "";

    document.getElementById("coopTransferPIN").value = "";

    showScreen("kcbReceipt");

}

/* ==========================
   HISTORY
========================== */

function getCoopTransferHistory() {

    return JSON.parse(

        localStorage.getItem(COOP_TRANSFER_HISTORY_KEY)

    ) || [];

}

function saveCoopTransferHistory(transaction) {

    const history =
        getCoopTransferHistory();

    history.unshift(transaction);

    localStorage.setItem(

        COOP_TRANSFER_HISTORY_KEY,

        JSON.stringify(history)

    );

}

function loadCoopTransferHistory() {

    const container =
        document.getElementById("coopTransferHistory");

    if (!container) return;

    const history =
        getCoopTransferHistory();

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
   BENEFICIARIES
========================== */

function getCoopTransferContacts() {

    return JSON.parse(

        localStorage.getItem(COOP_TRANSFER_CONTACTS_KEY)

    ) || [];

}

function saveCoopTransferContacts(data) {

    localStorage.setItem(

        COOP_TRANSFER_CONTACTS_KEY,

        JSON.stringify(data)

    );

}

function addCoopTransferContact() {

    const account =
        prompt("Account Number");

    if (!account) return;

    const name =
        prompt("Beneficiary Name");

    if (!name) return;

    const contacts =
        getCoopTransferContacts();

    contacts.push({

        account,

        name

    });

    saveCoopTransferContacts(contacts);

    loadCoopTransferContacts();

}

function loadCoopTransferContacts() {

    const list =
        document.getElementById("coopTransferContacts");

    if (!list) return;

    list.innerHTML = "";

    getCoopTransferContacts().forEach(item => {

        list.innerHTML += `

        <div class="contact-card"

        onclick="selectCoopBeneficiary('${item.account}')">

            <strong>${item.name}</strong>

            <small>${item.account}</small>

        </div>

        `;

    });

}

function selectCoopBeneficiary(account) {

    document.getElementById(

        "coopTransferAccount"

    ).value = account;

}

/* ==========================
   QUICK AMOUNTS
========================== */

function selectCoopTransferAmount(amount) {

    document.getElementById(

        "coopTransferAmount"

    ).value = amount;

}

/* ==========================
   OWN ACCOUNT
========================== */

function transferToOwnCoopAccount() {

    document.getElementById(

        "coopTransferAccount"

    ).value = coopAccount.accountNumber;

}

/* ==========================================
   EXPORTS
========================================== */

window.openCoopTransfer = openCoopTransfer;
window.submitCoopTransfer = submitCoopTransfer;

window.loadCoopTransferHistory = loadCoopTransferHistory;
window.getCoopTransferHistory = getCoopTransferHistory;
window.saveCoopTransferHistory = saveCoopTransferHistory;

window.loadCoopTransferContacts = loadCoopTransferContacts;
window.getCoopTransferContacts = getCoopTransferContacts;
window.saveCoopTransferContacts = saveCoopTransferContacts;
window.addCoopTransferContact = addCoopTransferContact;
window.selectCoopBeneficiary = selectCoopBeneficiary;

window.selectCoopTransferAmount = selectCoopTransferAmount;
window.transferToOwnCoopAccount = transferToOwnCoopAccount;