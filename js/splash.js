/* ==========================================
   SPLASH SCREEN
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const splash = document.getElementById("splashScreen");
    const app = document.querySelector(".phone");

    if (!splash || !app) return;

    // Show splash first
    app.style.display = "none";

    setTimeout(() => {

        splash.classList.add("hide");

        setTimeout(() => {

            splash.style.display = "none";
            app.style.display = "block";

        }, 600);

    }, 2500);

});