/**
 * Controller cho module Email — quản lý danh sách hộp thư + email đang mở.
 *
 * Trạng thái TOÀN CỤC (badge chưa đọc, folders, accounts) nằm ở Redux `mailSlice`.
 * Danh sách + nội dung email chi tiết nằm ở local state để lazy-load (không phình Redux).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../api/Api";
import { emailService } from "../api/services/emailService";
import {
  bumpMailUnread,
  setMailBootstrap,
  setMailUnread,
  type MailState,
} from "../redux/slices/mailSlice";
import type { MailDetailResponse, MailInboxPage, MailListItemModel, MailSearchSort } from "../components/Mail/mail.types";
import { parseMailQuery } from "../components/Mail/mailUtils";

const PAGE_SIZE = 30;

export interface MailController {
  bootstrapped: boolean;
  booting: boolean;
  unreadTotal: number;
  hasOwnAccount: boolean;
  folders: MailState["folders"];
  accounts: MailState["accounts"];
  activeFolder: string;
  messages: MailListItemModel[];
  hasMore: boolean;
  loadingList: boolean;
  listError: string | null;
  detail: MailDetailResponse | null;
  loadingDetail: boolean;
  /** Trạng thái tìm kiếm (Phase 5). */
  searchText: string;
  searchSort: MailSearchSort;
  searchMeta: { running: boolean; total: number | null; tookMs: number | null };
  inSearchMode: boolean;
  runSearch: (text: string, sort?: MailSearchSort, reset?: boolean) => Promise<void>;
  clearSearch: () => Promise<void>;
  bootstrap: () => Promise<void>;
  /** Nạp lại bootstrap (bỏ qua cờ bootstrapped) — dùng sau khi lưu cấu hình mailbox. */
  reloadBootstrap: () => Promise<void>;
  openFolder: (folder: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  openMessage: (id: number) => Promise<void>;
  closeDetail: () => void;
  toggleStar: (item: MailListItemModel) => Promise<void>;
  markRead: (id: number, isRead: boolean) => Promise<void>;
}

