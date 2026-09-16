import React from "react";
import { AUDITKpiMetrics } from "./auditTypes";

interface PrecisionAUDITKpiProps {
  metrics: AUDITKpiMetrics;
}

const PrecisionAUDITKpi: React.FC<PrecisionAUDITKpiProps> = ({ metrics }) => {
  return (
    <div className="precision-audit__kpiGrid">
      {/* Card 1: Total Items */}
      <div className="precision-audit__kpiCard precision-audit__kpiCard--blue">
        <div className="precision-audit__kpiHeader">
          <span className="precision-audit__kpiTitle">Tổng Hạng Mục Checksheet</span>
          <span className="material-symbols-outlined precision-audit__kpiIcon">checklist</span>
        </div>
        <div className="precision-audit__kpiValueRow">
          <span className="precision-audit__kpiValue precision-audit__kpiValue--blue">
            {metrics.totalItems}
          </span>
          <span className="precision-audit__kpiSub">tiêu chí</span>
        </div>
        <div className="precision-audit__kpiSub" style={{ marginTop: 4 }}>
          Đã chấm điểm: <strong>{metrics.evaluatedItems}</strong> / {metrics.totalItems} mục
        </div>
      </div>

      {/* Card 2: Score & Pass Status */}
      <div className={`precision-audit__kpiCard ${metrics.isPass ? "precision-audit__kpiCard--emerald" : "precision-audit__kpiCard--rose"}`}>
        <div className="precision-audit__kpiHeader">
          <span className="precision-audit__kpiTitle">Điểm Tổng Kết & Tỷ Lệ Đạt</span>
          <span className="material-symbols-outlined precision-audit__kpiIcon">
            {metrics.isPass ? "verified" : "report"}
          </span>
        </div>
        <div className="precision-audit__kpiValueRow">
          <span className={`precision-audit__kpiValue ${metrics.isPass ? "precision-audit__kpiValue--emerald" : "precision-audit__kpiValue--rose"}`}>
            {metrics.totalScore.toFixed(0)}
          </span>
          <span className="precision-audit__kpiSub">
            / {metrics.maxScore.toFixed(0)} ({metrics.scoreRate.toFixed(1)}%)
          </span>
          <span
            className={`audit-cell-badge ${metrics.isPass ? "audit-cell-badge--pass" : "audit-cell-badge--fail"}`}
            style={{ marginLeft: "auto" }}
          >
            {metrics.isPass ? "PASS" : "FAIL"} (Chuẩn: {metrics.passScore})
          </span>
        </div>
        <div className="precision-audit__kpiProgress">
          <div
            className={`progress-bar ${metrics.isPass ? "progress-bar--emerald" : "progress-bar--rose"}`}
            style={{ width: `${Math.min(100, metrics.scoreRate)}%` }}
          />
        </div>
      </div>

      {/* Card 3: Evident Attachments */}
      <div className="precision-audit__kpiCard precision-audit__kpiCard--purple">
        <div className="precision-audit__kpiHeader">
          <span className="precision-audit__kpiTitle">Bằng Chứng Hiện Trường (Evident)</span>
          <span className="material-symbols-outlined precision-audit__kpiIcon">photo_library</span>
        </div>
        <div className="precision-audit__kpiValueRow">
          <span className="precision-audit__kpiValue precision-audit__kpiValue--purple">
            {metrics.evidentCount}
          </span>
          <span className="precision-audit__kpiSub">
            mục có ảnh ({metrics.evidentRate.toFixed(1)}%)
          </span>
        </div>
        <div className="precision-audit__kpiProgress">
          <div
            className="progress-bar progress-bar--blue"
            style={{ width: `${Math.min(100, metrics.evidentRate)}%` }}
          />
        </div>
      </div>

      {/* Card 4: Audit Batch Info */}
      <div className="precision-audit__kpiCard precision-audit__kpiCard--amber">
        <div className="precision-audit__kpiHeader">
          <span className="precision-audit__kpiTitle">Thông Tin Đợt Đang Chọn</span>
          <span className="material-symbols-outlined precision-audit__kpiIcon">event_available</span>
        </div>
        <div className="precision-audit__kpiValueRow">
          <span className="precision-audit__kpiValue precision-audit__kpiValue--amber" style={{ fontSize: 14 }}>
            {metrics.selectedAuditName || "Chưa chọn đợt"}
          </span>
        </div>
        <div className="precision-audit__kpiSub" style={{ marginTop: 4 }}>
          Ngày: <strong>{metrics.selectedAuditDate || "N/A"}</strong> | NV: <strong>{metrics.selectedInsEmpl || "N/A"}</strong>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAUDITKpi);
