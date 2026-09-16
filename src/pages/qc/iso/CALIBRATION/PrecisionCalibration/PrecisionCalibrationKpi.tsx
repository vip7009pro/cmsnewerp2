import React from "react";
import {
  AiOutlineDashboard,
  AiOutlineAlert,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineTool,
} from "react-icons/ai";
import { CalibrationKpiData, UrgencyFilter } from "./calibrationTypes";

interface KpiProps {
  kpiData: CalibrationKpiData;
  activeFilter: UrgencyFilter;
  onSelectFilter: (filter: UrgencyFilter) => void;
}

export const PrecisionCalibrationKpi: React.FC<KpiProps> = ({
  kpiData,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <div className="pc-kpi-container">
      {/* 1. Tổng thiết bị */}
      <div
        className={`kpi-card blue ${activeFilter === "ALL" ? "active" : ""}`}
        onClick={() => onSelectFilter("ALL")}
        title="Bấm để xem tất cả thiết bị"
      >
        <div className="card-header">
          <span className="card-label">Tổng Thiết Bị</span>
          <AiOutlineDashboard className="card-icon" style={{ color: "#2563eb" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.totalCount}</span>
          <span className="sub-value">thiết bị</span>
        </div>
      </div>

      {/* 2. Quá hạn hiệu chuẩn */}
      <div
        className={`kpi-card rose ${activeFilter === "OVERDUE" ? "active" : ""}`}
        onClick={() => onSelectFilter("OVERDUE")}
        title="Bấm để lọc thiết bị quá hạn"
      >
        <div className="card-header">
          <span className="card-label">Quá Hạn Hiệu Chuẩn</span>
          <AiOutlineAlert className="card-icon" style={{ color: "#ef4444" }} />
        </div>
        <div className="card-body">
          <span className="primary-value" style={{ color: kpiData.overdueCount > 0 ? "#dc2626" : undefined }}>
            {kpiData.overdueCount}
          </span>
          <span className="sub-value" style={{ color: kpiData.overdueCount > 0 ? "#b91c1c" : undefined }}>
            cần hiệu chuẩn ngay
          </span>
        </div>
      </div>

      {/* 3. Sắp đến hạn */}
      <div
        className={`kpi-card amber ${activeFilter === "DUE_SOON" ? "active" : ""}`}
        onClick={() => onSelectFilter("DUE_SOON")}
        title="Bấm để lọc thiết bị sắp đến hạn"
      >
        <div className="card-header">
          <span className="card-label">Sắp Đến Hạn (30 ngày)</span>
          <AiOutlineClockCircle className="card-icon" style={{ color: "#f59e0b" }} />
        </div>
        <div className="card-body">
          <span className="primary-value" style={{ color: kpiData.dueSoonCount > 0 ? "#d97706" : undefined }}>
            {kpiData.dueSoonCount}
          </span>
          <span className="sub-value">trong tháng tới</span>
        </div>
      </div>

      {/* 4. Đạt chuẩn / Trong hạn */}
      <div
        className={`kpi-card emerald ${activeFilter === "VALID" ? "active" : ""}`}
        onClick={() => onSelectFilter("VALID")}
        title="Bấm để lọc thiết bị trong hạn"
      >
        <div className="card-header">
          <span className="card-label">Trong Hạn Chuẩn</span>
          <AiOutlineCheckCircle className="card-icon" style={{ color: "#10b981" }} />
        </div>
        <div className="card-body">
          <span className="primary-value" style={{ color: "#059669" }}>
            {kpiData.validCount}
          </span>
          <span className="sub-value">đang hợp lệ</span>
        </div>
      </div>

      {/* 5. Đang dùng vs Đã hỏng */}
      <div
        className={`kpi-card indigo ${activeFilter === "BROKEN" ? "active" : ""}`}
        onClick={() => onSelectFilter("BROKEN")}
        title="Bấm để lọc thiết bị đã hỏng"
      >
        <div className="card-header">
          <span className="card-label">Tình Trạng Thiết Bị</span>
          <AiOutlineTool className="card-icon" style={{ color: "#6366f1" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.inUseCount}</span>
          <span className="sub-value">
            dùng / <b style={{ color: "#64748b" }}>{kpiData.brokenCount} hỏng</b>
          </span>
        </div>
      </div>
    </div>
  );
};
