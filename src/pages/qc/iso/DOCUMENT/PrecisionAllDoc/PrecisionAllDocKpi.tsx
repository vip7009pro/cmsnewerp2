import React from "react";
import {
  AiOutlineFolderOpen,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFileText,
} from "react-icons/ai";
import { AllDocKpiData } from "./allDocTypes";

interface KpiProps {
  kpiData: AllDocKpiData;
}

export const PrecisionAllDocKpi: React.FC<KpiProps> = ({ kpiData }) => {
  const activeRate =
    kpiData.totalCount > 0
      ? Math.round((kpiData.activeCount / kpiData.totalCount) * 100)
      : 0;

  return (
    <div className="pad-kpi-container">
      {/* 1. Tổng số tài liệu */}
      <div className="kpi-card blue">
        <div className="card-header">
          <span className="card-label">Tổng Tài Liệu Đã Lưu</span>
          <AiOutlineFolderOpen className="card-icon" style={{ color: "#2563eb" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.totalCount}</span>
          <span className="sub-value">hồ sơ / tệp tin</span>
        </div>
      </div>

      {/* 2. Đang có hiệu lực */}
      <div className="kpi-card emerald">
        <div className="card-header">
          <span className="card-label">Đang Có Hiệu Lực</span>
          <AiOutlineCheckCircle className="card-icon" style={{ color: "#10b981" }} />
        </div>
        <div className="card-body">
          <span className="primary-value" style={{ color: "#059669" }}>
            {kpiData.activeCount}
          </span>
          <span className="sub-value">
            {activeRate}% tổng tài liệu
          </span>
        </div>
      </div>

      {/* 3. Kiểm soát hạn dùng */}
      <div className="kpi-card rose">
        <div className="card-header">
          <span className="card-label">Cảnh Báo Hạn Dùng</span>
          <AiOutlineClockCircle className="card-icon" style={{ color: "#ef4444" }} />
        </div>
        <div className="card-body">
          <span
            className="primary-value"
            style={{
              color:
                kpiData.expiredCount > 0
                  ? "#dc2626"
                  : kpiData.expiringSoonCount > 0
                  ? "#d97706"
                  : "#059669",
            }}
          >
            {kpiData.expiredCount}
          </span>
          <span className="sub-value">
            quá hạn / <b style={{ color: "#d97706" }}>{kpiData.expiringSoonCount} sắp hết hạn</b>
          </span>
        </div>
      </div>

      {/* 4. Định dạng số hóa */}
      <div className="kpi-card indigo">
        <div className="card-header">
          <span className="card-label">Định Dạng Tệp Tin</span>
          <AiOutlineFileText className="card-icon" style={{ color: "#6366f1" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.pdfCount}</span>
          <span className="sub-value">
            PDF / <b>{kpiData.officeCount} Office (Word/Excel)</b>
          </span>
        </div>
      </div>
    </div>
  );
};
