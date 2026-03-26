import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket, getUserData } from "../api/Api";
import { updateNotiCount } from "../redux/slices/globalSlice";
import Swal from "sweetalert2";

export interface SystemNotification {
  NOTI_TYPE: "success" | "error" | "warning" | "info";
  CONTENT: string;
  REQ_EMPL?: string;
}

export interface SocketEventHandlers {
  onNotification?: (data: SystemNotification) => void;
  onWebVersionUpdate?: (data: any) => void;
  onCheckOnline?: (data: any) => void;
  [key: string]: ((data: any) => void) | undefined;
}

/**
 * Hook to manage Socket.IO global event listeners.
 * Extracts inline socket event logic from components like App.tsx.
 */
export const useSocketEvents = (handlers: SocketEventHandlers) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    const currentUser = getUserData();

    // Default specific events
    if (handlers.onWebVersionUpdate && !socket.hasListeners("setWebVer")) {
      socket.on("setWebVer", handlers.onWebVersionUpdate);
    }

    if (handlers.onCheckOnline && !socket.hasListeners("request_check_online2")) {
      socket.on("request_check_online2", (data: any) => {
        socket.emit("respond_check_online", currentUser);
      });
    }

    // Generic custom events
    const customEvents = Object.keys(handlers).filter(
      (k) => !["onNotification", "onWebVersionUpdate", "onCheckOnline"].includes(k)
    );

    customEvents.forEach((eventName) => {
      const handler = handlers[eventName];
      if (handler && !socket.hasListeners(eventName)) {
        socket.on(eventName, handler);
      }
    });

    return () => {
      if (handlers.onWebVersionUpdate) {
        socket.off("setWebVer", handlers.onWebVersionUpdate);
      }
      if (handlers.onCheckOnline) {
        socket.off("request_check_online2");
      }
      customEvents.forEach((eventName) => {
        const handler = handlers[eventName];
        if (handler) socket.off(eventName, handler);
      });
    };
  }, [dispatch, handlers]);
};
