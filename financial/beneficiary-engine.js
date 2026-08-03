/* ==========================================
   KENYA SMART DIALER
   BENEFICIARY ENGINE
========================================== */

"use strict";

/* ==========================
   STORAGE KEY
========================== */

const BENEFICIARY_KEY = "KSD_BANK_BENEFICIARIES";

/* ==========================
   GET BENEFICIARIES
========================== */

function getBeneficiaries() {

    const data =
        localStorage.getItem(BENEFICIARY_KEY);

    return data
        ? JSON.parse(data)
        : [];

}

/* ==========================
   SAVE BENEFICIARIES
========================== */

function saveBeneficiaries(list) {

    localStorage.setItem(

        BENEFICIARY_KEY,

        JSON.stringify(list)

    );

}

/* ==========================
   ADD BENEFICIARY
========================== */

function addBeneficiary(bank, name, account) {

    const list = getBeneficiaries();

    const exists = list.find(item =>

        item.bank === bank &&

        item.account === account

    );

    if (exists) return;

    list.unshift({

        id: Date.now(),

        bank,

        name,

        account

    });

    saveBeneficiaries(list);

}

/* ==========================
   DELETE BENEFICIARY
========================== */

function deleteBeneficiary(id) {

    const list = getBeneficiaries()

        .filter(item => item.id !== id);

    saveBeneficiaries(list);

}

/* ==========================
   GET BANK BENEFICIARIES
========================== */

function getBankBeneficiaries(bank) {

    return getBeneficiaries()

        .filter(item => item.bank === bank);

}