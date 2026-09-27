// PrecisionADDSPECDTCMobileToolbar.tsx - Mobile Toolbar 3 hàng công thái học cho ADDSPECDTC

import React from "react";
import {
  FiSearch,
  FiX,
  FiSliders,
  FiRefreshCw,
  FiPlus,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";

interface PrecisionADDSPECDTCMobileToolbarProps {
  quickFilterText: string;
  onQuickFilterChange: (text: string) => void;
  onOpenConfigDrawer: () => void;
  activeConfigCount: number;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onExportPivot: () => void;
  onAddPoint: () => void;
  onDeleteSelected: () => void;
  onSave: () => void;
  selectedCount: number;
  checkNVL: boolean;
  onToggleCheckNVL: () => void;
}

const PrecisionADDSPECDTCMobileToolbar: React.FC<PrecisionADDSPECDTCMobileToolbarProps> = ({
  quickFilterText,
  onQuickFilterChange,
  onOpenConfigDrawer,
  activeConfigCount,
  onExportEX1,
  onExportEX2,
  onExportPivot,
  onAddPoint,
  onDeleteSelected,
  onSave,
  selectedCount,
  checkNVL,
  onToggleCheckNVL,
}) => {
  return (
    <div className="precision-addspecdtc__mobileToolbar" data-purpose="mobile-action-toolbar">
      {/* Hàng 1: Search input thông minh + Nút Cấu Hình */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={15} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilterText}
            onChange={(e) => onQuickFilterChange(e.target.value)}
          />
          {quickFilterText && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onQuickFilterChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-trigger-filter ${activeConfigCount > 0 ? "active" : ""}`}
          onClick={onOpenConfigDrawer}
          title="Mở cấu hình SPEC"
        >
          <FiSliders size={14} />
          <span>Config</span>
          {activeConfigCount > 0 && <span className="badge-count">{activeConfigCount}</span>}
        </button>
      </div>

      {/* Hàng 2: Quick Action Pills */}
      <div className="mobile-toolbar-mode-row">
        <button
          type="button"
          className={`mode-btn ${checkNVL ? "active active--warning" : ""}`}
          onClick={onToggleCheckNVL}
          title={checkNVL ? "Đang kiểm tra NVL (IQC)" : "Đang cấu hình Thành phẩm (R&D)"}
        >
          <span>{checkNVL ? "🧪 NVL (IQC) ✓" : "📦 SP (R&D)"}</span>
        </button>

        <button
          type="button"
          className="mode-btn mode-btn--search"
          onClick={onSave}
          title="Lưu tất cả điểm đo vào CSDL"
        >
          <FiSave size={14} />
          <span>LƯU DỮ LIỆU</span>
        </button>
      </div>

      {/* Hàng 3: Dải Tiện Ích Thao Tác Cuộn Ngang */}
      <div className="mobile-toolbar-actions-scroll">
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX1}
          title="Xuất Excel (Dữ liệu đã lọc)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#059669" }} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX2}
          title="Xuất Excel (Toàn bộ)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#0284c7" }} />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="action-pill"
          onClick={onExportPivot}
          title="Xuất PIVOT"
        >
          <span>🔀</span>
          <span>PIVOT</span>
        </button>

        <div className="pill-divider" />

        <button
          type="button"
          className="action-pill action-pill--add"
          onClick={onAddPoint}
          title="Thêm điểm đo"
        >
          <FiPlus size={13} />
          <span>+ Điểm Đo</span>
        </button>

        <button
          type="button"
          className={`action-pill action-pill--delete ${selectedCount > 0 ? "has-selection" : ""}`}
          onClick={onDeleteSelected}
          title="Xóa dòng đang chọn"
        >
          <FiTrash2 size={13} />
          <span>Xóa{selectedCount > 0 ? ` (${selectedCount})` : ""}</span>
        </button>

        <div className="pill-divider" />

        <button
          type="button"
          className="action-pill"
          onClick={onOpenConfigDrawer}
          title="Tải lại / Cấu hình lại"
        >
          <FiRefreshCw size={13} />
          <span>Config</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionADDSPECDTCMobileToolbar);
