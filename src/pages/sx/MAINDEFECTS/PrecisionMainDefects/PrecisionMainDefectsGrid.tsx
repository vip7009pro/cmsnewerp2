import React from "react";
import { FiSearch, FiDownload, FiFileText } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";

interface PrecisionMainDefectsGridProps {
  columns: any[];
  data: any[];
  totalCount: number;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionMainDefectsGrid: React.FC<PrecisionMainDefectsGridProps> = ({
  columns,
  data,
  totalCount,
  searchKeyword,
  onSearchChange,
  onExportEX1,
  onExportEX2,
}) => {
  return (
    <div className="precision-maindefects__gridContainer">
      {/* Thanh lọc nhanh & tiện ích bảng */}
      <div className="precision-maindefects__gridToolbar">
        <div className="left-controls">
          {/* Ô Quick Search tức thì */}
          <div className="search-box">
            <FiSearch size={12} color="#64748b" />
            <input
              type="text"
              placeholder="Lọc nhanh (ID, G_CODE, Lỗi, Model, Test...)"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Nút EX1: Xuất dữ liệu đang lọc */}
          <button
            type="button"
            className="btn-action btn-action--excel"
            onClick={onExportEX1}
            title="Xuất dữ liệu đang hiển thị ra file Excel"
          >
            <FiDownload size={11} />
            <span>EX1</span>
            <span className="badge">Đang lọc</span>
          </button>

          {/* Nút EX2: Xuất toàn bộ dữ liệu */}
          <button
            type="button"
            className="btn-action btn-action--excel"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu ra file Excel"
          >
            <FiFileText size={11} />
            <span>EX2</span>
            <span className="badge">Tất cả</span>
          </button>
        </div>

        {/* Telemetry số dòng */}
        <div className="grid-meta">
          <span>
            Đang hiển thị: <strong>{data.length.toLocaleString("en-US")}</strong> /{" "}
            <strong>{totalCount.toLocaleString("en-US")}</strong> tiêu chuẩn
          </span>
        </div>
      </div>

      {/* AGTable body - BỎ prop toolbar */}
      <div className="precision-maindefects__gridBody">
        <AGTable
          columns={columns}
          data={data}
          // KHÔNG truyền prop toolbar để tránh render toolbar xanh lá mặc định
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsGrid);
