"use strict";

const CACHE_NAME = "kenya-smart-dialer-v1";

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
    "/assets/logo.png"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())

    );

});


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

                const responseClone = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(request, responseClone);
                    });

                return response;

            })
            .catch(() => {

                return caches.match(request);

            })

    );

});