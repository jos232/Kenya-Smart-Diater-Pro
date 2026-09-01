/* ==========================================
   CO-OPERATIVE BANK
   STATEMENTS
========================================== */

"use strict";

/* ==========================
   OPEN STATEMENT
========================== */

function openCoopStatement() {

    loadCoopStatement();

    showScreen("coopStatement");

}

/* ==========================
   LOAD STATEMENT
========================== */

function loadCoopStatement(filter = "ALL") {

    const container =
        document.getElementById("coopStatementList");

    if (!container) return;

    let transactions =
        getBankStatements("CO-OP");

    if (filter !== "ALL") {

        transactions = transactions.filter(

            item => item.service === filter

        );

    }

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon"></div>

            <h3>No Statements Available</h3>

            <p>Your Co-operative Bank transactions will appear here.</p>

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

                <small>${item.reference || ""}</small>

            </div>

            <div class="transaction-amount">

                ${formatMoney(item.amount)}

            </div>

        </div>

        `;

    });

}

/* ==========================
   SEARCH
========================== */

function searchCoopStatement() {

    const keyword =

        document.getElementById(

            "coopStatementSearch"

        ).value.toLowerCase();

    const cards =

        document.querySelectorAll(

            "#coopStatementList .transaction-card"

        );

    cards.forEach(card => {

        card.style.display =

            card.textContent.toLowerCase().includes(keyword)

                ? ""

                : "none";

    });

}

/* ==========================
   FILTER
========================== */

function filterCoopStatement(service) {

    loadCoopStatement(service);

}

/* ==========================
   MINI STATEMENT
========================== */

function showCoopMiniStatement() {

    const transactions =

        getBankStatements("CO-OP").slice(0, 5);

    let message =

        "Last 5 Transactions\n\n";

    transactions.forEach(item => {

        message +=

            `${item.service}\n${formatMoney(item.amount)}\n${item.date}\n\n`;

    });

    alert(message);

}

/* ==========================
   DOWNLOAD PDF
========================== */

function downloadCoopStatement() {

    alert(

        "Statement PDF download will be available after backend integration."

    );

}

/* ==========================
   EMAIL STATEMENT
========================== */

function emailCoopStatement() {

    alert(

        "Statement email service will be available after backend integration."

    );

}

/* ==========================
   EXPORTS
========================== */

window.openCoopStatement = openCoopStatement;

window.loadCoopStatement = loadCoopStatement;

window.searchCoopStatement = searchCoopStatement;

window.filterCoopStatement = filterCoopStatement;

window.showCoopMiniStatement = showCoopMiniStatement;

window.downloadCoopStatement = downloadCoopStatement;

window.emailCoopStatement = emailCoopStatement;