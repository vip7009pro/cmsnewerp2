import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { socket } from "./totalParts/initialTotalState";

export type SocketState = Record<string, never>;

const initialState: SocketState = {};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    emitSocketEvent: (state, action: PayloadAction<{ event: string; data: any }>) => {
      socket.emit(action.payload.event, action.payload.data);
    },
    listenSocketEvent: (state, action: PayloadAction<{ event: string }>) => {
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
  },
});

export const { emitSocketEvent, listenSocketEvent } = socketSlice.actions;

export default socketSlice.reducer;
