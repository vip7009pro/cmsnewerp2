import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import type {
  ChatConversation,
  ChatFileKindFilter,
  ChatSearchFilters,
  ChatSearchResult,
} from "./chat.types";
import ChatDateField from "./ChatDateField";
import { chatService } from "../../api/services/chatService";
import {
  FILE_KIND_COLOR,
  FileKindIcon,
  chatAvatarUrl,
  fileKindOf,
  formatFileSize,
  initialsOf,
  timeLabel,
  dayLabel,
  vnDayOffset,
  vnToday,
} from "./chatUtils";

interface Props {
  /** Bỏ trống ⇒ tìm toàn cục trong mọi phòng của user. */
  conversationId?: number;
  conversation?: ChatConversation | null;
  /** Tên/avatar người gửi để hiển thị khi tìm toàn cục. */
  myEmplNo: string;
  onClose?: () => void;
  /** Bấm 1 kết quả ⇒ nhảy tới tin nhắn đó. */
  onOpenResult: (conversationId: number, messageId: number) => void;
  autoFocus?: boolean;
}

/** Các nhóm loại tệp theo yêu cầu nghiệp vụ (Excel, PPT, Word, ...). */
const KIND_OPTIONS: { value: ChatFileKindFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "image", label: "Ảnh" },
  { value: "excel", label: "Excel" },
  { value: "word", label: "Word" },
  { value: "ppt", label: "PowerPoint" },
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "zip", label: "Nén (zip)" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Âm thanh" },
  { value: "other", label: "Khác" },
];

const EMPTY_FILTERS: ChatSearchFilters = {
  keyword: "",
  senderEmplNo: "",
  fromDate: "",
  toDate: "",
  fileKind: "all",
  onlyWithFiles: false,
};

/** Mặc định: lọc theo NGÀY HÔM NAY (giờ Việt Nam). */
function defaultFilters(): ChatSearchFilters {
  const today = vnToday();
  return { ...EMPTY_FILTERS, fromDate: today, toDate: today };
}

/** Khoảng ngày chọn nhanh (số ngày lùi về trước so với hôm nay). */
const DATE_PRESETS: { label: string; days: number | null }[] = [
  { label: "Hôm nay", days: 0 },
  { label: "7 ngày", days: 6 },
  { label: "30 ngày", days: 29 },
  { label: "Tất cả", days: null },
];

