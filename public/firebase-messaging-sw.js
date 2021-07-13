importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');
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
firebase.messaging();