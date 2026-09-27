// PrecisionKQDTCMobileToolbar.tsx - Mobile Toolbar 3 hàng công thái học cho KQDTC

import React from "react";
import {
  FiSearch,
  FiX,
  FiSliders,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiPieChart,
  FiRotateCcw,
} from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiFilterAlt } from "react-icons/bi";

interface PrecisionKQDTCMobileToolbarProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onReload: () => void;
  onlyNG: boolean;
  onToggleOnlyNG: () => void;
  alltime: boolean;
  onToggleAllTime: () => void;
  onOpenChartsModal: () => void;
  hasSelectedData: boolean;
  selectedTestName?: string;
  onExportEX1: () => void;
  onExportEX2: () => void;
  showTableFilter: boolean;
  onToggleTableFilter: () => void;
  onResetFilter: () => void;
}

const PrecisionKQDTCMobileToolbar: React.FC<PrecisionKQDTCMobileToolbarProps> = ({
  searchKeyword,
  onSearchChange,
  onOpenFilterDrawer,
  activeFilterCount,
  onReload,
  onlyNG,
  onToggleOnlyNG,
  alltime,
  onToggleAllTime,
  onOpenChartsModal,
  hasSelectedData,
  selectedTestName,
  onExportEX1,
  onExportEX2,
  showTableFilter,
  onToggleTableFilter,
  onResetFilter,
}) => {
  return (
    <div className="precision-kqdtc__mobileToolbar" data-purpose="mobile-action-toolbar">
      {/* Hàng 1: Search input thông minh + Nút Lọc + Nút Reload */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={15} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm mã DTC, YCSX, model, vật liệu, test..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-trigger-filter ${activeFilterCount > 0 ? "active" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiSliders size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="badge-count">{activeFilterCount}</span>}
        </button>

        <button
          type="button"
          className="btn-trigger-reload"
          onClick={onReload}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>

      {/* Hàng 2: Dải Pills Lọc Nhanh & Trạng Thái SPC */}
      <div className="mobile-toolbar-mode-row">
        {/* Quick Filter: Chỉ Mẫu NG */}
        <button
          type="button"
          className={`mode-btn ${onlyNG ? "active active--rose" : ""}`}
          onClick={onToggleOnlyNG}
          title="Chỉ hiển thị các mẫu kiểm tra NG"
        >
          <FiAlertTriangle size={14} />
          <span>{onlyNG ? "Chỉ Xem NG ✓" : "Chỉ Xem NG"}</span>
        </button>

        {/* Quick Filter: All Time */}
        <button
          type="button"
          className={`mode-btn ${alltime ? "active active--warning" : ""}`}
          onClick={onToggleAllTime}
          title="Tra cứu toàn thời gian"
        >
          <FiClock size={14} />
          <span>{alltime ? "Toàn thời gian ✓" : "All Time"}</span>
        </button>

        {/* Action: Mở SPC Charts */}
        <button
          type="button"
          className={`mode-btn ${hasSelectedData ? "active active--spc" : ""}`}
          onClick={onOpenChartsModal}
          title={
            hasSelectedData
              ? `Xem SPC: ${selectedTestName || "Mục test đã chọn"}`
              : "Chọn 1 dòng trong bảng để xem SPC"
          }
        >
          <FiPieChart size={14} />
          <span className="mode-btn-text">
            {hasSelectedData ? `Biểu đồ SPC ✓` : "Biểu đồ SPC"}
          </span>
        </button>
      </div>

      {/* Hàng 3: Dải Tiện Ích Thao Tác Cuộn Ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Action: Excel EX1 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX1}
          title="Xuất bảng Excel (Dữ liệu đã lọc)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#059669" }} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Action: Excel EX2 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX2}
          title="Xuất bảng Excel (Toàn bộ dữ liệu)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#0284c7" }} />
          <span>EX2 (Tất cả)</span>
        </button>

        <div className="pill-divider" />

        {/* Action: Cột Filter Table Toggle */}
        <button
          type="button"
          className={`action-pill ${showTableFilter ? "active" : ""}`}
          onClick={onToggleTableFilter}
          title={showTableFilter ? "Ẩn hàng lọc trên cột bảng" : "Hiện hàng lọc trên cột bảng"}
        >
          <BiFilterAlt size={13} />
          <span>{showTableFilter ? "Lọc Cột: Bật" : "Lọc Cột: Tắt"}</span>
        </button>

        {/* Action: Đặt Lại Bộ Lọc */}
        <button
          type="button"
          className="action-pill"
          onClick={onResetFilter}
          title="Thiết lập lại bộ lọc mặc định"
        >
          <FiRotateCcw size={13} />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCMobileToolbar);
