import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import { SnackbarProvider } from 'notistack';
import { getCompany } from "./api/Api";
import AppVendors from "./AppVendors";
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration: ServiceWorkerRegistration = await navigator.serviceWorker.register('service-worker.js');
      console.log('Service Worker đăng ký thành công:', registration);
    } catch (error) {
      console.error('Lỗi đăng ký Service Worker:', error);
    }
  });
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
//check if full url contains vendors return Vendors component else return App component
const fullUrl = window.location.href;
if (fullUrl.includes("partners")) {
  root.render(
    <StrictMode>
      <Provider store={store}>        
        {getCompany() === "CMS" ? <AppVendors /> : <></>}
      </Provider>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <SnackbarProvider maxSnack={5} autoHideDuration={5000} preventDuplicate>
          <App />
        </SnackbarProvider>
      </Provider>
    </StrictMode>
  );
}
