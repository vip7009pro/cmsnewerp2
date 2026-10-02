import { useEffect, type ReactNode } from "react";

/**
 * Bottom-sheet danh mục thư mục + cài đặt cho MOBILE.
 * Chỉ được render khi `isMobile === true` → desktop không bị ảnh hưởng.
 * Nội dung (children) là cột thư mục MailSidebar → giữ 100% chức năng cột 1 của desktop.
 * KHÔNG dùng backdrop-filter blur (quy tắc module email/Stitch).
 */
interface MailMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Bấm chọn thư mục xong thì tự đóng sheet. */
  onNavigate?: () => void;
}

export default function MailMobileDrawer({ open, onClose, children, onNavigate }: MailMobileDrawerProps) {
  // ESC để đóng (giống hành vi dialog desktop).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="erp-mail__mSheetBackdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="erp-mail__mSheet"
        role="dialog"
        aria-modal="true"
        aria-label="Danh mục thư mục và cài đặt hộp thư"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="erp-mail__mSheetHead">
          <span className="erp-mail__mSheetGrip" aria-hidden="true" />
          <span className="erp-mail__mSheetTitle">Hộp thư</span>
          <button
            type="button"
            className="erp-mail__mIcon"
            onClick={onClose}
            aria-label="Đóng danh mục"
            title="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="erp-mail__mSheetBody" onClick={onNavigate}>{children}</div>
      </div>
    </div>
  );
}