export function useMailController(options: { realtime?: boolean } = {}): MailController {
  const { realtime = false } = options;
  const dispatch = useDispatch();
  const mail = useSelector((s: { mailSlice: MailState }) => s.mailSlice);

  const [booting, setBooting] = useState(false);
  const [activeFolder, setActiveFolder] = useState("INBOX");
  const [messages, setMessages] = useState<MailListItemModel[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [detail, setDetail] = useState<MailDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Mốc mới nhất đã biết (để hỏi server phần email mới hơn khi có realtime / nối lại).
  const latestRef = useRef<{ receivedAt: string; id: number } | null>(null);
  const activeFolderRef = useRef(activeFolder);
  activeFolderRef.current = activeFolder;
  const syncInFlightRef = useRef(false);

  const cursorRef = useRef<MailInboxPage["nextCursor"]>(null);
  // Tìm kiếm: `cursorRef` cho newest/oldest, `offsetRef` cho các kiểu sắp xếp khác.
  const offsetRef = useRef(0);
  const searchModeRef = useRef(false);
  const [searchText, setSearchText] = useState("");
  const [searchSort, setSearchSort] = useState<MailSearchSort>("newest");
  const [searchMeta, setSearchMeta] = useState<{ running: boolean; total: number | null; tookMs: number | null }>({
    running: false,
    total: null,
    tookMs: null,
  });
  const bootstrappedRef = useRef(mail.bootstrapped);
  bootstrappedRef.current = mail.bootstrapped;

  const bootstrap = useCallback(async () => {
    if (bootstrappedRef.current) return;
    setBooting(true);
    try {
      const data = await emailService.bootstrap();
      dispatch(setMailBootstrap(data));
    } catch (error: any) {
      console.warn("[mail] bootstrap lỗi:", error?.message || error);
    } finally {
      setBooting(false);
    }
  }, [dispatch]);

  /** Nạp lại bootstrap BẤT KỂ đã bootstrapped hay chưa (sau khi lưu cấu hình mailbox). */
  const reloadBootstrap = useCallback(async () => {
    setBooting(true);
    try {
      const data = await emailService.bootstrap();
      dispatch(setMailBootstrap(data));
    } catch (error: any) {
      console.warn("[mail] reloadBootstrap lỗi:", error?.message || error);
    } finally {
      setBooting(false);
    }
  }, [dispatch]);

  const loadPage = useCallback(
    async (folder: string, reset: boolean) => {
      setLoadingList(true);
      setListError(null);
      try {
        const page = await emailService.inbox({
          folder,
          limit: PAGE_SIZE,
          cursor: reset ? null : cursorRef.current,
        });
        cursorRef.current = page.nextCursor;
        setHasMore(page.hasMore);
        setMessages((prev) => (reset ? page.messages : [...prev, ...page.messages]));
        // Ghi nhớ mốc mới nhất của THƯ MỤC (không đổi khi đang tìm kiếm).
        const newest = page.messages[0];
        if (reset && newest) latestRef.current = { receivedAt: newest.receivedAt as string, id: newest.id };
      } catch (error: any) {
        setListError(error?.message || "Không tải được hộp thư");
      } finally {
        setLoadingList(false);
      }
    },
    []
  );

  const openFolder = useCallback(
    async (folder: string) => {
      setActiveFolder(folder);
      setDetail(null);
      cursorRef.current = null;
      offsetRef.current = 0;
      // Chuyển thư mục = thoát chế độ tìm kiếm.
      searchModeRef.current = false;
      setSearchText("");
      setSearchMeta({ running: false, total: null, tookMs: null });
      await loadPage(folder, true);
    },
    [loadPage]
  );

  /** Tìm kiếm server-side (Phase 5). `text` rỗng ⇒ quay về danh sách thư mục. */
  const runSearch = useCallback(
    async (text: string, sort: MailSearchSort = "newest", reset = true) => {
      const trimmed = String(text || "").trim();
      setSearchText(text);
      setSearchSort(sort);

      if (!trimmed) {
        searchModeRef.current = false;
        setSearchMeta({ running: false, total: null, tookMs: null });
        cursorRef.current = null;
        offsetRef.current = 0;
        await loadPage(activeFolder, true);
        return;
      }

      searchModeRef.current = true;
      setLoadingList(true);
      setListError(null);
      setSearchMeta((prev) => ({ ...prev, running: true }));
      try {
        const parsed = parseMailQuery(trimmed);
        const useKeyset = sort === "newest" || sort === "oldest";
        const page = await emailService.search({
          terms: parsed.terms,
          filters: parsed.filters,
          sort,
          limit: PAGE_SIZE,
          cursor: reset || !useKeyset ? null : cursorRef.current,
          offset: reset || useKeyset ? 0 : offsetRef.current,
          includeCount: reset,
        });
        cursorRef.current = page.nextCursor;
        offsetRef.current = reset ? PAGE_SIZE : offsetRef.current + PAGE_SIZE;
        setHasMore(page.hasMore);
        setMessages((prev) => (reset ? page.messages : [...prev, ...page.messages]));
        setSearchMeta({
          running: false,
          total: typeof page.total === "number" ? page.total : null,
          tookMs: typeof page.tookMs === "number" ? page.tookMs : null,
        });
      } catch (error: any) {
        setListError(error?.message || "Tìm kiếm thất bại");
        setSearchMeta((prev) => ({ ...prev, running: false }));
      } finally {
        setLoadingList(false);
      }
    },
    [activeFolder, loadPage]
  );

  const clearSearch = useCallback(async () => {
    await runSearch("", "newest", true);
  }, [runSearch]);

  /**
   * Lấy về các email MỚI HƠN mốc đã biết — dùng khi có `email:new` hoặc sau khi
   * socket kết nối lại (mất mạng/server restart ⇒ không mất email).
   * Luôn cập nhật badge theo số liệu server trả về (nguồn chân lý).
   */
  const syncNewEmails = useCallback(async () => {
    if (syncInFlightRef.current) return;
    syncInFlightRef.current = true;
    try {
      const searching = searchModeRef.current;
      const data = await emailService.syncSince({
        folder: searching ? "ALL" : activeFolderRef.current,
        since: latestRef.current,
        limit: 50,
      });
      dispatch(setMailUnread(Number(data.unreadTotal) || 0));
      if (!searching && data.latest) latestRef.current = data.latest;
      // Đang tìm kiếm thì KHÔNG chèn kết quả vào danh sách đã lọc (tránh sai bộ lọc).
      if (!searching && data.messages.length > 0) {
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const fresh = data.messages.filter((m) => !seen.has(m.id));
          if (fresh.length === 0) return prev;
          return [...fresh, ...prev];
        });
      }
    } catch (error: any) {
      console.warn("[mail] đồng bộ email mới lỗi:", error?.message || error);
    } finally {
      syncInFlightRef.current = false;
    }
  }, [dispatch]);

  // Realtime: worker ingest xong ⇒ badge + danh sách cập nhật KHÔNG cần tải lại trang.
  useEffect(() => {
    if (!realtime) return;
    const socket = getSocket();
    if (!socket || typeof socket.on !== "function") return;

    const onNew = () => {
      void syncNewEmails();
    };
    /** Trạng thái đọc/sao thay đổi ở tab/thiết bị khác ⇒ cập nhật ngay (idempotent). */
    const onState = (payload: { messageId?: number; isRead?: boolean; isStarred?: boolean }) => {
      const id = Number(payload?.messageId);
      if (!id) return;
      const patch: Partial<MailListItemModel> = {};
      if (payload.isRead !== undefined) patch.isRead = payload.isRead;
      if (payload.isStarred !== undefined) patch.isStarred = payload.isStarred;
      if (Object.keys(patch).length === 0) return;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      setDetail((prev) => (prev && prev.message.id === id ? { ...prev, message: { ...prev.message, ...patch } } : prev));
    };
    const onConnect = () => {
      void syncNewEmails();
    };

    socket.on("email:new", onNew);
    socket.on("email:state", onState);
    socket.on("connect", onConnect);
    // Socket có thể đã kết nối sẵn trước khi hook mount.
    if (socket.connected) void syncNewEmails();

    return () => {
      socket.off("email:new", onNew);
      socket.off("email:state", onState);
      socket.off("connect", onConnect);
    };
  }, [realtime, syncNewEmails]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingList) return;
    // Ở chế độ tìm kiếm: tải thêm theo đúng bộ lọc đang áp dụng.
    if (searchModeRef.current) {
      await runSearch(searchText, searchSort, false);
      return;
    }
    await loadPage(activeFolder, false);
  }, [activeFolder, hasMore, loadingList, loadPage, runSearch, searchSort, searchText]);

  const refresh = useCallback(async () => {
    if (searchModeRef.current) {
      await runSearch(searchText, searchSort, true);
      return;
    }
    await loadPage(activeFolder, true);
  }, [activeFolder, loadPage, runSearch, searchSort, searchText]);

  const markRead = useCallback(
    async (id: number, isRead: boolean) => {
      // Cập nhật lạc quan trước.
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));
      const wasUnread = messages.find((m) => m.id === id)?.isRead === false;
      if (isRead && wasUnread) dispatch(bumpMailUnread(-1));
      if (!isRead && !wasUnread) dispatch(bumpMailUnread(1));
      try {
        await emailService.markRead(id, isRead);
      } catch (error: any) {
        console.warn("[mail] markRead lỗi:", error?.message || error);
      }
    },
    [dispatch, messages]
  );

  const openMessage = useCallback(
    async (id: number) => {
      setLoadingDetail(true);
      try {
        const data = await emailService.get(id);
        setDetail(data);
        if (!data.message.isRead) await markRead(id, true);
      } catch (error: any) {
        console.warn("[mail] openMessage lỗi:", error?.message || error);
      } finally {
        setLoadingDetail(false);
      }
    },
    [markRead]
  );

  const closeDetail = useCallback(() => setDetail(null), []);

  const toggleStar = useCallback(
    async (item: MailListItemModel) => {
      const next = !item.isStarred;
      setMessages((prev) => prev.map((m) => (m.id === item.id ? { ...m, isStarred: next } : m)));
      if (detail?.message.id === item.id) {
        setDetail({ ...detail, message: { ...detail.message, isStarred: next } });
      }
      try {
        await emailService.star(item.id, next);
      } catch (error: any) {
        console.warn("[mail] toggleStar lỗi:", error?.message || error);
      }
    },
    [detail]
  );

  // Nạp bootstrap 1 lần (nhẹ) để có badge + folders.
  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // Nạp trang đầu khi mở lần đầu (sau bootstrap).
  useEffect(() => {
    if (mail.bootstrapped && messages.length === 0 && !loadingList) {
      void loadPage("INBOX", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail.bootstrapped]);

  return {
    bootstrapped: mail.bootstrapped,
    booting,
    unreadTotal: mail.unreadTotal,
    hasOwnAccount: mail.hasOwnAccount,
    folders: mail.folders,
    accounts: mail.accounts,
    activeFolder,
    messages,
    hasMore,
    loadingList,
    listError,
    detail,
    loadingDetail,
    searchText,
    searchSort,
    searchMeta,
    inSearchMode: searchText.trim().length > 0,
    runSearch,
    clearSearch,
    bootstrap,
    reloadBootstrap,
    openFolder,
    loadMore,
    refresh,
    openMessage,
    closeDetail,
    toggleStar,
    markRead,
  };
}

export { setMailUnread };