export default function ChatSearchPanel({
  conversationId,
  conversation,
  myEmplNo,
  onClose,
  onOpenResult,
  autoFocus = true,
}: Props) {
  const [filters, setFilters] = useState<ChatSearchFilters>(() => defaultFilters());
  const [results, setResults] = useState<ChatSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const isGlobal = !conversationId;

  const senderOptions = useMemo(() => {
    if (!conversation) return [];
    return conversation.MEMBERS.filter((m) => m.EMPL_NO !== myEmplNo);
  }, [conversation, myEmplNo]);

  const runSearch = useCallback(
    async (nextFilters: ChatSearchFilters, append = false) => {
      setLoading(true);
      try {
        const payload = {
          conversationId,
          keyword: nextFilters.keyword?.trim() || undefined,
          senderEmplNo: nextFilters.senderEmplNo || undefined,
          fromDate: nextFilters.fromDate || undefined,
          toDate: nextFilters.toDate || undefined,
          fileKind: nextFilters.fileKind && nextFilters.fileKind !== "all" ? nextFilters.fileKind : undefined,
          onlyWithFiles: nextFilters.onlyWithFiles || undefined,
          beforeMessageId: append ? results[results.length - 1]?.MESSAGE_ID : undefined,
          limit: 30,
        };
        const response = await chatService.searchMessages(payload);
        setResults((prev) => (append ? [...prev, ...response.results] : response.results));
        setHasMore(Boolean(response.hasMore));
        setSearched(true);
      } catch (error) {
        console.warn("[chat] tìm kiếm lỗi:", error);
        if (!append) setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, results]
  );

  // Chạy tìm kiếm khi mở (để thấy ngay tin/tệp gần nhất) và khi đổi bộ lọc.
  useEffect(() => {
    const initial = defaultFilters();
    setFilters(initial);
    void runSearch(initial, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const patch = (changes: Partial<ChatSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    void runSearch(filters, false);
  };

  const reset = () => {
    const initial = defaultFilters();
    setFilters(initial);
    void runSearch(initial, false);
  };

  /** Bấm preset khoảng ngày ⇒ áp dụng và tìm luôn. */
  const applyPreset = (days: number | null) => {
    const next: ChatSearchFilters = {
      ...filters,
      fromDate: days === null ? "" : vnDayOffset(-days),
      toDate: days === null ? "" : vnToday(),
    };
    setFilters(next);
    void runSearch(next, false);
  };

  const activePreset = useMemo(() => {
    const from = filters.fromDate || "";
    const to = filters.toDate || "";
    if (!from && !to) return null;
    return DATE_PRESETS.find(
      (preset) =>
        preset.days !== null && from === vnDayOffset(-preset.days) && to === vnToday()
    )?.days;
  }, [filters.fromDate, filters.toDate]);

  const grouped = useMemo(() => {
    const buckets: { day: string; items: ChatSearchResult[] }[] = [];
    results.forEach((item) => {
      const day = dayLabel(item.CREATED_AT);
      const last = buckets[buckets.length - 1];
      if (last && last.day === day) last.items.push(item);
      else buckets.push({ day, items: [item] });
    });
    return buckets;
  }, [results]);

  return (
    <div className="erp-chat__searchPanel">
      <form className="erp-chat__searchForm" onSubmit={handleSubmit}>
        <div className="erp-chat__searchInput">
          <SearchRoundedIcon fontSize="small" />
          <input
            value={filters.keyword || ""}
            onChange={(event) => patch({ keyword: event.target.value })}
            placeholder={
              isGlobal ? "Tìm trong toàn bộ lịch sử chat và tệp..." : "Tìm trong cuộc trò chuyện này..."
            }
            aria-label="Từ khoá tìm kiếm"
            autoFocus={autoFocus}
          />
        </div>
        <Tooltip title="Tìm">
          <IconButton size="small" className="erp-chat__iconBtn" type="submit">
            <SearchRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {onClose && (
          <Tooltip title="Đóng tìm kiếm">
            <IconButton size="small" className="erp-chat__iconBtn" onClick={onClose} type="button">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </form>

      <div className="erp-chat__searchFilters">
        <div className="erp-chat__filterRow">
          {!isGlobal && senderOptions.length > 0 && (
            <TextField
              select
              size="small"
              label="Người gửi"
              value={filters.senderEmplNo || ""}
              onChange={(event) => patch({ senderEmplNo: event.target.value })}
              className="erp-chat__filterSelect"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {senderOptions.map((member) => (
                <MenuItem key={member.EMPL_NO} value={member.EMPL_NO}>
                  {member.FULL_NAME || member.EMPL_NO}
                  <em className="erp-chat__menuCode">({member.EMPL_NO})</em>
                </MenuItem>
              ))}
            </TextField>
          )}

          <ChatDateField
            label="Từ ngày"
            value={filters.fromDate || ""}
            maxDate={filters.toDate || undefined}
            onChange={(value) => patch({ fromDate: value })}
          />
          <ChatDateField
            label="Đến ngày"
            value={filters.toDate || ""}
            minDate={filters.fromDate || undefined}
            onChange={(value) => patch({ toDate: value })}
          />
        </div>

        <div className="erp-chat__filterRow erp-chat__filterRow--presets">
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
        </div>

        <div className="erp-chat__filterRow erp-chat__filterRow--kinds">
          <span className="erp-chat__filterLabel">Loại tệp:</span>
          <div className="erp-chat__kindChips">
            {KIND_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`erp-chat__kindChip${
                  (filters.fileKind || "all") === option.value ? " is-active" : ""
                }`}
                onClick={() => patch({ fileKind: option.value })}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              className={`erp-chat__kindChip${filters.onlyWithFiles ? " is-active" : ""}`}
              onClick={() => patch({ onlyWithFiles: !filters.onlyWithFiles })}
            >
              Chỉ tin có tệp
            </button>
          </div>
        </div>

        <div className="erp-chat__filterRow erp-chat__filterRow--actions">
          <button type="button" className="erp-chat__primaryBtn" onClick={() => handleSubmit()}>
            Áp dụng bộ lọc
          </button>
          <button type="button" className="erp-chat__ghostBtn" onClick={reset}>
            Xoá lọc
          </button>
        </div>
      </div>

      <div className="erp-chat__searchResults">
        {loading && results.length === 0 && (
          <div className="erp-chat__searchLoading">
            <CircularProgress size={20} /> Đang tìm...
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="erp-chat__empty">
            <SearchRoundedIcon />
            <span>Không tìm thấy kết quả</span>
            <small>Thử từ khoá khác hoặc bỏ bớt bộ lọc</small>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.day} className="erp-chat__searchGroup">
            <div className="erp-chat__searchDay">{group.day}</div>
            {group.items.map((item) => (
              <button
                key={`${item.CONVERSATION_ID}-${item.MESSAGE_ID}`}
                type="button"
                className="erp-chat__searchItem"
                onClick={() => onOpenResult(item.CONVERSATION_ID, item.MESSAGE_ID)}
              >
                <Avatar
                  src={chatAvatarUrl(item.SENDER_EMPL_NO) || undefined}
                  sx={{ width: 30, height: 30, fontSize: 12, bgcolor: "#64748b" }}
                >
                  {initialsOf(item.SENDER_EMPL_NO)}
                </Avatar>
                <span className="erp-chat__searchBody">
                  <span className="erp-chat__searchMeta">
                    {isGlobal && (
                      <em className="erp-chat__searchRoom">{item.CONVERSATION_NAME}</em>
                    )}
                    <span>{item.SENDER_EMPL_NO}</span>
                    <span>· {timeLabel(item.CREATED_AT)}</span>
                  </span>
                  <span className="erp-chat__searchText">
                    {item.DELETED_AT ? (
                      <em>Tin nhắn đã được thu hồi</em>
                    ) : (
                      item.CONTENT || "(không có nội dung văn bản)"
                    )}
                  </span>
                  {item.ATTACHMENTS.length > 0 && (
                    <span className="erp-chat__searchFiles">
                      {item.ATTACHMENTS.slice(0, 4).map((file) => {
                        const kind = fileKindOf(file.originalName, file.mimeType);
                        const color = FILE_KIND_COLOR[kind];
                        return (
                          <span
                            key={file.attachmentId}
                            className="erp-chat__searchFile"
                            title={`${file.originalName} · ${formatFileSize(file.fileSize)}`}
                          >
                            <i style={{ background: color.bg, color: color.fg }}>
                              {kind === "file" ? (
                                <InsertDriveFileRoundedIcon fontSize="inherit" />
                              ) : (
                                <FileKindIcon kind={kind} />
                              )}
                            </i>
                            <b>{file.originalName}</b>
                            <small>{formatFileSize(file.fileSize)}</small>
                          </span>
                        );
                      })}
                      {item.ATTACHMENTS.length > 4 && (
                        <span className="erp-chat__searchFileMore">
                          +{item.ATTACHMENTS.length - 4} tệp
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        ))}

        {hasMore && results.length > 0 && (
          <div className="erp-chat__searchMore">
            <button type="button" disabled={loading} onClick={() => void runSearch(filters, true)}>
              {loading ? "Đang tải..." : "Tải thêm kết quả"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
