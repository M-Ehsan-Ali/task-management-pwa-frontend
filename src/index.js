import React from "react";
import ReactDOM from "react-dom/client";
import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "./styles/tailwind.css";

// Register service worker
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/serviceWorker.js`)
        .then((registration) => {
          console.log("Service worker registered:", registration);
          return registration;
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
registerServiceWorker();
