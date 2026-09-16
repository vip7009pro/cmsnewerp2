import React from "react";
import {
  AiOutlineAudit,
  AiOutlineCheckCircle,
  AiOutlineTrophy,
  AiOutlineFileProtect,
} from "react-icons/ai";
import { AuditHistoryKpiData } from "./auditHistoryTypes";

interface KpiProps {
  kpiData: AuditHistoryKpiData;
}

export const PrecisionAUDITHistoryKpi: React.FC<KpiProps> = ({ kpiData }) => {
  return (
    <div className="pah-kpi-container">
      {/* 1. Tổng đợt Audit */}
      <div className="kpi-card blue">
        <div className="card-header">
          <span className="card-label">Tổng Đợt Kiểm Toán</span>
          <AiOutlineAudit className="card-icon" style={{ color: "#2563eb" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.totalCount}</span>
          <span className="sub-value">đợt audit</span>
        </div>
        <div className="card-progress">
          <div className="progress-fill blue" style={{ width: "100%" }} />
        </div>
      </div>

      {/* 2. Tỷ lệ Đạt Pass */}
      <div className="kpi-card emerald">
        <div className="card-header">
          <span className="card-label">Tỷ Lệ Đạt Yêu Cầu</span>
          <AiOutlineCheckCircle className="card-icon" style={{ color: "#10b981" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.passRate}%</span>
          <span className="sub-value">
            {kpiData.passCount} PASS / {kpiData.failCount} FAIL
          </span>
        </div>
        <div className="card-progress">
          <div
            className="progress-fill emerald"
            style={{ width: `${Math.min(kpiData.passRate, 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Điểm số Trung bình */}
      <div className="kpi-card indigo">
        <div className="card-header">
          <span className="card-label">Điểm Số Trung Bình</span>
          <AiOutlineTrophy className="card-icon" style={{ color: "#6366f1" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.avgScore}</span>
          <span className="sub-value">
            / {kpiData.avgMaxScore || 100} tối đa
          </span>
        </div>
        <div className="card-progress">
          <div
            className="progress-fill indigo"
            style={{
              width: `${Math.min(
                kpiData.avgMaxScore > 0
                  ? (kpiData.avgScore / kpiData.avgMaxScore) * 100
                  : 0,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* 4. Hồ sơ Báo Cáo đính kèm */}
      <div className="kpi-card amber">
        <div className="card-header">
          <span className="card-label">Hồ Sơ Đính Kèm</span>
          <AiOutlineFileProtect className="card-icon" style={{ color: "#f59e0b" }} />
        </div>
        <div className="card-body">
          <span className="primary-value">{kpiData.hasFileRate}%</span>
          <span className="sub-value">
            {kpiData.hasFileCount} / {kpiData.totalCount} có tệp
          </span>
        </div>
        <div className="card-progress">
          <div
            className="progress-fill amber"
            style={{ width: `${Math.min(kpiData.hasFileRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
