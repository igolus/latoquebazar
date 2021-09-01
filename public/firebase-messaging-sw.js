importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
//import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDKBt5pdqJ5K3qMZXc4v_HnUxAChI9WSyU",
    authDomain: "latoque-b23f1.firebaseapp.com",
    databaseURL: "https://latoque-b23f1.firebaseio.com",
    projectId: "latoque-b23f1",
    storageBucket: "latoque-b23f1.appspot.com",
    messagingSenderId: "399587571823",
    appId: "1:399587571823:web:260f3a8634976e5c86759a",
    measurementId: "G-51LESC240G",
};



//import { firebaseConfig } from '../src/config';

// import firebase from '../src/lib/firebase'
firebase.initializeApp(firebaseConfig)
// const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage(function(payload) {
//     console.log('Received background message ', payload);
//
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//     };
//
//     self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });

// firebase.initializeApp({
// // Project Settings => Add Firebase to your web app
//     messagingSenderId: "1062407524656"
// });

const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage(async (payload) => {
//
//     console.log('[firebase-messaging-sw.js] Received background message token ', payload);
//
//
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         //icon: '/firebase-logo.png'
//     };
//
//     try {
//         console.log(" self.registration " +  self.registration)
//         //alert(" self.registration " +  self.registration)
//         self.registration.showNotification(notificationTitle,
//             notificationOptions);
//     }
//     catch (err) {
//         //alert(err);
//         console.log("showNotification ERRRRRROOOR" + err);
//     }
// });

// function showNotification(event) {
//
//     if (Notification.permission == 'granted') {
//         navigator.serviceWorker.getRegistration().then(function(reg) {
//             reg.showNotification('Hello world!');
//         });
//     }
//
//     // return new Promise(resolve => {
//     //     const { body, title, tag } = JSON.parse(event.data.text());
//     //
//     //     self.registration
//     //         .getNotifications({ tag })
//     //         .then(existingNotifications => { // close? ignore? })
//     //         .then(() => {
//     //                 const icon = `/path/to/icon`;
//     //                 return self.registration
//     //                     .showNotification(title, { body, tag, icon })
//     //             })
//     //                 .then(resolve)
//     //         })
//     // }
// }
//
// self.addEventListener('notificationclick', event => {
//     console.log(event)
//     return event;
// });
//
// self.addEventListener("push", event => {
//     console.log('[Service Worker] Push Received.' + event.data.text());
//     event.waitUntil(
//         showNotification(event)
//     );
// });

// self.addEventListener('push', function(event) {
//     console.log('[Service Worker] Push Received.' + event.data.text());
//     /**
//      Assuming the payload string is a valid JSON and can be parsed and contains a minimum of valid
//      fields... possible fields can be:
//      title: String,
//      body: String,
//      icon: String,
//      badge: String,
//      image: String,
//      vibrate: Array,
//      sound: String,
//      dir: String,
//      tag: String,
//      requireInteraction: Boolean,
//      renotify: Boolean,
//      silent: Boolean,
//      timestamp: Date
//      */
//     let data = JSON.parse(event.data.text());
//     // show
//     event.waitUntil(self.registration.showNotification(data.title, data));
// });