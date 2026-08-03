/* ==========================================
   KCB MOBILE BANKING
   TRANSFER
========================================== */

"use strict";

/* ==========================
   OPEN TRANSFER
========================== */

function openTransfer() {

    hideFinancialScreens();

    document.getElementById("transferScreen").style.display = "block";

}

/* ==========================
   SEND MONEY
========================== */

function submitKCBTransfer() {

    const recipient =

        document.getElementById("transferRecipient").value.trim();

    const account =

        document.getElementById("transferAccount").value.trim();

    const amount = Number(

        document.getElementById("transferAmount").value

    );

    const pin =

        document.getElementById("transferPIN").value;

    if (!recipient || !account || amount <= 0) {

        alert("Complete all fields.");

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

    if (total > kcbAccount.balance) {

        alert("Insufficient balance.");

        return;

    }

    kcbAccount.balance -= total;

    updateKCBBalance();

    addBeneficiary(

        "KCB",

        recipient,

        account

    );

    const transaction =

        createTransaction({

            bank: "KCB",

            service: "TRANSFER",

            sender: kcbAccount.holder,

            recipient,

            amount,

            fee,

            total,

            balance: kcbAccount.balance

        });

    addStatement(transaction);

    createReceipt(transaction);

    addBankNotification(

        "Transfer Successful",

        `${formatMoney(amount)} sent to ${recipient}.`

    );

    loadKCBRecentTransactions();

    showReceipt(

        getReceipt()

    );

}
/* ==========================================
   CONFIRM TRANSFER
========================================== */

function confirmTransfer() {

    const name = document.getElementById("transferName").value;

    const account = document.getElementById("transferAccount").value;

    const bank = document.getElementById("transferBank").value;

    const amount = Number(document.getElementById("transferAmount").value);

    document.getElementById("confirmName").textContent = name;

    document.getElementById("confirmAccount").textContent = account;

    document.getElementById("confirmBank").textContent = bank;

    document.getElementById("confirmAmount").textContent = "KSh " + amount.toLocaleString();

    document.getElementById("confirmTotal").textContent = "KSh " + (amount + 22).toLocaleString();

    showScreen("kcbTransferConfirm");

}
function processTransfer() {

    const transfer = {

        recipient:
            document.getElementById("transferName").value,

        amount:
            Number(document.getElementById("transferAmount").value)

    };

    const transaction =
        executeTransfer(kcbAccount, transfer);

    updateKCBBalance();

    loadKCBRecentTransactions();

    generateReceipt(transaction);

    showScreen("kcbProcessing");

    setTimeout(function () {

        showScreen("kcbTransferSuccess");

    }, 2000);

}