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
import type { ChatFileKindFilter, ChatMediaItem } from "./chat.types";
import type { ChatStorage } from "../../api/services/chatService";
import { chatFileUrl, chatService } from "../../api/services/chatService";
import { shareMediaItemOut } from "./chatShareOut";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  dayLabel,
  fileKindOf,
  formatFileSize,
  timeLabel,
} from "./chatUtils";

interface Props {
  open: boolean;
  conversationId: number | null;
  conversationName: string;
  isSelf: boolean;
  onClose: () => void;
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
  { value: "other", label: "Khác" },
];

/**
 * Cửa sổ xem media/tệp của 1 phòng: lưới ảnh + danh sách tệp, phân nhóm theo ngày
 * dạng timeline để dễ tra cứu lịch sử.
 */
export default function ChatMediaDialog({
  open,
  conversationId,
  conversationName,
  isSelf,
  onClose,
}: Props) {
  const [items, setItems] = useState<ChatMediaItem[]>([]);
  const [storage, setStorage] = useState<ChatStorage | null>(null);
  const [kind, setKind] = useState<ChatFileKindFilter>("all");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  /** Đang nạp tệp để đưa vào bảng chia sẻ của hệ điều hành. */
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

  const load = useCallback(
    async (nextKind: ChatFileKindFilter, append = false) => {
      if (!conversationId) return;
      setLoading(true);
      try {
        const response = await chatService.listMedia({
          conversationId,
          fileKind: nextKind === "all" ? undefined : nextKind,
          beforeAttachmentId: append ? items[items.length - 1]?.attachmentId : undefined,
          limit: 60,
        });
        setItems((prev) => (append ? [...prev, ...response.items] : response.items));
        setHasMore(response.hasMore);
        if (response.storage) setStorage(response.storage);
      } catch (error) {
        console.warn("[chat] tải media lỗi:", error);
        if (!append) setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, items]
  );

  useEffect(() => {
    if (!open || !conversationId) return;
    setKind("all");
    void load("all", false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, conversationId]);

  const changeKind = (next: ChatFileKindFilter) => {
    setKind(next);
    void load(next, false);
  };

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
        <IconButton size="small" onClick={onClose} aria-label="Đóng">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <div className="erp-chat__mediaFilters">
        {KIND_FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`erp-chat__kindChip${kind === option.value ? " is-active" : ""}`}
            onClick={() => changeKind(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <DialogContent dividers className="erp-chat__mediaBody">
        {loading && items.length === 0 && (
          <div className="erp-chat__searchLoading">
            <CircularProgress size={20} /> Đang tải media...
          </div>
        )}

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
                          title={`${item.originalName} · ${formatFileSize(item.fileSize)} · ${timeLabel(
                            item.createdAt
                          )}`}
                        >
                          <a
                            href={chatFileUrl(item.attachmentId)}
                            target="_blank"
                            rel="noreferrer"
                            className="erp-chat__mediaTile"
                          >
                            <img
                              src={chatFileUrl(item.attachmentId)}
                              alt={item.originalName}
                              loading="lazy"
                            />
                          </a>
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
                                {timeLabel(item.createdAt)} · {item.senderEmplNo} ·{" "}
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

        {hasMore && items.length > 0 && (
          <div className="erp-chat__searchMore">
            <button type="button" disabled={loading} onClick={() => void load(kind, true)}>
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
    </Dialog>
  );
}
