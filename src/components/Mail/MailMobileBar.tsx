/**
 * Thanh điều hướng trên cùng của hộp thư trên MOBILE (viewport < 768px).
 * Chỉ được render khi `isMobile === true` → desktop không bị ảnh hưởng.
 * Công thái học: mỗi nút ≥ 44px (ngón tay), tiêu đề co giãn + ellipsis.
 */
interface MailMobileBarProps {
  /** Tên thư mục đang xem (hoặc "Kết quả tìm kiếm"). */
  title: string;
  unreadCount: number;
  searchOpen: boolean;
  onOpenDrawer: () => void;
  onToggleSearch: () => void;
  onRefresh: () => void;
  onClose: () => void;
}

export default function MailMobileBar({
  title,
  unreadCount,
  searchOpen,
  onOpenDrawer,
  onToggleSearch,
  onRefresh,
  onClose,
}: MailMobileBarProps) {
  return (
    <header className="erp-mail__mBar">
      <button
        type="button"
        className="erp-mail__mIcon"
        onClick={onOpenDrawer}
        aria-label="Mở danh mục thư mục và cài đặt"
        title="Danh mục thư mục"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="erp-mail__mTitle">
        <span className="erp-mail__mTitleText">{title}</span>
        {unreadCount > 0 && (
          <span className="erp-mail__windowCount">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </div>

      <button
        type="button"
        className={`erp-mail__mIcon${searchOpen ? " is-active" : ""}`}
        onClick={onToggleSearch}
        aria-label={searchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm email"}
        aria-pressed={searchOpen}
        title={searchOpen ? "Đóng tìm kiếm" : "Tìm kiếm"}
      >
        <span className="material-symbols-outlined">{searchOpen ? "search_off" : "search"}</span>
      </button>

      <button
        type="button"
        className="erp-mail__mIcon"
        onClick={onRefresh}
        aria-label="Tải lại hộp thư"
        title="Tải lại"
      >
        <span className="material-symbols-outlined">refresh</span>
      </button>

      <button
        type="button"
        className="erp-mail__mIcon"
        onClick={onClose}
        aria-label="Đóng hộp thư"
        title="Đóng hộp thư"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </header>
  );
}
