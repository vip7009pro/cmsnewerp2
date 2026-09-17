import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { ViewMode } from "./useBtpAutoData";
import { DETAIL_COLUMNS, SUMMARY_COLUMNS } from "./PrecisionBtpAutoColumns";

interface Props {
  viewMode: ViewMode;
  filteredData: any[];
  totalDataLength: number;
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  isLoading: boolean;
  onSwitchMode: (mode: ViewMode) => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
}

/**
 * Khung bảng AGTable bọc Segmented Tab (Detail/Summary),
 * ô Quick Search, cụm nút Excel EX1/EX2 và telemetry số dòng.
 */
const PrecisionBtpAutoGrid: React.FC<Props> = React.memo(
  ({
    viewMode,
    filteredData,
    totalDataLength,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    onSwitchMode,
    onExportExcel,
  }) => {
    const columns = useMemo(
      () => (viewMode === "detail" ? DETAIL_COLUMNS : SUMMARY_COLUMNS),
      [viewMode]
    );

    return (
      <div className="precision-btpauto__gridContainer">
        {/* ===== GRID TOOLBAR ===== */}
        <div className="precision-btpauto__gridToolbar">
          <div className="precision-btpauto__gridToolbarLeft">
            {/* Segmented Tabs */}
            <div className="precision-btpauto__segmentedTabs">
              <button
                type="button"
                className={`precision-btpauto__segTab ${
                  viewMode === "detail"
                    ? "precision-btpauto__segTab--active"
                    : ""
                }`}
                onClick={() => onSwitchMode("detail")}
                disabled={isLoading}
              >
                📋 Detail
              </button>
              <button
                type="button"
                className={`precision-btpauto__segTab ${
                  viewMode === "summary"
                    ? "precision-btpauto__segTab--active"
                    : ""
                }`}
                onClick={() => onSwitchMode("summary")}
                disabled={isLoading}
              >
                📊 Summary
              </button>
            </div>

            {/* Search Box */}
            <div className="precision-btpauto__searchBox">
              <span>🔍</span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Lọc nhanh G_CODE, G_NAME, LOT..."
              />
            </div>

            {/* Excel Buttons */}
            <div className="precision-btpauto__gridActions">
              <button
                type="button"
                className="precision-btpauto__gridBtn precision-btpauto__gridBtn--excel"
                onClick={() => onExportExcel("EX1")}
                title="Xuất dữ liệu đang lọc ra file Excel"
              >
                📄 EX1 <span className="badge">Đang lọc</span>
              </button>
              <button
                type="button"
                className="precision-btpauto__gridBtn precision-btpauto__gridBtn--excel"
                onClick={() => onExportExcel("EX2")}
                title="Xuất toàn bộ dữ liệu ra file Excel"
              >
                📥 EX2 <span className="badge">Tất cả</span>
              </button>
            </div>
          </div>

          {/* Data Meta */}
          <div className="precision-btpauto__gridMeta">
            <span>
              Hiển thị:{" "}
              <strong>
                {filteredData.length} / {totalDataLength}
              </strong>
            </span>
          </div>
        </div>

        {/* ===== GRID BODY ===== */}
        <div className="precision-btpauto__gridBody">
          <AGTable
            columns={columns}
            data={filteredData}
            onCellEditingStopped={() => {}}
            onRowClick={() => {}}
            onSelectionChange={() => {}}
          />
        </div>
      </div>
    );
  }
);

PrecisionBtpAutoGrid.displayName = "PrecisionBtpAutoGrid";
export default PrecisionBtpAutoGrid;
