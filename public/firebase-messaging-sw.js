// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDvcWHmQMDHH6d5snJMdNrer6YnioDI7zA",
  authDomain: "fair-column-343422.firebaseapp.com",
  projectId: "fair-column-343422",
  storageBucket: "fair-column-343422.appspot.com",
  messagingSenderId: "409796469282",
  appId: "1:409796469282:web:60c3af69a28d2f6ebe607b",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
