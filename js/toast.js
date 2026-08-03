/* ==========================================
   TOAST
========================================== */

"use strict";

function showToast(message) {

    const toast = document.getElementById("toast");
    const text = document.getElementById("toastMessage");

    if (!toast || !text) return;

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}