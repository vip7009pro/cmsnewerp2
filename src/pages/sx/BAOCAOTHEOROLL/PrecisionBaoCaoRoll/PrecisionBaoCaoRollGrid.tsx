import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { getBaoCaoRollColumns } from "./PrecisionBaoCaoRollColumns";
import { SX_BAOCAOROLLDATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  filteredData?: SX_BAOCAOROLLDATA[];
  plandatatable?: SX_BAOCAOROLLDATA[];
  totalCount?: number;
  searchKeyword?: string;
  quickFilterText?: string;
  onSearchChange?: (val: string) => void;
  onFilterChange?: (val: string) => void;
  onExportEX1?: () => void;
  onExportEX2?: () => void;
  onOpenPivot?: () => void;
}

const PrecisionBaoCaoRollGrid: React.FC<Props> = ({
  filteredData,
  plandatatable = [],
  totalCount,
  searchKeyword,
  quickFilterText,
  onSearchChange,
  onFilterChange,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
}) => {
  const columns = useMemo(() => getBaoCaoRollColumns(), []);
  const displayData = filteredData ?? plandatatable ?? [];
  const keyword = searchKeyword ?? quickFilterText ?? "";
  const handleKeywordChange = onSearchChange ?? onFilterChange ?? (() => {});
  const total = totalCount ?? plandatatable?.length ?? displayData.length;

  return (
    <div className="precision-bcr-gridContainer">
      {/* Grid Toolbar */}
      <div className="precision-bcr-gridToolbar">
        <div className="precision-bcr-gridToolbarLeft">
          <div className="precision-bcr-searchBox">
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94a3b8" }}>search</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="Lọc nhanh dữ liệu..."
            />
          </div>
          <div className="precision-bcr-gridActions">
            <button type="button" className="precision-bcr-gridBtn precision-bcr-gridBtn--excel" onClick={onExportEX1} title="Xuất dữ liệu đang lọc">
              <span style={{ fontSize: 12 }}>📄</span><span>EX1</span>
            </button>
            <button type="button" className="precision-bcr-gridBtn precision-bcr-gridBtn--excel" onClick={onExportEX2} title="Xuất toàn bộ dữ liệu">
              <span style={{ fontSize: 12 }}>📥</span><span>EX2</span>
            </button>
            <button type="button" className="precision-bcr-gridBtn precision-bcr-gridBtn--pivot" onClick={onOpenPivot} title="Mở bảng phân tích Pivot đa chiều">
              <span style={{ fontSize: 12 }}>📊</span><span>PIVOT</span>
            </button>
          </div>
        </div>
        <div className="precision-bcr-gridMeta">
          <span>Hiển thị: <strong>{(displayData?.length ?? 0).toLocaleString("en-US")} / {(total ?? 0).toLocaleString("en-US")}</strong> dòng</span>
        </div>
      </div>

      {/* Grid Body */}
      <div className="precision-bcr-gridBody">
        <AGTable
          suppressRowClickSelection={false}
          showFilter={true}
          columns={columns}
          data={displayData}
          onCellEditingStopped={() => {}}
          onCellClick={() => {}}
          onSelectionChange={() => {}}
        />
      </div>
    </div>
  );
};

const MemoizedPrecisionBaoCaoRollGrid = React.memo(PrecisionBaoCaoRollGrid);
export { MemoizedPrecisionBaoCaoRollGrid as PrecisionBaoCaoRollGrid };
export default MemoizedPrecisionBaoCaoRollGrid;
