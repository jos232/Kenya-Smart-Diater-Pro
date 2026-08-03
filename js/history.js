/* ==========================================
   HISTORY.JS
========================================== */

"use strict";

/* ==========================================
   DATA
========================================== */

let callHistory = [];

let currentFilter = "all";

/* ==========================================
   LOAD HISTORY
========================================== */

function loadHistory() {

    callHistory = JSON.parse(
        localStorage.getItem("callHistory")
    ) || [];

    renderHistory(callHistory);

}
/* ==========================================
   FORMAT HISTORY DATE
========================================== */

function getHistoryGroup(dateString) {

    const callDate = new Date(dateString);

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (callDate.toDateString() === today.toDateString()) {

        return "TODAY";

    }

    if (callDate.toDateString() === yesterday.toDateString()) {

        return "YESTERDAY";

    }

    return callDate.toLocaleDateString("en-GB", {

        weekday: "long",

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}
/* ==========================================
   RENDER HISTORY
========================================== */

function renderHistory(history = callHistory) {

    const container = document.getElementById("historyList");

    if (!container) return;

    if (history.length === 0) {

        container.innerHTML = `

            <div class="empty-history">

                <h3>No Call History</h3>

                <p>Your recent calls will appear here.</p>

            </div>

        `;

        return;

    }

    container.innerHTML = "";

    let currentGroup = "";

    history.forEach((call, index) => {

        const group = getHistoryGroup(call.date);

        if (group !== currentGroup) {

            currentGroup = group;

            container.innerHTML += `

            <div class="history-group">

                ${group}

            </div>

        `;

        }

        const avatar = call.name
            ? call.name.charAt(0).toUpperCase()
            : "?";

        container.innerHTML += `

        <div class="history-card">

            <div class="history-left">

                <div class="history-avatar">

                    ${avatar}

                </div>

                <div class="history-info">

                    <h4>${call.name || "Unknown Caller"}</h4>

                    <p>${call.number}</p>

                    <small>${call.network || "Unknown Network"}</small>

                </div>

            </div>

            <div class="history-right">

                <span class="history-type ${call.type.toLowerCase()}">

                    ${call.type}

                </span>

                 <small class="history-date">

                 ${call.date} • ${call.time}

                </small>

                <div class="history-buttons">

                    <button
                        class="history-call"
                        title="Call Again"
                        onclick="callFromHistory('${call.number}')">

                        📞

                    </button>

                    <button
                        class="history-delete"
                        title="Delete Call"
                        onclick="deleteHistoryItem(${index})">

                        🗑️

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}
/* ==========================================
   FILTER HISTORY
========================================== */

function filterHistory(type, button) {

    currentFilter = type;

    // Highlight active button
    document.querySelectorAll(".history-filter").forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

    let filtered = [...callHistory];

    switch (type) {

        case "incoming":

            filtered = filtered.filter(call =>
                call.type &&
                call.type.toLowerCase() === "incoming"
            );

            break;

        case "outgoing":

            filtered = filtered.filter(call =>
                call.type &&
                call.type.toLowerCase() === "outgoing"
            );

            break;

        case "missed":

            filtered = filtered.filter(call =>
                call.type &&
                call.type.toLowerCase() === "missed"
            );

            break;

        default:

            filtered = callHistory;

    }

    renderHistory(filtered);

}
/* ==========================================
   SEARCH HISTORY
========================================== */

function searchHistory(keyword) {

    keyword = keyword.toLowerCase().trim();

    let filtered = [...callHistory];

    // Apply current filter first

    if (currentFilter !== "all") {

        filtered = filtered.filter(call =>
            call.type &&
            call.type.toLowerCase() === currentFilter
        );

    }

    filtered = filtered.filter(call =>

        (call.name || "")
            .toLowerCase()
            .includes(keyword)

        ||

        (call.number || "")
            .includes(keyword)

    );

    renderHistory(filtered);

}

/* ==========================================
   REFRESH HISTORY
========================================== */

function refreshHistory() {

    loadHistory();

    showToast("History refreshed");

}
/* ==========================================
   DELETE SINGLE CALL
========================================== */

function deleteHistoryItem(index) {

    if (!confirm("Delete this call record?")) return;

    callHistory.splice(index, 1);

    localStorage.setItem(
        "callHistory",
        JSON.stringify(callHistory)
    );

    loadHistory();

}

/* ==========================================
   CLEAR HISTORY
========================================== */

function clearHistory() {

    if (!confirm("Clear entire call history?")) return;



    callHistory = [];

    loadHistory();

}
/* ==========================================
   DELETE HISTORY ITEM
========================================== */

function deleteHistoryItem(index) {

    if (!confirm("Delete this call record?"))
        return;

    callHistory.splice(index, 1);

    localStorage.setItem(

        "callHistory",

        JSON.stringify(callHistory)

    );

    loadHistory();

    showToast("Call removed from history");

}
/* ==========================================
   CALL FROM HISTORY
========================================== */

function callFromHistory(number) {

    // Open Dialer screen
    showScreen("dialer");

    // Fill the phone number
    const input = document.getElementById("phoneNumber");

    if (input) {

        input.value = number;

    }

    // Detect network and contact
    if (typeof updateNetwork === "function") {

        updateNetwork();

    }

    if (typeof updateContactPreview === "function") {

        updateContactPreview();

    }

    // Start the call
    if (typeof startCall === "function") {

        startCall();

    }

}