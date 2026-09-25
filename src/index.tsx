import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./index.css";
import { SnackbarProvider } from 'notistack';
// NOTE: @tanstack/react-query đã được gỡ khỏi cây provider vì toàn bộ src/ KHÔNG có
// useQuery/useMutation/useQueryClient nào (đã kiểm tra bằng grep). Dependency vẫn còn trong
// package.json để dùng lại khi cần; chỉ bỏ provider rỗng khỏi runtime/bundle.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration: ServiceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('Service Worker đăng ký thành công');
    } catch (error) {
      console.error('Lỗi đăng ký Service Worker:', error);
    }
  });
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={5000}
        preventDuplicate
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
