// PrecisionDTCResultMobileToolbar.tsx - Mobile Toolbar công thái học cho module Nhập KQ ĐTC
// Hàng 1: ô tìm kiếm chính (lọc realtime) + nút mở Phiếu Nhập.
// Hàng 2: dải tiện ích thao tác cuộn ngang (Thêm mẫu / EX1 / EX2 / PIVOT / Lọc cột / Đặt lại).

import React from "react";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoStatsChartOutline,
  IoOptionsOutline,
  IoBackspaceOutline,
  IoCreateOutline,
} from "react-icons/io5";

interface PrecisionDTCResultMobileToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenRecordSheet: () => void;
  onAddSample: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  showTableFilter: boolean;
  onToggleTableFilter: () => void;
}

const PrecisionDTCResultMobileToolbar: React.FC<PrecisionDTCResultMobileToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onOpenRecordSheet,
  onAddSample,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  showTableFilter,
  onToggleTableFilter,
}) => {
  // Enter trên bàn phím ảo chỉ cần đóng bàn phím (bảng đã lọc realtime theo từ khóa)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="precision-dtcresult__mobileToolbar" data-purpose="mobile-action-toolbar">
      {/* Hàng 1: Ô tìm kiếm chính + Nút mở Phiếu Nhập Kết Quả */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <IoSearchOutline size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Lọc điểm đo, mẫu, sản phẩm, ghi chú..."
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
          className="btn-toolbar-record"
          onClick={onOpenRecordSheet}
          title="Mở phiếu nhập kết quả đo"
        >
          <IoCreateOutline size={16} />
          <span>Phiếu</span>
        </button>
      </div>

      {/* Hàng 2: Dải tiện ích thao tác cuộn ngang */}
      <div className="mobile-toolbar-actions-scroll">
        <button
          type="button"
          className="action-pill action-pill--addSample"
          onClick={onAddSample}
          title="Nhân bản thêm 1 đợt mẫu đo (Sample + 1)"
        >
          <IoAddCircleOutline size={14} />
          <span>+ Mẫu</span>
        </button>

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
          className="action-pill action-pill--reset"
          onClick={() => onSearchChange("")}
          title="Đặt lại từ khóa tìm kiếm"
        >
          <IoBackspaceOutline size={14} />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultMobileToolbar);
