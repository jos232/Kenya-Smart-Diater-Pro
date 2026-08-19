"use strict";

const CACHE_NAME = "kenya-smart-dialer-v3";

const APP_SHELL = [
    "/",
    "/index.html",
    "/manifest.json",

    /* =========================
       CSS
    ========================= */

    "/css/theme.css",
    "/css/dashboard.css",
    "/css/history.css",
    "/css/dialer.css",
    "/css/contacts.css",
    "/css/airtime.css",
    "/css/bundles.css",
    "/css/subscriptions.css",
    "/css/animations.css",
    "/css/responsive.css",
    "/css/splash.css",
    "/css/toast.css",
    "/css/call.css",
    "/css/financial.css",
    "/css/bank.css",
    "/css/kcb.css",
    "/css/equity.css",
    "/css/offers.css",

    /* =========================
       JAVASCRIPT
    ========================= */

    "/js/storage.js",
    "/js/networks.js",
    "/js/telecom-engine.js",
    "/js/config.js",
    "/js/api.js",
    "/js/auth.js",
    "/js/utils.js",
    "/js/toast.js",
    "/js/splash.js",
    "/js/dashboard.js",
    "/js/contacts.js",
    "/js/dialer.js",
    "/js/dialpad.js",
    "/js/contact-preview.js",
    "/js/callscreen.js",
    "/js/call-controls.js",
    "/js/incoming-call.js",
    "/js/call-history.js",
    "/js/speed-dial.js",
    "/js/airtime.js",
    "/js/bundles.js",
    "/js/voice.js",
    "/js/sms.js",
    "/js/subscriptions.js",
    "/js/offers.js",
    "/js/services.js",
    "/js/financial.js",
    "/js/history.js",
    "/js/app.js",
    "/js/bank.js",

    /* =========================
       PWA ASSETS
    ========================= */

    "/assets/logo.png",
    "/assets/pwa-icon-512.png",
    "/assets/pwa-desktop.png",
    "/assets/pwa-mobile.png",
    "/assets/favicon.png"
];


/* ==========================================
   INSTALL
========================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(async cache => {

                for (const file of APP_SHELL) {

                    try {

                        const response = await fetch(file);

                        if (response.ok) {

                            await cache.put(file, response);

                            console.log("✅ Cached:", file);

                        } else {

                            console.warn(
                                "⚠️ Could not cache:",
                                file,
                                response.status
                            );

                        }

                    } catch (error) {

                        console.warn(
                            "⚠️ Cache failed:",
                            file,
                            error
                        );

                    }

                }

            })

            .then(() => self.skipWaiting())

    );

});


/* ==========================================
   ACTIVATE
========================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(cacheNames => {

                return Promise.all(

                    cacheNames

                        .filter(name => name !== CACHE_NAME)

                        .map(name => caches.delete(name))

                );

            })

            .then(() => self.clients.claim())

    );

});


/* ==========================================
   FETCH
========================================== */

self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(

        fetch(request)

            .then(response => {

                if (response && response.ok) {

                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                request,
                                responseClone
                            );

                        });

                }

                return response;

            })

            .catch(() => {

                return caches.match(request);

            })

    );

});