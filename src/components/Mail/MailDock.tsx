import { useCallback, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { IconButton, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import MailSidebar from "./MailSidebar";
import MailList from "./MailList";
import MailSearchBar from "./MailSearchBar";
import MailDetail from "./MailDetail";
import MailAccountDialog from "./MailAccountDialog";
import MailSyncStatus from "./MailSyncStatus";
import MailComposer, { type MailComposeMode } from "./MailComposer";
import { useMailController } from "../../hooks/useMailController";
import { useMobileBackClose } from "../NavMenu/useMobileBackClose";
import type { MailListItemModel } from "./mail.types";
import "./mail.scss";

interface MailDockProps {
  isMobile?: boolean;
  /** Cho phép điều khiển từ bên ngoài (menu overflow trên mobile). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function MailDock({ isMobile = false, open, onOpenChange, showTrigger = true }: MailDockProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  // Chỉ nghe realtime khi cửa sổ đang mở: tránh 2 dock (desktop + mobile) gọi API trùng nhau.
  const controller = useMailController({ realtime: isOpen });
  const [fullscreen, setFullscreen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  /** Trạng thái hộp soạn thảo (Phase 3). */
  const [compose, setCompose] = useState<{ open: boolean; mode: MailComposeMode; draftId?: number | null }>({ open: false, mode: "new" });
  // Ẩn/hiện cột thư mục (cột 1) và cột danh sách (cột 2) để tối ưu không gian đọc nội dung.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem("mail_sidebar_collapsed") === "1"; } catch { return false; }
  });
  const [listCollapsed, setListCollapsed] = useState(() => {
    try { return localStorage.getItem("mail_list_collapsed") === "1"; } catch { return false; }
  });
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("mail_sidebar_collapsed", next ? "1" : "0"); } catch { /* bỏ qua */ }
      return next;
    });
  }, []);
  const toggleList = useCallback(() => {
    setListCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("mail_list_collapsed", next ? "1" : "0"); } catch { /* bỏ qua */ }
      return next;
    });
  }, []);

  /**
   * Độ rộng cột danh sách (cột 2) — mặc định NGẮN để nhường chỗ cho nội dung (cột 3).
   * Người dùng kéo divider để chỉnh; lưu lại qua localStorage.
   */
  const MIN_LIST_W = 200;
  const MAX_LIST_W = 700;
  const DEFAULT_LIST_W = 300;
  const [listWidth, setListWidth] = useState<number>(() => {
    try {
      const v = Number(localStorage.getItem("mail_list_width"));
      return v >= 200 && v <= 700 ? v : DEFAULT_LIST_W;
    } catch {
      return DEFAULT_LIST_W;
    }
  });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listWidthRef = useRef(listWidth);
  listWidthRef.current = listWidth;

  /** Kéo divider: cập nhật CSS var trực tiếp (mượt, không re-render iframe), chốt state khi thả. */
  const startResize = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = listWidthRef.current;
    const panel = panelRef.current;
    const divider = e.currentTarget;
    divider.classList.add("is-dragging");
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "col-resize";

    const onMove = (ev: PointerEvent) => {
      const next = Math.min(MAX_LIST_W, Math.max(MIN_LIST_W, startW + (ev.clientX - startX)));
      listWidthRef.current = next;
      panel?.style.setProperty("--mail-list-width", `${next}px`);
    };
    const onUp = () => {
      divider.classList.remove("is-dragging");
      document.body.style.cursor = prevCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setListWidth(listWidthRef.current);
      try { localStorage.setItem("mail_list_width", String(listWidthRef.current)); } catch { /* bỏ qua */ }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Mobile: nút Back đi theo tầng — đang xem email ⇒ về danh sách; đang ở danh sách ⇒ đóng.
  useMobileBackClose(
    isMobile && isOpen,
    () => {
      if (controller.detail) controller.closeDetail();
      else setOpen(false);
    },
    { rearm: true }
  );

  const folderTitle = useMemo(() => {
    if (controller.inSearchMode) return "Kết quả tìm kiếm";
    const found = controller.folders.find((f) => f.FOLDER_KEY === controller.activeFolder);
    return found?.DISPLAY_NAME || "Hộp thư đến";
  }, [controller.folders, controller.activeFolder, controller.inSearchMode]);

  const handleOpenItem = useCallback(
    (item: MailListItemModel) => {
      void controller.openMessage(item.id);
    },
    [controller]
  );

  const handleToggleStarItem = useCallback(
    (item: MailListItemModel) => {
      void controller.toggleStar(item);
    },
    [controller]
  );

  const panel = (
    <div
      ref={panelRef}
      className={`erp-mail__panel${controller.detail ? " has-detail" : ""}${sidebarCollapsed ? " is-sidebar-collapsed" : ""}${listCollapsed ? " is-list-collapsed" : ""}`}
      style={{ "--mail-list-width": `${listWidth}px` } as CSSProperties}
    >
      <MailSidebar
        folders={controller.folders}
        accounts={controller.accounts}
        activeFolder={controller.activeFolder}
        unreadTotal={controller.unreadTotal}
        onSelect={(key) => void controller.openFolder(key)}
        onOpenAccount={() => setShowAccount(true)}
        onCompose={() => setCompose({ open: true, mode: "new" })}
      />
      <MailList
        title={folderTitle}
        messages={controller.messages}
        loading={controller.loadingList}
        hasMore={controller.hasMore}
        error={controller.listError}
        activeId={controller.detail?.message.id ?? null}
        emptyHint={
          controller.inSearchMode ? (
            <div>
              <p style={{ margin: "0 0 6px" }}>Không tìm thấy email phù hợp.</p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Thử bỏ bớt bộ lọc, hoặc dùng cú pháp: from:, to:, subject:, has:attachment, is:unread, after:YYYY-MM-DD
              </p>
            </div>
          ) : controller.hasOwnAccount ? null : (
            <div>
              <p style={{ margin: "0 0 10px" }}>Bạn chưa cấu hình hộp thư email.</p>
              <button
                type="button"
                onClick={() => setShowAccount(true)}
                style={{ padding: "6px 14px", border: "1px solid #2563eb", borderRadius: 8, background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
              >
                Cấu hình ngay
              </button>
            </div>
          )
        }
        statusBar={<MailSyncStatus onSynced={() => void controller.refresh()} />}
        searchSlot={
          <MailSearchBar
            value={controller.searchText}
            onChange={(text) => void controller.runSearch(text, controller.searchSort, true)}
            sort={controller.searchSort}
            onSortChange={(sort) => void controller.runSearch(controller.searchText, sort, true)}
            onClear={() => void controller.clearSearch()}
            running={controller.searchMeta.running}
            total={controller.searchMeta.total}
            tookMs={controller.searchMeta.tookMs}
            hint={controller.inSearchMode ? undefined : "Tìm trong tất cả thư mục"}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onOpen={handleOpenItem}
        onToggleStar={handleToggleStarItem}
        onLoadMore={() => void controller.loadMore()}
        onRefresh={() => void controller.refresh()}
      />
      {(controller.detail || controller.loadingDetail) && (
        <>
          {!isMobile && !listCollapsed && (
            <div
              className="erp-mail__divider"
              onPointerDown={startResize}
              role="separator"
              aria-orientation="vertical"
              title="Kéo để chỉnh độ rộng cột danh sách"
            />
          )}
          <MailDetail
            detail={controller.detail}
            loading={controller.loadingDetail}
            isMobile={isMobile}
            listCollapsed={listCollapsed}
            onToggleList={toggleList}
            onReply={() => setCompose({ open: true, mode: "reply" })}
            onReplyAll={() => setCompose({ open: true, mode: "replyAll" })}
            onForward={() => setCompose({ open: true, mode: "forward" })}
            onClose={controller.closeDetail}
            onToggleStar={(isStarred) => {
              const item = controller.messages.find((m) => m.id === controller.detail?.message.id);
              if (item) void controller.toggleStar({ ...item, isStarred: !isStarred });
              else void controller.markRead(controller.detail!.message.id, true);
            }}
          />
        </>
      )}
    </div>
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          className={`precision-header__actionBtn${isOpen ? " is-active" : ""}`}
          onClick={() => setOpen(!isOpen)}
          title="Hộp thư Email"
          aria-label="Mở hộp thư Email"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
            mail
          </span>
          {controller.unreadTotal > 0 && (
            <span className="precision-header__badge">
              {controller.unreadTotal > 99 ? "99+" : controller.unreadTotal}
            </span>
          )}
        </button>
      )}

      {isMobile ? (
        isOpen && (
          <div className="erp-mail__mobileOverlay">
            <div className="erp-mail__mobileBody">{panel}</div>
          </div>
        )
      ) : (
        isOpen && (
          <div
            className={`erp-mail__window${fullscreen ? " is-fullscreen" : ""}`}
            role="dialog"
            aria-label="Hộp thư Email"
          >
            <div className="erp-mail__windowHead">
              <span className="erp-mail__windowTitle">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  mail
                </span>
                Hộp thư Email
                {controller.unreadTotal > 0 && (
                  <span className="erp-mail__windowCount">{controller.unreadTotal}</span>
                )}
              </span>
              <div className="erp-mail__windowActions" style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Tooltip title={fullscreen ? "Thu nhỏ" : "Toàn màn hình"}>
                  <IconButton
                    size="small"
                    className="erp-mail__iconBtn"
                    onClick={() => setFullscreen((v) => !v)}
                    aria-label={fullscreen ? "Thu nhỏ cửa sổ email" : "Toàn màn hình"}
                  >
                    {fullscreen ? <FullscreenExitRoundedIcon fontSize="small" /> : <FullscreenRoundedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  className="erp-mail__iconBtn"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng cửa sổ email"
                  title="Đóng cửa sổ email"
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            <div className="erp-mail__windowBody">{panel}</div>
          </div>
        )
      )}

      <MailAccountDialog
        open={showAccount}
        onClose={() => setShowAccount(false)}
        onSaved={() => {
          void controller.reloadBootstrap();
          void controller.openFolder("INBOX");
        }}
      />

      <MailComposer
        open={compose.open}
        mode={compose.mode}
        draftId={compose.draftId}
        source={compose.mode === "new" ? null : controller.detail?.message || null}
        onClose={() => setCompose({ open: false, mode: "new" })}
        onSent={() => {
          void controller.reloadBootstrap();
          if (controller.activeFolder === "SENT") void controller.refresh();
          else void controller.openFolder("SENT");
        }}
      />
    </>
  );
}
