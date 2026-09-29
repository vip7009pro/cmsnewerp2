import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSocket, getUserData } from "../api/Api";
import { chatService, uploadChatFile } from "../api/services/chatService";
import type {
  ChatConversation,
  ChatEmployee,
  ChatFriendEntry,
  ChatMessage,
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

export interface PendingUpload {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

const makeClientId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

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

  /* ----------------------------- Nạp dữ liệu ---------------------------- */

  const applySync = useCallback(
    (list: ChatConversation[], unread: number, onlineEmplNos?: string[]) => {
      setConversations(list);
      setUnreadTotal(unread);
      // Danh sách online đầy đủ từ server — thiếu bước này FE sẽ hiển thị
      // tất cả là "không hoạt động" cho tới khi có sự kiện presence đầu tiên.
      if (Array.isArray(onlineEmplNos)) {
        setOnlineUsers(new Set(onlineEmplNos.map((v) => String(v || "").trim().toUpperCase())));
      }
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
      const socket = getSocket();
      if (socket?.connected) socket.emit("chat:join", { conversationId });

      if (messages[conversationId]) {
        markRead(conversationId);
        return;
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
      } catch (error) {
        console.warn("[chat] loadMessages lỗi:", error);
      } finally {
        setLoadingMessages(false);
      }
    },
    [markRead, messages]
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
    }) => {
      const conversationId = activeIdRef.current;
      if (!conversationId) return;

      const content = payload.content.trim();
      const files = payload.files || [];
      if (!content && files.length === 0) return;

      const clientMessageId = makeClientId();
      const optimistic: ChatMessage = {
        MESSAGE_ID: -Date.now(),
        CONVERSATION_ID: conversationId,
        SENDER_EMPL_NO: myEmplNo,
        MSG_TYPE: files.length > 0 ? (files[0].type.startsWith("image/") ? "IMAGE" : "FILE") : "TEXT",
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
        msgType:
          payload.msgType ||
          (files.length > 0 ? (files[0].type.startsWith("image/") ? "IMAGE" : "FILE") : "TEXT"),
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
      seenMessageIds.current.add(message.MESSAGE_ID);

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

    // Socket có thể mất kết nối rồi tự nối lại (đổi mạng, server restart) ⇒ phải vào lại
    // room phòng đang mở, nếu không các sự kiện phát theo room (typing, read) sẽ im lặng.
    const onConnect = () => {
      const conversationId = activeIdRef.current;
      if (conversationId) socket.emit("chat:join", { conversationId });
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:reaction", onReaction);
    socket.on("chat:presence-list", onPresenceList);
    socket.on("chat:message-hidden", onMessageHidden);
    socket.on("chat:message-deleted", onMessageDeleted);
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
      socket.off("chat:presence-list", onPresenceList);
      socket.off("chat:message-hidden", onMessageHidden);
      socket.off("chat:message-deleted", onMessageDeleted);
      socket.off("chat:typing", onTyping);
      socket.off("chat:presence", onPresence);
      socket.off("chat:conversation-updated", onConversationUpdated);
      socket.off("chat:conversation-removed", onConversationRemoved);
      socket.off("chat:members-changed", onConversationUpdated);
      socket.off("chat:friend-request", onFriendRequest);
      socket.off("connect", onConnect);
    };
  }, [appendMessage, applyReactions, bootstrap, bumpConversationPreview, myEmplNo, refreshBadge]);

  /* ------------------------------- Actions ------------------------------- */

  const searchEmployees = useCallback((keyword: string) => chatService.searchEmployees(keyword), []);

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
    async (title: string, memberEmplNos: string[]) => {
      const conversation = await chatService.createGroup(title, memberEmplNos);
      setConversations((prev) => [conversation, ...prev]);
      await selectConversation(conversation.CONVERSATION_ID);
      return conversation;
    },
    [selectConversation]
  );

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
    notifyTyping,
    searchEmployees,
    startDirect,
    createGroup,
    respondFriendRequest,
    sendFriendRequest,
    refreshConversation,
    clearActive,
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
  };
}

export type ChatController = ReturnType<typeof useChatController>;
