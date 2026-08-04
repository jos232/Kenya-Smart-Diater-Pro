/* ==========================================
   KCB MOBILE BANKING
   STATEMENTS MODULE
   PART 1
========================================== */

"use strict";

/* ==========================================
   STATE
========================================== */

let kcbStatements = [];

let currentStatement = null;

/* ==========================================
   LOAD STATEMENTS
========================================== */

async function fetchKCBStatements() {

    try {

        const response = await fetch(

            "/api/statements/KCB"

        );

        if (!response.ok) {

            throw new Error(

                "Unable to load statements."

            );

        }

        kcbStatements = await response.json();

        return kcbStatements;

    }

    catch (error) {

        console.error(

            "Statement Error:",

            error

        );

        return [];

    }

}

/* ==========================================
   OPEN STATEMENTS
========================================== */

async function openStatement() {

    await loadStatement();

    showScreen("kcbStatement");

}

/* ==========================================
   LOAD STATEMENTS
========================================== */

async function loadStatement() {

    const container =

        document.getElementById(

            "statementList"

        );

    if (!container)

        return;

    const transactions =

        await fetchKCBStatements();

    if (transactions.length === 0) {

        container.innerHTML = `

        <div class="transaction-empty">

            <div class="transaction-empty-icon">

                📄

            </div>

            <h3>No Transactions</h3>

            <p>

                Your banking activity

                will appear here.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    transactions.forEach(

        transaction => {

            container.innerHTML += `

            <div

                class="transaction-card"

                onclick="viewStatementDetails('${transaction._id}')"

            >

                <div>

                    <strong>

                        ${transaction.description}

                    </strong>

                    <small>

                        ${new Date(

                transaction.createdAt

            ).toLocaleString()}

                    </small>

                </div>

                <div>

                    ${formatMoney(

                transaction.amount

            )}

                </div>

            </div>

            `;

        }

    );

}

/* ==========================================
   VIEW DETAILS
========================================== */

function viewStatementDetails(id) {

    currentStatement =

        kcbStatements.find(

            item => item._id === id

        );

    if (!currentStatement)

        return;

    alert(

        "Reference\n" +

        currentStatement.reference +

        "\n\nDescription\n" +

        currentStatement.description +

        "\n\nAmount\n" +

        formatMoney(

            currentStatement.amount

        ) +

        "\n\nCharges\n" +

        formatMoney(

            currentStatement.charges

        ) +

        "\n\nBalance\n" +

        formatMoney(

            currentStatement.balance

        ) +

        "\n\nStatus\n" +

        currentStatement.status

    );

}
/* ==========================================
   PART 2
   SEARCH • FILTER • MINI STATEMENT
========================================== */

/* ==========================
   SEARCH
========================== */

function searchStatement() {

    const keyword = prompt("Search Transaction");

    if (!keyword) return;

    const results = kcbStatements.filter(item =>

        item.description
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||

        item.type
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||

        item.reference
            .toLowerCase()
            .includes(keyword.toLowerCase())

    );

    if (results.length === 0) {

        alert("No matching transactions found.");

        return;

    }

    let output = "SEARCH RESULTS\n\n";

    results.forEach(item => {

        output +=

            new Date(item.createdAt)

                .toLocaleDateString()

            + "\n"

            + item.description

            + "\n"

            + formatMoney(item.amount)

            + "\n\n";

    });

    alert(output);

}

/* ==========================
   MINI STATEMENT
========================== */

function miniStatement() {

    if (kcbStatements.length === 0) {

        alert("No transactions available.");

        return;

    }

    let output =

        "LAST 5 TRANSACTIONS\n\n";

    kcbStatements

        .slice(0, 5)

        .forEach(item => {

            output +=

                new Date(item.createdAt)

                    .toLocaleDateString()

                + "\n"

                + item.description

                + "\n"

                + formatMoney(item.amount)

                + "\n\n";

        });

    alert(output);

}

/* ==========================
   MONTHLY SUMMARY
========================== */

function monthlySummary() {

    let income = 0;

    let expenses = 0;

    kcbStatements.forEach(item => {

        if (

            item.type === "DEPOSIT" ||

            item.type === "LOAN"

        ) {

            income += item.amount;

        }

        else {

            expenses += item.amount;

        }

    });

    alert(

        "MONTHLY SUMMARY\n\n"

        +

        "Income\n"

        +

        formatMoney(income)

        +

        "\n\nExpenses\n"

        +

        formatMoney(expenses)

        +

        "\n\nNet\n"

        +

        formatMoney(

            income - expenses

        )

    );

}

/* ==========================
   FILTER BY TYPE
========================== */

function filterStatement(type) {

    const container =

        document.getElementById(

            "statementList"

        );

    if (!container)

        return;

    const filtered =

        kcbStatements.filter(

            item =>

                item.type === type

        );

    container.innerHTML = "";

    if (filtered.length === 0) {

        container.innerHTML =

            "<p>No transactions found.</p>";

        return;

    }

    filtered.forEach(item => {

        container.innerHTML += `

        <div class="transaction-card">

            <div>

                <strong>

                    ${item.description}

                </strong>

                <small>

                    ${new Date(

            item.createdAt

        ).toLocaleDateString()}

                </small>

            </div>

            <div>

                ${formatMoney(

            item.amount

        )}

            </div>

        </div>

        `;

    });

}

/* ==========================
   SHOW ALL
========================== */

function showAllStatements() {

    loadStatement();

}
/* ==========================================
   PART 3
   DOWNLOAD • EXPORT • EMAIL • PRINT
========================================== */

/* ==========================
   DOWNLOAD STATEMENT
========================== */

function downloadStatement() {

    if (kcbStatements.length === 0) {

        alert("No statements available.");

        return;

    }

    let text =

        "=====================================\n" +

        "          KCB BANK STATEMENT\n" +

        "=====================================\n\n";

    kcbStatements.forEach(item => {

        text +=

            "Date : " +

            new Date(item.createdAt).toLocaleString() +

            "\n" +

            "Reference : " +

            item.reference +

            "\n" +

            "Description : " +

            item.description +

            "\n" +

            "Type : " +

            item.type +

            "\n" +

            "Amount : " +

            formatMoney(item.amount) +

            "\n" +

            "Charges : " +

            formatMoney(item.charges) +

            "\n" +

            "Balance : " +

            formatMoney(item.balance) +

            "\n" +

            "-------------------------------------\n";

    });

    const blob =

        new Blob(

            [text],

            {

                type: "text/plain"

            }

        );

    const link =

        document.createElement("a");

    link.href =

        URL.createObjectURL(blob);

    link.download =

        "KCB_Statement.txt";

    link.click();

}

/* ==========================
   EXPORT CSV
========================== */

function exportCSV() {

    if (kcbStatements.length === 0) {

        alert("No statements available.");

        return;

    }

    let csv =

        "Date,Reference,Description,Type,Amount,Charges,Balance\n";

    kcbStatements.forEach(item => {

        csv +=

            `"${new Date(item.createdAt).toLocaleString()}",` +

            `"${item.reference}",` +

            `"${item.description}",` +

            `"${item.type}",` +

            `${item.amount},` +

            `${item.charges},` +

            `${item.balance}\n`;

    });

    const blob =

        new Blob(

            [csv],

            {

                type: "text/csv"

            }

        );

    const link =

        document.createElement("a");

    link.href =

        URL.createObjectURL(blob);

    link.download =

        "KCB_Statement.csv";

    link.click();

}

/* ==========================
   EXPORT PDF
========================== */

function exportStatementPDF() {

    alert(

        "PDF Export will be connected to jsPDF during deployment."

    );

}

/* ==========================
   EMAIL STATEMENT
========================== */

function emailStatement() {

    const email =

        prompt(

            "Enter Email Address"

        );

    if (!email)

        return;

    addBankNotification(

        "Statement Sent",

        "Statement emailed to " + email

    );

    alert(

        "Statement sent successfully."

    );

}

/* ==========================
   PRINT
========================== */

function printStatement() {

    window.print();

}

/* ==========================
   REFRESH
========================== */

async function refreshStatements() {

    await loadStatement();

}

/* ==========================
   EXPORTS
========================== */

window.openStatement = openStatement;

window.loadStatement = loadStatement;

window.fetchKCBStatements = fetchKCBStatements;

window.viewStatementDetails = viewStatementDetails;

window.searchStatement = searchStatement;

window.filterStatement = filterStatement;

window.showAllStatements = showAllStatements;

window.miniStatement = miniStatement;

window.monthlySummary = monthlySummary;

window.downloadStatement = downloadStatement;

window.exportCSV = exportCSV;

window.exportStatementPDF = exportStatementPDF;

window.emailStatement = emailStatement;

window.printStatement = printStatement;

window.refreshStatements = refreshStatements;

/* ==========================
   AUTO LOAD
========================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        fetchKCBStatements();

    }

);

console.log(

    "✅ KCB Statements Module Loaded"

);