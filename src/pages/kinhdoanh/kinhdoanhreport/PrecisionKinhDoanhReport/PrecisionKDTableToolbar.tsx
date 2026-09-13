import React from "react";
import { FiSearch, FiDownload, FiBarChart2 } from "react-icons/fi";

interface PrecisionKDTableToolbarProps {
  title?: string;
  totalRows: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onExportFiltered?: () => void;
  onExportAll?: () => void;
  onPivot?: () => void;
}

const PrecisionKDTableToolbar: React.FC<PrecisionKDTableToolbarProps> = ({
  title,
  totalRows,
  searchValue,
  onSearchChange,
  onExportFiltered,
  onExportAll,
  onPivot,
}) => {
  return (
    <div className="precision-kd-table-toolbar">
      {/* Cụm Tiêu Đề & Badge Đếm Dòng */}
      <div className="precision-kd-table-toolbar__left">
        {title && <span className="toolbar-title">{title}</span>}
        <span className="toolbar-count-badge">
          <strong>{totalRows}</strong> dòng
        </span>
      </div>

      {/* Cụm Tìm Kiếm & Các Nút Hành Động */}
      <div className="precision-kd-table-toolbar__right">
        {/* Ô Tìm Kiếm Quick Filter */}
        <div className="toolbar-search">
          <FiSearch size={11} className="toolbar-search__icon" />
          <input
            type="text"
            placeholder="Lọc nhanh bảng..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              className="toolbar-search__clear"
              onClick={() => onSearchChange("")}
            >
              ×
            </button>
          )}
        </div>

        {/* Cụm Nút Xuất & Phân Tích SaaS */}
        <div className="toolbar-actions">
          {onExportFiltered && (
            <button
              type="button"
              className="btn-saas btn-saas--excel-filtered"
              onClick={onExportFiltered}
              title="Xuất Excel dữ liệu hiển thị (EX1)"
            >
              <FiDownload size={11} />
              <span>EX1</span>
            </button>
          )}
          {onExportAll && (
            <button
              type="button"
              className="btn-saas btn-saas--excel-all"
              onClick={onExportAll}
              title="Xuất Excel toàn bộ dữ liệu (EX2)"
            >
              <FiDownload size={11} />
              <span>EX2</span>
            </button>
          )}
          {onPivot && (
            <button
              type="button"
              className="btn-saas btn-saas--pivot"
              onClick={onPivot}
              title="Mở bảng phân tích xoay đa chiều (PIVOT)"
            >
              <FiBarChart2 size={11} />
              <span>PIVOT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDTableToolbar);
