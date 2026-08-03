/* ==========================================
   KENYA SMART DIALER PRO
   contacts.js
========================================== */

"use strict";

console.log("✅ Contacts Module Loaded");

/* ==========================================
   CONFIGURATION
========================================== */



let contacts = [];
let selectedContact = null;

/* ==========================================
   LOAD CONTACTS
========================================== */

async function loadContacts() {

    if (!CONTACT_API) {

        contacts = JSON.parse(
            localStorage.getItem("contacts")
        ) || [];

        renderContacts();

        return;

    }

    try {

        const result = await apiGet("/contacts");

        contacts = result.contacts || result;

        renderContacts();

    }

    catch (error) {

        console.error("Load Contacts:", error);

        contacts = [];

        renderContacts();

    }

}
/* ==========================================
   RENDER CONTACTS
========================================== */

function renderContacts(list = contacts) {

    const container = document.getElementById("contactsList");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">👥</div>

            <h3>No Contacts</h3>

            <p>Add your first contact.</p>

        </div>

        `;

        return;

    }

    list
        .sort((a, b) => {

            if (a.favorite === b.favorite) {

                return a.name.localeCompare(b.name);

            }

            return a.favorite ? -1 : 1;

        })

        .forEach(contact => {

            const initials = contact.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

            const avatar = contact.photo

                ? `<img src="${contact.photo}" class="contact-photo">`

                : `<div class="contact-avatar">${initials}</div>`;

            container.innerHTML += `

            <div class="contact-card"
                 onclick="openContactDetails('${contact._id}')">

                ${avatar}

                <div class="contact-info">

                    <div class="contact-name">

                        ${contact.name}

                    </div>

                    <div class="contact-phone">

                        ${contact.phone}

                    </div>

                    <div class="contact-network">

                        ${contact.network || "Unknown"}

                    </div>

                </div>

                <div class="contact-actions">

                    <button
                        onclick="event.stopPropagation();toggleFavorite('${contact._id}')">

                        ${contact.favorite ? "⭐" : "☆"}

                    </button>

                    <button
                        onclick="event.stopPropagation();callContact('${contact._id}')">

                        📞

                    </button>

                    <button
                        onclick="event.stopPropagation();toggleContactMenu('${contact._id}')">

                        ⋮

                    </button>

                </div>

                <div
                    class="contact-menu"
                    id="menu-${contact._id}">

                    <button onclick="editContact('${contact._id}')">

                        ✏ Edit

                    </button>

                    <button onclick="deleteContact('${contact._id}')">

                        🗑 Delete

                    </button>

                </div>

            </div>

            `;

        });

}

/* ==========================================
   SEARCH CONTACTS
========================================== */

function searchContacts(query) {

    if (query === undefined) {

        const input = document.getElementById("contactSearch");

        query = input ? input.value : "";

    }

    query = query.toLowerCase().trim();

    if (!query) {

        renderContacts();

        return;

    }

    const filtered = contacts.filter(contact =>

        (contact.name || "").toLowerCase().includes(query) ||

        (contact.phone || "").includes(query) ||

        (contact.network || "").toLowerCase().includes(query)

    );

    renderContacts(filtered);

}

/* ==========================================
   ADD CONTACT
========================================== */

async function addContact() {

    const nameInput = document.getElementById("contactName");
    const phoneInput = document.getElementById("contactPhone");
    const photoInput = document.getElementById("contactPhoto");

    const name = nameInput.value.trim();
    const phone = normalizeNumber(phoneInput.value.trim());

    if (!name) {

        alert("Enter contact name.");
        return;

    }

    if (!isValidKenyanNumber(phone)) {

        alert("Enter a valid Kenyan phone number.");
        return;

    }

    let photo = "";

    if (photoInput && photoInput.files.length > 0) {

        photo = await new Promise(resolve => {

            const reader = new FileReader();

            reader.onload = e => resolve(e.target.result);

            reader.readAsDataURL(photoInput.files[0]);

        });

    }

    try {

        await apiPost("/contacts", {

            name,
            phone,
            network: detectNetworkName(phone),
            favorite: false,
            photo

        });

        await loadContacts();

        nameInput.value = "";
        phoneInput.value = "";

        if (photoInput) {
            photoInput.value = "";
        }

        showToast("✅ Contact Added");

    }

    catch (error) {

        console.error(error);

        alert(error.message || "Unable to save contact.");

    }

    /* ==========================================
       EDIT CONTACT
    ========================================== */

    async function editContact(id) {

        const contact = contacts.find(c => c._id === id);

        if (!contact) return;

        const newName = prompt("Edit Name", contact.name);

        if (newName === null) return;

        const newPhone = prompt("Edit Phone", contact.phone);

        if (newPhone === null) return;

        const phone = normalizeNumber(newPhone);

        if (!isValidKenyanNumber(phone)) {

            alert("Invalid phone number.");

            return;

        }
        try {

            await apiPut("/contacts/" + id, {

                name: newName.trim(),
                phone,
                network: detectNetworkName(phone)

            });

            await loadContacts();

            showToast("✏ Contact Updated");

        }

        catch (error) {

            console.error(error);

            alert(error.message || "Unable to update contact.");

        }

    }
    /* ==========================================
   DELETE CONTACT
========================================== */

    async function deleteContact(id) {

        if (!confirm("Delete this contact?")) {
            return;
        }

        try {

            await apiDelete("/contacts/" + id);

            await loadContacts();

            showToast("🗑 Contact Deleted");

        }

        catch (error) {

            console.error(error);

            alert(error.message || "Unable to delete contact.");

        }

    }
    /* ==========================================
   TOGGLE FAVORITE
========================================== */

    async function toggleFavorite(id) {

        const contact = contacts.find(c => c._id === id);

        if (!contact) return;

        try {

            await apiPut("/contacts/" + id, {

                favorite: !contact.favorite

            });

            await loadContacts();

            showToast("⭐ Favorite Updated");

        }

        catch (error) {

            console.error(error);

            alert(error.message || "Unable to update favorite.");

        }

    }

    /* ==========================================
       CALL CONTACT
    ========================================== */

    function callContact(id) {

        const contact = contacts.find(c => c._id === id);

        if (!contact) return;

        const input = document.getElementById("phoneNumber");

        if (input) {

            input.value = contact.phone;

        }

        if (typeof detectNetwork === "function") {

            detectNetwork();

        }

        showScreen("dialer");

    }
    /* ==========================================
       CONTACT DETAILS
    ========================================== */

    function openContactDetails(id) {

        const contact = contacts.find(c => c._id === id);

        if (!contact) return;

        selectedContact = contact;

        const avatar = document.getElementById("detailAvatar");

        if (avatar) {

            if (contact.photo) {

                avatar.innerHTML = `<img src="${contact.photo}" class="contact-photo-large">`;

            } else {

                avatar.textContent = contact.name
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

            }

        }

        document.getElementById("detailName").textContent =
            contact.name;

        document.getElementById("detailNumber").textContent =
            contact.phone;

        document.getElementById("detailNetwork").textContent =
            contact.network;

        showScreen("contactDetails");

    }

    /* ==========================================
       DETAILS ACTIONS
    ========================================== */

    function callDetailContact() {

        if (!selectedContact) return;

        const input = document.getElementById("phoneNumber");

        if (input) {

            input.value = selectedContact.phone;

        }

        showScreen("dialer");

        if (typeof detectNetwork === "function") {

            detectNetwork();

        }

    }

    function smsDetailContact() {

        if (!selectedContact) return;

        showToast("SMS feature coming soon.");

    }

    function editDetailContact() {

        if (!selectedContact) return;

        editContact(selectedContact._id);

    }

    function deleteDetailContact() {

        if (!selectedContact) return;

        deleteContact(selectedContact._id);

        showScreen("contacts");

    }

    function toggleFavoriteDetail() {

        if (!selectedContact) return;

        toggleFavorite(selectedContact._id);

    }

    /* ==========================================
       DIALER LIVE SEARCH
    ========================================== */

    function searchDialerContact() {

        const input = document.getElementById("phoneNumber");

        const preview = document.getElementById("contactPreview");

        if (!input || !preview) return;

        const number = input.value.replace(/\s+/g, "");

        if (number.length < 3) {

            preview.style.display = "none";

            return;

        }

        const contact = contacts.find(c => {

            return (c.phone || "").replace(/\s+/g, "")
                .startsWith(number);

        });

        if (!contact) {

            preview.style.display = "none";

            return;

        }

        preview.style.display = "flex";

        document.getElementById("contactPreviewName").textContent =
            contact.name;

        document.getElementById("contactPreviewNetwork").textContent =
            contact.network;

    }

    /* ==========================================
       CONTACT MENU
    ========================================== */

    function toggleContactMenu(id) {

        document.querySelectorAll(".contact-menu")

            .forEach(menu => {

                if (menu.id !== `menu-${id}`) {

                    menu.style.display = "none";

                }

            });

        const menu = document.getElementById(`menu-${id}`);

        if (!menu) return;

        menu.style.display =
            menu.style.display === "flex"
                ? "none"
                : "flex";

    }

    /* ==========================================
       CLOSE MENUS
    ========================================== */

    document.addEventListener("click", () => {

        document.querySelectorAll(".contact-menu")

            .forEach(menu => {

                menu.style.display = "none";

            });

    });

    /* ==========================================
       INITIALIZE
    ========================================== */

    document.addEventListener("DOMContentLoaded", () => {

        loadContacts();

    });
}