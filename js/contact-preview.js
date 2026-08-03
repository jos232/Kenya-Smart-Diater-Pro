/* ==========================================================
   CONTACT PREVIEW
========================================================== */

"use strict";

/* ==========================================================
   UPDATE CONTACT PREVIEW
========================================================== */

function updateContactPreview() {

    const preview = document.getElementById("contactPreview");

    if (!preview) return;

    const contacts = getContacts();

    const number = Dialer.currentNumber;

    if (!number) {

        preview.style.display = "none";

        Dialer.currentContact = null;

        return;

    }

    const contact = contacts.find(c => {

        return normalizePhone(c.phone) === normalizePhone(number);

    });

    if (!contact) {

        preview.style.display = "none";

        Dialer.currentContact = null;

        return;

    }

    Dialer.currentContact = contact;

    document.getElementById("contactName").textContent =
        contact.name;

    document.getElementById("contactNetwork").textContent =
        contact.network || Dialer.currentNetwork;

    const avatar = document.getElementById("contactAvatar");

    if (contact.photo && contact.photo !== "") {

        avatar.src = contact.photo;

    } else {

        avatar.src = "assets/user.png";

    }

    preview.style.display = "flex";

}

/* ==========================================================
   NORMALIZE PHONE
========================================================== */

function normalizePhone(phone) {

    if (!phone) return "";

    phone = phone.replace(/\s+/g, "");

    if (phone.startsWith("+254")) {

        return "0" + phone.substring(4);

    }

    if (phone.startsWith("254")) {

        return "0" + phone.substring(3);

    }

    return phone;

}