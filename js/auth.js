"use strict";

const API = "http://localhost:3000/api/auth";

const loginScreen = document.getElementById("loginScreen");
const appContainer = document.getElementById("appContainer");

const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const registerScreen = document.getElementById("registerScreen");

const registerBtn = document.getElementById("registerBtn");

const registerMessage = document.getElementById("registerMessage");

const showRegisterBtn = document.getElementById("showRegisterBtn");

const backToLoginBtn = document.getElementById("backToLoginBtn");

showRegisterBtn.addEventListener("click", () => {

    loginScreen.style.display = "none";
    registerScreen.style.display = "flex";

});

backToLoginBtn.addEventListener("click", () => {

    registerScreen.style.display = "none";
    loginScreen.style.display = "flex";

});

function showApp() {
    loginScreen.style.display = "none";
    appContainer.style.display = "block";
}

function showLogin() {
    loginScreen.style.display = "flex";
    appContainer.style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    if (token) {
        showApp();
    } else {
        showLogin();
    }

});

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    loginMessage.textContent = "";

    try {

        const response = await fetch(`${API}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message || "Login failed.";
            return;
        }

        localStorage.setItem("token", data.token);

        showApp();

    } catch (err) {

        console.error(err);

        loginMessage.textContent = "Unable to connect to the server.";

    }

});

registerBtn.addEventListener("click", async () => {

    const fullName = document.getElementById("registerName").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const phone = document.getElementById("registerPhone").value.trim();

    const password = document.getElementById("registerPassword").value;

    registerMessage.textContent = "";

    try {

        const response = await fetch(`${API}/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                email,
                phone,
                password
            })

        });

        const data = await response.json();

        registerMessage.textContent = data.message;

        if (data.success) {

            localStorage.setItem("token", data.token);

            showApp();

        }

    } catch (err) {

        console.error(err);

        registerMessage.textContent = "Server unavailable.";

    }

});