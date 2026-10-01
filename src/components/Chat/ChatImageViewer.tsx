import React, { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress, Dialog, IconButton, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { chatFileUrl } from "../../api/services/chatService";
import { dayLabel, formatFileSize, timeLabel } from "./chatUtils";

/** Một ảnh trong bộ xem ảnh dùng chung (chat + media). */
export interface ImageViewerItem {
  attachmentId: number;
  originalName: string;
  fileSize?: number | null;
  senderEmplNo: string;
  senderName?: string;
  createdAt: string;
  conversationId: number;
  conversationName?: string;
  /** Tin nhắn chứa ảnh — dùng để chuyển tiếp / nhảy tới tin gốc. */
  messageId: number;
}

interface Props {
  open: boolean;
  items: ImageViewerItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Chuyển tiếp tin nhắn chứa ảnh (tuỳ chọn). */
  onForward?: (item: ImageViewerItem) => void;
  /** Nhảy tới tin nhắn gốc trong khung chat (tuỳ chọn). */
  onJumpToMessage?: (item: ImageViewerItem) => void;
}

/** Ngưỡng vuốt ngang (px) để chuyển ảnh khi ảnh CHƯA được zoom. */
const SWIPE_THRESHOLD = 50;
/** Mức zoom nhỏ nhất / lớn nhất. */
const MIN_SCALE = 1;
const MAX_SCALE = 6;
/** Độ nhạy bánh xe (desktop) và bước phóng khi bấm nút ± / phím +-. */
const WHEEL_SENSITIVITY = 0.0015;
const STEP_SCALE = 1.25;
/** Nhấn đúp (chuột) hoặc chạm đúp (cảm ứng) ⇒ phóng tới mức này. */
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 320;
/** Dưới mức di chuyển này thì vẫn coi là "chạm" (dùng cho chạm đúp). */
const TAP_SLOP_PX = 12;

/** Trạng thái zoom/pan của ảnh đang xem. */
interface ViewState {
  scale: number;
  tx: number;
  ty: number;
}

/** Phím tắt không được cướp khi người dùng đang nhập liệu ở nơi khác. */
function isTypingTarget(target: EventTarget | null): boolean {
  const node = target as HTMLElement | null;
  if (!node || !node.tagName) return false;
  const tag = node.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || node.isContentEditable === true;
}

/** Tải ảnh về máy: phải lấy blob rồi tạo object URL (thuộc tính `download` không qua được khác origin). */
async function downloadImage(item: ImageViewerItem): Promise<void> {
  const url = chatFileUrl(item.attachmentId);
  const name = item.originalName || `image-${item.attachmentId}.png`;
  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  } catch {
    // Không tải được qua blob ⇒ mở tab mới để trình duyệt tự xử lý.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Bộ XEM ẢNH dùng chung cho chat + cửa sổ Media/Tệp.
 *
 * - Bấm ảnh ⇒ mở tại đây (thay vì mở tab mới).
 * - Chuyển ảnh: nút ◀ ▶, phím mũi tên (desktop), vuốt ngang (mobile).
 * - ZOOM/PAN: lăn chuột hoặc nút ± (desktop), chụm 2 ngón (mobile), nhấn/chạm đúp;
 *   kéo để di chuyển ảnh khi đã zoom.
 * - Có: tải về, chuyển tiếp, tới tin nhắn gốc, thông tin ảnh (tên/dung lượng/kích cỡ/ngày/người gửi).
 */
export default function ChatImageViewer({
  open,
  items,
  index,
  onIndexChange,
  onClose,
  onForward,
  onJumpToMessage,
}: Props) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  /** Zoom/pan của ảnh đang xem. */
  const [view, setView] = useState<ViewState>({ scale: 1, tx: 0, ty: 0 });
  /** Đang kéo/chụm ⇒ tắt transition cho mượt. */
  const [interacting, setInteracting] = useState(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tapRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const gestureRef = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    mode: "none" as "none" | "pan" | "pinch",
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    lastDist: 1,
    lastMidX: 0,
    lastMidY: 0,
    lastDx: 0,
    lastDy: 0,
    moved: 0,
  });

  const count = items.length;
  const current = index >= 0 && index < count ? items[index] : null;
  const zoomed = view.scale > MIN_SCALE + 0.001;

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      // Xoay vòng để không bị "kẹt" ở đầu/cuối.
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange]
  );

  /** Kích thước gốc của ảnh + vùng nhìn thấy được (đã trừ padding của khung). */
  const measure = useCallback(() => {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return null;
    const cs = window.getComputedStyle(wrap);
    const pad = (name: string) => parseFloat(cs.getPropertyValue(name)) || 0;
    const vw = wrap.clientWidth - pad("padding-left") - pad("padding-right");
    const vh = wrap.clientHeight - pad("padding-top") - pad("padding-bottom");
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    if (!w || !h || !vw || !vh) return null;
    return { w, h, vw, vh };
  }, []);

  /** Kẹp vị trí để không kéo ảnh ra khỏi khung nhìn. */
  const clampView = useCallback(
    (scale: number, tx: number, ty: number): ViewState => {
      const m = measure();
      if (!m) return { scale, tx: 0, ty: 0 };
      const maxX = Math.max(0, (m.w * scale - m.vw) / 2);
      const maxY = Math.max(0, (m.h * scale - m.vh) / 2);
      return {
        scale,
        tx: Math.min(maxX, Math.max(-maxX, tx)),
        ty: Math.min(maxY, Math.max(-maxY, ty)),
      };
    },
    [measure]
  );

  const resetView = useCallback(() => {
    setInteracting(false);
    setView({ scale: 1, tx: 0, ty: 0 });
  }, []);

  /**
   * Phóng/thu quanh 1 điểm màn hình — giữ đúng điểm đó nằm yên dưới con trỏ/ngón tay.
   * Công thức: t' = t + (1 - k) * d  với d = vector từ TÂM ẢNH tới điểm zoom.
   */
  const zoomAt = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      const cur = viewRef.current;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, cur.scale * factor));
      if (Math.abs(next - cur.scale) < 0.001) return;
      if (next <= MIN_SCALE + 0.001) {
        setView({ scale: 1, tx: 0, ty: 0 });
        return;
      }
      const img = imgRef.current;
      if (!img || clientX === undefined || clientY === undefined) {
        setView(clampView(next, cur.tx, cur.ty));
        return;
      }
      const rect = img.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const k = next / cur.scale;
      setView(
        clampView(next, cur.tx + (1 - k) * (clientX - cx), cur.ty + (1 - k) * (clientY - cy))
      );
    },
    [clampView]
  );

  // Phím tắt trên desktop (bỏ qua khi đang gõ ở nơi khác).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        go(1);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomAt(STEP_SCALE);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomAt(1 / STEP_SCALE);
      } else if (event.key === "0") {
        event.preventDefault();
        resetView();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, go, onClose, zoomAt, resetView]);

  // Lăn chuột để zoom. Phải gắn listener NATIVE ở chế độ non-passive (React đăng ký `wheel`
  // ở chế độ passive nên `preventDefault()` vô hiệu) — và phải gắn bằng CALLBACK REF vì
  // MUI Dialog mount phần con TRỄ 1 nhịp ⇒ `useEffect` thường chạy lúc `wrapRef.current` còn null.
  const onWheelNative = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      zoomAt(Math.exp(-event.deltaY * WHEEL_SENSITIVITY), event.clientX, event.clientY);
    },
    [zoomAt]
  );

  const attachWrap = useCallback(
    (node: HTMLDivElement | null) => {
      const prev = wrapRef.current;
      if (prev && prev !== node) prev.removeEventListener("wheel", onWheelNative);
      wrapRef.current = node;
      if (node) node.addEventListener("wheel", onWheelNative, { passive: false });
    },
    [onWheelNative]
  );

  // Đổi ảnh ⇒ nạp lại thông tin kích cỡ và ĐẶT LẠI zoom/pan.
  useEffect(() => {
    setLoading(true);
    setNatural(null);
    setInteracting(false);
    setView({ scale: 1, tx: 0, ty: 0 });
    gestureRef.current.pointers.clear();
    gestureRef.current.mode = "none";
    tapRef.current = null;
  }, [current?.attachmentId]);

  // Mở viewer ⇒ đưa tiêu điểm vào vùng ảnh để dùng được phím tắt.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => wrapRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // 2 nút chuyển ảnh nằm trong vùng ảnh ⇒ không bắt đầu cử chỉ khi bấm vào nút.
    if ((event.target as HTMLElement).closest("button")) return;
    const g = gestureRef.current;
    g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* trình duyệt cũ không hỗ trợ — vẫn chạy được ở mức cơ bản */
    }

    if (g.pointers.size === 1) {
      g.mode = "pan";
      g.startX = event.clientX;
      g.startY = event.clientY;
      g.startTx = viewRef.current.tx;
      g.startTy = viewRef.current.ty;
      g.lastDx = 0;
      g.lastDy = 0;
      g.moved = 0;
      setInteracting(true);
      return;
    }

    if (g.pointers.size === 2) {
      // Chuyển từ kéo sang CHỤM 2 NGÓN.
      g.mode = "pinch";
      const [a, b] = Array.from(g.pointers.values());
      g.lastDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.lastMidX = (a.x + b.x) / 2;
      g.lastMidY = (a.y + b.y) / 2;
      g.moved = TAP_SLOP_PX + 1;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g.pointers.has(event.pointerId)) return;
    g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (g.mode === "pinch" && g.pointers.size >= 2) {
      const [a, b] = Array.from(g.pointers.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const cur = viewRef.current;
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, cur.scale * (dist / g.lastDist)));
      const k = nextScale / cur.scale;
      const img = imgRef.current;
      let tx = cur.tx;
      let ty = cur.ty;
      if (img) {
        const rect = img.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        tx = cur.tx + (1 - k) * (midX - cx);
        ty = cur.ty + (1 - k) * (midY - cy);
      }
      // Đi theo ngón tay: cộng thêm dịch chuyển của ĐIỂM GIỮA 2 ngón.
      tx += midX - g.lastMidX;
      ty += midY - g.lastMidY;
      setView(
        nextScale <= MIN_SCALE + 0.001
          ? { scale: 1, tx: 0, ty: 0 }
          : clampView(nextScale, tx, ty)
      );
      g.lastDist = dist;
      g.lastMidX = midX;
      g.lastMidY = midY;
      return;
    }

    if (g.mode === "pan") {
      const dx = event.clientX - g.startX;
      const dy = event.clientY - g.startY;
      g.lastDx = dx;
      g.lastDy = dy;
      g.moved = Math.max(g.moved, Math.hypot(dx, dy));
      const cur = viewRef.current;
      // Chưa zoom thì KHÔNG pan (ảnh đang vừa khung) — để dành cử chỉ cho vuốt chuyển ảnh.
      if (cur.scale > MIN_SCALE + 0.001) {
        setView(clampView(cur.scale, g.startTx + dx, g.startTy + dy));
      }
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = gestureRef.current;
    const wasPan = g.mode === "pan";
    g.pointers.delete(event.pointerId);

    // Chụm 2 ngón ⇒ nhấc 1 ngón: chuyển sang kéo với mốc mới.
    if (g.pointers.size === 1) {
      const p = Array.from(g.pointers.values())[0];
      g.mode = "pan";
      g.startX = p.x;
      g.startY = p.y;
      g.startTx = viewRef.current.tx;
      g.startTy = viewRef.current.ty;
      g.lastDx = 0;
      g.lastDy = 0;
      g.moved = TAP_SLOP_PX + 1;
      return;
    }
    if (g.pointers.size > 0) return;

    g.mode = "none";
    setInteracting(false);
    if (!wasPan || cancelled) return;

    // Vuốt NGANG khi CHƯA zoom ⇒ chuyển ảnh trước/sau.
    if (
      viewRef.current.scale <= MIN_SCALE + 0.001 &&
      Math.abs(g.lastDx) > SWIPE_THRESHOLD &&
      Math.abs(g.lastDx) > Math.abs(g.lastDy)
    ) {
      go(g.lastDx < 0 ? 1 : -1);
      return;
    }

    // Nhấn/chạm ĐÚP (chuột lẫn cảm ứng) ⇒ phóng to / về 100%.
    if (g.moved <= TAP_SLOP_PX) {
      const last = tapRef.current;
      const now = Date.now();
      if (
        last &&
        now - last.t <= DOUBLE_TAP_MS &&
        Math.abs(last.x - event.clientX) <= 40 &&
        Math.abs(last.y - event.clientY) <= 40
      ) {
        tapRef.current = null;
        if (viewRef.current.scale > MIN_SCALE + 0.001) resetView();
        else zoomAt(DOUBLE_TAP_SCALE, event.clientX, event.clientY);
      } else {
        tapRef.current = { t: now, x: event.clientX, y: event.clientY };
      }
    } else {
      tapRef.current = null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      className="erp-chat-viewer"
      disableAutoFocus
      aria-label="Xem ảnh"
    >
      <div className="erp-chat-viewer__stage">
        <div className="erp-chat-viewer__topbar">
          <div className="erp-chat-viewer__topLeft">
            <span className="erp-chat-viewer__counter">
              {count > 0 ? `${Math.min(index + 1, count)} / ${count}` : ""}
            </span>

            <div className="erp-chat-viewer__zoom">
              <button
                type="button"
                className="erp-chat-viewer__zoomBtn"
                onClick={() => zoomAt(1 / STEP_SCALE)}
                disabled={!zoomed}
                title="Thu nhỏ (phím -)"
                aria-label="Thu nhỏ"
              >
                <RemoveRoundedIcon fontSize="small" />
              </button>
              <button
                type="button"
                className={`erp-chat-viewer__zoomValue${zoomed ? " is-zoomed" : ""}`}
                onClick={resetView}
                title={zoomed ? "Bấm để về 100%" : "Mức zoom hiện tại"}
                aria-label="Đặt lại mức zoom 100%"
              >
                {Math.round(view.scale * 100)}%
              </button>
              <button
                type="button"
                className="erp-chat-viewer__zoomBtn"
                onClick={() => zoomAt(STEP_SCALE)}
                disabled={view.scale >= MAX_SCALE - 0.001}
                title="Phóng to (phím +)"
                aria-label="Phóng to"
              >
                <AddRoundedIcon fontSize="small" />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="erp-chat-viewer__close"
            onClick={onClose}
            title="Đóng (Esc)"
            aria-label="Đóng bộ xem ảnh"
          >
            <CloseRoundedIcon fontSize="small" />
            <span>Đóng</span>
          </button>
        </div>

        <div
          ref={attachWrap}
          className={`erp-chat-viewer__imageWrap${zoomed ? " is-zoomed" : ""}`}
          tabIndex={-1}
          style={{ touchAction: zoomed ? "none" : "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => endPointer(event, false)}
          onPointerCancel={(event) => endPointer(event, true)}
        >
          {loading && <CircularProgress size={26} className="erp-chat-viewer__spinner" />}
          {current && (
            <img
              ref={imgRef}
              key={current.attachmentId}
              className="erp-chat-viewer__img"
              src={chatFileUrl(current.attachmentId)}
              alt={current.originalName}
              draggable={false}
              style={{
                transform: `translate3d(${view.tx}px, ${view.ty}px, 0) scale(${view.scale})`,
                transformOrigin: "center center",
                transition: interacting ? "none" : "transform 0.16s ease-out",
                cursor: zoomed ? (interacting ? "grabbing" : "grab") : "zoom-in",
              }}
              onLoad={(event) => {
                setNatural({
                  w: event.currentTarget.naturalWidth,
                  h: event.currentTarget.naturalHeight,
                });
                setLoading(false);
              }}
              onError={() => setLoading(false)}
            />
          )}

          {/* Nút chuyển ảnh nằm TRONG vùng ảnh: desktop neo giữa 2 bên,
              mobile neo xuống đáy vùng ảnh để không đè lên chính tấm ảnh. */}
          {count > 1 && (
            <>
              <button
                type="button"
                className="erp-chat-viewer__nav is-prev"
                onClick={() => go(-1)}
                aria-label="Ảnh trước"
              >
                <ChevronLeftRoundedIcon />
              </button>
              <button
                type="button"
                className="erp-chat-viewer__nav is-next"
                onClick={() => go(1)}
                aria-label="Ảnh sau"
              >
                <ChevronRightRoundedIcon />
              </button>
            </>
          )}
        </div>

        <div className="erp-chat-viewer__bottombar">
          {infoOpen && current && (
            <div className="erp-chat-viewer__info">
              <div className="erp-chat-viewer__infoRow">
                <span>Tên ảnh</span>
                <b title={current.originalName}>{current.originalName}</b>
              </div>
              <div className="erp-chat-viewer__infoRow">
                <span>Dung lượng</span>
                <b>
                  {formatFileSize(current.fileSize)}
                  {natural ? ` · ${natural.w} × ${natural.h}px` : ""}
                </b>
              </div>
              <div className="erp-chat-viewer__infoRow">
                <span>Ngày gửi</span>
                <b>
                  {dayLabel(current.createdAt)} · {timeLabel(current.createdAt)}
                </b>
              </div>
              <div className="erp-chat-viewer__infoRow">
                <span>Người gửi</span>
                <b>{current.senderName || current.senderEmplNo}</b>
              </div>
              {current.conversationName && (
                <div className="erp-chat-viewer__infoRow">
                  <span>Phòng</span>
                  <b>{current.conversationName}</b>
                </div>
              )}
            </div>
          )}

          <div className="erp-chat-viewer__barRow">
            <span className="erp-chat-viewer__title" title={current?.originalName}>
              {current?.originalName}
            </span>
            <div className="erp-chat-viewer__actions">
              <Tooltip title="Tải ảnh về máy">
                <IconButton
                  className="erp-chat-viewer__iconBtn"
                  onClick={() => current && void downloadImage(current)}
                  aria-label="Tải ảnh về máy"
                >
                  <DownloadRoundedIcon />
                </IconButton>
              </Tooltip>
              {onForward && (
                <Tooltip title="Chuyển tiếp tin nhắn chứa ảnh">
                  <IconButton
                    className="erp-chat-viewer__iconBtn"
                    onClick={() => current && onForward(current)}
                    aria-label="Chuyển tiếp"
                  >
                    <ForwardRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
              {onJumpToMessage && (
                <Tooltip title="Tới tin nhắn gốc">
                  <IconButton
                    className="erp-chat-viewer__iconBtn"
                    onClick={() => current && onJumpToMessage(current)}
                    aria-label="Tới tin nhắn gốc"
                  >
                    <MyLocationRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Thông tin ảnh">
                <IconButton
                  className={`erp-chat-viewer__iconBtn${infoOpen ? " is-active" : ""}`}
                  onClick={() => setInfoOpen((prev) => !prev)}
                  aria-label="Thông tin ảnh"
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
