/* ==========================================
   KCB MOBILE BANKING
   LOANS MODULE
========================================== */

"use strict";

/* ==========================================
   API
========================================== */

const LOAN_API = "/loans";

/* ==========================================
   LOAN STATE
========================================== */

let kcbLoan = {

    id: null,

    limit: 100000,

    active: false,

    amount: 0,

    repayment: 0,

    months: 0,

    balance: 0,

    interest: 0,

    totalRepayment: 0,

    status: "NONE"

};

let loanHistory = [];

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeLoans();

    }

);

/* ==========================================
   INITIALIZE LOANS
========================================== */

async function initializeLoans() {

    try {

        await loadLoanHistory();

        updateLoanDashboard();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   LOAD HISTORY
========================================== */

async function loadLoanHistory() {

    try {

        const response = await apiGet(

            LOAN_API

        );

        loanHistory = response.loans || [];

        if (loanHistory.length > 0) {

            const loan = loanHistory.find(

                l => l.status === "ACTIVE"

            );

            if (loan) {

                kcbLoan.id = loan._id;

                kcbLoan.active = true;

                kcbLoan.amount = loan.amount;

                kcbLoan.balance = loan.balance;

                kcbLoan.months = loan.duration;

                kcbLoan.repayment = loan.monthlyPayment;

                kcbLoan.totalRepayment = loan.totalRepayment;

                kcbLoan.interest =

                    loan.totalRepayment -

                    loan.amount;

                kcbLoan.status = loan.status;

            }

        }

        renderLoanHistory();

        updateLoanDashboard();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateLoanDashboard() {

    const outstanding =

        document.getElementById(

            "loanOutstanding"

        );

    const status =

        document.getElementById(

            "loanStatus"

        );

    const limit =

        document.getElementById(

            "loanLimit"

        );

    if (limit) {

        limit.textContent =

            formatMoney(

                kcbLoan.limit

            );

    }

    if (outstanding) {

        outstanding.textContent =

            formatMoney(

                kcbLoan.balance

            );

    }

    if (status) {

        status.textContent =

            kcbLoan.active

                ? "ACTIVE"

                : "NO ACTIVE LOAN";

    }

}
/* ==========================================
   LOAN CALCULATOR
========================================== */

async function calculateLoan() {

    const amount = Number(

        document.getElementById("loanAmount").value

    );

    const months = Number(

        document.getElementById("loanMonths").value

    );

    if (!amount || !months) {

        return;

    }

    try {

        const result = await apiPost(

            LOAN_API + "/calculate",

            {

                amount,

                duration: months

            }

        );

        const interestElement =

            document.getElementById(

                "loanInterest"

            );

        const monthlyElement =

            document.getElementById(

                "loanMonthly"

            );

        const totalElement =

            document.getElementById(

                "loanTotal"

            );

        if (interestElement) {

            interestElement.textContent =

                formatMoney(

                    result.interest

                );

        }

        if (monthlyElement) {

            monthlyElement.textContent =

                formatMoney(

                    result.monthlyPayment

                );

        }

        if (totalElement) {

            totalElement.textContent =

                formatMoney(

                    result.totalRepayment

                );

        }

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   APPLY LOAN
========================================== */

async function applyLoan() {

    const amount = Number(

        document.getElementById("loanAmount").value

    );

    const months = Number(

        document.getElementById("loanMonths").value

    );

    const pin =

        document.getElementById("loanPIN").value;

    const purposeField =

        document.getElementById("loanPurpose");

    const purpose =

        purposeField

            ? purposeField.value

            : "Personal Loan";

    if (amount <= 0) {

        alert(

            "Enter a valid loan amount."

        );

        return;

    }

    if (amount > kcbLoan.limit) {

        alert(

            "Requested amount exceeds your loan limit."

        );

        return;

    }

    if (kcbLoan.active) {

        alert(

            "You already have an active loan."

        );

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    try {

        const response = await apiPost(

            LOAN_API + "/apply",

            {

                loanType: "Personal",

                amount,

                duration: months,

                purpose

            }

        );

        const loan = response.loan;

        /* -------------------------
           SAVE ACTIVE LOAN
        ------------------------- */

        kcbLoan.id = loan._id;

        kcbLoan.active = true;

        kcbLoan.amount = loan.amount;

        kcbLoan.balance = loan.balance;

        kcbLoan.months = loan.duration;

        kcbLoan.repayment =

            loan.monthlyPayment;

        kcbLoan.totalRepayment =

            loan.totalRepayment;

        kcbLoan.interest =

            loan.totalRepayment -

            loan.amount;

        kcbLoan.status =

            loan.status;

        /* -------------------------
           CREDIT ACCOUNT
        ------------------------- */

        kcbAccount.balance += amount;

        updateKCBBalance();

        updateLoanDashboard();

        /* -------------------------
           TRANSACTION
        ------------------------- */

        const transaction = createTransaction({

            bank: "KCB",

            service: "LOAN",

            sender: "KCB",

            recipient:

                kcbAccount.accountNumber,

            amount,

            fee: kcbLoan.interest,

            total:

                kcbLoan.totalRepayment,

            balance:

                kcbAccount.balance

        });

        saveBankTransaction(

            transaction

        );

        addStatement(

            transaction

        );

        generateReceipt(

            transaction

        );

        addBankNotification(

            "Loan Approved",

            `${formatMoney(amount)} has been credited to your account.`

        );

        loadKCBRecentTransactions();

        /* -------------------------
           RESET FORM
        ------------------------- */

        document.getElementById(

            "loanAmount"

        ).value = "";

        document.getElementById(

            "loanPIN"

        ).value = "";

        document.getElementById(

            "loanMonths"

        ).selectedIndex = 0;

        if (purposeField) {

            purposeField.value = "";

        }

        renderLoanHistory();

        showScreen("kcbReceipt");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}
/* ==========================================
   REPAY LOAN
========================================== */

async function repayLoan() {

    if (!kcbLoan.active) {

        alert("You do not have an active loan.");

        return;

    }

    const amount = Number(

        document.getElementById(

            "loanRepaymentAmount"

        ).value

    );

    const pin =

        document.getElementById(

            "loanRepaymentPIN"

        ).value;

    if (amount <= 0) {

        alert("Enter a valid repayment amount.");

        return;

    }

    const verify = verifyPIN(pin);

    if (!verify.success) {

        alert(verify.message);

        return;

    }

    if (amount > kcbAccount.balance) {

        alert("Insufficient account balance.");

        return;

    }

    try {

        await apiPut(

            LOAN_API +

            "/repay/" +

            kcbLoan.id,

            {

                amount

            }

        );

        /* -------------------------
           UPDATE LOCAL DATA
        ------------------------- */

        kcbAccount.balance -= amount;

        kcbLoan.balance -= amount;

        if (kcbLoan.balance <= 0) {

            kcbLoan.balance = 0;

            kcbLoan.active = false;

            kcbLoan.status = "COMPLETED";

        }

        updateKCBBalance();

        updateLoanDashboard();

        /* -------------------------
           CREATE TRANSACTION
        ------------------------- */

        const transaction = createTransaction({

            bank: "KCB",

            service: "LOAN REPAYMENT",

            sender:

                kcbAccount.accountNumber,

            recipient: "KCB Loan",

            amount,

            fee: 0,

            total: amount,

            balance:

                kcbAccount.balance

        });

        saveBankTransaction(

            transaction

        );

        addStatement(

            transaction

        );

        generateReceipt(

            transaction

        );

        addBankNotification(

            "Loan Repayment",

            `${formatMoney(amount)} loan repayment received.`

        );

        loadKCBRecentTransactions();

        document.getElementById(

            "loanRepaymentAmount"

        ).value = "";

        document.getElementById(

            "loanRepaymentPIN"

        ).value = "";

        await loadLoanHistory();

        showScreen("kcbReceipt");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================
   LOAN HISTORY
========================================== */

function renderLoanHistory() {

    const container =

        document.getElementById(

            "loanHistory"

        );

    if (!container) return;

    if (

        loanHistory.length === 0

    ) {

        container.innerHTML =

            "<p>No loan history available.</p>";

        return;

    }

    container.innerHTML =

        loanHistory.map(

            loan =>

                `

            <div class="history-card">

                <h3>

                    ${loan.loanType}

                </h3>

                <p>

                    Amount:

                    ${formatMoney(loan.amount)}

                </p>

                <p>

                    Balance:

                    ${formatMoney(loan.balance)}

                </p>

                <p>

                    Monthly:

                    ${formatMoney(loan.monthlyPayment)}

                </p>

                <p>

                    Status:

                    ${loan.status}

                </p>

                <p>

                    Duration:

                    ${loan.duration} Month(s)

                </p>

            </div>

            `

        ).join("");

}

/* ==========================================
   REFRESH DASHBOARD
========================================== */

async function refreshLoanDashboard() {

    await loadLoanHistory();

    updateLoanDashboard();

}

/* ==========================================
   ACTIVE LOAN
========================================== */

function hasActiveLoan() {

    return kcbLoan.active;

}
/* ==========================================
   UPDATE LOAN LIMIT
========================================== */

function updateLoanLimit(newLimit) {

    kcbLoan.limit = Number(newLimit) || 0;

    const limit = document.getElementById("loanLimit");

    if (limit) {

        limit.textContent = formatMoney(kcbLoan.limit);

    }

}

/* ==========================================
   RESET LOAN FORM
========================================== */

function resetLoanForm() {

    const amount = document.getElementById("loanAmount");

    const months = document.getElementById("loanMonths");

    const pin = document.getElementById("loanPIN");

    const purpose = document.getElementById("loanPurpose");

    if (amount) amount.value = "";

    if (months) months.selectedIndex = 0;

    if (pin) pin.value = "";

    if (purpose) purpose.value = "";

}

/* ==========================================
   CLEAR REPAYMENT FORM
========================================== */

function resetRepaymentForm() {

    const amount = document.getElementById("loanRepaymentAmount");

    const pin = document.getElementById("loanRepaymentPIN");

    if (amount) amount.value = "";

    if (pin) pin.value = "";

}

/* ==========================================
   GET ACTIVE LOAN
========================================== */

function getActiveLoan() {

    return kcbLoan.active ? kcbLoan : null;

}

/* ==========================================
   EXPORTS
========================================== */

window.applyLoan = applyLoan;

window.repayLoan = repayLoan;

window.calculateLoan = calculateLoan;

window.refreshLoanDashboard = refreshLoanDashboard;

window.updateLoanLimit = updateLoanLimit;

window.getActiveLoan = getActiveLoan;

window.initializeLoans = initializeLoans;

/* ==========================================
   AUTO INITIALIZE
========================================== */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializeLoans

    );

} else {

    initializeLoans();

}

console.log("✅ KCB Loans Module Loaded");