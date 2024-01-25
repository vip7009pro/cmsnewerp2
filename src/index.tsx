import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.ts')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
root.render(
  <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </StrictMode>,
);
