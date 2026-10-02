import { Button, CircularProgress } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import type React from "react";
import MailListItem from "./MailListItem";
import type { MailListItemModel } from "./mail.types";

interface MailListProps {
  title: string;
  messages: MailListItemModel[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  activeId: number | null;
  /** Nội dung gọi ý khi danh sách trống (ví dụ: chưa cấu hình mail). */
  emptyHint?: React.ReactNode;  /** Thanh trạng thái đồng bộ (chèn ngay dưới tiêu đề). */
  statusBar?: React.ReactNode;
  /** Ô tìm kiếm + bộ lọc (chèn ngay dưới thanh trạng thái). */
  searchSlot?: React.ReactNode;
  /** Ẩn/hiện cột thư mục (cột 1). */
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;  onOpen: (item: MailListItemModel) => void;
  onToggleStar: (item: MailListItemModel) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
}

/** Danh sách email (keyset pagination — tải thêm khi cuộn tới đáy). */
export default function MailList({
  title,
  messages,
  loading,
  hasMore,
  error,
  activeId,
  emptyHint,
  statusBar,
  searchSlot,
  sidebarCollapsed,
  onToggleSidebar,
  onOpen,
  onToggleStar,
  onLoadMore,
  onRefresh,
}: MailListProps) {
  return (
    <div className="erp-mail__main">
      <div className="erp-mail__listHead">
        {onToggleSidebar && (
          <button
            type="button"
            className={`erp-mail__backBtn${sidebarCollapsed ? " is-off" : ""}`}
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? "Hiện danh mục thư mục" : "Ẩn danh mục thư mục"}
            aria-label={sidebarCollapsed ? "Hiện danh mục thư mục" : "Ẩn danh mục thư mục"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {sidebarCollapsed ? "left_panel_open" : "left_panel_close"}
            </span>
          </button>
        )}
        <span className="erp-mail__listTitle">{title}</span>
        <span className="erp-mail__listSpacer" />
        <button
          type="button"
          className="erp-mail__backBtn"
          onClick={onRefresh}
          title="Tải lại"
          aria-label="Tải lại hộp thư"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            refresh
          </span>
        </button>
      </div>

      {statusBar}

      {searchSlot}

      <div
        className="erp-mail__list"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (hasMore && !loading && el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
            onLoadMore();
          }
        }}
      >
        {error && <div className="erp-mail__empty erp-mail__attachmentError">{error}</div>}
        {!error && messages.length === 0 && !loading && (
          <div className="erp-mail__empty">{emptyHint || "Thư mục trống"}</div>
        )}

        {messages.map((item) => (
          <MailListItem
            key={item.id}
            item={item}
            active={activeId === item.id}
            onOpen={onOpen}
            onToggleStar={onToggleStar}
          />
        ))}

        {loading && (
          <div className="erp-mail__loadMore">
            <CircularProgress size={20} />
          </div>
        )}

        {!loading && hasMore && (
          <div className="erp-mail__loadMore">
            <Button size="small" onClick={onLoadMore} startIcon={<RefreshRoundedIcon />}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
