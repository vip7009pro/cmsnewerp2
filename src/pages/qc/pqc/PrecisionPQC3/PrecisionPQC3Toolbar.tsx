import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiShow, BiHide } from "react-icons/bi";
import { FiDownload, FiLayers, FiAlertTriangle, FiColumns } from "react-icons/fi";
import { PQC3ViewMode } from "./usePQC3Data";

interface PrecisionPQC3ToolbarProps {
  showhideinput: boolean;
  onToggleShowHideInput: () => void;
  onTraData: () => void;
  activeView: PQC3ViewMode;
  onActiveViewChange: (mode: PQC3ViewMode) => void;
  quickFilter: string;
  onQuickFilterChange: (val: string) => void;
  onExportExcel: (isFiltered: boolean) => void;
  pqc3Count: number;
  pqc1Count: number;
}

export const PrecisionPQC3Toolbar: React.FC<PrecisionPQC3ToolbarProps> = ({
  showhideinput,
  onToggleShowHideInput,
  onTraData,
  activeView,
  onActiveViewChange,
  quickFilter,
  onQuickFilterChange,
  onExportExcel,
  pqc3Count,
  pqc1Count,
}) => {
  return (
    <div className="precision-pqc3-toolbar">
      <div className="precision-pqc3-toolbar__left">
        <button
          type="button"
          className="btn-action primary"
          onClick={onTraData}
          title="Tra cứu dữ liệu lỗi PQC3 toàn bộ"
        >
          <AiOutlineSearch size={14} /> Tra Data Lỗi
        </button>

        <button
          type="button"
          className="btn-action"
          onClick={onToggleShowHideInput}
          title="Ẩn hoặc hiện khung nhập thông tin đăng ký lỗi"
        >
          {showhideinput ? <BiHide size={14} /> : <BiShow size={14} />}
          {showhideinput ? "Ẩn Form Nhập" : "Hiện Form Nhập"}
        </button>

        <div className="toolbar-divider" />

        {/* Segment Switcher cho chế độ xem bảng */}
        <div className="view-switcher">
          <button
            type="button"
            className={`view-tab ${activeView === "DEFECT" ? "active" : ""}`}
            onClick={() => onActiveViewChange("DEFECT")}
            title="Xem danh sách các sự cố lỗi PQC3"
          >
            <FiAlertTriangle size={12} /> Bảng Lỗi PQC3 ({pqc3Count})
          </button>

          <button
            type="button"
            className={`view-tab ${activeView === "SETTING" ? "active" : ""}`}
            onClick={() => onActiveViewChange("SETTING")}
            title="Xem danh sách lô cài đặt công đoạn PQC1"
          >
            <FiLayers size={12} /> Lô Setting PQC1 ({pqc1Count})
          </button>

          <button
            type="button"
            className={`view-tab ${activeView === "DUAL" ? "active" : ""}`}
            onClick={() => onActiveViewChange("DUAL")}
            title="Xem song song cả 2 bảng PQC3 & PQC1"
          >
            <FiColumns size={12} /> Song Song (Dual)
          </button>
        </div>
      </div>

      <div className="precision-pqc3-toolbar__right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilter}
            onChange={(e) => onQuickFilterChange(e.target.value)}
          />
          <span className="search-icon">
            <AiOutlineSearch />
          </span>
        </div>

        <button
          type="button"
          className="btn-export"
          onClick={() => onExportExcel(true)}
          title="Xuất các dòng đang lọc ra file Excel"
        >
          <FiDownload size={12} /> EX1 (Lọc)
        </button>

        <button
          type="button"
          className="btn-export"
          onClick={() => onExportExcel(false)}
          title="Xuất toàn bộ bảng ra file Excel"
        >
          <FiDownload size={12} /> EX2 (Toàn bộ)
        </button>

        <span className="count-chip">
          {activeView === "SETTING" ? `${pqc1Count} PQC1` : `${pqc3Count} PQC3`}
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQC3Toolbar);
