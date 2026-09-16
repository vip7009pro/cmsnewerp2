import React from "react";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineDownload,
  AiOutlineFilter,
} from "react-icons/ai";

interface ToolbarProps {
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  allTime: boolean;
  setAllTime: (allTime: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  selectedCount: number;
  totalCount: number;
  onLoadData: () => void;
  onApplyPreset: (days: number) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: () => void;
  onDeleteSelected: () => void;
  onExportExcel: () => void;
}

export const PrecisionAUDITHistoryToolbar: React.FC<ToolbarProps> = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  allTime,
  setAllTime,
  searchQuery,
  setSearchQuery,
  isLoading,
  selectedCount,
  totalCount,
  onLoadData,
  onApplyPreset,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteSelected,
  onExportExcel,
}) => {
  return (
    <div className="pah-toolbar">
      {/* Row 1: Filters */}
      <div className="toolbar-row-1">
        <div className="filter-group">
          <div className="date-picker-wrap">
            <span>Từ:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={allTime || isLoading}
            />
          </div>

          <div className="date-picker-wrap">
            <span>Đến:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={allTime || isLoading}
            />
          </div>

          <div className="quick-presets">
            <button
              type="button"
              className="btn-preset"
              onClick={() => onApplyPreset(7)}
              disabled={allTime || isLoading}
            >
              7 ngày
            </button>
            <button
              type="button"
              className="btn-preset"
              onClick={() => onApplyPreset(30)}
              disabled={allTime || isLoading}
            >
              30 ngày
            </button>
            <button
              type="button"
              className="btn-preset"
              onClick={() => onApplyPreset(90)}
              disabled={allTime || isLoading}
            >
              90 ngày
            </button>
            <button
              type="button"
              className="btn-preset"
              onClick={() => onApplyPreset(365)}
              disabled={allTime || isLoading}
            >
              1 năm
            </button>
          </div>

          <label className="alltime-toggle">
            <input
              type="checkbox"
              checked={allTime}
              onChange={(e) => setAllTime(e.target.checked)}
              disabled={isLoading}
            />
            <span>Tất cả thời gian</span>
          </label>
        </div>

        <button
          type="button"
          className="btn-load"
          onClick={onLoadData}
          disabled={isLoading}
        >
          <AiOutlineFilter />
          <span>{isLoading ? "Đang nạp..." : "Nạp Dữ Liệu"}</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Row 2: Actions & Quick Filter */}
      <div className="toolbar-row-2">
        <div className="quick-search-box">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh khách hàng, mã, audit, kết quả..."
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
            className="btn-action add"
            onClick={onOpenAddModal}
            title="Thêm đợt kiểm toán mới"
          >
            <AiOutlinePlus />
            <span>Thêm Audit</span>
          </button>

          <button
            type="button"
            className="btn-action edit"
            onClick={onOpenEditModal}
            disabled={selectedCount === 0}
            title="Chỉnh sửa đợt kiểm toán đã chọn"
          >
            <AiOutlineEdit />
            <span>Sửa</span>
          </button>

          <button
            type="button"
            className="btn-action delete"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            title="Xóa các đợt kiểm toán đã chọn"
          >
            <AiOutlineDelete />
            <span>Xóa ({selectedCount})</span>
          </button>

          <button
            type="button"
            className="btn-action export"
            onClick={onExportExcel}
            title="Xuất bảng ra Excel"
          >
            <AiOutlineDownload />
            <span>Xuất Excel</span>
          </button>

          <div className="selection-indicator">
            Hiển thị: <b>{totalCount}</b> đợt | Đã chọn: <b>{selectedCount}</b>
          </div>
        </div>
      </div>
    </div>
  );
};
