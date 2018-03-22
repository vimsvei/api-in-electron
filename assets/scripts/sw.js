'use strict';
var VERSION = 'v1';
var assets = [
    '/assets/css/style.css',
    '/assets/favicon.ico',
    '/assets/scripts/script.js'
];
self.oninstall = function (event) { return event.waitUntil(self.skipWaiting()); };
self.onactivate = function (event) { return event.waitUntil(self.clients.claim()); };
self.onfetch = function (event) { return event.respondWith(fetch(event.request)); };
