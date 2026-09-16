import React from "react";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineReload,
} from "react-icons/ai";
import { Equipment, UrgencyFilter } from "./calibrationTypes";

interface ToolbarProps {
  urgencyFilter: UrgencyFilter;
  setUrgencyFilter: (filter: UrgencyFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  selectedEquipment: Equipment | null;
  totalCount: number;
  onLoadEquipment: () => void;
  onOpenAddEq: () => void;
  onOpenAddHist: () => void;
  onUnselectEq: () => void;
  onExportExcel: () => void;
}

export const PrecisionCalibrationToolbar: React.FC<ToolbarProps> = ({
  urgencyFilter,
  setUrgencyFilter,
  searchQuery,
  setSearchQuery,
  isLoading,
  selectedEquipment,
  totalCount,
  onLoadEquipment,
  onOpenAddEq,
  onOpenAddHist,
  onUnselectEq,
  onExportExcel,
}) => {
  return (
    <div className="pc-toolbar">
      {/* Row 1: Filter tabs & Legend */}
      <div className="toolbar-row-1">
        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${urgencyFilter === "ALL" ? "active" : ""}`}
            onClick={() => setUrgencyFilter("ALL")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`tab-btn ${urgencyFilter === "OVERDUE" ? "active" : ""}`}
            onClick={() => setUrgencyFilter("OVERDUE")}
          >
            Quá hạn
          </button>
          <button
            type="button"
            className={`tab-btn ${urgencyFilter === "DUE_SOON" ? "active" : ""}`}
            onClick={() => setUrgencyFilter("DUE_SOON")}
          >
            Sắp đến hạn (30d)
          </button>
          <button
            type="button"
            className={`tab-btn ${urgencyFilter === "VALID" ? "active" : ""}`}
            onClick={() => setUrgencyFilter("VALID")}
          >
            Trong hạn
          </button>
          <button
            type="button"
            className={`tab-btn ${urgencyFilter === "BROKEN" ? "active" : ""}`}
            onClick={() => setUrgencyFilter("BROKEN")}
          >
            Đã hỏng
          </button>
        </div>

        <div className="legend-group">
          <span className="legend-chip overdue">Quá hạn</span>
          <span className="legend-chip due-soon">Sắp đến hạn</span>
          <span className="legend-chip valid">Trong hạn</span>
          <span className="legend-chip broken">Đã hỏng</span>

          <button
            type="button"
            className="btn-reload"
            onClick={onLoadEquipment}
            disabled={isLoading}
            title="Làm mới bảng"
          >
            <AiOutlineReload />
            <span>Nạp lại</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Row 2: Quick Search & Action Buttons */}
      <div className="toolbar-row-2">
        <div className="quick-search-box">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh tên thiết bị, số QL, model, maker, vị trí..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery("")}
            >
              <AiOutlineClose />
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn-action add-eq"
            onClick={onOpenAddEq}
            title="Thêm mới thiết bị đo lường"
          >
            <AiOutlinePlus />
            <span>Thêm Thiết Bị</span>
          </button>

          <button
            type="button"
            className="btn-action add-hist"
            onClick={onOpenAddHist}
            disabled={!selectedEquipment}
            title={
              selectedEquipment
                ? `Thêm lịch sử cho ${selectedEquipment.EQ_NAME}`
                : "Vui lòng chọn 1 thiết bị trên bảng trước"
            }
          >
            <AiOutlinePlus />
            <span>Thêm Lịch Sử HC</span>
          </button>

          <button
            type="button"
            className="btn-action export"
            onClick={onExportExcel}
            title="Xuất danh sách thiết bị ra Excel"
          >
            <AiOutlineDownload />
            <span>Xuất Excel</span>
          </button>

          {selectedEquipment && (
            <div className="selected-eq-badge">
              <span>
                Đang chọn: <b>ID {selectedEquipment.EQ_ID}</b> - {selectedEquipment.EQ_NAME}
              </span>
              <button
                type="button"
                className="btn-unselect"
                onClick={onUnselectEq}
                title="Bỏ chọn thiết bị"
              >
                <AiOutlineClose size={13} />
              </button>
            </div>
          )}

          <div style={{ fontSize: "11px", color: "#64748b", marginLeft: "4px" }}>
            Tổng: <b>{totalCount}</b> TB
          </div>
        </div>
      </div>
    </div>
  );
};
