import React, { useMemo } from "react";
import {
  IoSearchOutline,
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoRefreshOutline,
  IoStatsChartOutline,
  IoCloseOutline,
} from "react-icons/io5";
import AGTable from "../../../../components/DataTable/AGTable";
import { DTC_REG_DATA } from "../../interfaces/qcInterface";
import { getDKDTCColumnDefs } from "./PrecisionDKDTCColumns";

interface PrecisionDKDTCTableProps {
  data: DTC_REG_DATA[];
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onRefresh: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot?: () => void;
}

const PrecisionDKDTCTable: React.FC<PrecisionDKDTCTableProps> = ({
  data,
  totalCount,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
}) => {
  const columns = useMemo(() => getDKDTCColumnDefs(), []);

  return (
    <div className="precision-dkdtc__gridContainer">
      {/* Top Grid Toolbar */}
      <div className="precision-dkdtc__gridToolbar">
        <div className="precision-dkdtc__gridToolbarLeft">
          {/* Omnibar Quick Search */}
          <div className="precision-dkdtc__searchBox">
            <IoSearchOutline className="icon" />
            <input
              type="text"
              placeholder="Lọc ID, mã YCSX, sản phẩm, vật liệu, NV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
                title="Xóa bộ lọc tìm kiếm"
              >
                <IoCloseOutline size={14} />
              </button>
            )}
          </div>

          {/* Action Export & Pivot Buttons */}
          <div className="precision-dkdtc__gridActions">
            <button
              type="button"
              className="precision-dkdtc__gridBtn precision-dkdtc__gridBtn--excel"
              onClick={onExportEX1}
              title="Xuất dữ liệu đang hiển thị ra file Excel"
            >
              <IoDocumentTextOutline size={14} />
              <span>EX1</span>
              <span className="badge">Lọc</span>
            </button>

            <button
              type="button"
              className="precision-dkdtc__gridBtn precision-dkdtc__gridBtn--excel"
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
                className="precision-dkdtc__gridBtn precision-dkdtc__gridBtn--pivot"
                onClick={onOpenPivot}
                title="Phân tích báo cáo xoay Pivot đa chiều"
              >
                <IoStatsChartOutline size={14} />
                <span>PIVOT</span>
              </button>
            )}

            <button
              type="button"
              className="precision-dkdtc__gridBtn precision-dkdtc__gridBtn--refresh"
              onClick={onRefresh}
              title="Tải lại danh sách kiểm tra mới nhất"
            >
              <IoRefreshOutline size={14} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="precision-dkdtc__gridMeta">
          <span>Đang hiển thị:</span>
          <span className="badge-count">
            {data.length} / {totalCount}
          </span>
          <span>dòng</span>
        </div>
      </div>

      {/* Main AG-Grid Table Body */}
      <div className="precision-dkdtc__gridBody">
        <AGTable
          columns={columns}
          data={data}
          rowHeight={28}
          // KHÔNG truyền prop toolbar để loại bỏ thanh công cụ xanh lá cũ
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="precision-dkdtc__statusBar">
        <div>
          <span className="dot-live" />
          <span>Hệ thống DTC trực tuyến • Đồng bộ realtime</span>
        </div>
        <div>
          <span>Tổng bản ghi: <strong>{totalCount}</strong> | Đang hiển thị: <strong>{data.length}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDKDTCTable);
