import React from "react";

interface KpiMetrics {
  totalLots: number;
  okLots: number;
  ngLots: number;
  passRate: number;
  totalDeliveryQty: number;
  totalDeliveryAmount: number;
  totalSampleQty: number;
  totalSampleNGQty: number;
  sampleNGRate: number;
  sampleNGPPM: number;
  totalSampleNGAmount: number;
  uniqueCodesCount: number;
  uniqueCustomersCount: number;
  nm1Count: number;
  nm2Count: number;
  shiftDayCount: number;
  shiftNightCount: number;
}

interface PrecisionOQCDataKpiProps {
  metrics: KpiMetrics;
}

export const PrecisionOQCDataKpi: React.FC<PrecisionOQCDataKpiProps> = ({
  metrics,
}) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");
  const formatCurrency = (val: number) =>
    `$${(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="precision-oqc-kpi-container">
      <div className="kpi-cards-grid">
        {/* Card 1: Tổng Lượt OQC & Tỷ Lệ Đạt */}
        <div className="kpi-card blue">
          <div className="kpi-header-row">
            <span className="kpi-title">Tổng Lượt Kiểm Tra OQC</span>
            <span
              className={`kpi-badge ${
                metrics.passRate >= 98
                  ? "success"
                  : metrics.passRate >= 95
                  ? "warning"
                  : "danger"
              }`}
            >
              Đạt {metrics.passRate.toFixed(1)}%
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalLots)}{" "}
            <span className="unit">lô kiểm tra</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Lô OK:</span>
              <span className="val green">{formatNum(metrics.okLots)}</span>
            </div>
            <div className="stat-item">
              <span>Lô Có Lỗi:</span>
              <span className="val red">{formatNum(metrics.ngLots)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Khối Lượng & Giá Trị Xuất Hàng */}
        <div className="kpi-card emerald">
          <div className="kpi-header-row">
            <span className="kpi-title">Sản Lượng & Giá Trị Xuất</span>
            <span className="kpi-badge success">DELIVERY</span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalDeliveryQty)}{" "}
            <span className="unit">EA (pcs)</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Tổng Trị Giá:</span>
              <span className="val green">
                {formatCurrency(metrics.totalDeliveryAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Lấy Mẫu Kiểm Tra & Tỷ Lệ Lỗi */}
        <div className="kpi-card amber">
          <div className="kpi-header-row">
            <span className="kpi-title">Mẫu Kiểm Tra & Tỷ Lệ Lỗi</span>
            <span
              className={`kpi-badge ${
                metrics.sampleNGRate === 0
                  ? "success"
                  : metrics.sampleNGRate < 0.5
                  ? "warning"
                  : "danger"
              }`}
            >
              {metrics.sampleNGPPM.toLocaleString("en-US")} PPM
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalSampleQty)}{" "}
            <span className="unit">mẫu OQC</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Mẫu NG:</span>
              <span className="val red">{formatNum(metrics.totalSampleNGQty)}</span>
            </div>
            <div className="stat-item">
              <span>Tỷ Lệ Phế Phẩm:</span>
              <span className="val red">{metrics.sampleNGRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Thiệt Hại Phế Phẩm Mẫu */}
        <div className="kpi-card rose">
          <div className="kpi-header-row">
            <span className="kpi-title">Thiệt Hại Lỗi & Phạm Vi</span>
            <span className="kpi-badge danger">OQC DEFECT</span>
          </div>
          <div className="kpi-main-stat">
            {formatCurrency(metrics.totalSampleNGAmount)}
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
      </div>

      {/* Mini operational summary strip */}
      <div className="kpi-summary-strip">
        <div className="strip-group">
          <span className="strip-item">
            🏭 Nhà máy: <strong>NM1 ({metrics.nm1Count})</strong> •{" "}
            <strong>NM2 ({metrics.nm2Count})</strong>
          </span>
          <span>|</span>
          <span className="strip-item">
            ☀️ Ca làm việc: <strong>Ngày ({metrics.shiftDayCount})</strong> •{" "}
            <strong>Đêm ({metrics.shiftNightCount})</strong>
          </span>
        </div>
        <div className="strip-group">
          <span className="strip-item">
            🤝 Khách hàng liên quan: <strong>{metrics.uniqueCustomersCount}</strong> đối tác
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionOQCDataKpi);
