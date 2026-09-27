import React from "react";
import { ViewMode } from "./useBtpAutoData";
import { BiRefresh } from "react-icons/bi";
import { FiPieChart, FiBox } from "react-icons/fi";

interface Props {
  dataLength: number;
  totalDataLength: number;
  lastUpdated: string;
  viewMode: ViewMode;
  isLoading: boolean;
  showKpi: boolean;
  onToggleKpi: () => void;
  onRefresh: () => void;
  onOpenGiaoNhan: () => void;
}

/**
 * Mobile Header tinh gọn chuẩn Google Stitch Enterprise cho BTP_AUTO:
 * - Brand badge "04. SX BTP"
 * - Live pulse indicator xanh lá
 * - Telemetry chips: Chế độ, Số dòng, Cập nhật
 * - Nút toggle Micro-KPI, Nút Giao Nhận dao film, Nút Làm Mới
 */
export const PrecisionBtpAutoMobileHeader: React.FC<Props> = React.memo(
  ({
    dataLength,
    totalDataLength,
    lastUpdated,
    viewMode,
    isLoading,
    showKpi,
    onToggleKpi,
    onRefresh,
    onOpenGiaoNhan,
  }) => {
    return (
      <div className="precision-btpauto__mobileHeader">
        <div className="mobile-header-top">
          {/* Nhóm Brand + Tiêu đề + Pulse Live */}
          <div className="brand-group">
            <span className="brand-badge">04. SX BTP</span>
            <div className="title-wrapper">
              <span className="page-title">TRA CỨU BTP</span>
              <span className="live-indicator" title="Dữ liệu kết nối ERP realtime">
                <span className="pulse-dot" />
                LIVE
              </span>
            </div>
          </div>

          {/* Nhóm nút hành động nhanh */}
          <div className="action-group">
            {/* Nút bật/tắt Micro-KPI */}
            <button
              type="button"
              className={`btn-action-icon ${showKpi ? "active" : ""}`}
              onClick={onToggleKpi}
              title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
            >
              <FiPieChart size={16} />
              <span className="btn-text">KPI</span>
            </button>

            {/* Nút mở Giao Nhận Dao/Film */}
            <button
              type="button"
              className="btn-action-icon btn-action-icon--gn"
              onClick={onOpenGiaoNhan}
              title="Quản lý giao nhận Dao/Film"
            >
              <FiBox size={16} />
              <span className="btn-text">QLGN</span>
            </button>

            {/* Nút Làm Mới Dữ Liệu */}
            <button
              type="button"
              className={`btn-action-icon btn-action-icon--refresh ${
                isLoading ? "is-loading" : ""
              }`}
              onClick={onRefresh}
              disabled={isLoading}
              title="Làm mới dữ liệu từ máy chủ"
            >
              <BiRefresh size={18} />
            </button>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="mobile-header-chips">
          <span className="telemetry-chip mode-chip">
            Chế độ: <strong>{viewMode === "detail" ? "Chi Tiết" : "Tổng Hợp"}</strong>
          </span>
          <span className="telemetry-chip count-chip">
            Dòng:{" "}
            <strong>
              {dataLength.toLocaleString("en-US")}
              {dataLength !== totalDataLength ? ` / ${totalDataLength}` : ""}
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
      </div>
    );
  }
);

PrecisionBtpAutoMobileHeader.displayName = "PrecisionBtpAutoMobileHeader";
export default PrecisionBtpAutoMobileHeader;
