import React, { useMemo } from "react";
import {
  IoSearchOutline,
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoRefreshOutline,
  IoStatsChartOutline,
  IoCloseOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import AGTable from "../../../../components/DataTable/AGTable";
import { DTC_RESULT_INPUT } from "./dtcResultUtils";
import { getDTCResultColumns } from "./PrecisionDTCResultColumns";

interface PrecisionDTCResultTableProps {
  data: DTC_RESULT_INPUT[];
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onRefresh: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot?: () => void;
  onAddSample: () => void;
  onCellValueChanged: (params: any) => void;
}

const PrecisionDTCResultTable: React.FC<PrecisionDTCResultTableProps> = ({
  data,
  totalCount,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onAddSample,
  onCellValueChanged,
}) => {
  const columns = useMemo(() => getDTCResultColumns(), []);

  return (
    <div className="precision-dtcresult__gridContainer">
      {/* Top Grid Toolbar */}
      <div className="precision-dtcresult__gridToolbar">
        <div className="precision-dtcresult__gridToolbarLeft">
          {/* Quick Filter Omnibar */}
          <div className="precision-dtcresult__searchBox">
            <IoSearchOutline className="icon" />
            <input
              type="text"
              placeholder="Lọc điểm đo, mẫu, sản phẩm, ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
                title="Xóa bộ lọc"
              >
                <IoCloseOutline size={14} />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="precision-dtcresult__gridActions">
            <button
              type="button"
              className="precision-dtcresult__gridBtn precision-dtcresult__gridBtn--addSample"
              onClick={onAddSample}
              title="Nhân bản thêm 1 đợt mẫu đo (Sample + 1)"
            >
              <IoAddCircleOutline size={15} />
              <span>+ Thêm Mẫu Đo</span>
            </button>

            <button
              type="button"
              className="precision-dtcresult__gridBtn precision-dtcresult__gridBtn--excel"
              onClick={onExportEX1}
              title="Xuất dữ liệu đang hiển thị ra file Excel"
            >
              <IoDocumentTextOutline size={14} />
              <span>EX1</span>
              <span className="badge">Lọc</span>
            </button>

            <button
              type="button"
              className="precision-dtcresult__gridBtn precision-dtcresult__gridBtn--excel"
              onClick={onExportEX2}
              title="Xuất toàn bộ dữ liệu bảng ra file Excel"
            >
              <IoDownloadOutline size={14} />
              <span>EX2</span>
              <span className="badge">Tất cả</span>
            </button>

            {onOpenPivot && (
              <button
                type="button"
                className="precision-dtcresult__gridBtn precision-dtcresult__gridBtn--pivot"
                onClick={onOpenPivot}
                title="Phân tích báo cáo xoay Pivot đa chiều"
              >
                <IoStatsChartOutline size={14} />
                <span>PIVOT</span>
              </button>
            )}

            <button
              type="button"
              className="precision-dtcresult__gridBtn precision-dtcresult__gridBtn--refresh"
              onClick={onRefresh}
              title="Tải lại spec và điểm đo"
            >
              <IoRefreshOutline size={14} />
              <span>Tải lại</span>
            </button>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="precision-dtcresult__gridMeta">
          <span>Đang hiển thị:</span>
          <span className="badge-count">
            {data.length} / {totalCount}
          </span>
          <span>điểm đo</span>
        </div>
      </div>

      {/* Main AG-Grid Table Body */}
      <div className="precision-dtcresult__gridBody">
        <AGTable
          columns={columns}
          data={data}
          rowHeight={28}
          onCellValueChanged={onCellValueChanged}
          // KHÔNG truyền prop toolbar để ẩn thanh công cụ xanh lá cũ
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="precision-dtcresult__statusBar">
        <div>
          <span className="dot-live" />
          <span>Hệ thống DTC Result Entry trực tuyến • Nhập số đo trực tiếp trên bảng</span>
        </div>
        <div>
          <span>
            Tổng điểm đo: <strong>{totalCount}</strong> | Đang lọc:{" "}
            <strong>{data.length}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultTable);
