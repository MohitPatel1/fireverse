import "./styles/index.css";
import "emoji-mart/css/emoji-mart.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
