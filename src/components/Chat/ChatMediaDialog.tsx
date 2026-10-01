import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import type {
  ChatFileKindFilter,
  ChatMediaItem,
  ChatMember,
  ChatSearchResult,
} from "./chat.types";
import type { ChatStorage } from "../../api/services/chatService";
import { chatFileUrl, chatService } from "../../api/services/chatService";
import { shareMediaItemOut } from "./chatShareOut";
import ChatDateField from "./ChatDateField";
import ChatSenderField from "./ChatSenderField";
import ChatImageViewer, { type ImageViewerItem } from "./ChatImageViewer";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  chatAvatarUrl,
  dayLabel,
  fileKindOf,
  formatFileSize,
  initialsOf,
  renderMentions,
  timeLabel,
  vnDayOffset,
  vnToday,
} from "./chatUtils";

interface Props {
  open: boolean;
  conversationId: number | null;
  conversationName: string;
  isSelf: boolean;
  /** Người đang xem (để không lọc trùng chính mình). */
  myEmplNo: string;
  /** Thành viên phòng — dùng cho bộ lọc "Người gửi". */
  members: ChatMember[];
  onClose: () => void;
  /** Bấm 1 tin chứa Link ⇒ nhảy tới tin đó trong khung chat. */
  onOpenMessage?: (conversationId: number, messageId: number) => void;
  /** Chuyển tiếp tin nhắn chứa ảnh đang xem (tuỳ chọn). */
  onForwardMessage?: (messageId: number) => void;
}

const KIND_FILTERS: { value: ChatFileKindFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "image", label: "Ảnh" },
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "word", label: "Word" },
  { value: "ppt", label: "PowerPoint" },
  { value: "csv", label: "CSV" },
  { value: "zip", label: "Nén" },
  { value: "link", label: "Link" },
  { value: "other", label: "Khác" },
];

/** Khoảng ngày chọn nhanh cho bộ lọc media. */
const DATE_PRESETS: { label: string; days: number | null }[] = [
  { label: "Hôm nay", days: 0 },
  { label: "7 ngày", days: 6 },
  { label: "30 ngày", days: 29 },
  { label: "Tất cả", days: null },
];

/** Bộ lọc hiện tại của cửa sổ media. */
interface MediaFilters {
  kind: ChatFileKindFilter;
  keyword: string;
  senderEmplNo: string;
  fromDate: string;
  toDate: string;
}

const EMPTY_FILTERS: MediaFilters = {
  kind: "all",
  keyword: "",
  senderEmplNo: "",
  fromDate: "",
  toDate: "",
};

/** Bộ lọc mặc định: loại "all", ngày Từ/Đến = HÔM NAY (giờ Việt Nam). */
function defaultFilters(): MediaFilters {
  const today = vnToday();
  return { ...EMPTY_FILTERS, fromDate: today, toDate: today };
}

/**
 * Cửa sổ xem media/tệp của 1 phòng: lưới ảnh + danh sách tệp, phân nhóm theo ngày
 * dạng timeline. Hỗ trợ lọc theo từ khoá / người gửi / khoảng ngày / loại tệp —
 * và chip "Link" để lọc riêng các TIN NHẮN CHỨA LIÊN KẾT.
 */
