import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import Vendors from "./App2";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
//check if full url contains vendors return Vendors component else return App component
const fullUrl = window.location.href;
if (fullUrl.includes("cmsvendors")) {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <Vendors />
      </Provider>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
    <Provider store={store}>
      <SnackbarProvider maxSnack={5} autoHideDuration={3000} preventDuplicate>
        <App />
      </SnackbarProvider>
      </Provider>
    </StrictMode>
  );
}
