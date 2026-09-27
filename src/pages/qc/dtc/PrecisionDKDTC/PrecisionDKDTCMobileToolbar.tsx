// PrecisionDKDTCMobileToolbar.tsx - Mobile Toolbar công thái học cho module Đăng Ký Test ĐTC (DKDTC)

import React from "react";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoStatsChartOutline,
  IoRefreshOutline,
  IoBackspaceOutline,
  IoOptionsOutline,
} from "react-icons/io5";

interface PrecisionDKDTCMobileToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenRegister: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  onReload: () => void;
  onReset: () => void;
  showTableFilter: boolean;
  onToggleTableFilter: () => void;
  selectedTestsCount: number;
}

const PrecisionDKDTCMobileToolbar: React.FC<PrecisionDKDTCMobileToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onOpenRegister,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onReload,
  onReset,
  showTableFilter,
  onToggleTableFilter,
  selectedTestsCount,
}) => {
  // Enter trên bàn phím ảo chỉ cần đóng bàn phím (bảng đã lọc realtime theo từ khóa)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className="precision-dkdtc__mobileToolbar"
      data-purpose="mobile-action-toolbar"
    >
      {/* Hàng 1: Ô tìm kiếm chính + Nút mở Phiếu Đăng Ký */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <IoSearchOutline size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Lọc ID, YCSX, sản phẩm, vật liệu, NV..."
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
          className="btn-toolbar-register"
          onClick={onOpenRegister}
          title="Mở phiếu đăng ký test ĐTC"
        >
          <IoDocumentTextOutline size={16} />
          <span>Phiếu ĐK</span>
          {selectedTestsCount > 0 && (
            <span className="register-badge">{selectedTestsCount}</span>
          )}
        </button>
      </div>

      {/* Hàng 2: Dải tiện ích thao tác cuộn ngang */}
      <div className="mobile-toolbar-actions-scroll">
        <button
          type="button"
          className="action-pill action-pill--excel"
          onClick={onExportEX1}
          title="Xuất dữ liệu đang hiển thị ra Excel"
        >
          <IoDocumentTextOutline size={14} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu bảng ra Excel"
        >
          <IoDownloadOutline size={14} />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--pivot"
          onClick={onOpenPivot}
          title="Phân tích báo cáo xoay Pivot đa chiều"
        >
          <IoStatsChartOutline size={14} />
          <span>PIVOT</span>
        </button>

        <div className="pill-divider" />

        <button
          type="button"
          className={`action-pill ${showTableFilter ? "active" : ""}`}
          onClick={onToggleTableFilter}
          title={showTableFilter ? "Ẩn hàng lọc trên cột" : "Hiện hàng lọc trên cột"}
        >
          <IoOptionsOutline size={14} />
          <span>Lọc cột</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--reload"
          onClick={onReload}
          title="Tải lại danh sách kiểm tra mới nhất"
        >
          <IoRefreshOutline size={14} />
          <span>Nạp lại</span>
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

export default React.memo(PrecisionDKDTCMobileToolbar);
