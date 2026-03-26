import "devextreme/dist/css/dx.light.css";
import { useEffect, Suspense, useRef, useMemo, useCallback } from "react";
import {
  checkLogin,
  generalQuery,
  getCompany,
  getGlobalSetting,
  getNotiCount,
  getSocket,
  getUserData,
} from "./api/Api";
import Swal from "sweetalert2";
import { RootState } from "./redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  changeDiemDanhState,
  changeUserData,
  update_socket,
  logout,
  login,
  setTabModeSwap,
  changeGLBSetting,
  changeServer,
  updateNotiCount,
} from "./redux/slices/globalSlice";
import "./App.scss";
import FallBackComponent from "./components/Fallback/FallBackComponent";
import { UserData, WEB_SETTING_DATA } from "./api/GlobalInterface";
import { DEFAULT_USER_DATA } from "./api/defaultUserData";
import { current_ver } from "./pages/home/Home";
import { Notifications } from "react-push-notification";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { NotificationElement } from "./components/NotificationPanel/Notification";
import { enqueueSnackbar } from "notistack";
import { Login } from "./api/lazyPages";
import AppRoutes from "./AppRoutes";
import { useRenderLag } from "./api/userRenderLag";
import { useSocketEvents } from "./hooks/useSocketEvents";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { requestFullScreen } from "./api/services/utilService";
function App() {
  const full_screen: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "FULL_SCREEN"
    )[0]?.CURRENT_VALUE ?? "0"
  );
  const elementRef = useRef(null);
  const swalContainer = document.querySelector(".swal2-container");
  if (swalContainer instanceof HTMLElement) {
    swalContainer.style.zIndex = "9999";
  }
  const loadWebSetting = useCallback(() => {
    generalQuery("loadWebSetting", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let crST_string: any = localStorage.getItem("setting") ?? "";
          let loadeddata: WEB_SETTING_DATA[] = [];
          if (crST_string !== "") {
            let crST: WEB_SETTING_DATA[] = JSON.parse(crST_string);
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE:
                    crST.filter(
                      (ele: WEB_SETTING_DATA, id: number) =>
                        ele.ID === element.ID
                    )[0]?.CURRENT_VALUE ?? element.DEFAULT_VALUE,
                };
              }
            );
          } else {
            loadeddata = response.data.data.map(
              (element: WEB_SETTING_DATA, index: number) => {
                return {
                  ...element,
                  CURRENT_VALUE: element.DEFAULT_VALUE,
                };
              }
            );
          }
          dispatch(changeGLBSetting(loadeddata));
        } else {
          dispatch(changeGLBSetting([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const globalLoginState: boolean | undefined = useSelector(
    (state: RootState) => state.totalSlice.loginState
  );
  const globalUserData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const dispatch = useDispatch();
  const checkDiemDanh = useCallback(() => {
    generalQuery("checkdiemdanh", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          dispatch(changeDiemDanhState(true));
        } else {
          dispatch(changeDiemDanhState(false));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const checkLoginCallback = useCallback(() => {
    checkLogin()
      .then((data: any) => {
//        console.log('data check login', data);
        if (data.data.tk_status === "ng") {
          loadWebSetting();
          dispatch(logout(false));
          dispatch(changeUserData(DEFAULT_USER_DATA));
        } else {
          dispatch(changeUserData(data.data.data));
          if (data.data.data.JOB_NAME === "Worker") {
            dispatch(setTabModeSwap(false));
          }
          if (data.data.data.POSITION_CODE === 4) {
            dispatch(setTabModeSwap(false));
          }
          dispatch(
            update_socket({
              event: "login",
              data: data.data.data.EMPL_NO,
            })
          );
          dispatch(login(true));
        }
      })
      .catch((err: any) => {
        console.log(err + " ");
      });
  }, []);
  const showNoti = useCallback((data: NotificationElement) => {
    dispatch(updateNotiCount((getNotiCount() ?? 0) + 1));
    localStorage.setItem(
      "notification_count",
      ((getNotiCount() ?? 0) + 1).toString()
    );
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
  }, []);
  const handleSetWebVer = useCallback((data: any) => {
    console.log("co data web ver", data);
    if (current_ver >= data) {
      console.log("khong can update web");
    } else {
      Swal.fire({
        title: "ERP has updates?",
        text: "Update Web",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Update",
        cancelButtonText: "Update later",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Notification", "Update Web", "success");
          window.location.reload();
        } else {
          Swal.fire(
            "Notification",
            "Press Ctrl + F5 to update the Web",
            "info"
          );
        }
      });
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
  }, []);
  const handleNotification = useCallback((data: NotificationElement) => {
    //console.log(data);
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
  }, []);
  // Hàm chuyển đổi VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };
  // Hàm yêu cầu quyền và đăng ký push
  const handleEnableNotifications = async (): Promise<void> => {
//    console.log("handleEnableNotifications");
    try {
//      console.log("vao day");
      // Kiểm tra hỗ trợ
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        console.log("Trình duyệt không hỗ trợ thông báo đẩy!");
        return;
      }
      // Yêu cầu quyền thông báo
      const permission: NotificationPermission =
        await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Người dùng không cho phép thông báo!");
        return;
      }
      // Lấy Service Worker registration
      const registration: ServiceWorkerRegistration = await navigator
        .serviceWorker.ready;
      // Đăng ký push subscription
      const subscription: PushSubscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BDrr_753esKQykp6mnFRExVohLC_yBXGdodkkOB3KzVAJegzQ79Nk-bDxAeZ3feyzIa9XgAcxpoXb0kdtP9cXBE" // Thay bằng public VAPID key của đại ca
          ) as any,
        });
      // Gửi subscription đến server
      const response = await generalQuery("addSubscription", {
        subscription: JSON.stringify(subscription),
      });
      if (response.data.tk_status === "OK") {
        console.log("Đã bật thông báo thành công!");
      } else {
        console.log("Lỗi khi gửi subscription đến server!");
      }
    } catch (error: unknown) {
      console.error("Lỗi:", error);
      console.log(`Có lỗi xảy ra: ${(error as Error).message}`);
    }
  };
  const getIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      console.log(data.ip);
      return data.ip;
    } catch (error) {
      console.error("Lỗi khi lấy IP:", error);
      return null;
    }
  };

  useSocketEvents({
    onWebVersionUpdate: handleSetWebVer,
    onCheckOnline: () => {},
    changeServer: handleChangeServerCommand,
    notification_panel: handleNotification as any,
  });

  useEffect(() => {
    checkLoginCallback();
    checkDiemDanh();
    if(getCompany() === 'CMS') {
      handleEnableNotifications();
    }
    getIPAddress();
  }, [globalLoginState, checkLoginCallback, checkDiemDanh]);

  useEffect(() => {
    let timer: any = null;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollHeight > target.clientHeight) {
        target.classList.add("is-scrolling");
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          target.classList.remove("is-scrolling");
        }, 900);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true } as any);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll, { capture: true } as any);
    };
  }, []);
  return (
    <>
      {globalLoginState && (
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
      {!globalLoginState && <Login />}
      <Notifications />
    </>
  );
}
export default App;
