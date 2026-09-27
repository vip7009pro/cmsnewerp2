// PrecisionTestTableMobileToolbar.tsx
// Mobile Toolbar công thái học cho module Danh Mục Hạng Mục & Điểm Đo ĐTC
// - Hàng 1: ô tìm kiếm chính (16px chống auto-zoom iOS) + nút hành động chính
// - Hàng 2: dải tiện ích cuộn ngang (touch target >= 38px)

import React from "react";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoAddCircleOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoBackspaceOutline,
  IoOptionsOutline,
} from "react-icons/io5";

interface PrecisionTestTableMobileToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  /** Nhãn nút hành động chính: "+ Hạng mục" hoặc "+ Điểm đo" */
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimaryAction: () => void;
  onExport: () => void;
  onReload: () => void;
  onReset: () => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  /** Điểm đo bị khóa khi chưa chọn hạng mục -> đổi màu nút chính */
  primaryTone?: "emerald" | "indigo";
}

const PrecisionTestTableMobileToolbar: React.FC<
  PrecisionTestTableMobileToolbarProps
> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  primaryLabel,
  primaryDisabled,
  onPrimaryAction,
  onExport,
  onReload,
  onReset,
  showFilter,
  onToggleFilter,
  primaryTone = "emerald",
}) => {
  // Enter trên bàn phím ảo chỉ cần đóng bàn phím (bảng đã lọc realtime theo từ khóa)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className="precision-testtable__mobileToolbar"
      data-purpose="mobile-action-toolbar"
    >
      {/* Hàng 1: Ô tìm kiếm chính + Nút hành động chính */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <IoSearchOutline size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              title="Xóa bộ lọc tìm kiếm"
            >
              <IoCloseOutline size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-toolbar-primary btn-toolbar-primary--${primaryTone}`}
          onClick={onPrimaryAction}
          disabled={primaryDisabled}
          title={primaryLabel}
        >
          <IoAddCircleOutline size={16} />
          <span>{primaryLabel}</span>
        </button>
      </div>

      {/* Hàng 2: Dải tiện ích thao tác cuộn ngang */}
      <div className="mobile-toolbar-actions-scroll">
        <button
          type="button"
          className="action-pill action-pill--excel"
          onClick={onExport}
          title="Xuất danh sách đang hiển thị ra file Excel"
        >
          <IoDownloadOutline size={14} />
          <span>Excel</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--reload"
          onClick={onReload}
          title="Nạp lại danh sách mới nhất"
        >
          <IoRefreshOutline size={14} />
          <span>Tải lại</span>
        </button>

        <div className="pill-divider" />

        <button
          type="button"
          className={`action-pill ${showFilter ? "active" : ""}`}
          onClick={onToggleFilter}
          title={showFilter ? "Ẩn hàng lọc trên cột" : "Hiện hàng lọc trên cột"}
        >
          <IoOptionsOutline size={14} />
          <span>Lọc cột</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--reset"
          onClick={onReset}
          title="Xóa từ khóa tìm kiếm"
        >
          <IoBackspaceOutline size={14} />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestTableMobileToolbar);
