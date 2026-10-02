import { useEffect, Suspense, useRef, useMemo, useCallback } from "react";
import {
  getCompany,
  getGlobalSetting,
  getNotiCount,
  getUserData,
  logout as logoutSession,
} from "./api/Api";
import { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeServer,
  updateNotiCount,
} from "./redux/slices/globalSlice";
import "./App.scss";
import FallBackComponent from "./components/Fallback/FallBackComponent";
import { UserData, WEB_SETTING_DATA } from "./api/GlobalInterface";
import { current_ver } from "./pages/home/Home";
import { Notifications } from "react-push-notification";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { NotificationElement } from "./components/NotificationPanel/Notification";
import { enqueueSnackbar } from "notistack";
import { isNotiMuted } from "./api/services/notificationMuteService";
import { Login } from "./api/lazyPages";
import AppRoutes from "./AppRoutes";
import { useSocketEvents } from "./hooks/useSocketEvents";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// requestFullScreen nằm ở utilCore (không kéo recharts/barcode) — KHÔNG import từ utilService.
import { requestFullScreen } from "./api/services/utilCore";
import { useAppBootstrap } from "./hooks/useAppBootstrap";
import { useDocumentScrollIdleClass } from "./hooks/useDocumentScrollIdleClass";
import { useAutoTabModeByViewport } from "./hooks/useAutoTabModeByViewport";
import AppBootScreen from "./components/AppBootScreen/AppBootScreen";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChangelogHost, { requestChangelogPopup } from "./components/Changelog/ChangelogHost";
import NotificationPermissionGate from "./components/NotificationPermissionGate/NotificationPermissionGate";
import { isPushNotificationSupported } from "./api/services/notificationPermissionService";
import { getPlatformInfo, isStandalonePwa } from "./api/services/platformDetect";

function App() {
  const isBootstrapping = useAppBootstrap();
  useDocumentScrollIdleClass();
  // Mobile mặc định đơn nhiệm; chỉ đa nhiệm khi người dùng đã chủ động bật (lưu ở localStorage).
  useAutoTabModeByViewport();

  const appTheme = useMemo(() => {
    const fontFamily = '"Inter", "Segoe UI", sans-serif';

    return createTheme({
      typography: {
        fontFamily,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontFamily,
            },
          },
        },
      },
    });
  }, []);

  const iosNeedsHomeScreen = useMemo(
    () => getPlatformInfo().platform === "ios" && !isStandalonePwa(),
    []
  );

  const full_screen: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "FULL_SCREEN"
    )[0]?.CURRENT_VALUE ?? "0"
  );
  const elementRef = useRef(null);
  const globalLoginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.loginState
  );
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const dispatch = useDispatch();

  const showNoti = useCallback((data: NotificationElement) => {
    dispatch(updateNotiCount((getNotiCount() ?? 0) + 1));
    localStorage.setItem(
      "notification_count",
      ((getNotiCount() ?? 0) + 1).toString()
    );
    // Đang tắt thông báo ở "Trung tâm thông báo" ⇒ vẫn ghi nhận (badge tăng) nhưng KHÔNG phụt snackbar.
    if (isNotiMuted()) return;
    switch (data.NOTI_TYPE) {
      case "success":
        enqueueSnackbar(data.CONTENT, {
          variant: "success",
        });
        break;
      case "error":
        enqueueSnackbar(data.CONTENT, {
          variant: "error",
        });
        break;
      case "warning":
        enqueueSnackbar(data.CONTENT, {
          variant: "warning",
        });
        break;
      case "info":
        enqueueSnackbar(data.CONTENT, {
          variant: "info",
        });
        break;
      default:
        enqueueSnackbar(data.CONTENT, {
          variant: "success",
        });
        break;
    }
  }, [dispatch]);

  const handleSetWebVer = useCallback((data: any) => {
    console.log("co data web ver", data);
    const serverVersion = Number(data);
    if (!Number.isFinite(serverVersion) || current_ver >= serverVersion) {
      console.log("khong can update web");
    } else {
      requestChangelogPopup(serverVersion);
    }
  }, []);

  const handleChangeServerCommand = useCallback((data: any) => {
    console.log("Change server commnand received !");
    console.log(data.server);
    if (
      getCompany() === "CMS" &&
      (data.empl_no.toUpperCase() === getUserData()?.EMPL_NO?.toUpperCase() ||
        data.empl_no.toUpperCase() === "ALL")
    ) {
      dispatch(changeServer(data.server));
      localStorage.setItem("server_ip", data.server);
    }
  }, [dispatch]);

  const handleNotification = useCallback((data: NotificationElement) => {
    let mainDeptArray = data.MAINDEPTNAME?.split(",");
    if (getCompany() !== "CMS") return;
    if (getUserData()?.EMPL_NO === "NHU1903") {
      showNoti(data);
    } else {
      if (
        !mainDeptArray ||
        !mainDeptArray.includes(getUserData()?.MAINDEPTNAME ?? "ALL") ||
        (getUserData()?.JOB_NAME !== "Leader" &&
          getUserData()?.JOB_NAME !== "Sub Leader" &&
          getUserData()?.JOB_NAME !== "Dept Staff")
      ) {
        showNoti(data);
      }
    }
  }, [showNoti]);

  const getIPAddress = useCallback(async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      console.log(data.ip);
      return data.ip;
    } catch (error) {
      console.error("Lỗi khi lấy IP:", error);
      return null;
    }
  }, []);

  const socketHandlers = useMemo(
    () => ({
      onWebVersionUpdate: handleSetWebVer,
      onCheckOnline: () => {},
      changeServer: handleChangeServerCommand,
      notification_panel: handleNotification as any,
    }),
    [handleSetWebVer, handleChangeServerCommand, handleNotification]
  );

  useSocketEvents(socketHandlers);

  useEffect(() => {
    if (isBootstrapping) return;
    void getIPAddress();
    // KHÔNG gọi Notification.requestPermission() ở đây nữa: prompt trình duyệt sẽ bật lên
    // trước khi người dùng hiểu lý do, dễ bị bấm "Chặn" vĩnh viễn. Việc xin quyền do
    // NotificationPermissionGate đảm nhiệm (xem bên dưới).
  }, [isBootstrapping, getIPAddress]);

  // Warm-up chunk màn hình đăng nhập.
  // Người dùng vào app bằng token còn hạn sẽ KHÔNG bao giờ render <Login /> ở lần boot đầu,
  // nên chunk Login chỉ được tải đúng lúc bấm Logout. Nạp trước ở đây (cùng module key với
  // lazy() trong lazyPages.ts) để React.lazy resolve đồng bộ ⇒ logout ra màn login tức thì.
  useEffect(() => {
    if (isBootstrapping) return;
    const timer = window.setTimeout(() => {
      void import("./pages/login/Login").catch(() => {
        /* Bỏ qua: lần render thật sẽ tự thử lại và đã có ErrorBoundary xử lý. */
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [isBootstrapping]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ChangelogHost />
      <>
        {isBootstrapping && <AppBootScreen />}
        {!isBootstrapping && globalLoginState && (
          <div
            className="App"
            ref={elementRef}
            onClick={() => requestFullScreen(elementRef, full_screen)}
          >
            <Suspense fallback={<FallBackComponent />}>
              <ErrorBoundary>
                <AppRoutes globalUserData={globalUserData} />
              </ErrorBoundary>
            </Suspense>
          </div>
        )}
        {/**
         * Login là component React.lazy (xem api/lazyPages.ts).
         * BẮT BUỘC phải có Suspense + ErrorBoundary bọc ngoài.
         * Trước đây render trần `<Login />` nên khi chunk Login chưa từng được tải
         * (user đăng nhập bằng token còn hạn, vào thẳng app) → lazy suspend mà không có
         * boundary nào phía trên ⇒ React 18 unmount toàn bộ root ⇒ màn hình trắng cho tới
         * khi F5 (F5 tải lại chunk trong lúc boot nên hiển thị được màn login).
         */}
        {!isBootstrapping && !globalLoginState && (
          <Suspense fallback={<AppBootScreen />}>
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          </Suspense>
        )}
        {/**
         * Cổng bắt buộc cấp quyền thông báo đẩy. Chỉ áp dụng cho CMS (đúng với phạm vi
         * luồng push hiện tại: socket `notification_panel` cũng chỉ chạy cho CMS).
         * Component tự bỏ qua nếu trình duyệt không hỗ trợ (HTTP nội bộ, iOS chưa
         * Add to Home Screen…) để không khoá người dùng oan.
         */}
        <NotificationPermissionGate
          enabled={
            !isBootstrapping &&
            globalLoginState &&
            getCompany() === "CMS" &&
            (isPushNotificationSupported() || iosNeedsHomeScreen)
          }
          iosNeedsHomeScreen={iosNeedsHomeScreen}
          onLogout={logoutSession}
        />
        <Notifications />
      </>
    </ThemeProvider>
  );
}
export default App;
