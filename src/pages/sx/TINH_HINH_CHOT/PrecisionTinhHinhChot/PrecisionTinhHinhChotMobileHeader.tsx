import React from "react";
import { BiRefresh } from "react-icons/bi";
import { FiPieChart, FiTrendingUp } from "react-icons/fi";

interface Props {
  lastUpdated: string;
  isLoading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  showCharts: boolean;
  onToggleCharts: () => void;
  onRefreshAll: () => void;
  totalCommands: number;
  totalChuaChot: number;
  nm1Count: number;
  nm2Count: number;
}

/**
 * Mobile Header tinh gọn chuẩn Google Stitch Enterprise cho TINH_HINH_CHOT:
 * - Brand badge "04. SX CHỐT BC"
 * - Live pulse indicator xanh lá
 * - Telemetry chips: NM1, NM2, Tồn chưa chốt (cảnh báo đỏ nếu > 0), Giờ cập nhật
 * - Nút toggle Micro-KPI, Nút toggle Biểu đồ, Nút Làm Mới
 */
export const PrecisionTinhHinhChotMobileHeader: React.FC<Props> = React.memo(
  ({
    lastUpdated,
    isLoading,
    showKpi,
    onToggleKpi,
    showCharts,
    onToggleCharts,
    onRefreshAll,
    totalCommands,
    totalChuaChot,
    nm1Count,
    nm2Count,
  }) => {
    return (
      <header className="precision-thc__mobileHeader">
        <div className="mobile-header-top">
          {/* Nhóm Brand + Tiêu đề + Pulse Live */}
          <div className="brand-group">
            <span className="brand-badge">04. SX CHỐT BC</span>
            <div className="title-wrapper">
              <span className="page-title">TÌNH HÌNH CHỐT BC</span>
              <span className="live-indicator" title="Dữ liệu kết nối ERP realtime">
                <span className="pulse-dot" />
                LIVE
              </span>
            </div>
          </div>

          {/* Nhóm nút thao tác nhanh */}
          <div className="action-group">
            {/* Nút bật/tắt Micro-KPI */}
            <button
              type="button"
              className={`btn-action-icon ${showKpi ? "active" : ""}`}
              onClick={onToggleKpi}
              title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
            >
              <FiPieChart size={15} />
              <span className="btn-text">KPI</span>
            </button>

            {/* Nút bật/tắt Biểu Đồ */}
            <button
              type="button"
              className={`btn-action-icon btn-action-icon--chart ${showCharts ? "active" : ""}`}
              onClick={onToggleCharts}
              title={showCharts ? "Ẩn biểu đồ xu hướng" : "Hiện biểu đồ xu hướng"}
            >
              <FiTrendingUp size={15} />
              <span className="btn-text">Biểu Đồ</span>
            </button>

            {/* Nút Làm Mới Dữ Liệu */}
            <button
              type="button"
              className={`btn-action-icon btn-action-icon--refresh ${
                isLoading ? "is-loading" : ""
              }`}
              onClick={onRefreshAll}
              disabled={isLoading}
              title="Làm mới toàn bộ dữ liệu 2 nhà máy"
            >
              <BiRefresh size={18} />
            </button>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="mobile-header-chips">
          <span className="telemetry-chip factory-chip nm1">
            NM1: <strong>{nm1Count} ngày</strong>
          </span>
          <span className="telemetry-chip factory-chip nm2">
            NM2: <strong>{nm2Count} ngày</strong>
          </span>
          <span
            className={`telemetry-chip status-chip ${
              totalChuaChot > 0 ? "has-warning" : "all-clear"
            }`}
          >
            Chưa chốt:{" "}
            <strong>
              {totalChuaChot.toLocaleString("en-US")} lệnh
            </strong>
          </span>
          {lastUpdated && (
            <span className="telemetry-chip time-chip">
              Cập nhật: <strong>{lastUpdated}</strong>
            </span>
          )}
          {isLoading && (
            <span className="telemetry-chip loading-chip">
              ⏳ Đang nạp dữ liệu...
            </span>
          )}
        </div>
      </header>
    );
  }
);

PrecisionTinhHinhChotMobileHeader.displayName = "PrecisionTinhHinhChotMobileHeader";
export default PrecisionTinhHinhChotMobileHeader;
