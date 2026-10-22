import React from "react";
import { OQCShippingKpiMetrics } from "./OQCShippingTypes";

interface OQCShippingKpiProps {
  metrics: OQCShippingKpiMetrics;
}

export const OQCShippingKpi: React.FC<OQCShippingKpiProps> = ({ metrics }) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");

  return (
    <div className="precision-oqc-shipping-kpi-container">
      <div className="kpi-cards-grid">
        {/* Card 1: Tổng Lượt Xuất Hàng & Tỷ Lệ Pass */}
        <div className="kpi-card blue">
          <div className="kpi-header-row">
            <span className="kpi-title">Tổng Lượt Xuất Hàng OQC</span>
            <span
              className={`kpi-badge ${
                metrics.passRate >= 98
                  ? "success"
                  : metrics.passRate >= 90
                  ? "warning"
                  : "danger"
              }`}
            >
              Pass {metrics.passRate.toFixed(1)}%
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalLots)}{" "}
            <span className="unit">lượt xuất</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Đạt (Pass):</span>
              <span className="val green">{formatNum(metrics.passLots)}</span>
            </div>
            <div className="stat-item">
              <span>Chờ / Khác:</span>
              <span className="val red">
                {formatNum(metrics.totalLots - metrics.passLots)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng Sản Lượng Xuất (OUT_QTY) */}
        <div className="kpi-card emerald">
          <div className="kpi-header-row">
            <span className="kpi-title">Tổng Sản Lượng Xuất</span>
            <span className="kpi-badge success">OUTGOING QTY</span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalOutQty)}{" "}
            <span className="unit">EA (pcs)</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Số Mã Hàng (SKUs):</span>
              <span className="val">{metrics.uniqueCodesCount}</span>
            </div>
            <div className="stat-item">
              <span>Số Khách Hàng:</span>
              <span className="val">{metrics.uniqueCustomersCount}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Khối Lượng Kiểm Tra Mẫu & Mẫu Lỗi */}
        <div className="kpi-card amber">
          <div className="kpi-header-row">
            <span className="kpi-title">Lấy Mẫu AQL & Mẫu Lỗi</span>
            <span
              className={`kpi-badge ${
                metrics.sampleNgPpm === 0
                  ? "success"
                  : metrics.sampleNgPpm < 1000
                  ? "warning"
                  : "danger"
              }`}
            >
              {metrics.sampleNgPpm.toLocaleString("en-US")} PPM
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalSamplingQty)}{" "}
            <span className="unit">mẫu AQL</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Mẫu Lỗi (NG):</span>
              <span className="val red">
                {formatNum(metrics.totalSampleNgQty)}
              </span>
            </div>
            <div className="stat-item">
              <span>Tỷ Lệ Mẫu Lỗi:</span>
              <span className="val red">
                {metrics.totalSamplingQty > 0
                  ? (
                      (metrics.totalSampleNgQty / metrics.totalSamplingQty) *
                      100
                    ).toFixed(2)
                  : "0.00"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Tỷ Lệ OK Bình Quân & Ca Sản Xuất */}
        <div className="kpi-card rose">
          <div className="kpi-header-row">
            <span className="kpi-title">Tỷ Lệ Đạt OK Trung Bình</span>
            <span
              className={`kpi-badge ${
                metrics.avgRateOk >= 99
                  ? "success"
                  : metrics.avgRateOk >= 95
                  ? "warning"
                  : "danger"
              }`}
            >
              AVG RATE
            </span>
          </div>
          <div className="kpi-main-stat">
            {metrics.avgRateOk.toFixed(2)}%
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Ca Ngày (Day):</span>
              <span className="val">{metrics.shiftDayCount}</span>
            </div>
            <div className="stat-item">
              <span>Ca Đêm (Night):</span>
              <span className="val">{metrics.shiftNightCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini operational summary strip */}
      <div className="kpi-summary-strip">
        <div className="strip-group">
          <span className="strip-item">
            📦 Tổng lượt: <strong>{formatNum(metrics.totalLots)}</strong> đợt xuất
          </span>
          <span>|</span>
          <span className="strip-item">
            ✅ Đạt Pass: <strong>{formatNum(metrics.passLots)}</strong> (
            {metrics.passRate.toFixed(1)}%)
          </span>
          <span>|</span>
          <span className="strip-item">
            ☀️ Ca Ngày: <strong>{metrics.shiftDayCount}</strong> • 🌙 Ca Đêm:{" "}
            <strong>{metrics.shiftNightCount}</strong>
          </span>
        </div>
        <div className="strip-group">
          <span className="strip-item">
            🤝 Đối tác khách hàng: <strong>{metrics.uniqueCustomersCount}</strong> •
            Mã sản phẩm: <strong>{metrics.uniqueCodesCount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OQCShippingKpi);
