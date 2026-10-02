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
  /** Mailbox người dùng đã tắt thông báo đẩy (Phase 7). */
  mutedAccountIds: number[];
  /** Nhân viên có được tự cấu hình mailbox không (admin bật/tắt qua env). */
  selfServiceEnabled: boolean;
}

const initialState: MailState = {
  bootstrapped: false,
  unreadTotal: 0,
  folders: [],
  accounts: [],
  counts: {},
  hasOwnAccount: false,
  ownAccountId: null,
  mutedAccountIds: [],
  selfServiceEnabled: true,
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
      state.mutedAccountIds = Array.isArray(payload.mutedAccountIds) ? payload.mutedAccountIds.map(Number) : [];
      state.selfServiceEnabled = payload.selfServiceEnabled !== false;
    },
    /** Cập nhật danh sách mailbox tắt thông báo đẩy (đã chuẩn hoá từ server). */
    setMailMutes(state, action: PayloadAction<number[]>) {
      state.mutedAccountIds = Array.isArray(action.payload) ? action.payload.map(Number) : [];
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

export const { setMailBootstrap, setMailUnread, bumpMailUnread, setMailMutes, resetMail } = mailSlice.actions;
export default mailSlice.reducer;
