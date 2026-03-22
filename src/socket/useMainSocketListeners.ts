import { useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import {
  generalQuery,
  getCompany,
  getNotiCount,
  getSocket,
  getUserData,
} from "../api/Api";
import type { NotificationElement } from "../components/NotificationPanel/Notification";
import { current_ver } from "../pages/home/Home";
import { useAppDispatch } from "../redux/hooks";
import { setServerIp } from "../redux/slices/uiSlice";
import { setNotificationCount } from "../redux/slices/notificationsSlice";

export function useMainSocketListeners(enabled: boolean | undefined) {
  const dispatch = useAppDispatch();

  const showNoti = useCallback(
    (data: NotificationElement) => {
      dispatch(setNotificationCount((getNotiCount() ?? 0) + 1));
      localStorage.setItem(
        "notification_count",
        ((getNotiCount() ?? 0) + 1).toString(),
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
    },
    [dispatch],
  );

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
            "info",
          );
        }
      });
    }
  }, []);

  const handleChangeServerCommand = useCallback(
    (data: any) => {
      console.log("Change server commnand received !");
      console.log(data.server);
      if (
        getCompany() === "CMS" &&
        (data.empl_no.toUpperCase() === getUserData()?.EMPL_NO?.toUpperCase() ||
          data.empl_no.toUpperCase() === "ALL")
      ) {
        dispatch(setServerIp(data.server));
        localStorage.setItem("server_ip", data.server);
      }
    },
    [dispatch],
  );

  const handleNotification = useCallback(
    (data: NotificationElement) => {
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
    },
    [showNoti],
  );

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };

  const handleEnableNotifications = async (): Promise<void> => {
    try {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        console.log("Trình duyệt không hỗ trợ thông báo đẩy!");
        return;
      }
      const permission: NotificationPermission =
        await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Người dùng không cho phép thông báo!");
        return;
      }
      const registration: ServiceWorkerRegistration = await navigator
        .serviceWorker.ready;
      const subscription: PushSubscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BDrr_753esKQykp6mnFRExVohLC_yBXGdodkkOB3KzVAJegzQ79Nk-bDxAeZ3feyzIa9XgAcxpoXb0kdtP9cXBE",
          ) as any,
        });
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

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();

    if (!socket.hasListeners("setWebVer")) {
      socket.on("setWebVer", handleSetWebVer);
    }

    if (!socket.hasListeners("request_check_online2")) {
      socket.on("request_check_online2", (data: any) => {
        socket.emit("respond_check_online", getUserData());
      });
    }

    if (!socket.hasListeners("changeServer")) {
      socket.on("changeServer", handleChangeServerCommand);
    }

    if (!socket.hasListeners("notification_panel")) {
      socket.on("notification_panel", handleNotification);
    }

    if (getCompany() === "CMS") {
      handleEnableNotifications();
    }

    getIPAddress();

    return () => {
      socket.off("setWebVer", (data: any) => {});
      socket.off("request_check_online", (data: any) => {});
      socket.off("notification_panel", (data: any) => {});
    };
  }, [enabled, handleChangeServerCommand, handleNotification, handleSetWebVer]);
}
