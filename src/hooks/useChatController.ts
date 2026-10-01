import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSocket, getUserData } from "../api/Api";
import { chatService, uploadChatFile } from "../api/services/chatService";
import { richToPlainText } from "../components/Chat/chatRichText";
import type {
  ChatConversation,
  ChatEmployee,
  ChatFriendEntry,
  ChatMessage,
  ChatPinnedMessage,
  ChatReactionBurst,
  ChatReactionType,
  ChatReplyTarget,
} from "../components/Chat/chat.types";

/** Danh sách cảm xúc hợp lệ — dùng để lọc sự kiện realtime trước khi bắn hiệu ứng tim bay. */
const REACTION_KEYS = new Set<ChatReactionType>([
  "LIKE",
  "LOVE",
  "HAHA",
  "WOW",
  "SAD",
  "ANGRY",
]);

/**
 * Số giây "coi như vô hạn" cho chế độ tắt thông báo **Cho tới khi mở lại** ở 1 phòng.
 * Server trả đúng mốc này (chặn trần 1 năm) nên chỉ cần so sánh ngưỡng.
 */
export const MUTE_UNTIL_OPEN_SECONDS = 365 * 24 * 3600;

/** Ngưỡng nhận biết chế độ "cho tới khi mở lại" (≥ 300 ngày). */
export const MUTE_UNTIL_OPEN_THRESHOLD_SECONDS = 300 * 24 * 3600;

/** True khi số giây còn lại thuộc chế độ "cho tới khi mở lại phòng". */
export function isMuteUntilOpen(secondsLeft: number): boolean {
  return Number(secondsLeft) >= MUTE_UNTIL_OPEN_THRESHOLD_SECONDS;
}

/** Lựa chọn tắt thông báo: số phút, "untilOpen", hoặc null = bật lại. */
export type ChatMuteOption = number | "untilOpen" | null;

/** Trạng thái tắt thông báo của 1 phòng (đã quy về mốc thời gian tuyệt đối). */
export interface ChatMuteState {
  /** Mốc hết hạn (ms). */
  deadline: number;
  untilOpen: boolean;
}

/** Số giây còn lại (đã trừ thời gian trôi qua từ lúc nhận). */
function muteSecondsLeftOf(state: ChatMuteState | undefined, now: number): number | null {
  if (!state) return null;
  const ms = state.deadline - now;
  return ms > 0 ? Math.round(ms / 1000) : null;
}

