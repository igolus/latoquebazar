importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')
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

messaging.setBackgroundMessageHandler(function(payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("my notification title");
        });
    return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
    // do what you want
    // ...
});