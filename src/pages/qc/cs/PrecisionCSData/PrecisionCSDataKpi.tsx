import React from "react";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

interface PrecisionCSDataKpiProps {
  metrics: any;
}

export const PrecisionCSDataKpi: React.FC<PrecisionCSDataKpiProps> = ({
  metrics,
}) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");
  const formatMoney = (val: number) =>
    (val || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });

  if (metrics.mode === "confirm") {
    const nndsRate = metrics.nndsRate || 0;
    const nndsBadgeClass =
      nndsRate >= 80 ? "success" : nndsRate >= 50 ? "warning" : "danger";

    return (
      <div className="precision-cs__kpiContainer">
        <div className="precision-cs__kpiGrid">
          {/* Card 1: Tổng Vụ & Tỷ Lệ Đối Sách */}
          <div className="kpi-card blue">
            <div className="kpi-header">
              <span className="kpi-title">1. Tổng Sự Cố Khiếu Nại (CS)</span>
              <span className={`kpi-badge ${nndsBadgeClass}`}>
                ĐỐI SÁCH {nndsRate.toFixed(1)}%
              </span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalCount)}{" "}
              <span className="unit">vụ sự cố</span>
            </div>
            <div className="kpi-breakdown">
              <div className="stat-item">
                <span>Đã Lập Đối Sách:</span>
                <span className="val emerald">{formatNum(metrics.completedNNDS)} vụ</span>
              </div>
              <div className="stat-item">
                <span>Chờ Đối Sách:</span>
                <span className="val red">
                  {formatNum(metrics.totalCount - metrics.completedNNDS)} vụ
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Thiệt Hại Bồi Thường / Giảm Trừ */}
          <div className="kpi-card rose">
            <div className="kpi-header">
              <span className="kpi-title">2. Thiệt Hại Bồi Thường / Giảm Trừ</span>
              <span className="kpi-badge danger">CLAIM AMOUNT</span>
            </div>
            <div className="kpi-main-stat">
              <span style={{ color: "#dc2626" }}>${formatMoney(metrics.totalReduceAmount)}</span>
            </div>
            <div className="kpi-breakdown">
              <div className="stat-item">
                <span>Số Lượng Đổi Trả:</span>
                <span className="val red">{formatNum(metrics.totalReduceQty)} EA</span>
              </div>
              <div className="stat-item">
                <span>Thiệt Hại BQ:</span>
                <span className="val">
                  ${metrics.totalCount > 0 ? formatMoney(metrics.totalReduceAmount / metrics.totalCount) : 0}/vụ
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Khối Lượng Kiểm Tra & Tỷ Lệ Lỗi */}
          <div className="kpi-card amber">
            <div className="kpi-header">
              <span className="kpi-title">3. Kiểm Tra & Tỷ Lệ Thay Thế</span>
              <span className="kpi-badge warning">
                THAY THẾ {metrics.avgReplaceRate?.toFixed(2)}%
              </span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalInspectQty)}{" "}
              <span className="unit">EA kiểm tra</span>
            </div>
            <div className="kpi-breakdown">
              <div className="stat-item">
                <span>Tổng Phế Phẩm NG:</span>
                <span className="val red">{formatNum(metrics.totalNGQty)} EA</span>
              </div>
              <div className="stat-item">
                <span>Tỷ Lệ Phế Phẩm:</span>
                <span className="val amber">
                  {metrics.totalInspectQty > 0
                    ? ((metrics.totalNGQty / metrics.totalInspectQty) * 100).toFixed(2)
                    : 0}%
                </span>
              </div>
            </div>
            <div className="kpi-progress">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(100, Math.max(0, metrics.avgReplaceRate || 0))}%`,
                  backgroundColor:
                    metrics.avgReplaceRate <= 1
                      ? "#10b981"
                      : metrics.avgReplaceRate <= 3
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>
          </div>

          {/* Card 4: Phạm Vi Khách Hàng & Chủng Loại SKU */}
          <div className="kpi-card purple">
            <div className="kpi-header">
              <span className="kpi-title">4. Phạm Vi Sự Cố</span>
              <span className="kpi-badge neutral">SCOPE</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.uniqueCustomers)}{" "}
              <span className="unit">khách hàng</span>
            </div>
            <div className="kpi-breakdown">
              <div className="stat-item">
                <span>Số Mã Sản Phẩm:</span>
                <span className="val purple">{formatNum(metrics.uniqueSKUs)} SKUs</span>
              </div>
              <div className="stat-item">
                <span>Bình Quân Vụ/Khách:</span>
                <span className="val">
                  {metrics.uniqueCustomers > 0
                    ? (metrics.totalCount / metrics.uniqueCustomers).toFixed(1)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Status Strip: Hồ sơ đối sách */}
        <div className="precision-cs__statusStrip">
          <div className="strip-label">
            <AssignmentTurnedInIcon className="pulse-icon" style={{ fontSize: "1rem" }} />
            <span>TÌNH TRẠNG HỒ SƠ & TÀI LIỆU ĐỐI SÁCH:</span>
          </div>

          <div className="strip-badges">
            <div className="strip-badge-item" title="Số vụ đã tải ảnh khuyết tật hiện trường">
              <span className="badge-name">📸 Ảnh Lỗi Hiện Trường:</span>
              <span className="badge-stat">
                {metrics.hasImage} / {metrics.totalCount} ({metrics.totalCount > 0 ? ((metrics.hasImage / metrics.totalCount) * 100).toFixed(0) : 0}%)
              </span>
            </div>

            <div className="strip-badge-item" title="Số vụ đã có file đối sách tiếng Việt">
              <span className="badge-name">🇻🇳 Đối Sách (VN PPTX):</span>
              <span className="badge-stat">
                {metrics.hasVN} / {metrics.totalCount} ({metrics.totalCount > 0 ? ((metrics.hasVN / metrics.totalCount) * 100).toFixed(0) : 0}%)
              </span>
            </div>

            <div className="strip-badge-item" title="Số vụ đã có file đối sách tiếng Hàn">
              <span className="badge-name">🇰🇷 Đối Sách (KR PPTX):</span>
              <span className="badge-stat">
                {metrics.hasKR} / {metrics.totalCount} ({metrics.totalCount > 0 ? ((metrics.hasKR / metrics.totalCount) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode: RMA (Hàng trả về)
  if (metrics.mode === "rma") {
    return (
      <div className="precision-cs__kpiContainer">
        <div className="precision-cs__kpiGrid">
          <div className="kpi-card blue">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Vụ Hàng Trả Về RMA</span>
              <span className="kpi-badge neutral">RMA CASES</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalCount)} <span className="unit">lô hàng</span>
            </div>
          </div>

          <div className="kpi-card rose">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Sản Lượng Trả Về</span>
              <span className="kpi-badge danger">RETURN QTY</span>
            </div>
            <div className="kpi-main-stat">
              <span style={{ color: "#dc2626" }}>{formatNum(metrics.totalReturnQty)}</span>{" "}
              <span className="unit">EA</span>
            </div>
          </div>

          <div className="kpi-card amber">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Giá Trị Hàng RMA</span>
              <span className="kpi-badge warning">AMOUNT</span>
            </div>
            <div className="kpi-main-stat">
              ${formatMoney(metrics.totalReturnAmount)}
            </div>
          </div>

          <div className="kpi-card emerald">
            <div className="kpi-header">
              <span className="kpi-title">Kết Quả Phân Loại (Sorting)</span>
              <span className="kpi-badge success">SORTING</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.sortingOk)} <span className="unit">EA OK</span>
            </div>
            <div className="kpi-breakdown">
              <div className="stat-item">
                <span>Phế Phẩm NG:</span>
                <span className="val red">{formatNum(metrics.sortingNG)} EA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode: Xin Chấp Nhận Đặc Biệt (CNDB)
  if (metrics.mode === "cndb") {
    return (
      <div className="precision-cs__kpiContainer">
        <div className="precision-cs__kpiGrid">
          <div className="kpi-card blue">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Vụ Xin CNĐB</span>
              <span className="kpi-badge neutral">SA CASES</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalCount)} <span className="unit">vụ</span>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Số Lượng Xin CNĐB</span>
              <span className="kpi-badge neutral">SA QTY</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalSAQty)} <span className="unit">EA</span>
            </div>
          </div>

          <div className="kpi-card emerald">
            <div className="kpi-header">
              <span className="kpi-title">Khách Hàng Chấp Thuận</span>
              <span className="kpi-badge success">ACCEPTED</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.okCount)} <span className="unit">vụ OK</span>
            </div>
          </div>

          <div className="kpi-card rose">
            <div className="kpi-header">
              <span className="kpi-title">Từ Chối / Không Đạt</span>
              <span className="kpi-badge danger">REJECTED</span>
            </div>
            <div className="kpi-main-stat">
              <span style={{ color: "#dc2626" }}>{formatNum(metrics.ngCount)}</span>{" "}
              <span className="unit">vụ NG</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode: Chi Phí Taxi CS
  if (metrics.mode === "taxi") {
    return (
      <div className="precision-cs__kpiContainer">
        <div className="precision-cs__kpiGrid">
          <div className="kpi-card blue">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Lượt Đi Taxi CS</span>
              <span className="kpi-badge neutral">TRIPS</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.totalCount)} <span className="unit">lượt</span>
            </div>
          </div>

          <div className="kpi-card amber">
            <div className="kpi-header">
              <span className="kpi-title">Tổng Chi Phí Phát Sinh</span>
              <span className="kpi-badge warning">TOTAL EXPENSE</span>
            </div>
            <div className="kpi-main-stat">
              {formatMoney(metrics.totalTaxiAmount)} <span className="unit">VND</span>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-header">
              <span className="kpi-title">Chi Phí Bình Quân / Lượt</span>
              <span className="kpi-badge neutral">AVG / TRIP</span>
            </div>
            <div className="kpi-main-stat">
              {metrics.totalCount > 0
                ? formatMoney(metrics.totalTaxiAmount / metrics.totalCount)
                : 0}{" "}
              <span className="unit">VND</span>
            </div>
          </div>

          <div className="kpi-card emerald">
            <div className="kpi-header">
              <span className="kpi-title">Nhân Sự CS Sử Dụng</span>
              <span className="kpi-badge success">STAFF</span>
            </div>
            <div className="kpi-main-stat">
              {formatNum(metrics.uniqueStaff)} <span className="unit">nhân viên</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default React.memo(PrecisionCSDataKpi);
