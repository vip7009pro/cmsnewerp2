// PrecisionKHOLIEUMobileToolbar.tsx - Mobile Toolbar 3 hàng công thái học cho Kho Liệu

import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiRefreshCw,
  FiCheck,
  FiClock,
  FiSliders,
} from "react-icons/fi";
import { MdInput, MdOutput } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiBarChartAlt2, BiFilterAlt } from "react-icons/bi";

interface PrecisionKHOLIEUMobileToolbarProps {
  mode: "NHAP" | "XUAT" | "TON";
  onModeChange: (mode: "NHAP" | "XUAT" | "TON") => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onReload: () => void;
  onOpenNhapLieu: () => void;
  onOpenXuatLieu: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  justbalancecode: boolean;
  onToggleJustBalance: () => void;
  alltime: boolean;
  onToggleAllTime: () => void;
  showTableFilter: boolean;
  onToggleTableFilter: () => void;
}

const PrecisionKHOLIEUMobileToolbar: React.FC<PrecisionKHOLIEUMobileToolbarProps> = ({
  mode,
  onModeChange,
  searchKeyword,
  onSearchChange,
  onOpenFilterDrawer,
  activeFilterCount,
  onReload,
  onOpenNhapLieu,
  onOpenXuatLieu,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  justbalancecode,
  onToggleJustBalance,
  alltime,
  onToggleAllTime,
  showTableFilter,
  onToggleTableFilter,
}) => {
  return (
    <div className="precision-kholieu__mobileToolbar" data-purpose="mobile-action-toolbar">
      {/* Hàng 1: Search input thông minh + Nút Lọc + Nút Reload */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={15} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm mã VL, tên VL, PO, Lot, Model..."
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

      {/* Hàng 2: Segmented Mode Switcher (Nhập / Xuất / Tồn) */}
      <div className="mobile-toolbar-mode-row">
        <button
          type="button"
          className={`mode-btn ${mode === "NHAP" ? "active active--emerald" : ""}`}
          onClick={() => onModeChange("NHAP")}
        >
          <MdInput size={15} />
          <span>DATA NHẬP</span>
        </button>

        <button
          type="button"
          className={`mode-btn ${mode === "XUAT" ? "active active--blue" : ""}`}
          onClick={() => onModeChange("XUAT")}
        >
          <MdOutput size={15} />
          <span>DATA XUẤT</span>
        </button>

        <button
          type="button"
          className={`mode-btn ${mode === "TON" ? "active active--purple" : ""}`}
          onClick={() => onModeChange("TON")}
        >
          <BiBarChartAlt2 size={15} />
          <span>TỒN KHO</span>
        </button>
      </div>

      {/* Hàng 3: Dải Pills Lọc Nhanh & Tiện Ích Thao Tác Cuộn Ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Quick Filter: Chỉ Tồn > 0 */}
        <button
          type="button"
          className={`action-pill ${justbalancecode ? "active active--blue" : ""}`}
          onClick={onToggleJustBalance}
          title="Chỉ hiển thị các vật liệu có tồn kho > 0"
        >
          {justbalancecode && <FiCheck size={12} />}
          <span>Tồn &gt; 0</span>
        </button>

        {/* Quick Filter: All Time */}
        <button
          type="button"
          className={`action-pill ${alltime ? "active active--warning" : ""}`}
          onClick={onToggleAllTime}
          title="Tra cứu toàn thời gian"
        >
          <FiClock size={12} />
          <span>{alltime ? "Toàn thời gian ✓" : "All Time"}</span>
        </button>

        <div className="pill-divider" />

        {/* Action: Nhập Liệu Modal */}
        <button
          type="button"
          className="action-pill action-pill--nhap"
          onClick={onOpenNhapLieu}
          title="Mở giao diện nhập liệu"
        >
          <MdInput size={14} />
          <span>Nhập Liệu</span>
        </button>

        {/* Action: Xuất Liệu Modal */}
        <button
          type="button"
          className="action-pill action-pill--xuat"
          onClick={onOpenXuatLieu}
          title="Mở giao diện xuất liệu"
        >
          <MdOutput size={14} />
          <span>Xuất Liệu</span>
        </button>

        <div className="pill-divider" />

        {/* Action: Excel EX1 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX1}
          title="Xuất bảng Excel (Dữ liệu đã lọc)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#059669" }} />
          <span>EX1</span>
        </button>

        {/* Action: Excel EX2 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX2}
          title="Xuất bảng Excel (Toàn bộ dữ liệu)"
        >
          <RiFileExcel2Line size={13} style={{ color: "#0284c7" }} />
          <span>EX2</span>
        </button>

        {/* Action: PIVOT */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onOpenPivot}
          title="Mở bảng phân tích Pivot"
        >
          <BiBarChartAlt2 size={13} style={{ color: "#7c3aed" }} />
          <span>Pivot</span>
        </button>

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
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUMobileToolbar);
