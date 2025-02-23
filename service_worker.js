/* 
author name: Daniel Khong mun Loong
File: service_worker.js
Description: javascript file containing service worker related functions and routines called by script.js
*/

self.addEventListener("install", function (event) {
    console.log("CA 2 Fashion PWA service Worker installing");
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    console.log("CA 2 Fashion PWA service Worker activating");
});

function send_message_to_client(client, msg) {
    return new Promise(function (resolve, reject) {
        let msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };
        client.postMessage(msg, [msg_chan.port2]);
    });
}

function send_message_to_all_clients(msg) {
    clients.matchAll()
        .then(clients => {
            clients.forEach(client => {
                send_message_to_client(client, msg)
                    .then(m => console.log("[Service Worker] From Client:" + msg));
            });
        });
}

self.addEventListener('push', function (event) {
    console.log("------ PWA service worker push event listener starts ------");

    if (Notification.permission === "granted") {
        console.log("Granted permission to display PWA notification.");
        let notificationText = "You Got New Message!";
        if (event.data) {
            notificationText = event.data.text();
        }
        const title = 'CA2 Fashion PWA';
        const options = {
            body: notificationText,
            icon: './img/icon_notification.png',
            badge: './img/icon_notification.png'
        };

        self.registration.pushManager.getSubscription()
        .then(function (subscription) {
            if (!subscription) {
                console.log("PWA has no subscription in place. Will not send web notfication to client.");
            } else {
                console.log("PWA has subscription in place. Start to send web notfication to client.");
                send_message_to_all_clients(notificationText);
                self.registration.showNotification(title, options);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    console.log("------ PWA service worker push event listener done ------");
});

