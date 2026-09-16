import React from "react";

interface KpiMetrics {
  totalCases: number;
  completedCases: number;
  pendingCases: number;
  resolutionRate: number;
  totalDefectQty: number;
  totalWHOutQty: number;
  totalSampleQty: number;
  avgPPM: number;
  criticalCases: number;
  uniqueProjectsCount: number;
  uniquePartsCount: number;
  plantNM1Count: number;
  plantNM2Count: number;
  occurMainCount: number;
  occurSubCount: number;
}

interface PrecisionQTRDataKpiProps {
  metrics: KpiMetrics;
}

export const PrecisionQTRDataKpi: React.FC<PrecisionQTRDataKpiProps> = ({
  metrics,
}) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");

  return (
    <div className="precision-qtr-kpi-container">
      <div className="kpi-cards-grid">
        {/* Card 1: Tổng Sự Cố & Tỷ Lệ Đóng */}
        <div className="kpi-card blue">
          <div className="kpi-header-row">
            <span className="kpi-title">Tổng Sự Cố Chất Lượng (QTR)</span>
            <span
              className={`kpi-badge ${
                metrics.resolutionRate >= 80
                  ? "success"
                  : metrics.resolutionRate >= 50
                  ? "warning"
                  : "danger"
              }`}
            >
              Đã Xử Lý {metrics.resolutionRate.toFixed(1)}%
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalCases)}{" "}
            <span className="unit">vụ sự cố</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Đã Duyệt Đóng:</span>
              <span className="val green">{formatNum(metrics.completedCases)}</span>
            </div>
            <div className="stat-item">
              <span>Đang Xử Lý:</span>
              <span className="val red">{formatNum(metrics.pendingCases)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng Lượng Phế Phẩm & PPM */}
        <div className="kpi-card emerald">
          <div className="kpi-header-row">
            <span className="kpi-title">Lượng Phế Phẩm & PPM</span>
            <span className="kpi-badge success">DEFECT VOL</span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(metrics.totalDefectQty)}{" "}
            <span className="unit">EA lỗi</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Tổng Xuất Kho:</span>
              <span className="val">{formatNum(metrics.totalWHOutQty)}</span>
            </div>
            <div className="stat-item">
              <span>PPM Bình Quân:</span>
              <span className="val green">{formatNum(metrics.avgPPM)} PPM</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cảnh Báo Lỗi Nghiêm Trọng */}
        <div className="kpi-card rose">
          <div className="kpi-header-row">
            <span className="kpi-title">Sự Cố Ngưỡng Đỏ (Nghiêm Trọng)</span>
            <span
              className={`kpi-badge ${
                metrics.criticalCases === 0 ? "success" : "danger"
              }`}
            >
              {metrics.criticalCases === 0 ? "AN TOÀN" : "CẦN ĐỐI SÁCH"}
            </span>
          </div>
          <div className="kpi-main-stat">
            <span style={{ color: metrics.criticalCases > 0 ? "#e11d48" : "#10b981" }}>
              {metrics.criticalCases}
            </span>{" "}
            <span className="unit">vụ vượt ngưỡng</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Tiêu chuẩn:</span>
              <span className="val">Main Line &ge; 500 PPM</span>
            </div>
            <div className="stat-item">
              <span>Xuất kho:</span>
              <span className="val">&ge; 100k EA</span>
            </div>
          </div>
        </div>

        {/* Card 4: Phạm Vi Dự Án & Linh Kiện */}
        <div className="kpi-card amber">
          <div className="kpi-header-row">
            <span className="kpi-title">Phạm Vi Dự Án & Linh Kiện</span>
            <span className="kpi-badge warning">SCOPE</span>
          </div>
          <div className="kpi-main-stat">
            {metrics.uniqueProjectsCount}{" "}
            <span className="unit">dự án (Projects)</span>
          </div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Số Mã Linh Kiện:</span>
              <span className="val">{metrics.uniquePartsCount}</span>
            </div>
            <div className="stat-item">
              <span>Mẫu Thử Nghiệm:</span>
              <span className="val">{formatNum(metrics.totalSampleQty)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini operational summary strip */}
      <div className="kpi-summary-strip">
        <div className="strip-group">
          <span className="strip-item">
            🏭 Nhà máy (Plant): <strong>NM1 ({metrics.plantNM1Count})</strong> •{" "}
            <strong>NM2 ({metrics.plantNM2Count})</strong>
          </span>
          <span>|</span>
          <span className="strip-item">
            📍 Vị trí phát sinh: <strong>Main Line ({metrics.occurMainCount})</strong> •{" "}
            <strong>Khác / Sub ({metrics.occurSubCount})</strong>
          </span>
        </div>
        <div className="strip-group">
          <span className="strip-item">
            📋 Tiến độ phê duyệt:{" "}
            <strong>
              {metrics.completedCases}/{metrics.totalCases} vụ hoàn thành (
              {metrics.resolutionRate.toFixed(1)}%)
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQTRDataKpi);
