/* ==========================================
   KENYA SMART DIALER PRO
   API HELPER
========================================== */

"use strict";

/* ==========================================
   API CONFIGURATION
========================================== */

/*
   IMPORTANT:
   Use a relative path because the frontend
   and backend are served by the same Render
   application.

   Local:
   http://localhost:3000/api

   Render:
   https://your-render-domain.onrender.com/api

   "/api" works correctly in BOTH environments.
*/
const API_BASE = "https://kenya-smart-diater-pro.onrender.com/api";

const API_BASE = "/api";

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


/* ==========================================
   RESPONSE HANDLER
========================================== */

async function parseResponse(response) {

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {

        data = await response.json();

    } else {

        const text = await response.text();

        data = {
            success: false,
            message: text || "Server returned an invalid response."
        };

    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            `Request failed with status ${response.status}.`
        );

    }

    return data;

}


/* ==========================================
   GET
========================================== */

async function apiGet(endpoint) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    console.log("API GET:", url);

    const response = await fetch(url, {

        method: "GET",

        headers: getHeaders()

    });

    return await parseResponse(response);

}


/* ==========================================
   POST
========================================== */

async function apiPost(endpoint, body = {}) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    console.log("API POST:", url);
    console.log("API POST BODY:", body);

    const response = await fetch(url, {

        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify(body)

    });

    return await parseResponse(response);

}


/* ==========================================
   PUT
========================================== */

async function apiPut(endpoint, body = {}) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    console.log("API PUT:", url);
    console.log("API PUT BODY:", body);

    const response = await fetch(url, {

        method: "PUT",

        headers: getHeaders(),

        body: JSON.stringify(body)

    });

    return await parseResponse(response);

}


/* ==========================================
   DELETE
========================================== */

async function apiDelete(endpoint) {

    const url = endpoint.startsWith("http")
        ? endpoint
        : API_BASE + endpoint;

    console.log("API DELETE:", url);

    const response = await fetch(url, {

        method: "DELETE",

        headers: getHeaders()

    });

    return await parseResponse(response);

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
console.log("🌐 API BASE:", API_BASE);