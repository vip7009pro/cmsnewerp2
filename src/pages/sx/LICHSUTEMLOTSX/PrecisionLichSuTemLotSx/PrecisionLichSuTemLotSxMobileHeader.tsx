import React from "react";
import { FaSyncAlt, FaChartPie, FaChartBar, FaBarcode } from "react-icons/fa";

interface PrecisionLichSuTemLotSxMobileHeaderProps {
  totalCount: number;
  filteredCount: number;
  totalQty: number;
  selectedLot?: string | null;
  showKpi: boolean;
  onToggleKpi: () => void;
  showCharts: boolean;
  onToggleCharts: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const PrecisionLichSuTemLotSxMobileHeader: React.FC<
  PrecisionLichSuTemLotSxMobileHeaderProps
> = ({
  totalCount,
  filteredCount,
  totalQty,
  selectedLot,
  showKpi,
  onToggleKpi,
  showCharts,
  onToggleCharts,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="precision-lichsutemlotsx-mobile-header">
      {/* Hàng 1: Brand badge, Pulse Live & Title + Nút điều khiển */}
      <div className="header-top-row">
        <div className="header-left">
          <span className="brand-badge">04. SX TEM LÓT</span>
          <span className="live-pulse" title="Hệ thống hoạt động trực tuyến" />
          <h1 className="header-title">LỊCH SỬ TEM LÓT SX</h1>
        </div>

        <div className="header-actions">
          {/* Nút Toggle Micro-KPI */}
          <button
            type="button"
            className={`btn-mobile-header ${showKpi ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt Micro-KPI Dashboard"
          >
            <FaChartBar size={11} />
            <span>KPI</span>
          </button>

          {/* Nút Toggle Biểu Đồ Recharts */}
          <button
            type="button"
            className={`btn-mobile-header ${showCharts ? "btn-mobile-header--active" : ""}`}
            onClick={onToggleCharts}
            title="Bật/Tắt Biểu Đồ Xu Hướng"
          >
            <FaChartPie size={11} />
            <span>Biểu Đồ</span>
          </button>

          {/* Nút Làm Mới */}
          <button
            type="button"
            className="btn-mobile-header btn-mobile-header--refresh"
            onClick={onRefresh}
            disabled={isLoading}
            title="Tải lại dữ liệu"
          >
            <FaSyncAlt size={11} className={isLoading ? "fa-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Hàng 2: Telemetry chips */}
      <div className="header-telemetry-row">
        <span className="telemetry-chip">
          Bản ghi: <strong>{filteredCount.toLocaleString("en-US")}</strong>
          {filteredCount !== totalCount && ` / ${totalCount.toLocaleString("en-US")}`}
        </span>
        <span className="telemetry-chip">
          Tổng EA: <strong>{totalQty.toLocaleString("en-US")}</strong>
        </span>
        {selectedLot && (
          <span className="telemetry-chip telemetry-chip--lot" title="LOT đang chọn">
            <FaBarcode size={10} />
            <span>{selectedLot}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuTemLotSxMobileHeader);
