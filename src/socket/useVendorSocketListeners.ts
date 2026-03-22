import { useEffect } from "react";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import {
  getCompany,
  getNotiCount,
  getSocket,
  getUserData,
} from "../api/ApiVendors";
import type { NotificationElement } from "../components/NotificationPanel/Notification";
import { current_ver } from "../pages/home/Home";
import { useAppDispatch } from "../redux/hooks";
import { setServerIp } from "../redux/slices/uiSlice";
import { setNotificationCount } from "../redux/slices/notificationsSlice";

export function useVendorSocketListeners() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    if (!socket.hasListeners("setWebVer")) {
      socket.on("setWebVer", (data: any) => {
        console.log(data);
        if (current_ver >= data) {
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
      });
    }

    if (!socket.hasListeners("changeServer")) {
      socket.on("changeServer", (data: any) => {
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
      });
    }

    const showNoti = (data: NotificationElement) => {
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
    };

    if (!socket.hasListeners("notification_panel")) {
      socket.on("notification_panel", (data: NotificationElement) => {
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
            return;
          }
          showNoti(data);
        }
      });
    }

    return () => {
      socket.off("setWebVer", (data: any) => {
      });
      socket.off("request_check_online", (data: any) => {
      });
      socket.off("notification_panel", (data: any) => {
      });
    };
  }, [dispatch]);
}
