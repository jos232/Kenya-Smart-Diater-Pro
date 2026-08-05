/* ==========================================
   KENYA SMART DIALER PRO
   API HELPER
========================================== */

"use strict";

/* ==========================================
   API CONFIGURATION
========================================== */

const API_BASE = "http://localhost:3000/api";

const CONTACT_API = API_BASE + "/contacts";
const AIRTIME_API = API_BASE + "/airtime";
const BUNDLE_API = API_BASE + "/bundles";
const VOICE_API = API_BASE + "/voice";
const SMS_API = API_BASE + "/sms";
const FINANCIAL_API = API_BASE + "/financial";


/* ==========================================
   TOKEN
========================================== */

function getToken() {
    return localStorage.getItem("token") || "";
}

/* ==========================================
   COMMON HEADERS
========================================== */

function getHeaders() {

    const headers = {
        "Content-Type": "application/json"
    };

    const token = getToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

async function apiGet(endpoint) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "GET request failed.");
    }

    return data;
}

/* ==========================================
   POST
========================================== */

async function apiPost(endpoint, body = {}) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "POST request failed.");
    }

    return data;
}

/* ==========================================
   PUT
========================================== */

async function apiPut(endpoint, body = {}) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    const response = await fetch(url, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "PUT request failed.");
    }

    return data;
}

/* ==========================================
   DELETE
========================================== */

async function apiDelete(endpoint) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    const response = await fetch(url, {
        method: "DELETE",
        headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "DELETE request failed.");
    }

    return data;
}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.API_BASE = API_BASE;

window.CONTACT_API = CONTACT_API;
window.AIRTIME_API = AIRTIME_API;
window.BUNDLE_API = BUNDLE_API;
window.VOICE_API = VOICE_API;
window.SMS_API = SMS_API;
window.FINANCIAL_API = FINANCIAL_API;


window.apiGet = apiGet;
window.apiPost = apiPost;
window.apiPut = apiPut;
window.apiDelete = apiDelete;
window.getToken = getToken;

console.log("✅ API Helper Loaded");