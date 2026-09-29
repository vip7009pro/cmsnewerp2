import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSocket, getUserData } from "../api/Api";
import { chatService, uploadChatFile } from "../api/services/chatService";
import type {
  ChatConversation,
  ChatEmployee,
  ChatFriendEntry,
  ChatMessage,
} from "../components/Chat/chat.types";

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

  const activeIdRef = useRef<number | null>(null);
  const typingTimers = useRef<Record<string, number>>({});
  const conversationsRef = useRef<ChatConversation[]>([]);
  /** Chống xử lý trùng: server phát cùng 1 tin qua cả room phòng và room user. */
  const seenMessageIds = useRef<Set<number>>(new Set());

  activeIdRef.current = activeId;
  conversationsRef.current = conversations;

  const activeConversation = useMemo(
    () => conversations.find((c) => c.CONVERSATION_ID === activeId) || null,
    [conversations, activeId]
  );

  const activeMessages = activeId ? messages[activeId] || [] : [];

  /* ----------------------------- Nạp dữ liệu ---------------------------- */

  const applySync = useCallback((list: ChatConversation[], unread: number) => {
    setConversations(list);
    setUnreadTotal(unread);
  }, []);

  const refreshBadge = useCallback(async () => {
    try {
      const result = await chatService.sync();
      applySync(result.conversations, result.unreadTotal);
    } catch {
      // Badge là thông tin phụ — lỗi mạng không nên làm ồn UI.
    }
  }, [applySync]);

  const bootstrap = useCallback(async () => {
    if (booting) return;
    setBooting(true);
    try {
      const data = await chatService.bootstrap();
      applySync(data.conversations, data.unreadTotal);
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
    (conversationId: number) => {
      const list = messages[conversationId] || [];
      const lastId = list.length > 0 ? list[list.length - 1].MESSAGE_ID : 0;
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
    [conversations, messages]
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
        markRead(conversationId);
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
    async (payload: { content: string; files?: File[]; mentions?: string[]; replyToMessageId?: number }) => {
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
        replyToMessageId: payload.replyToMessageId,
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

    const onFriendRequest = () => {
      void bootstrap();
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:message-deleted", onMessageDeleted);
    socket.on("chat:typing", onTyping);
    socket.on("chat:presence", onPresence);
    socket.on("chat:conversation-updated", onConversationUpdated);
    socket.on("chat:conversation-removed", onConversationRemoved);
    socket.on("chat:members-changed", onConversationUpdated);
    socket.on("chat:friend-request", onFriendRequest);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:message-deleted", onMessageDeleted);
      socket.off("chat:typing", onTyping);
      socket.off("chat:presence", onPresence);
      socket.off("chat:conversation-updated", onConversationUpdated);
      socket.off("chat:conversation-removed", onConversationRemoved);
      socket.off("chat:members-changed", onConversationUpdated);
      socket.off("chat:friend-request", onFriendRequest);
    };
  }, [appendMessage, bootstrap, bumpConversationPreview, myEmplNo, refreshBadge]);

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
  };
}

export type ChatController = ReturnType<typeof useChatController>;
