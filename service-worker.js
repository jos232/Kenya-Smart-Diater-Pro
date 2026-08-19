"use strict";

const CACHE_NAME = "kenya-smart-dialer-v2";

const APP_SHELL = [
    "/",
    "/index.html",
    "/manifest.json",

    "/css/style.css",
    "/css/pages.css",
    "/css/responsive.css",

    "/js/api.js",
    "/js/app.js",
    "/js/dashboard.js",
    "/js/contacts.js",
    "/js/dialer.js",
    "/js/airtime.js",
    "/js/bundles.js",
    "/js/voice.js",
    "/js/sms.js",
    "/js/subscriptions.js",
    "/js/financial.js",
    "/js/loans.js",
    "/js/cards.js",
    "/js/statement.js",
    "/js/networks.js",
    "/js/storage.js",

    "/assets/logo.png",
    "/assets/pwa-icon-512.png",
    "/assets/pwa-desktop.png",
    "/assets/pwa-mobile.png"
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

                            console.log(
                                "✅ Cached:",
                                file
                            );

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