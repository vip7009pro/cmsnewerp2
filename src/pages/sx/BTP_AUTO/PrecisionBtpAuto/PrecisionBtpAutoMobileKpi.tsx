import React from "react";
import { BtpKpiData, ViewMode } from "./useBtpAutoData";
import { FiX } from "react-icons/fi";

interface Props {
  kpiData: BtpKpiData;
  viewMode: ViewMode;
  dataLength: number;
  onClose: () => void;
}

/**
 * Micro KPI Bar cuộn ngang siêu nhẹ dành cho Mobile:
 * Tối ưu hóa GPU, cuộn mượt mà, kèm nút đóng [X] giải phóng 100% diện tích màn hình.
 */
export const PrecisionBtpAutoMobileKpi: React.FC<Props> = React.memo(
  ({ kpiData, viewMode, dataLength, onClose }) => {
    const pctA =
      kpiData.totalBtp > 0
        ? ((kpiData.totalXA / kpiData.totalBtp) * 100).toFixed(1)
        : "0";
    const pctB =
      kpiData.totalBtp > 0
        ? ((kpiData.totalXB / kpiData.totalBtp) * 100).toFixed(1)
        : "0";

    const factoryEntries = Object.entries(kpiData.factoryBreakdown);
    const factorySummary =
      factoryEntries.length > 0
        ? factoryEntries.map(([k, v]) => `${k}:${(v / 1000).toFixed(0)}k`).join(" · ")
        : "—";

    return (
      <div className="precision-btpauto__mobileKpi">
        <div className="mobile-kpi-scroll">
          {/* Card 1: Tổng BTP */}
          <div className="micro-kpi-card card--blue">
            <div className="micro-kpi-header">
              <span className="micro-kpi-title">TỔNG BTP</span>
              <span className="micro-kpi-icon">📦</span>
            </div>
            <span className="micro-kpi-value">
              {kpiData.totalBtp.toLocaleString("en-US")}
            </span>
            <span className="micro-kpi-sub">
              {viewMode === "detail" ? "EA chi tiết" : "EA tổng hợp"}
            </span>
          </div>

          {/* Card 2: Xưởng A */}
          <div className="micro-kpi-card card--green">
            <div className="micro-kpi-header">
              <span className="micro-kpi-title">XƯỞNG A</span>
              <span className="micro-kpi-icon">🏭</span>
            </div>
            <span className="micro-kpi-value">
              {kpiData.totalXA.toLocaleString("en-US")}
            </span>
            <span className="micro-kpi-sub">{pctA}% tổng BTP</span>
          </div>

          {/* Card 3: Xưởng B */}
          <div className="micro-kpi-card card--amber">
            <div className="micro-kpi-header">
              <span className="micro-kpi-title">XƯỞNG B</span>
              <span className="micro-kpi-icon">🏗️</span>
            </div>
            <span className="micro-kpi-value">
              {kpiData.totalXB.toLocaleString("en-US")}
            </span>
            <span className="micro-kpi-sub">{pctB}% tổng BTP</span>
          </div>

          {/* Card 4: Số Lot / Mã Hàng */}
          <div className="micro-kpi-card card--purple">
            <div className="micro-kpi-header">
              <span className="micro-kpi-title">
                {viewMode === "detail" ? "LOT / MÃ" : "MÃ HÀNG"}
              </span>
              <span className="micro-kpi-icon">🔢</span>
            </div>
            <span className="micro-kpi-value">
              {dataLength.toLocaleString("en-US")}
            </span>
            <span className="micro-kpi-sub">
              {kpiData.uniqueGCodes} mã khác nhau
            </span>
          </div>

          {/* Card 5: Phân Bổ Nhà Máy */}
          <div className="micro-kpi-card card--rose">
            <div className="micro-kpi-header">
              <span className="micro-kpi-title">PHÂN BỔ NM</span>
              <span className="micro-kpi-icon">📊</span>
            </div>
            <span className="micro-kpi-value">
              {factoryEntries.length > 0 ? `${factoryEntries.length} NM` : "—"}
            </span>
            <span className="micro-kpi-sub">{factorySummary}</span>
          </div>
        </div>

        {/* Nút đóng nhanh [X] */}
        <button
          type="button"
          className="btn-kpi-close"
          onClick={onClose}
          title="Đóng dải KPI để phóng to bảng dữ liệu"
        >
          <FiX size={15} />
        </button>
      </div>
    );
  }
);

PrecisionBtpAutoMobileKpi.displayName = "PrecisionBtpAutoMobileKpi";
export default PrecisionBtpAutoMobileKpi;
