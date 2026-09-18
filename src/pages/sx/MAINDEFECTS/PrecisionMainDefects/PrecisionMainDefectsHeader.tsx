import React from "react";
import { FiRefreshCw, FiChevronRight } from "react-icons/fi";

interface PrecisionMainDefectsHeaderProps {
  totalCount: number;
  filteredCount: number;
  uniqueProducts: number;
  loading: boolean;
  onReload: () => void;
}

const PrecisionMainDefectsHeader: React.FC<PrecisionMainDefectsHeaderProps> = ({
  totalCount,
  filteredCount,
  uniqueProducts,
  loading,
  onReload,
}) => {
  return (
    <div className="precision-maindefects__header">
      <div className="header-left">
        <div className="badge-system">
          <span className="pulse-dot" />
          <span>SX PRECISION • QC STANDARDS</span>
        </div>
        <div className="title-group">
          <h1 className="main-title">Thư Viện & Quản Lý Tiêu Chuẩn Lỗi Công Đoạn (MAIN DEFECTS)</h1>
          <div className="sub-breadcrumb">
            <span>Sản Xuất</span>
            <FiChevronRight className="sep" size={10} />
            <span>Chất Lượng PQC</span>
            <FiChevronRight className="sep" size={10} />
            <span>Tiêu Chuẩn Lỗi SX100 & INS Patrol</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="telemetry-pill">
          <span>Dữ Liệu:</span>
          <strong>{filteredCount.toLocaleString("en-US")}</strong>
          <span>/ {totalCount.toLocaleString("en-US")} Lỗi</span>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <strong>{uniqueProducts}</strong>
          <span>G_CODE</span>
        </div>

        <button
          type="button"
          className="btn-reload"
          onClick={onReload}
          disabled={loading}
          title="Tải lại toàn bộ dữ liệu từ server"
        >
          <FiRefreshCw size={12} className={loading ? "spin" : ""} />
          <span>Làm Mới</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsHeader);
