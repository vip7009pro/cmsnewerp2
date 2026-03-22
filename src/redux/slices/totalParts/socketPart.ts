import type { PayloadAction } from "@reduxjs/toolkit";
import { socket } from "./initialTotalState";

export const socketReducers = {
  update_socket: (state: any, action: PayloadAction<any>) => {
    socket.emit(action.payload.event, action.payload.data);
  },
  listen_socket: (state: any, action: PayloadAction<any>) => {
    socket.on(action.payload.event, (data: any) => {
      switch (action.payload.event) {
        case "login":
          console.log(data);
          break;
        case "logout":
          console.log(data + "da dang xuat");
          break;
        case "connect":
          console.log(socket.id);
          break;
        case "disconnect":
          console.log(data);
          break;
        case "notification":
          break;
      }
    });
  },
};
