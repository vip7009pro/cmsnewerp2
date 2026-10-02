import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MailAccountLite, MailBootstrap, MailFolder } from "../../components/Mail/mail.types";

/**
 * Trạng thái TOÀN CỤC của module Email (Phần dùng chung cho badge navbar + realtime).
 * Danh sách hộp thư và nội dung email chi tiết KHÔNG đặt ở đây (để lazy-load, tránh phình Redux) —
 * chúng nằm trong `useMailController`.
 */
export interface MailState {
  bootstrapped: boolean;
  unreadTotal: number;
  folders: MailFolder[];
  accounts: MailAccountLite[];
  counts: Record<string, number>;
  hasOwnAccount: boolean;
  ownAccountId: number | null;
}

const initialState: MailState = {
  bootstrapped: false,
  unreadTotal: 0,
  folders: [],
  accounts: [],
  counts: {},
  hasOwnAccount: false,
  ownAccountId: null,
};

const mailSlice = createSlice({
  name: "mailSlice",
  initialState,
  reducers: {
    setMailBootstrap(state, action: PayloadAction<MailBootstrap>) {
      const payload = action.payload;
      state.bootstrapped = true;
      state.unreadTotal = payload.unreadTotal || 0;
      state.folders = payload.folders || [];
      state.accounts = payload.accounts || [];
      state.counts = payload.counts || {};
      state.hasOwnAccount = payload.hasOwnAccount === true;
      state.ownAccountId = payload.ownAccountId ?? null;
    },
    /** Cập nhật số chưa đọc (khi đọc email / nhận realtime). */
    setMailUnread(state, action: PayloadAction<number>) {
      state.unreadTotal = Math.max(0, action.payload || 0);
    },
    bumpMailUnread(state, action: PayloadAction<number>) {
      state.unreadTotal = Math.max(0, state.unreadTotal + (action.payload || 0));
    },
    resetMail() {
      return initialState;
    },
  },
});

export const { setMailBootstrap, setMailUnread, bumpMailUnread, resetMail } = mailSlice.actions;
export default mailSlice.reducer;
