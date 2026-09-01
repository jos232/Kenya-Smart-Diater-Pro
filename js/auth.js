"use strict";

/* ==========================================
   AUTH API
========================================== */

const AUTH_API =
    API.BASE_URL + API.ENDPOINTS.auth;


/* ==========================================
   ELEMENTS
========================================== */

const loginScreen =
    document.getElementById("loginScreen");

const appContainer =
    document.getElementById("appContainer");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const registerScreen =
    document.getElementById("registerScreen");

const registerBtn =
    document.getElementById("registerBtn");

const registerMessage =
    document.getElementById("registerMessage");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const backToLoginBtn =
    document.getElementById("backToLoginBtn");


/* ==========================================
   SHOW REGISTER
========================================== */

showRegisterBtn.addEventListener(
    "click",
    () => {

        loginScreen.style.display = "none";

        registerScreen.style.display =
            "flex";

    }
);


/* ==========================================
   BACK TO LOGIN
========================================== */

backToLoginBtn.addEventListener(
    "click",
    () => {

        registerScreen.style.display =
            "none";

        loginScreen.style.display =
            "flex";

    }
);


/* ==========================================
   SHOW APP
========================================== */

function showApp() {

    loginScreen.style.display =
        "none";

    registerScreen.style.display =
        "none";

    appContainer.style.display =
        "block";

}


/* ==========================================
   SHOW LOGIN
========================================== */

function showLogin() {

    loginScreen.style.display =
        "flex";

    registerScreen.style.display =
        "none";

    appContainer.style.display =
        "none";

}

/* ==========================================
   LOAD CURRENT USER NAME
========================================== */

async function loadCurrentUser() {

    try {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return;
        }

        const response =
            await fetch(
                `${AUTH_API}/profile`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            console.error(
                "Unable to load user profile:",
                data.message
            );

            return;
        }

        const fullName =
            data.user.fullName || "User";


        /* ==============================
           UPDATE BANNER NAME
        ============================== */

        const bannerName =
            document.getElementById(
                "bannerName"
            );

        if (bannerName) {
            bannerName.textContent =
                fullName;
        }


        /* ==============================
           UPDATE WELCOME NAME
        ============================== */

        const welcomeName =
            document.getElementById(
                "welcomeName"
            );

        if (welcomeName) {
            welcomeName.textContent =
                fullName;
        }


        /* ==============================
           SAVE USER PROFILE
           FOR OTHER UI COMPONENTS
        ============================== */

        localStorage.setItem(
            "authUser",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
            "userPhone",
            data.user.phone
        );

        console.log(
            "User profile loaded:",
            fullName
        );

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* ==========================================
   LOAD USER FINANCIAL DATA
========================================== */

async function loadUserFinancialData() {

    try {

        console.log(
            "Loading user's financial profile..."
        );


        /*
           financial.js already contains
           initializeFinancialData().
        */

        if (
            typeof initializeFinancialData ===
            "function"
        ) {

            await initializeFinancialData();

            console.log(
                " User financial data loaded."
            );

        } else {

            console.warn(
                "initializeFinancialData() is not available yet."
            );

        }

    }

    catch (error) {

        console.error(
            "Financial data loading error:",
            error
        );

    }

}


/* ==========================================
   RESTORE SESSION
========================================== */

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        const token =
            localStorage.getItem("token");


        if (token) {

            showApp();

            /*
               Give the application a moment
               to finish loading its scripts.
            */

            setTimeout(
                async () => {

                    await loadCurrentUser();

                    await loadUserFinancialData();

                },
                300
            );

        } else {

            showLogin();

        }

    }
);


/* ==========================================
   LOGIN
========================================== */

loginBtn.addEventListener(
    "click",
    async () => {

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        loginMessage.textContent = "";


        if (!email || !password) {

            loginMessage.textContent =
                "Email and password are required.";

            return;

        }


        try {

            const response =
                await fetch(
                    `${AUTH_API}/login`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email,

                                password

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                loginMessage.textContent =
                    data.message ||
                    "Login failed.";

                return;

            }


            /*
               Save authentication token
            */

            localStorage.setItem(
                "token",
                data.token
            );


            /*
               Open application
            */

            showApp();

            await loadCurrentUser();

            await loadUserFinancialData();


        }

        catch (err) {

            console.error(
                "Login error:",
                err
            );

            loginMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);


/* ==========================================
   REGISTER
========================================== */

registerBtn.addEventListener(
    "click",
    async () => {

        const fullName =
            document
                .getElementById("registerName")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();


        const phone =
            document
                .getElementById("registerPhone")
                .value
                .trim();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        registerMessage.textContent = "";


        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            registerMessage.textContent =
                "All fields are required.";

            return;

        }


        try {

            const response =
                await fetch(
                    `${AUTH_API}/register`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                fullName,

                                email,

                                phone,

                                password

                            })

                    }
                );


            const data =
                await response.json();


            registerMessage.textContent =
                data.message ||
                "";


            if (data.success) {

                /*
                   Save the new user's token
                */

                localStorage.setItem(
                    "token",
                    data.token
                );


                /*
                   Open the application
                */

                showApp();

                await loadCurrentUser();

                await loadUserFinancialData();

            }

        }

        catch (err) {

            console.error(
                "Registration error:",
                err
            );

            registerMessage.textContent =
                "Server unavailable.";

        }

    }
);


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.showApp =
    showApp;

window.showLogin =
    showLogin;

window.loadUserFinancialData =
    loadUserFinancialData;