export default function ChatMediaDialog({
  open,
  conversationId,
  conversationName,
  isSelf,
  myEmplNo,
  members,
  onClose,
  onOpenMessage,
  onForwardMessage,
}: Props) {
  const [items, setItems] = useState<ChatMediaItem[]>([]);
  const [linkResults, setLinkResults] = useState<ChatSearchResult[]>([]);
  const [storage, setStorage] = useState<ChatStorage | null>(null);
  const [filters, setFilters] = useState<MediaFilters>(() => defaultFilters());
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  /** Đang nạp tệp để đưa vào bảng chia sẻ của hệ điều hành. */
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /** Bộ XEM ẢNH dùng chung đang mở ở ảnh thứ mấy (null = đang đóng). */
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const senderOptions = useMemo(
    () => (members || []).filter((m) => m.EMPL_NO !== myEmplNo),
    [members, myEmplNo]
  );

  const memberNameOf = useCallback(
    (emplNo: string) => {
      const found = (members || []).find((m) => m.EMPL_NO === emplNo);
      return found?.FULL_NAME || emplNo;
    },
    [members]
  );

  /** Chia sẻ 1 mục media/tệp ra app bên ngoài (Zalo, Kakao, Mail, ...). */
  const handleShareOut = useCallback(
    async (item: ChatMediaItem) => {
      setSharingId(item.attachmentId);
      try {
        const outcome = await shareMediaItemOut(item, conversationName);
        setToast(outcome.message);
      } finally {
        setSharingId(null);
      }
    },
    [conversationName]
  );

  /**
   * Nạp dữ liệu theo bộ lọc.
   * `kind === "link"` ⇒ tìm TIN NHẮN chứa liên kết; ngược lại ⇒ danh sách TỆP của phòng.
   */
  const load = useCallback(
    async (next: MediaFilters, append = false) => {
      if (!conversationId) return;
      const isLink = next.kind === "link";
      setLoading(true);
      try {
        if (isLink) {
          const response = await chatService.searchMessages({
            conversationId,
            keyword: next.keyword.trim() || undefined,
            senderEmplNo: next.senderEmplNo || undefined,
            fromDate: next.fromDate || undefined,
            toDate: next.toDate || undefined,
            hasLink: true,
            beforeMessageId: append ? linkResults[linkResults.length - 1]?.MESSAGE_ID : undefined,
            limit: 30,
          });
          setLinkResults((prev) => (append ? [...prev, ...response.results] : response.results));
          setHasMore(Boolean(response.hasMore));
        } else {
          const response = await chatService.listMedia({
            conversationId,
            fileKind: next.kind === "all" ? undefined : next.kind,
            keyword: next.keyword.trim() || undefined,
            senderEmplNo: next.senderEmplNo || undefined,
            fromDate: next.fromDate || undefined,
            toDate: next.toDate || undefined,
            beforeAttachmentId: append ? items[items.length - 1]?.attachmentId : undefined,
            limit: 60,
          });
          setItems((prev) => (append ? [...prev, ...response.items] : response.items));
          setHasMore(response.hasMore);
          if (response.storage) setStorage(response.storage);
        }
      } catch (error) {
        console.warn("[chat] tải media lỗi:", error);
        if (!append) {
          setItems([]);
          setLinkResults([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [conversationId, items, linkResults]
  );

  // Mở cửa sổ hoặc đổi phòng ⇒ xoá bộ lọc và tải lại từ đầu.
  useEffect(() => {
    if (!open || !conversationId) return;
    const initial = defaultFilters();
    setFilters(initial);
    void load(initial, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversationId]);

  /** Đổi 1 phần bộ lọc và tải lại ngay (dùng cho chip / preset / đổi phòng). */
  const patchAndLoad = (changes: Partial<MediaFilters>) => {
    const next = { ...filters, ...changes };
    setFilters(next);
    void load(next, false);
  };

  const applyFilters = () => void load(filters, false);

  const resetFilters = () => {
    const initial = defaultFilters();
    setFilters(initial);
    void load(initial, false);
  };

  const applyPreset = (days: number | null) => {
    patchAndLoad({
      fromDate: days === null ? "" : vnDayOffset(-days),
      toDate: days === null ? "" : vnToday(),
    });
  };

  const activePreset = useMemo(() => {
    const from = filters.fromDate || "";
    const to = filters.toDate || "";
    if (!from && !to) return null;
    return DATE_PRESETS.find(
      (preset) => preset.days !== null && from === vnDayOffset(-preset.days) && to === vnToday()
    )?.days;
  }, [filters.fromDate, filters.toDate]);

  const isLinkMode = filters.kind === "link";
  const linkGroups = useMemo(() => {
    const buckets: { day: string; items: ChatSearchResult[] }[] = [];
    linkResults.forEach((item) => {
      const day = dayLabel(item.CREATED_AT);
      const last = buckets[buckets.length - 1];
      if (last && last.day === day) last.items.push(item);
      else buckets.push({ day, items: [item] });
    });
    return buckets;
  }, [linkResults]);

  /** Nhóm theo ngày để hiển thị timeline (mới nhất lên trên). */
  const grouped = useMemo(() => {
    const buckets: { day: string; images: ChatMediaItem[]; files: ChatMediaItem[] }[] = [];
    items.forEach((item) => {
      const day = dayLabel(item.createdAt);
      let bucket = buckets[buckets.length - 1];
      if (!bucket || bucket.day !== day) {
        bucket = { day, images: [], files: [] };
        buckets.push(bucket);
      }
      if (fileKindOf(item.originalName, item.mimeType) === "image") bucket.images.push(item);
      else bucket.files.push(item);
    });
    return buckets;
  }, [items]);

  const totalFiles = storage?.fileCount ?? items.length;

  /** Ảnh đang hiển thị (theo đúng thứ tự timeline) — nguồn cho bộ xem ảnh dùng chung. */
  const mediaImageItems = useMemo<ImageViewerItem[]>(
    () =>
      grouped.flatMap((group) =>
        group.images.map((item) => ({
          attachmentId: item.attachmentId,
          originalName: item.originalName,
          fileSize: item.fileSize,
          senderEmplNo: item.senderEmplNo,
          senderName:
            (members || []).find((member) => member.EMPL_NO === item.senderEmplNo)?.FULL_NAME ||
            item.senderEmplNo,
          createdAt: item.createdAt,
          conversationId: conversationId ?? 0,
          conversationName,
          messageId: item.messageId,
        }))
      ),
    [grouped, members, conversationId, conversationName]
  );

  /** Bấm 1 ô ảnh ⇒ mở bộ xem ảnh tại đúng ảnh đó. */
  const openViewerAt = useCallback(
    (attachmentId: number) => {
      const found = mediaImageItems.findIndex((item) => item.attachmentId === attachmentId);
      setViewerIndex(found >= 0 ? found : null);
    },
    [mediaImageItems]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth className="erp-chat-mediaDialog">
      <DialogTitle className="erp-chat__mediaHead">
        <span className="erp-chat__mediaTitle">
          <FolderZipRoundedIcon sx={{ fontSize: 20 }} />
          Media &amp; tệp của {conversationName}
        </span>
        <span className="erp-chat__mediaStorage">
          {totalFiles} tệp · {formatFileSize(storage?.totalBytes)}
          {isSelf && <em> · cloud cá nhân, dung lượng không giới hạn</em>}
        </span>
        <IconButton
          size="small"
          className="erp-chat__mediaClose"
          onClick={onClose}
          aria-label="Đóng"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Bộ lọc theo phòng: 1 DÒNG gọn (tìm kiếm · người gửi · từ/đến ngày · nút) + dải chip. */}
      <div className="erp-chat__mediaFilterWrap">
        <div className="erp-chat__filterBar">
          <div className="erp-chat__searchInput">
            <SearchRoundedIcon fontSize="small" />
            <input
              value={filters.keyword}
              onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilters();
              }}
              placeholder="Tìm theo tên tệp / nội dung..."
              aria-label="Từ khoá lọc media"
            />
          </div>
          {senderOptions.length > 0 && (
            <ChatSenderField
              members={senderOptions}
              value={filters.senderEmplNo}
              onChange={(emplNo) => setFilters((prev) => ({ ...prev, senderEmplNo: emplNo }))}
              placeholder="Người gửi"
            />
          )}
          <ChatDateField
            compact
            label="Từ ngày"
            value={filters.fromDate}
            maxDate={filters.toDate || undefined}
            onChange={(value) => setFilters((prev) => ({ ...prev, fromDate: value }))}
          />
          <ChatDateField
            compact
            label="Đến ngày"
            value={filters.toDate}
            minDate={filters.fromDate || undefined}
            onChange={(value) => setFilters((prev) => ({ ...prev, toDate: value }))}
          />
          <button type="button" className="erp-chat__primaryBtn" onClick={applyFilters}>
            Áp dụng
          </button>
          <button type="button" className="erp-chat__ghostBtn" onClick={resetFilters}>
            Xoá lọc
          </button>
        </div>

        <div className="erp-chat__chipBar">
          <span className="erp-chat__filterLabel">Khoảng:</span>
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`erp-chat__kindChip${activePreset === preset.days ? " is-active" : ""}`}
              onClick={() => applyPreset(preset.days)}
            >
              {preset.label}
            </button>
          ))}
          <span className="erp-chat__filterLabel erp-chat__filterLabel--sep">Loại:</span>
          {KIND_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`erp-chat__kindChip${
                filters.kind === option.value ? " is-active" : ""
              }${option.value === "link" ? " erp-chat__kindChip--link" : ""}`}
              onClick={() => patchAndLoad({ kind: option.value })}
            >
              {option.value === "link" && <LinkRoundedIcon sx={{ fontSize: 14, mr: 0.3 }} />}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <DialogContent dividers className="erp-chat__mediaBody">
        {loading && items.length === 0 && linkResults.length === 0 && (
          <div className="erp-chat__searchLoading">
            <CircularProgress size={20} /> Đang tải...
          </div>
        )}

        {isLinkMode ? (
          <>
            {!loading && linkResults.length === 0 && (
              <div className="erp-chat__empty">
                <LinkRoundedIcon />
                <span>Không có tin nhắn chứa liên kết</span>
                <small>Thử đổi từ khoá, người gửi hoặc khoảng ngày</small>
              </div>
            )}
            <div className="erp-chat__searchResults">
              {linkGroups.map((group) => (
                <div key={group.day} className="erp-chat__searchGroup">
                  <div className="erp-chat__searchDay">{group.day}</div>
                  {group.items.map((item) => (
                    <button
                      key={`${item.CONVERSATION_ID}-${item.MESSAGE_ID}`}
                      type="button"
                      className="erp-chat__searchItem"
                      onClick={() => onOpenMessage?.(item.CONVERSATION_ID, item.MESSAGE_ID)}
                    >
                      <span className="erp-chat__searchBody">
                        <span className="erp-chat__searchMeta">
                          <span>{memberNameOf(item.SENDER_EMPL_NO)}</span>
                          <span>· {timeLabel(item.CREATED_AT)}</span>
                        </span>
                        <span className="erp-chat__searchText">
                          {item.DELETED_AT ? (
                            <em>Tin nhắn đã được thu hồi</em>
                          ) : (
                            renderMentions(item.CONTENT || "", {})
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {!loading && items.length === 0 && (
              <div className="erp-chat__empty">
                <FolderZipRoundedIcon />
                <span>Chưa có media hoặc tệp nào</span>
                <small>Ảnh và tệp gửi trong phòng này sẽ hiện ở đây</small>
              </div>
            )}

            <div className="erp-chat__timeline">
              {grouped.map((group) => (
                <div key={group.day} className="erp-chat__timelineGroup">
                  <div className="erp-chat__timelineDay">
                    <span>{group.day}</span>
                  </div>

                  <div className="erp-chat__timelineContent">
                    {group.images.length > 0 && (
                      <div className="erp-chat__mediaGrid">
                        {group.images.map((item) => (
                          <div key={item.attachmentId} className="erp-chat__mediaTileWrap">
                            <Tooltip
                              title={`${item.originalName} · ${formatFileSize(
                                item.fileSize
                              )} · ${timeLabel(item.createdAt)}`}
                            >
                              <button
                                type="button"
                                className="erp-chat__mediaTile"
                                aria-label={`Xem ảnh ${item.originalName}`}
                                onClick={() => openViewerAt(item.attachmentId)}
                              >
                                <img
                                  src={chatFileUrl(item.attachmentId)}
                                  alt={item.originalName}
                                  loading="lazy"
                                />
                              </button>
                            </Tooltip>
                            <button
                              type="button"
                              className="erp-chat__mediaShare"
                              title="Chia sẻ ra ngoài"
                              aria-label={`Chia sẻ ${item.originalName} ra ngoài`}
                              disabled={sharingId === item.attachmentId}
                              onClick={() => void handleShareOut(item)}
                            >
                              {sharingId === item.attachmentId ? (
                                <CircularProgress size={12} color="inherit" />
                              ) : (
                                <IosShareRoundedIcon sx={{ fontSize: 14 }} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {group.files.length > 0 && (
                      <div className="erp-chat__mediaFiles">
                        {group.files.map((item) => {
                          const itemKind = fileKindOf(item.originalName, item.mimeType);
                          const color = FILE_KIND_COLOR[itemKind];
                          return (
                            <div key={item.attachmentId} className="erp-chat__mediaFileRow">
                              <a
                                href={chatFileUrl(item.attachmentId)}
                                target="_blank"
                                rel="noreferrer"
                                className="erp-chat__mediaFile"
                                title={item.originalName}
                              >
                                <i
                                  className="erp-chat__mediaFileIcon"
                                  style={{ background: color.bg, color: color.fg }}
                                >
                                  <FileKindIcon kind={itemKind} />
                                </i>
                                <span className="erp-chat__mediaFileMeta">
                                  <strong>{item.originalName}</strong>
                                  <small>
                                    {timeLabel(item.createdAt)} · {memberNameOf(item.senderEmplNo)} ·{" "}
                                    {formatFileSize(item.fileSize)}
                                  </small>
                                </span>
                                <DownloadRoundedIcon sx={{ fontSize: 17 }} />
                              </a>
                              <button
                                type="button"
                                className="erp-chat__mediaShare erp-chat__mediaShare--row"
                                title="Chia sẻ ra ngoài"
                                aria-label={`Chia sẻ ${item.originalName} ra ngoài`}
                                disabled={sharingId === item.attachmentId}
                                onClick={() => void handleShareOut(item)}
                              >
                                {sharingId === item.attachmentId ? (
                                  <CircularProgress size={12} color="inherit" />
                                ) : (
                                  <IosShareRoundedIcon sx={{ fontSize: 15 }} />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {hasMore && (isLinkMode ? linkResults.length > 0 : items.length > 0) && (
          <div className="erp-chat__searchMore">
            <button type="button" disabled={loading} onClick={() => void load(filters, true)}>
              {loading ? "Đang tải..." : "Tải thêm"}
            </button>
          </div>
        )}
      </DialogContent>

      {/* Snackbar portal ra body nên vẫn nằm trên dialog. */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3200}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Bộ xem ảnh dùng chung — dùng lại y nguyên như trong khung chat. */}
      <ChatImageViewer
        open={viewerIndex !== null}
        items={mediaImageItems}
        index={viewerIndex ?? 0}
        onIndexChange={setViewerIndex}
        onClose={() => setViewerIndex(null)}
        onForward={onForwardMessage ? (item) => onForwardMessage(item.messageId) : undefined}
        onJumpToMessage={(item) => {
          setViewerIndex(null);
          onOpenMessage?.(item.conversationId, item.messageId);
        }}
      />
    </Dialog>
  );
}
