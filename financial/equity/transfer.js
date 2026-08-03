/* ==========================================
   EQUITY MOBILE BANKING
   TRANSFER
========================================== */

"use strict";

/* ==========================
   OPEN TRANSFER
========================== */

function openEquityTransfer() {

    showScreen("equityTransfer");

}

/* ==========================
   SUBMIT TRANSFER
========================== */

function submitEquityTransfer() {

    const recipient =
        document.getElementById("equityTransferRecipient").value.trim();

    const account =
        document.getElementById("equityTransferAccount").value.trim();

    const amount =
        Number(document.getElementById("equityTransferAmount").value);

    const pin =
        document.getElementById("equityTransferPIN").value;

    if (recipient === "") {

        alert("Enter recipient name.");

        return;

    }

    if (account === "") {

        alert("Enter recipient account.");

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
        calculateFee("transfer", amount);

    const total =
        calculateTotal(amount, fee);

    if (total > equityAccount.balance) {

        alert("Insufficient Balance.");

        return;

    }

    equityAccount.balance -= total;

    updateEquityBalance();

    const transaction = createTransaction({

        bank: "EQUITY",

        service: "TRANSFER",

        sender: equityAccount.accountNumber,

        recipient: account,

        amount: amount,

        fee: fee,

        total: total,

        balance: equityAccount.balance

    });

    saveBankTransaction(transaction);

    addStatement(transaction);

    generateReceipt(transaction);

    addBankNotification(

        "Transfer Successful",

        `${formatMoney(amount)} sent successfully.`

    );

    loadEquityRecentTransactions();

    document.getElementById("equityTransferRecipient").value = "";
    document.getElementById("equityTransferAccount").value = "";
    document.getElementById("equityTransferAmount").value = "";
    document.getElementById("equityTransferPIN").value = "";

    showScreen("kcbReceipt");

}
/* ==========================================
   BENEFICIARIES
========================================== */

let equityBeneficiaries = [];

function loadEquityBeneficiaries() {

    const saved = localStorage.getItem("equityBeneficiaries");

    equityBeneficiaries = saved
        ? JSON.parse(saved)
        : [];

}

function saveEquityBeneficiaries() {

    localStorage.setItem(

        "equityBeneficiaries",

        JSON.stringify(equityBeneficiaries)

    );

}

function addEquityBeneficiary(name, account) {

    equityBeneficiaries.push({

        name,

        account

    });

    saveEquityBeneficiaries();

}

/* ==========================================
   QUICK TRANSFER
========================================== */

function quickEquityTransfer(accountNumber) {

    const accountInput =
        document.getElementById("equityTransferAccount");

    if (accountInput) {

        accountInput.value = accountNumber;

    }

}

/* ==========================================
   TRANSFER HISTORY
========================================== */

function loadEquityTransferHistory() {

    return getBankStatements("EQUITY")

        .filter(item => item.service === "TRANSFER");

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityTransfer() {

    loadEquityBeneficiaries();

    loadEquityRecentTransactions();

}

/* ==========================================
   INTERBANK TRANSFER
========================================== */

function transferToAnotherBank(bankName) {

    alert(

        "Transfering to " +

        bankName +

        "\n\nFeature Ready."

    );

}

/* ==========================================
   EXPORTS
========================================== */

window.loadEquityBeneficiaries = loadEquityBeneficiaries;
window.addEquityBeneficiary = addEquityBeneficiary;
window.quickEquityTransfer = quickEquityTransfer;
window.refreshEquityTransfer = refreshEquityTransfer;
window.transferToAnotherBank = transferToAnotherBank;