export interface PendingUpload {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

const makeClientId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Trần bộ nhớ cho bộ chống trùng tin nhắn.
 * Set chỉ cần giữ các id GẦN ĐÂY (đủ để chặn bản phát lặp trong cùng thời điểm);
 * nếu để phình vô hạn thì người chat nhiều giờ sẽ tăng RAM không cần thiết.
 */
const SEEN_MESSAGE_LIMIT = 5000;
const SEEN_MESSAGE_KEEP = 3000;

/** Thêm MESSAGE_ID vào bộ chống trùng, tự bỏ phần CŨ NHẤT khi vượt trần. */
function rememberSeenMessage(seen: Set<number>, id: number) {
  if (seen.size >= SEEN_MESSAGE_LIMIT) {
    const drop = seen.size - SEEN_MESSAGE_KEEP;
    let index = 0;
    for (const value of seen) {
      if (index++ >= drop) break;
      seen.delete(value);
    }
  }
  seen.add(id);
}

/** Mốc thời gian ghim (ms) — 0 nghĩa là không ghim. */
function pinTime(conversation: ChatConversation): number {
  if (!conversation.PINNED_AT) return 0;
  const value = Date.parse(conversation.PINNED_AT);
  return Number.isFinite(value) ? value : 0;
}

/** Mốc hoạt động gần nhất (tin cuối, hoặc lúc tạo phòng nếu chưa có tin). */
function activityTime(conversation: ChatConversation): number {
  const raw = conversation.LAST_MESSAGE?.CREATED_AT || conversation.CREATED_AT || "";
  const value = Date.parse(String(raw));
  return Number.isFinite(value) ? value : 0;
}

/**
 * Sắp xếp danh sách phòng GIỐNG server:
 * phòng đã ghim lên trước (ghim MỚI hơn ở trên cùng), phần còn lại theo hoạt động mới nhất.
 */
export function sortConversations(list: ChatConversation[]): ChatConversation[] {
  return [...list].sort((a, b) => {
    const aPin = pinTime(a);
    const bPin = pinTime(b);
    if (aPin !== bPin) return bPin - aPin;
    return activityTime(b) - activityTime(a);
  });
}

/**
 * Quản lý toàn bộ trạng thái chat: danh sách phòng, tin nhắn, gửi lạc quan,
 * typing, presence và số tin chưa đọc. Socket là singleton của app nên hook này
 * chỉ đăng ký/gỡ listener, không tự tạo kết nối.
 */
export function useChatController() {
  const myEmplNo = String(getUserData()?.EMPL_NO || "").toUpperCase();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [hasMore, setHasMore] = useState<Record<number, boolean>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [booting, setBooting] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [requests, setRequests] = useState<ChatFriendEntry[]>([]);
  const [friends, setFriends] = useState<ChatFriendEntry[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, Record<string, string>>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  /** Cảm xúc vừa được thả ở nơi khác ⇒ bắn hiệu ứng tim bay ở mọi phía đang mở phòng. */
  const [reactionBurst, setReactionBurst] = useState<ChatReactionBurst | null>(null);
  /** Tin nhắn đang được trả lời (hiện trong composer). */
  const [replyTarget, setReplyTarget] = useState<ChatReplyTarget | null>(null);
  /** Văn bản soạn sẵn khi bấm vào tên được tag để mở chat riêng. */
  const [draft, setDraft] = useState<{ conversationId: number; text: string } | null>(null);
  /** Tin nhắn cần nhảy tới (sau khi tìm kiếm) — đổi `seq` để kích hoạt lại hiệu ứng. */
  const [focusMessage, setFocusMessage] = useState<{
    conversationId: number;
    messageId: number;
    seq: number;
  } | null>(null);

  /**
   * Trạng thái TẮT THÔNG BÁO theo TỪNG PHÒNG (mốc hết hạn tuyệt đối).
   * Nguồn sự thật là server (participant.MUTED_UNTIL) nên đổi máy vẫn giữ nguyên.
   */
  const [muteStates, setMuteStates] = useState<Record<number, ChatMuteState>>({});
  const muteStatesRef = useRef<Record<number, ChatMuteState>>({});
  muteStatesRef.current = muteStates;

  /** Mốc đọc cuối của từng thành viên: conversationId → emplNo → messageId. */
  const [readState, setReadState] = useState<Record<number, Record<string, number>>>({});

  /** Tin nhắn đang ghim của từng phòng (ghim mới nhất trước). */
  const [pins, setPins] = useState<Record<number, ChatPinnedMessage[]>>({});

  /** Cửa sổ chat đang mở hay không — ChatDock đồng bộ xuống để biết khi nào cần tự bật. */
  const dockOpenRef = useRef(false);
  /**
   * Yêu cầu "mở cửa sổ chat và vào đúng phòng này" khi có tin mới.
   * `seq` đổi mỗi lần nên cùng 1 phòng nhận nhiều tin vẫn kích hoạt lại.
   */
  const [autoOpen, setAutoOpen] = useState<{ conversationId: number; seq: number } | null>(null);

  const activeIdRef = useRef<number | null>(null);
  const typingTimers = useRef<Record<string, number>>({});
  const conversationsRef = useRef<ChatConversation[]>([]);
  const replyTargetRef = useRef<ChatReplyTarget | null>(null);
  /** Bản mới nhất của tin nhắn — cần cho markRead vì state trong closure có thể đã cũ. */
  const messagesRef = useRef<Record<number, ChatMessage[]>>({});
  /** Chống xử lý trùng: server phát cùng 1 tin qua cả room phòng và room user. */
  const seenMessageIds = useRef<Set<number>>(new Set());
  /** Chống nhân đôi hiệu ứng tim bay khi cùng 1 sự kiện cảm xúc được phát 2 lần. */
  const lastBurstKeyRef = useRef("");

  activeIdRef.current = activeId;
  conversationsRef.current = conversations;
  replyTargetRef.current = replyTarget;
  messagesRef.current = messages;

  const activeConversation = useMemo(
    () => conversations.find((c) => c.CONVERSATION_ID === activeId) || null,
    [conversations, activeId]
  );

  const activeMessages = activeId ? messages[activeId] || [] : [];

  /** Số giây còn tắt thông báo của 1 phòng (null = đang nhận thông báo). */
  const muteSecondsLeftOfConversation = useCallback(
    (conversationId: number): number | null =>
      muteSecondsLeftOf(muteStatesRef.current[conversationId], Date.now()),
    []
  );

  /** Đang tắt thông báo phòng này? Dùng để chặn tự bật cửa sổ khi có tin mới. */
  const isConversationMuted = useCallback((conversationId: number): boolean => {
    const state = muteStatesRef.current[conversationId];
    return Boolean(state && state.deadline > Date.now());
  }, []);

  /**
   * Tắt/bật thông báo cho RIÊNG 1 phòng.
   * `null` = bật lại; `"untilOpen"` = tới khi mở lại phòng; số = số phút.
   */
  const setConversationMute = useCallback(
    async (conversationId: number, option: ChatMuteOption) => {
      const payload =
        option === null
          ? { mode: "off" as const }
          : option === "untilOpen"
            ? { mode: "untilOpen" as const }
            : { mode: "minutes" as const, minutes: option };

      try {
        const result = await chatService.muteConversation(conversationId, payload);
        const seconds = Number(result?.mutedSecondsLeft) > 0 ? Number(result.mutedSecondsLeft) : 0;
        setMuteStates((prev) => {
          const next = { ...prev };
          if (seconds > 0) next[conversationId] = { deadline: Date.now() + seconds * 1000, untilOpen: Boolean(result.mutedUntilOpen) };
          else delete next[conversationId];
          return next;
        });
        setConversations((prev) =>
          prev.map((c) =>
            c.CONVERSATION_ID === conversationId
              ? {
                  ...c,
                  MUTED: seconds > 0,
                  MUTED_SECONDS_LEFT: seconds > 0 ? seconds : null,
                  MUTED_UNTIL_OPEN: Boolean(result?.mutedUntilOpen),
                }
              : c
          )
        );
      } catch (error) {
        console.warn("[chat] đổi trạng thái thông báo lỗi:", error);
      }
    },
    []
  );

  /** ChatDock báo lên trạng thái mở/đóng để tránh tự bật khi cửa sổ đã mở đúng phòng. */
  const setDockOpen = useCallback((open: boolean) => {
    dockOpenRef.current = open;
  }, []);

  /** ChatDock gọi sau khi đã xử lý yêu cầu tự mở (tránh lặp vô hạn vì `controller` đổi mỗi render). */
  const consumeAutoOpen = useCallback(() => setAutoOpen(null), []);

  /* ----------------------------- Nạp dữ liệu ---------------------------- */

  const applySync = useCallback(
    (list: ChatConversation[], unread: number, onlineEmplNos?: string[]) => {
      setConversations(sortConversations(list));
      setUnreadTotal(unread);
      // Danh sách online đầy đủ từ server — thiếu bước này FE sẽ hiển thị
      // tất cả là "không hoạt động" cho tới khi có sự kiện presence đầu tiên.
      if (Array.isArray(onlineEmplNos)) {
        setOnlineUsers(new Set(onlineEmplNos.map((v) => String(v || "").trim().toUpperCase())));
      }

      // Tắt thông báo theo phòng: đổi số giây còn lại thành mốc tuyệt đối để đếm ngược.
      const now = Date.now();
      const nextMutes: Record<number, ChatMuteState> = {};
      list.forEach((conversation) => {
        const seconds = Number(conversation.MUTED_SECONDS_LEFT);
        if (Number.isFinite(seconds) && seconds > 0) {
          nextMutes[conversation.CONVERSATION_ID] = {
            deadline: now + seconds * 1000,
            untilOpen: Boolean(conversation.MUTED_UNTIL_OPEN),
          };
        }
      });
      setMuteStates(nextMutes);

      // Mốc đọc cuối của từng thành viên → đếm "ai đã xem" từng tin nhắn.
      const nextReads: Record<number, Record<string, number>> = {};
      const nextPins: Record<number, ChatPinnedMessage[]> = {};
      list.forEach((conversation) => {
        const markers: Record<string, number> = {};
        (conversation.MEMBERS || []).forEach((member) => {
          markers[member.EMPL_NO] = Number(member.LAST_READ_MESSAGE_ID) || 0;
        });
        nextReads[conversation.CONVERSATION_ID] = markers;
        nextPins[conversation.CONVERSATION_ID] = conversation.PINNED || [];
      });
      setReadState(nextReads);
      setPins((prev) => {
        // Giữ lại ghim vừa thao tác lạc quan ở phòng CHƯA có trong danh sách vừa tải.
        const merged: Record<number, ChatPinnedMessage[]> = { ...nextPins };
        Object.keys(prev).forEach((key) => {
          const id = Number(key);
          if (!(id in merged)) merged[id] = prev[id];
        });
        return merged;
      });
    },
    []
  );

  const refreshBadge = useCallback(async () => {
    try {
      const result = await chatService.sync();
      applySync(result.conversations, result.unreadTotal, result.onlineEmplNos);
    } catch {
      // Badge là thông tin phụ — lỗi mạng không nên làm ồn UI.
    }
  }, [applySync]);

  /**
   * Đồng bộ tin nhắn bị LỠ sau khi socket nối lại.
   *
   * Trước đây khi mất mạng, client chỉ `chat:join` lại phòng mà KHÔNG lấy các tin
   * đã bỏ lỡ trong lúc offline ⇒ phải F5 mới thấy. Nay gọi `chatSyncMessages`
   * với `afterMessageId` = MESSAGE_ID mới nhất đang có ⇒ chỉ tải phần còn thiếu.
   */
  const syncAfterReconnect = useCallback(
    async (conversationId: number) => {
      const current = messagesRef.current[conversationId];
      if (!current || current.length === 0) return;
      const lastId = current[current.length - 1].MESSAGE_ID;
      if (!Number.isFinite(lastId) || lastId <= 0) return;
      try {
        const result = await chatService.syncMessages(conversationId, lastId, 200);
        const incoming = result.messages || [];
        if (incoming.length === 0) return;

        const curSeen = new Set(current.map((m) => m.MESSAGE_ID));
        const missing = incoming.filter((m) => !curSeen.has(m.MESSAGE_ID));
        if (missing.length === 0) return;

        // Đánh dấu đã xử lý để bản phát lặp qua socket không cộng nhầm số chưa đọc.
        missing.forEach((m) => seenMessageIds.current.add(m.MESSAGE_ID));

        setMessages((prev) => {
          const list = prev[conversationId] || [];
          const seen = new Set(list.map((m) => m.MESSAGE_ID));
          const add = missing.filter((m) => !seen.has(m.MESSAGE_ID));
          if (add.length === 0) return prev;
          return {
            ...prev,
            [conversationId]: [...list, ...add].sort((a, b) => a.MESSAGE_ID - b.MESSAGE_ID),
          };
        });
        // Danh sách phòng/badge có thể cũng lỡ ⇒ làm mới (nhẹ, chỉ metadata).
        void refreshBadge();
      } catch (error) {
        console.warn("[chat] đồng bộ sau reconnect lỗi:", error);
      }
    },
    [refreshBadge]
  );

  /**
   * Báo server "thiết bị này đang thực sự được dùng" (tab đang hiển thị).
   * Server dùng mốc này để quyết định push theo TỪNG thiết bị.
   */
  const markDeviceActive = useCallback(() => {
    const socket = getSocket();
    if (socket?.connected) socket.emit("chat:active");
  }, []);

  /** Ghim / bỏ ghim 1 tin nhắn trong phòng (cập nhật lạc quan, server sẽ xác nhận). */
  const setMessagePinned = useCallback(
    async (conversationId: number, messageId: number, pinned: boolean) => {
      setPins((prev) => {
        const list = prev[conversationId] || [];
        if (!pinned) {
          return { ...prev, [conversationId]: list.filter((p) => p.MESSAGE_ID !== messageId) };
        }
        if (list.some((p) => p.MESSAGE_ID === messageId)) return prev;
        const message = (messagesRef.current[conversationId] || []).find(
          (m) => m.MESSAGE_ID === messageId
        );
        const entry: ChatPinnedMessage = {
          MESSAGE_ID: messageId,
          SENDER_EMPL_NO: message?.SENDER_EMPL_NO || myEmplNo,
          MSG_TYPE: message?.MSG_TYPE || "TEXT",
          CONTENT: message?.CONTENT ?? null,
          CREATED_AT: message?.CREATED_AT || new Date().toISOString(),
          PINNED_AT: new Date().toISOString(),
          PINNED_BY: myEmplNo,
        };
        return { ...prev, [conversationId]: [entry, ...list] };
      });

      try {
        await chatService.pinMessage(conversationId, messageId, pinned);
      } catch (error) {
        console.warn("[chat] ghim tin nhắn lỗi:", error);
        // Sai ⇒ đồng bộ lại từ server để không hiển thị trạng thái sai.
        await refreshBadge();
      }
    },
    [myEmplNo, refreshBadge]
  );

  /**
   * Thay thế nguyên trạng bản tổng hợp cảm xúc của 1 tin nhắn bằng dữ liệu từ server.
   * Dùng dữ liệu server (không tự cộng trừ ở client) vì mỗi người có thể thả nhiều lần
   * và chỉ server mới biết chính xác số đếm.
   * PHẢI khai báo TRƯỚC effect socket vì effect dùng nó trong dependency.
   */
  const applyReactions = useCallback(
    (conversationId: number, messageId: number, reactions: ChatMessage["REACTIONS"]) => {
      setMessages((prev) => {
        const list = prev[conversationId];
        if (!list) return prev;
        return {
          ...prev,
          [conversationId]: list.map((message) =>
            message.MESSAGE_ID === messageId ? { ...message, REACTIONS: reactions || {} } : message
          ),
        };
      });
    },
    []
  );

  const bootstrap = useCallback(async () => {
    if (booting) return;
    setBooting(true);
    try {
      const data = await chatService.bootstrap();
      applySync(data.conversations, data.unreadTotal, data.onlineEmplNos);
      setRequests(data.requests || []);
      setFriends(
        (data.friends || []).map((f) => ({
          FRIEND_ID: f.FRIEND_ID,
          PARTNER: f.PARTNER,
          STATUS: f.STATUS,
        }))
      );
      setBootstrapped(true);
    } catch (error) {
      console.warn("[chat] bootstrap lỗi:", error);
    } finally {
      setBooting(false);
    }
  }, [applySync, booting]);

  useEffect(() => {
    if (!myEmplNo) return;
    void refreshBadge();
  }, [myEmplNo, refreshBadge]);

  /* --------------------------------- Đọc -------------------------------- */

  const markRead = useCallback(
    (conversationId: number, explicitLastId?: number) => {
      // `messages` trong closure có thể là bản CŨ (vừa setMessages chưa re-render) ⇒ đọc qua ref,
      // và luôn ưu tiên id truyền vào. Trước đây đọc state cũ nên lastId = 0 ⇒ bỏ luôn việc
      // báo đã đọc lên server, khiến badge còn nguyên sau khi F5.
      const list = messagesRef.current[conversationId] || [];
      const fromList = list.length > 0 ? list[list.length - 1].MESSAGE_ID : 0;
      const lastId = Number(explicitLastId) > 0 ? Number(explicitLastId) : fromList;

      setConversations((prev) =>
        prev.map((c) =>
          c.CONVERSATION_ID === conversationId ? { ...c, UNREAD_COUNT: 0 } : c
        )
      );
      setUnreadTotal((prev) => {
        const target = conversations.find((c) => c.CONVERSATION_ID === conversationId);
        return Math.max(0, prev - (target?.UNREAD_COUNT || 0));
      });
      if (lastId <= 0) return;
      const socket = getSocket();
      if (socket?.connected) socket.emit("chat:read", { conversationId, lastMessageId: lastId });
      else void chatService.markRead(conversationId, lastId).catch(() => undefined);
    },
    [conversations]
  );

  const selectConversation = useCallback(
    async (conversationId: number) => {
      setActiveId(conversationId);
      /*
       * Chế độ "Cho tới khi mở lại phòng" ⇒ người dùng vừa mở lại phòng này nên bật lại thông báo.
       * Chỉ áp dụng cho ĐÚNG phòng đó, không ảnh hưởng các phòng khác.
       */
      const muteState = muteStatesRef.current[conversationId];
      if (muteState?.untilOpen && muteState.deadline > Date.now()) {
        void setConversationMute(conversationId, null);
      }
      const socket = getSocket();
      if (socket?.connected) socket.emit("chat:join", { conversationId });

      if (messages[conversationId]) {
        markRead(conversationId);
        return messages[conversationId];
      }

      setLoadingMessages(true);
      try {
        const result = await chatService.loadMessages(conversationId, undefined, 40);
        setMessages((prev) => ({ ...prev, [conversationId]: result.messages }));
        setHasMore((prev) => ({ ...prev, [conversationId]: result.hasMore }));
        // Truyền thẳng id mới nhất vừa tải (không phụ thuộc state vừa set).
        const newest = result.messages.length > 0
          ? result.messages[result.messages.length - 1].MESSAGE_ID
          : 0;
        markRead(conversationId, newest);
        return result.messages;
      } catch (error) {
        console.warn("[chat] loadMessages lỗi:", error);
        return [];
      } finally {
        setLoadingMessages(false);
      }
    },
    [markRead, messages, setConversationMute]
  );

  /**
   * Nhảy tới 1 tin nhắn (từ kết quả tìm kiếm): mở phòng, nạp thêm nếu tin chưa có
   * trong bộ đang hiển thị, rồi phát tín hiệu để view cuộn tới và làm nổi bật.
   */
  const jumpToMessage = useCallback(
    async (conversationId: number, messageId: number) => {
      const loaded = (await selectConversation(conversationId)) || [];

      if (!loaded.some((m) => m.MESSAGE_ID === messageId)) {
        try {
          // Lấy 1 trang kết thúc ngay tại tin cần tìm (before = id + 1).
          const result = await chatService.loadMessages(conversationId, messageId + 1, 30);
          if (result.messages.length > 0) {
            setMessages((prev) => {
              const existing = prev[conversationId] || [];
              const seen = new Set(existing.map((m) => m.MESSAGE_ID));
              const merged = [...existing, ...result.messages.filter((m) => !seen.has(m.MESSAGE_ID))]
                .sort((a, b) => a.MESSAGE_ID - b.MESSAGE_ID);
              return { ...prev, [conversationId]: merged };
            });
          }
        } catch (error) {
          console.warn("[chat] không nạp được quanh tin nhắn:", error);
        }
      }

      setFocusMessage({ conversationId, messageId, seq: Date.now() });
    },
    [selectConversation]
  );

  const loadMore = useCallback(
    async (conversationId: number) => {
      const list = messages[conversationId] || [];
      if (list.length === 0 || loadingMore) return;
      setLoadingMore(true);
      try {
        const result = await chatService.loadMessages(conversationId, list[0].MESSAGE_ID, 40);
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...result.messages, ...(prev[conversationId] || [])],
        }));
        setHasMore((prev) => ({ ...prev, [conversationId]: result.hasMore }));
      } catch (error) {
        console.warn("[chat] loadMore lỗi:", error);
      } finally {
        setLoadingMore(false);
      }
    },
    [loadingMore, messages]
  );

  /* -------------------------------- Gửi --------------------------------- */

  const appendMessage = useCallback((conversationId: number, message: ChatMessage) => {
    setMessages((prev) => {
      const list = prev[conversationId];
      if (!list) return prev;
      if (list.some((m) => m.MESSAGE_ID === message.MESSAGE_ID)) return prev;
      // Bỏ tin lạc quan trùng clientMessageId để tránh nhân đôi.
      const filtered = message.CLIENT_MESSAGE_ID
        ? list.filter((m) => m.CLIENT_MESSAGE_ID !== message.CLIENT_MESSAGE_ID)
        : list;
      return { ...prev, [conversationId]: [...filtered, { ...message, _status: "sent" }] };
    });
  }, []);

  const bumpConversationPreview = useCallback(
    (conversationId: number, message: ChatMessage, incrementUnread: boolean) => {
      setConversations((prev) =>
        // Sắp xếp LẠI sau mỗi lần cập nhật tin cuối: phòng vừa có hoạt động phải nhảy lên
        // ngay dưới các phòng đã ghim, KHÔNG cần F5 mới thấy thứ tự mới.
        sortConversations(
          prev.map((c) =>
            c.CONVERSATION_ID === conversationId
              ? {
                  ...c,
                  LAST_MESSAGE: {
                    MESSAGE_ID: message.MESSAGE_ID,
                    SENDER_EMPL_NO: message.SENDER_EMPL_NO,
                    MSG_TYPE: message.MSG_TYPE,
                    CONTENT: message.CONTENT,
                    CREATED_AT: message.CREATED_AT,
                  },
                  UNREAD_COUNT: incrementUnread ? c.UNREAD_COUNT + 1 : 0,
                }
              : c
          )
        )
      );
      if (incrementUnread) setUnreadTotal((prev) => prev + 1);
    },
    []
  );

  const sendMessage = useCallback(
    async (payload: {
      content: string;
      files?: File[];
      mentions?: string[];
      replyToMessageId?: number;
      msgType?: string;
      /** Gửi vào phòng cụ thể (dùng cho luồng chia sẻ từ app khác); mặc định là phòng đang mở. */
      conversationId?: number;
    }) => {
      const conversationId = Number(payload.conversationId) || activeIdRef.current;
      if (!conversationId) return;

      const content = payload.content.trim();
      const files = payload.files || [];
      if (!content && files.length === 0) return;

      const clientMessageId = makeClientId();
      // Loại tin: tôn trọng `msgType` do composer gửi (ví dụ "RICH" khi bật định dạng).
      const derivedType = files.length > 0
        ? files[0].type.startsWith("image/")
          ? "IMAGE"
          : "FILE"
        : "TEXT";
      const outgoingType = (payload.msgType as ChatMessage["MSG_TYPE"]) || derivedType;
      const optimistic: ChatMessage = {
        MESSAGE_ID: -Date.now(),
        CONVERSATION_ID: conversationId,
        SENDER_EMPL_NO: myEmplNo,
        MSG_TYPE: outgoingType,
        CONTENT: content || null,
        CREATED_AT: new Date().toISOString(),
        CLIENT_MESSAGE_ID: clientMessageId,
        ATTACHMENTS: [],
        _status: "sending",
      };
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), optimistic],
      }));

      // 1) Upload file trước (nếu có) để lấy attachmentIds.
      let attachmentIds: number[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const uploadId = `${clientMessageId}-${file.name}`;
          setPendingUploads((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }]);
          try {
            const uploaded = await uploadChatFile(file, conversationId, (event) => {
              const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
              setPendingUploads((prev) =>
                prev.map((item) => (item.id === uploadId ? { ...item, progress: percent } : item))
              );
            });
            attachmentIds.push(uploaded.attachmentId);
          } catch (error: any) {
            setPendingUploads((prev) =>
              prev.map((item) =>
                item.id === uploadId
                  ? { ...item, error: error?.response?.data?.message || "Upload thất bại" }
                  : item
              )
            );
          }
        }
      }

      // Đã "khoá" tin nhắn được trả lời vào payloadToSend ⇒ bỏ khỏi composer.
      if (replyTargetRef.current) setReplyTarget(null);

      const markFailed = () => {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((m) =>
            m.CLIENT_MESSAGE_ID === clientMessageId ? { ...m, _status: "failed" } : m
          ),
        }));
      };

      const payloadToSend = {
        conversationId,
        content,
        clientMessageId,
        mentions: payload.mentions,
        // Trả lời tin nhắn: ưu tiên tham số truyền vào, không thì dùng tin đang được chọn để trả lời.
        replyToMessageId: payload.replyToMessageId ?? replyTargetRef.current?.messageId,
        // Loại tin suy ra từ file đính kèm để server lưu đúng IMAGE/FILE.
        msgType: outgoingType,
        attachmentIds: attachmentIds.length > 0 ? attachmentIds : undefined,
      };

      // 2) Ưu tiên socket (realtime + ack); fallback HTTP khi mất kết nối.
      const socket = getSocket();
      const delivered = await new Promise<boolean>((resolve) => {
        if (!socket?.connected) return resolve(false);
        let settled = false;
        const timer = window.setTimeout(() => {
          if (!settled) {
            settled = true;
            resolve(false);
          }
        }, 12000);

        socket.emit("chat:send", payloadToSend, (ack: any) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          if (ack?.ok) {
            appendMessage(conversationId, ack.message);
            bumpConversationPreview(conversationId, ack.message, false);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });

      if (!delivered) {
        try {
          const result = await chatService.sendMessage(payloadToSend);
          appendMessage(conversationId, result.message);
          bumpConversationPreview(conversationId, result.message, false);
        } catch {
          markFailed();
        }
      }

      setPendingUploads([]);
    },
    [appendMessage, bumpConversationPreview, myEmplNo]
  );

  const retryMessage = useCallback(
    async (message: ChatMessage) => {
      const conversationId = message.CONVERSATION_ID;
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(
          (m) => m.CLIENT_MESSAGE_ID !== message.CLIENT_MESSAGE_ID
        ),
      }));
      const socket = getSocket();
      if (!socket?.connected) return;
      socket.emit(
        "chat:send",
        {
          conversationId,
          content: message.CONTENT || "",
          clientMessageId: message.CLIENT_MESSAGE_ID,
        },
        (ack: any) => {
          if (ack?.ok) {
            appendMessage(conversationId, ack.message);
            bumpConversationPreview(conversationId, ack.message, false);
          }
        }
      );
    },
    [appendMessage, bumpConversationPreview]
  );

  const deleteMessage = useCallback(async (conversationId: number, messageId: number) => {
    try {
      await chatService.deleteMessage(conversationId, messageId);
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((m) =>
          m.MESSAGE_ID === messageId
            ? { ...m, DELETED_AT: new Date().toISOString(), CONTENT: null }
            : m
        ),
      }));
    } catch (error) {
      console.warn("[chat] deleteMessage lỗi:", error);
    }
  }, []);

  /**
   * Xoá phòng chat (ẩn lịch sử phía TÔI): bỏ khỏi danh sách và xoá bộ tin đang giữ.
   * Nếu đối phương nhắn tin mới, phòng sẽ tự hiện lại (server đã xử lý ở mốc xoá).
   */
  const deleteConversation = useCallback(async (conversationId: number) => {
    try {
      await chatService.deleteConversation(conversationId);
    } catch (error) {
      console.warn("[chat] deleteConversation lỗi:", error);
      return;
    }
    setConversations((prev) => prev.filter((c) => c.CONVERSATION_ID !== conversationId));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    setPins((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    setReadState((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    if (activeIdRef.current === conversationId) setActiveId(null);
  }, []);

  /**
   * Xoá NHIỀU tin nhắn đang chọn.
   *  - mode "hide"   ⇒ ẩn với riêng mình.
   *  - mode "recall" ⇒ thu hồi với cả hai phía (bong bóng chuyển "đã thu hồi").
   */
  const deleteMessages = useCallback(
    async (conversationId: number, messageIds: number[], mode: "hide" | "recall") => {
      if (messageIds.length === 0) return null;
      try {
        const result = await chatService.deleteMessages(conversationId, messageIds, mode);
        const hidden = new Set(result?.hidden || []);
        const recalled = new Set(result?.recalled || []);
        setMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || [])
            .filter((m) => !hidden.has(m.MESSAGE_ID))
            .map((m) =>
              recalled.has(m.MESSAGE_ID)
                ? { ...m, DELETED_AT: new Date().toISOString(), CONTENT: null }
                : m
            ),
        }));
        return result;
      } catch (error) {
        console.warn("[chat] deleteMessages lỗi:", error);
        return null;
      }
    },
    []
  );

  const notifyTyping = useCallback((typing: boolean) => {
    const conversationId = activeIdRef.current;
    if (!conversationId) return;
    const socket = getSocket();
    socket?.emit("chat:typing", { conversationId, typing });
  }, []);

  /* ------------------------------- Socket -------------------------------- */

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onMessage = (payload: { conversationId: number; message: ChatMessage }) => {
      const { conversationId, message } = payload || ({} as any);
      if (!conversationId || !message) return;

      // Server phát 2 lần (room phòng + room user) ⇒ chỉ xử lý 1 lần để không
      // nhân đôi số chưa đọc và không thêm trùng tin nhắn.
      if (seenMessageIds.current.has(message.MESSAGE_ID)) return;
      rememberSeenMessage(seenMessageIds.current, message.MESSAGE_ID);

      // Hội thoại chưa có trong danh sách (người mới nhắn lần đầu) ⇒ nạp lại danh sách
      // để tin nhắn/badge xuất hiện ngay, không cần tải lại trang.
      if (!conversationsRef.current.some((c) => c.CONVERSATION_ID === conversationId)) {
        void refreshBadge();
      }

      appendMessage(conversationId, message);
      const isMine = message.SENDER_EMPL_NO === myEmplNo;
      const isActive = activeIdRef.current === conversationId;
      bumpConversationPreview(conversationId, message, !isMine && !isActive);
      if (isActive && !isMine) {
        const socketNow = getSocket();
        socketNow?.emit("chat:read", { conversationId, lastMessageId: message.MESSAGE_ID });
      }

      // Tự bật cửa sổ chat và vào đúng phòng khi có tin mới tới — TRỪ khi:
      //  - tin do chính mình gửi;
      //  - phòng đó đang "tắt thông báo" (muốn tập trung làm việc);
      //  - phòng đó đang được mở sẵn (không cần bật lại).
      if (!isMine && !isConversationMuted(conversationId)) {
        const alreadyVisible = dockOpenRef.current && isActive;
        if (!alreadyVisible) {
          setAutoOpen({ conversationId, seq: Date.now() + Math.random() });
        }
      }
    };

    const onMessageDeleted = (payload: { conversationId: number; messageId: number }) => {
      const { conversationId, messageId } = payload || ({} as any);
      if (!conversationId || !messageId) return;
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((m) =>
          m.MESSAGE_ID === messageId
            ? { ...m, DELETED_AT: new Date().toISOString(), CONTENT: null }
            : m
        ),
      }));
    };

    /** Thu hồi HÀNG LOẠT (chọn nhiều tin) — bong bóng chuyển "đã thu hồi". */
    const onMessagesDeleted = (payload: { conversationId: number; messageIds: number[] }) => {
      const { conversationId, messageIds } = payload || ({} as any);
      if (!conversationId || !Array.isArray(messageIds) || messageIds.length === 0) return;
      const ids = new Set(messageIds.map((v) => Number(v)));
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((m) =>
          ids.has(m.MESSAGE_ID)
            ? { ...m, DELETED_AT: new Date().toISOString(), CONTENT: null }
            : m
        ),
      }));
    };

    /** "Xoá ở phía tôi" HÀNG LOẠT — bỏ hẳn khỏi khung tin nhắn. */
    const onMessagesHidden = (payload: { conversationId: number; messageIds: number[] }) => {
      const { conversationId, messageIds } = payload || ({} as any);
      if (!conversationId || !Array.isArray(messageIds) || messageIds.length === 0) return;
      const ids = new Set(messageIds.map((v) => Number(v)));
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter((m) => !ids.has(m.MESSAGE_ID)),
      }));
    };

    /** Xoá phòng chat ở tab/thiết bị KHÁC của CÙNG người dùng. */
    const onConversationCleared = (payload: { conversationId: number }) => {
      const conversationId = payload?.conversationId;
      if (!conversationId) return;
      setConversations((prev) => prev.filter((c) => c.CONVERSATION_ID !== conversationId));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
      if (activeIdRef.current === conversationId) setActiveId(null);
    };

    const onTyping = (payload: { conversationId: number; emplNo: string; emplName?: string; typing: boolean }) => {
      const { conversationId, emplNo, emplName, typing } = payload || ({} as any);
      if (!conversationId || !emplNo || emplNo === myEmplNo) return;

      setTypingUsers((prev) => {
        const forConversation = { ...(prev[conversationId] || {}) };
        if (typing) forConversation[emplNo] = emplName || emplNo;
        else delete forConversation[emplNo];
        return { ...prev, [conversationId]: forConversation };
      });

      if (typing) {
        const key = `${conversationId}:${emplNo}`;
        window.clearTimeout(typingTimers.current[key]);
        typingTimers.current[key] = window.setTimeout(() => {
          setTypingUsers((prev) => {
            const forConversation = { ...(prev[conversationId] || {}) };
            delete forConversation[emplNo];
            return { ...prev, [conversationId]: forConversation };
          });
        }, 4000);
      }
    };

    const onPresence = (payload: { emplNo: string; online: boolean }) => {
      const { emplNo, online } = payload || ({} as any);
      if (!emplNo) return;
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (online) next.add(emplNo);
        else next.delete(emplNo);
        return next;
      });
    };

    const onConversationUpdated = () => {
      void refreshBadge();
    };

    const onConversationRemoved = (payload: { conversationId: number }) => {
      const conversationId = payload?.conversationId;
      if (!conversationId) return;
      setConversations((prev) => prev.filter((c) => c.CONVERSATION_ID !== conversationId));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
      if (activeIdRef.current === conversationId) setActiveId(null);
    };

    const onReaction = (payload: {
      conversationId: number;
      messageId: number;
      emplNo?: string;
      reaction?: string | null;
      removed?: boolean;
      reactions?: ChatMessage["REACTIONS"];
    }) => {
      const { conversationId, messageId, reactions } = payload || ({} as any);
      if (!conversationId || !messageId) return;
      // Server gửi kèm bản tổng hợp số đếm ⇒ thay thế nguyên trạng, không tự cộng trừ.
      if (reactions) applyReactions(conversationId, messageId, reactions);

      // Hiệu ứng tim bay ở phía NGƯỜI KHÁC (chính mình đã bắn ngay khi bấm).
      const actor = String((payload as any)?.emplNo || "").trim().toUpperCase();
      const reaction = String((payload as any)?.reaction || "").trim().toUpperCase();
      if (!actor || actor === myEmplNo || !reaction || (payload as any)?.removed) return;
      if (!REACTION_KEYS.has(reaction as ChatReactionType)) return;
      // Server phát cùng sự kiện qua CẢ room phòng và room user ⇒ chống nhân đôi hiệu ứng
      // bằng "chữ ký" gồm người thả + loại + số đếm mới nhất.
      const count = (reactions as any)?.[reaction]?.count ?? 0;
      const signature = `${messageId}:${actor}:${reaction}:${count}`;
      if (lastBurstKeyRef.current === signature) return;
      lastBurstKeyRef.current = signature;
      setReactionBurst({
        conversationId,
        messageId,
        emplNo: actor,
        reaction: reaction as ChatReactionType,
        seq: Date.now() + Math.random(),
      });
    };

    const onPresenceList = (payload: { emplNos?: string[] }) => {
      const list = payload?.emplNos;
      if (!Array.isArray(list)) return;
      setOnlineUsers(new Set(list.map((value) => String(value || "").trim().toUpperCase())));
    };

    const onMessageHidden = (payload: { conversationId: number; messageId: number }) => {
      const { conversationId, messageId } = payload || ({} as any);
      if (!conversationId || !messageId) return;
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter((m) => m.MESSAGE_ID !== messageId),
      }));
    };

    const onFriendRequest = () => {
      void bootstrap();
    };

    /** Có người ghim / bỏ ghim tin nhắn ⇒ cập nhật thanh ghim của phòng. */
    const onPinned = (payload: {
      conversationId: number;
      messageId: number;
      pinned: boolean;
      pinnedBy?: string;
      pinnedAt?: string | null;
    }) => {
      const { conversationId, messageId, pinned, pinnedBy, pinnedAt } = payload || ({} as any);
      if (!conversationId || !messageId) return;
      setPins((prev) => {
        const list = prev[conversationId] || [];
        if (!pinned) {
          return { ...prev, [conversationId]: list.filter((p) => p.MESSAGE_ID !== messageId) };
        }
        if (list.some((p) => p.MESSAGE_ID === messageId)) return prev;
        const message = (messagesRef.current[conversationId] || []).find(
          (m) => m.MESSAGE_ID === messageId
        );
        // Tin không nằm trong bộ đang hiển thị ⇒ không đủ dựng preview; gọi chatSync để
        // lấy nội dung thật (chỉ 1 lần, xảy ra khi bị ghim ở phòng chưa mở).
        if (!message) {
          void refreshBadge();
          return prev;
        }
        return {
          ...prev,
          [conversationId]: [
            {
              MESSAGE_ID: messageId,
              SENDER_EMPL_NO: message.SENDER_EMPL_NO,
              MSG_TYPE: message.MSG_TYPE,
              CONTENT: message.CONTENT,
              CREATED_AT: message.CREATED_AT,
              PINNED_AT: pinnedAt || new Date().toISOString(),
              PINNED_BY: pinnedBy || null,
            },
            ...list,
          ],
        };
      });
    };

    /** Người khác đọc tin ⇒ cập nhật mốc đã đọc để đếm "ai đã xem". */
    const onReadState = (payload: {
      conversationId: number;
      emplNo: string;
      lastMessageId: number;
    }) => {
      const { conversationId, emplNo, lastMessageId } = payload || ({} as any);
      if (!conversationId || !emplNo) return;
      const who = String(emplNo).trim().toUpperCase();
      const id = Number(lastMessageId) || 0;
      if (id <= 0) return;
      setReadState((prev) => {
        const forConversation = { ...(prev[conversationId] || {}) };
        if ((forConversation[who] || 0) >= id) return prev;
        forConversation[who] = id;
        return { ...prev, [conversationId]: forConversation };
      });
    };

    // Socket có thể mất kết nối rồi tự nối lại (đổi mạng, server restart) ⇒ phải vào lại
    // room phòng đang mở, ĐỒNG BỘ các tin bị lỡ, và báo thiết bị đang active.
    const onConnect = () => {
      const conversationId = activeIdRef.current;
      markDeviceActive();
      if (conversationId) {
        socket.emit("chat:join", { conversationId });
        void syncAfterReconnect(conversationId);
      }
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:reaction", onReaction);
    socket.on("chat:pinned", onPinned);
    socket.on("chat:read", onReadState);
    socket.on("chat:presence-list", onPresenceList);
    socket.on("chat:message-hidden", onMessageHidden);
    socket.on("chat:message-deleted", onMessageDeleted);
    socket.on("chat:messages-deleted", onMessagesDeleted);
    socket.on("chat:messages-hidden", onMessagesHidden);
    socket.on("chat:conversation-cleared", onConversationCleared);
    socket.on("chat:typing", onTyping);
    socket.on("chat:presence", onPresence);
    socket.on("chat:conversation-updated", onConversationUpdated);
    socket.on("chat:conversation-removed", onConversationRemoved);
    socket.on("chat:members-changed", onConversationUpdated);
    socket.on("chat:friend-request", onFriendRequest);
    socket.on("connect", onConnect);
    // Socket đã kết nối sẵn từ trước khi hook mount ⇒ vào room ngay.
    if (socket.connected) onConnect();

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:reaction", onReaction);
      socket.off("chat:pinned", onPinned);
      socket.off("chat:read", onReadState);
      socket.off("chat:presence-list", onPresenceList);
      socket.off("chat:message-hidden", onMessageHidden);
      socket.off("chat:message-deleted", onMessageDeleted);
      socket.off("chat:messages-deleted", onMessagesDeleted);
      socket.off("chat:messages-hidden", onMessagesHidden);
      socket.off("chat:conversation-cleared", onConversationCleared);
      socket.off("chat:typing", onTyping);
      socket.off("chat:presence", onPresence);
      socket.off("chat:conversation-updated", onConversationUpdated);
      socket.off("chat:conversation-removed", onConversationRemoved);
      socket.off("chat:members-changed", onConversationUpdated);
      socket.off("chat:friend-request", onFriendRequest);
      socket.off("connect", onConnect);
    };
  }, [
    appendMessage,
    applyReactions,
    bootstrap,
    bumpConversationPreview,
    isConversationMuted,
    markDeviceActive,
    myEmplNo,
    refreshBadge,
    syncAfterReconnect,
  ]);

  /**
   * Nhịp "thiết bị này đang được dùng": gửi khi tab được focus/hiện lại và định kỳ
   * mỗi 60s lúc tab đang hiển thị. Server dùng mốc này để quyết định push theo thiết bị
   * (tab để nền quá lâu sẽ không còn tính là "active" ⇒ vẫn nhận push).
   */
  useEffect(() => {
    if (typeof document === "undefined") return;
    const ping = () => {
      if (document.visibilityState === "visible") markDeviceActive();
    };
    ping();
    document.addEventListener("visibilitychange", ping);
    window.addEventListener("focus", ping);
    const timer = window.setInterval(ping, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", ping);
      window.removeEventListener("focus", ping);
      window.clearInterval(timer);
    };
  }, [markDeviceActive]);

  /* ------------------------------- Actions ------------------------------- */

  const searchEmployees = useCallback(
    (keyword: string, options?: { all?: boolean; limit?: number }) =>
      chatService.searchEmployees(keyword, options),
    []
  );

  const startDirect = useCallback(
    async (otherEmplNo: string) => {
      const conversation = await chatService.getOrCreateDirect(otherEmplNo);
      setConversations((prev) => {
        const exists = prev.some((c) => c.CONVERSATION_ID === conversation.CONVERSATION_ID);
        return exists
          ? prev.map((c) => (c.CONVERSATION_ID === conversation.CONVERSATION_ID ? conversation : c))
          : [conversation, ...prev];
      });
      await selectConversation(conversation.CONVERSATION_ID);
      return conversation;
    },
    [selectConversation]
  );

  const createGroup = useCallback(
    async (title: string, memberEmplNos: string[], avatar?: string) => {
      const conversation = await chatService.createGroup(title, memberEmplNos, avatar);
      setConversations((prev) => [conversation, ...prev]);
      await selectConversation(conversation.CONVERSATION_ID);
      return conversation;
    },
    [selectConversation]
  );

  /**
   * Ghim / bỏ ghim cuộc trò chuyện (tuỳ chọn của RIÊNG người dùng hiện tại).
   * Không truyền `pinned` ⇒ đảo trạng thái hiện tại.
   */
  const togglePin = useCallback(async (conversationId: number, pinned?: boolean) => {
    const current = conversationsRef.current.find((c) => c.CONVERSATION_ID === conversationId);
    const next = pinned === undefined ? !current?.PINNED_AT : pinned;
    try {
      const result = await chatService.pinConversation(conversationId, next);
      setConversations((prev) =>
        sortConversations(
          prev.map((c) =>
            c.CONVERSATION_ID === conversationId
              ? { ...c, PINNED_AT: result.pinnedAt || null }
              : c
          )
        )
      );
    } catch (error) {
      console.warn("[chat] ghim cuộc trò chuyện lỗi:", error);
    }
  }, []);

  const respondFriendRequest = useCallback(async (friendId: number, action: "accept" | "reject") => {
    await chatService.friendRespond(friendId, action);
    setRequests((prev) => prev.filter((r) => r.FRIEND_ID !== friendId));
  }, []);

  const sendFriendRequest = useCallback(async (recipient: string) => {
    await chatService.friendRequest(recipient);
  }, []);

  /* ------------------ Cảm xúc / ẩn tin / chuyển tiếp / trả lời ------------------ */

  /**
   * Ghi cảm xúc lên server rồi lấy lại bản tổng hợp số đếm mới nhất.
   * `reaction = "NONE"` để bỏ cảm xúc của mình.
   */
  const sendReaction = useCallback(
    async (conversationId: number, messageId: number, reaction: string) => {
      const socket = getSocket();
      const delivered = await new Promise<{ ok: boolean; reactions?: ChatMessage["REACTIONS"] }>(
        (resolve) => {
          if (!socket?.connected) return resolve({ ok: false });
          let settled = false;
          const timer = window.setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve({ ok: false });
            }
          }, 8000);
          socket.emit("chat:reaction", { conversationId, messageId, reaction }, (ack: any) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            resolve({ ok: Boolean(ack?.ok), reactions: ack?.reactions });
          });
        }
      );

      if (delivered.ok) {
        if (delivered.reactions) applyReactions(conversationId, messageId, delivered.reactions);
        return;
      }

      try {
        const result = await chatService.react(conversationId, messageId, reaction);
        if (result?.reactions) applyReactions(conversationId, messageId, result.reactions);
      } catch (error) {
        console.warn("[chat] react lỗi:", error);
      }
    },
    [applyReactions]
  );

  /** Thả cảm xúc — mỗi lần bấm là +1, KHÔNG giới hạn (giống "tim bay"). */
  const addReaction = useCallback(
    (conversationId: number, messageId: number, reaction: ChatReactionType) =>
      sendReaction(conversationId, messageId, reaction),
    [sendReaction]
  );

  /** Bỏ toàn bộ cảm xúc của mình trên tin nhắn. */
  const clearReaction = useCallback(
    (conversationId: number, messageId: number) => sendReaction(conversationId, messageId, "NONE"),
    [sendReaction]
  );

  /** Xoá ở phía tôi: ẩn tin với riêng mình. */
  const hideMessage = useCallback(async (conversationId: number, messageId: number) => {
    try {
      await chatService.hideMessage(conversationId, messageId);
    } catch (error) {
      console.warn("[chat] hideMessage lỗi:", error);
    }
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter((m) => m.MESSAGE_ID !== messageId),
    }));
  }, []);

  /** Chuyển tiếp tin nhắn sang các phòng khác. */
  const forwardMessage = useCallback(
    async (conversationId: number, messageId: number, targetConversationIds: number[]) => {
      await chatService.forward(conversationId, messageId, targetConversationIds);
      await refreshBadge();
    },
    [refreshBadge]
  );

  const startReply = useCallback((message: ChatMessage) => {
    const preview = message.DELETED_AT
      ? "Tin nhắn đã được thu hồi"
      : message.MSG_TYPE === "IMAGE"
      ? "[Hình ảnh]"
      : message.MSG_TYPE === "FILE"
      ? "[Tệp đính kèm]"
      : message.MSG_TYPE === "RICH"
      ? richToPlainText(message.CONTENT).slice(0, 120)
      : String(message.CONTENT || "").slice(0, 120);
    setReplyTarget({
      messageId: message.MESSAGE_ID,
      senderEmplNo: message.SENDER_EMPL_NO,
      preview,
    });
  }, []);

  const clearReply = useCallback(() => setReplyTarget(null), []);

  /**
   * Bấm vào tên được tag ⇒ mở chat riêng với người đó và soạn sẵn nội dung trích dẫn
   * tin nhắn cũ để gửi tiếp.
   */
  const openPrivateChatWithQuote = useCallback(
    async (params: { emplNo: string; name: string; preview: string }) => {
      const conversation = await chatService.getOrCreateDirect(params.emplNo);
      setConversations((prev) =>
        prev.some((c) => c.CONVERSATION_ID === conversation.CONVERSATION_ID)
          ? prev.map((c) => (c.CONVERSATION_ID === conversation.CONVERSATION_ID ? conversation : c))
          : [conversation, ...prev]
      );
      setReplyTarget(null);
      setDraft({
        conversationId: conversation.CONVERSATION_ID,
        text: `[Trích dẫn tin nhắn của ${params.name}]: "${params.preview}"\n`,
      });
      await selectConversation(conversation.CONVERSATION_ID);
    },
    [selectConversation]
  );

  const consumeDraft = useCallback(() => setDraft(null), []);

  const refreshConversation = useCallback(async () => {
    await refreshBadge();
  }, [refreshBadge]);

  /** Bỏ chọn phòng (dùng cho nút back trên mobile). */
  const clearActive = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    myEmplNo,
    conversations,
    activeId,
    activeConversation,
    activeMessages,
    autoOpen,
    consumeAutoOpen,
    /** Tắt thông báo theo TỪNG phòng (thay cho chuông toàn cục trước đây). */
    isConversationMuted,
    muteSecondsLeftOfConversation,
    setConversationMute,
    /** Ghim tin nhắn của phòng (thanh ghim dưới header). */
    pins,
    setMessagePinned,
    /** Mốc "đã đọc" của từng thành viên → đếm/liệt kê ai đã xem tin nhắn. */
    readState,
    setDockOpen,
    hasMore,
    loadingMessages,
    loadingMore,
    bootstrapped,
    booting,
    unreadTotal,
    requests,
    friends,
    typingUsers,
    onlineUsers,
    reactionBurst,
    pendingUploads,
    bootstrap,
    selectConversation,
    loadMore,
    sendMessage,
    retryMessage,
    deleteMessage,
    deleteConversation,
    deleteMessages,
    notifyTyping,
    searchEmployees,
    startDirect,
    createGroup,
    respondFriendRequest,
    sendFriendRequest,
    refreshConversation,
    clearActive,
    togglePin,
    replyTarget,
    startReply,
    clearReply,
    addReaction,
    clearReaction,
    hideMessage,
    forwardMessage,
    openPrivateChatWithQuote,
    draft,
    consumeDraft,
    jumpToMessage,
    focusMessage,
  };
}

export type ChatController = ReturnType<typeof useChatController>;
