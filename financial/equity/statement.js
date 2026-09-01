/* ==========================================
   EQUITY MOBILE BANKING
   STATEMENTS
========================================== */

"use strict";

/* ==========================
   OPEN STATEMENT
========================== */

function openEquityStatement() {

    loadEquityStatement();

    showScreen("equityStatement");

}

/* ==========================
   LOAD STATEMENT
========================== */

function loadEquityStatement() {

    const container =
        document.getElementById("equityStatementList");

    if (!container) return;

    const transactions =
        getBankStatements("EQUITY");

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">



            </div>

            <h3>No Statements Available</h3>

            <p>

                Your Equity transactions will appear here.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    transactions.forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-info">

                <strong>${item.service}</strong>

                <small>${item.date}</small>

            </div>

            <div class="transaction-amount">

                ${formatMoney(item.amount)}

            </div>

        </div>

        `;

    });

}
/* ==========================================
   DOWNLOAD STATEMENT
========================================== */

function downloadEquityStatement() {

    const transactions =
        getBankStatements("EQUITY");

    let text =
        "EQUITY BANK MINI STATEMENT\n\n";

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
        "Equity_Statement.txt";

    link.click();

}

/* ==========================================
   EMAIL STATEMENT
========================================== */

function emailEquityStatement() {

    alert(

        "Statement has been sent to your registered email."

    );

    addBankNotification(

        "Statement Sent",

        "Your Equity statement has been emailed successfully."

    );

}

/* ==========================================
   FILTER STATEMENTS
========================================== */

function filterEquityStatement(service) {

    const transactions =

        getBankStatements("EQUITY")

            .filter(item =>

                service === "ALL"

                    ? true

                    : item.service === service

            );

    const container =
        document.getElementById("equityStatementList");

    if (!container) return;

    container.innerHTML = "";

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon"></div>

            <h3>No Matching Transactions</h3>

        </div>

        `;

        return;

    }

    transactions.forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-info">

                <strong>${item.service}</strong>

                <small>${item.date}</small>

            </div>

            <div class="transaction-amount">

                ${formatMoney(item.amount)}

            </div>

        </div>

        `;

    });

}

/* ==========================================
   REFRESH
========================================== */

function refreshEquityStatement() {

    loadEquityStatement();

}

/* ==========================================
   EXPORTS
========================================== */

window.downloadEquityStatement = downloadEquityStatement;
window.emailEquityStatement = emailEquityStatement;
window.filterEquityStatement = filterEquityStatement;
window.refreshEquityStatement = refreshEquityStatement;
