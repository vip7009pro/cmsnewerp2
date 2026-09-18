import React from "react";
import { FiSearch, FiFileText, FiDownload, FiTable } from "react-icons/fi";
import { ColDef } from "ag-grid-community";
import AGTable from "../../../../components/DataTable/AGTable";
import { SX_KPI_NV_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionKpiNvSxGridProps {
  columns: ColDef[];
  data: SX_KPI_NV_DATA[];
  totalCount: number;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionKpiNvSxGrid: React.FC<PrecisionKpiNvSxGridProps> = ({
  columns,
  data,
  totalCount,
  searchKeyword,
  onSearchChange,
  onExportEX1,
  onExportEX2,
}) => {
  return (
    <div className="precision-kpinvsx__gridContainer">
      {/* Thanh lọc nhanh & hành động xuất file */}
      <div className="precision-kpinvsx__gridToolbar">
        <div className="precision-kpinvsx__gridToolbarLeft">
          <div className="precision-kpinvsx__searchBox">
            <FiSearch size={13} color="#64748b" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Lọc nhanh theo mã NV, ngày, tuần, tháng, sản lượng..."
            />
            {searchKeyword && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="precision-kpinvsx__gridActions">
            <button
              type="button"
              className="grid-btn grid-btn--excel-filtered"
              onClick={onExportEX1}
              title="Xuất dữ liệu đang lọc ra Excel"
            >
              <FiFileText size={12} />
              <span>EX1 (Đang lọc)</span>
            </button>

            <button
              type="button"
              className="grid-btn grid-btn--excel-all"
              onClick={onExportEX2}
              title="Xuất toàn bộ dữ liệu ra Excel"
            >
              <FiDownload size={12} />
              <span>EX2 (Tất cả)</span>
            </button>
          </div>
        </div>

        <div className="precision-kpinvsx__gridMeta">
          <FiTable size={12} />
          <span>
            Hiển thị: <strong>{data.length}</strong> / <strong>{totalCount}</strong> dòng
          </span>
        </div>
      </div>

      {/* Thân bảng AG Grid bọc Flexbox full height */}
      <div className="precision-kpinvsx__gridBody">
        <AGTable
          showFilter={true}
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
};

export { PrecisionKpiNvSxGrid };
export default React.memo(PrecisionKpiNvSxGrid);
