"use strict";

/* ==========================================
   DAILY OFFERS
========================================== */

const dailyOffers = [

    {
        network: "Safaricom",
        title: "1GB + 20 SMS",
        price: "KSh 20",
        validity: "24 Hours"
    },

    {
        network: "Airtel",
        title: "2GB Data",
        price: "KSh 49",
        validity: "24 Hours"
    },

    {
        network: "Telkom",
        title: "Unlimited Minutes",
        price: "KSh 30",
        validity: "1 Day"
    },

    {
        network: "Faiba",
        title: "Night Bundle 5GB",
        price: "KSh 50",
        validity: "Night"
    }

];
function openDailyOffers() {

    showScreen("dailyOffers");

    renderDailyOffers();

}

function renderDailyOffers() {

    const container =
        document.getElementById("dailyOffersList");

    if (!container) return;

    container.innerHTML = "";

    dailyOffers.forEach(offer => {

        container.innerHTML += `

        <div class="offer-card">

            <h3>${offer.network}</h3>

            <h2>${offer.title}</h2>

            <p>${offer.validity}</p>

            <button
                onclick="buyOffer('${offer.network}','${offer.title}','${offer.price}')">

                Buy ${offer.price}

            </button>

        </div>

        `;

    });

}