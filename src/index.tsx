import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration: ServiceWorkerRegistration = await navigator.serviceWorker.register('service-worker.js');
      console.log('Service Worker đăng ký thành công');
    } catch (error) {
      console.error('Lỗi đăng ký Service Worker:', error);
    }
  });
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
const queryClient = new QueryClient();
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={5} autoHideDuration={5000} preventDuplicate>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
