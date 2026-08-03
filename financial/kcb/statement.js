/* ==========================================
   KCB STATEMENTS
========================================== */

"use strict";

/* ==========================
   OPEN STATEMENT
========================== */

function openStatement() {

    loadStatement();

    showScreen("kcbStatement");

}

/* ==========================
   LOAD STATEMENT
========================== */

function loadStatement() {

    const container =
        document.getElementById("statementList");

    if (!container) return;

    const transactions =
        getBankStatements("KCB");

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

                📄

            </div>

            <h3>No Transactions</h3>

            <p>

                Your banking activity will appear here.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    transactions.forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div>

                <strong>${item.service}</strong>

                <small>${item.date}</small>

            </div>

            <div>

                ${formatMoney(item.amount)}

            </div>

        </div>

        `;

    });

}

/* ==========================
   DOWNLOAD STATEMENT
========================== */

function downloadStatement() {

    const transactions =
        getBankStatements("KCB");

    let text =
        "KCB MINI STATEMENT\n\n";

    transactions.forEach(item => {

        text +=

            item.date +

            " | " +

            item.service +

            " | " +

            formatMoney(item.amount) +

            "\n";

    });

    const blob =
        new Blob([text], { type: "text/plain" });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "KCB_Statement.txt";

    link.click();

}
/* ==========================================
   SEARCH STATEMENTS
========================================== */

function searchStatement() {

    const keyword = prompt("Search Transaction");

    if (!keyword) return;

    const transactions = getBankStatements("KCB");

    const results = transactions.filter(item =>
        item.service.toLowerCase().includes(keyword.toLowerCase())
    );

    if (results.length === 0) {

        alert("No matching transactions found.");

        return;

    }

    let output = "Search Results\n\n";

    results.forEach(item => {

        output +=
            item.date +
            " | " +
            item.service +
            " | " +
            formatMoney(item.amount) +
            "\n";

    });

    alert(output);

}

/* ==========================================
   MINI STATEMENT
========================================== */

function miniStatement() {

    const transactions =
        getBankStatements("KCB").slice(0, 5);

    let output = "LAST 5 TRANSACTIONS\n\n";

    transactions.forEach(item => {

        output +=
            item.date +
            "\n" +
            item.service +
            "\n" +
            formatMoney(item.amount) +
            "\n\n";

    });

    alert(output);

}

/* ==========================================
   EMAIL STATEMENT
========================================== */

function emailStatement() {

    const email =
        prompt("Enter Email Address");

    if (!email) return;

    addBankNotification(

        "Statement Sent",

        "Your KCB statement has been emailed."

    );

    alert("Statement sent successfully.");

}

/* ==========================================
   PRINT STATEMENT
========================================== */

function printStatement() {

    window.print();

}

/* ==========================================
   MONTHLY SUMMARY
========================================== */

function monthlySummary() {

    const transactions =
        getBankStatements("KCB");

    let income = 0;
    let expenses = 0;

    transactions.forEach(item => {

        if (item.amount >= 0)
            income += item.amount;
        else
            expenses += Math.abs(item.amount);

    });

    alert(

        "MONTHLY SUMMARY\n\n" +

        "Income\n" +
        formatMoney(income) +

        "\n\nExpenses\n" +
        formatMoney(expenses) +

        "\n\nNet\n" +
        formatMoney(income - expenses)

    );

}

/* ==========================================
   EXPORT PDF
========================================== */

function exportStatementPDF() {

    alert("PDF Export Coming Soon.");

}
/* ==========================================
   EXPORTS
========================================== */

window.openStatement = openStatement;

window.loadStatement = loadStatement;

window.downloadStatement = downloadStatement;