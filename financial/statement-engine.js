/* ==========================================
   KENYA SMART DIALER
   STATEMENT ENGINE
========================================== */

"use strict";

/* ==========================
   STORAGE KEY
========================== */

const STATEMENT_KEY = "KSD_BANK_STATEMENTS";

/* ==========================
   LOAD STATEMENTS
========================== */

function getStatements() {

    const data =
        localStorage.getItem(STATEMENT_KEY);

    return data
        ? JSON.parse(data)
        : [];

}

/* ==========================
   SAVE STATEMENTS
========================== */

function saveStatements(statements) {

    localStorage.setItem(

        STATEMENT_KEY,

        JSON.stringify(statements)

    );

}

/* ==========================
   ADD STATEMENT
========================== */

function addStatement(transaction) {

    const statements =
        getStatements();

    statements.unshift(transaction);

    saveStatements(statements);

}

/* ==========================
   GET BANK STATEMENTS
========================== */

function getBankStatements(bank) {

    return getStatements().filter(

        item => item.bank === bank

    );

}

/* ==========================
   SEARCH STATEMENTS
========================== */

function searchStatements(keyword) {

    keyword =
        keyword.toLowerCase();

    return getStatements().filter(item =>

        item.recipient.toLowerCase().includes(keyword)

        ||

        item.service.toLowerCase().includes(keyword)

        ||

        item.reference.toLowerCase().includes(keyword)

    );

}

/* ==========================
   DELETE ALL
========================== */

function clearStatements() {

    localStorage.removeItem(

        STATEMENT_KEY

    );

}