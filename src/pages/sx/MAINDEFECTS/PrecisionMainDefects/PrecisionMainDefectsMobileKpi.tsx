import React from "react";
import {
  FiLayers,
  FiCheckCircle,
  FiCamera,
  FiActivity,
  FiSliders,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MainDefectsKpiSummary } from "./mainDefectsHelpers";

interface PrecisionMainDefectsMobileKpiProps {
  summary: MainDefectsKpiSummary;
  onClose: () => void;
}

const PrecisionMainDefectsMobileKpi: React.FC<PrecisionMainDefectsMobileKpiProps> = ({
  summary,
  onClose,
}) => {
  return (
    <div className="precision-maindefects__mobileKpiWrapper">
      <div className="mobile-kpi-header">
        <span className="mobile-kpi-title">TỔNG QUAN CHỈ SỐ TIÊU CHUẨN LỖI (KPI)</span>
        <button
          type="button"
          className="btn-close-kpi"
          onClick={onClose}
          title="Đóng chỉ số để giải phóng không gian"
        >
          <FiX size={14} />
        </button>
      </div>

      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng tiêu chuẩn */}
        <div className="micro-kpi-card micro-kpi-card--blue">
          <div className="micro-kpi-icon">
            <FiLayers />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Tổng Tiêu Chuẩn</span>
            <span className="value">{summary.totalDefects.toLocaleString("en-US")}</span>
            <span className="sub">{summary.uniqueProducts} G_CODE</span>
          </div>
        </div>

        {/* Card 2: Áp dụng */}
        <div className="micro-kpi-card micro-kpi-card--emerald">
          <div className="micro-kpi-icon">
            <FiCheckCircle />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Đang Áp Dụng</span>
            <span className="value">{summary.activeRate.toFixed(1)}%</span>
            <span className="sub">{summary.activeCount} chuẩn / {summary.inactiveCount} dừng</span>
          </div>
        </div>

        {/* Card 3: Thư viện trực quan */}
        <div className="micro-kpi-card micro-kpi-card--purple">
          <div className="micro-kpi-icon">
            <FiCamera />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Thư Viện Trực Quan</span>
            <span className="value">{summary.visualRate.toFixed(1)}%</span>
            <span className="sub">{summary.visualCount} có hình ảnh</span>
          </div>
        </div>

        {/* Card 4: Công đoạn */}
        <div className="micro-kpi-card micro-kpi-card--amber">
          <div className="micro-kpi-icon">
            <FiActivity />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Công Đoạn Chính</span>
            <span className="value">CĐ1: {summary.cd1Count}</span>
            <span className="sub">CĐ2: {summary.cd2Count} • CĐ3+: {summary.cd3Count + summary.cd4PlusCount}</span>
          </div>
        </div>

        {/* Card 5: Hạng mục & Phương pháp test */}
        <div className="micro-kpi-card micro-kpi-card--indigo">
          <div className="micro-kpi-icon">
            <FiSliders />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Hạng Mục & PP Kiểm</span>
            <span className="value">{summary.uniqueTestItems} Mục</span>
            <span className="sub">{summary.uniqueTestMethods} phương pháp</span>
          </div>
        </div>

        {/* Card 6: Nhân sự & Cập nhật */}
        <div className="micro-kpi-card micro-kpi-card--rose">
          <div className="micro-kpi-icon">
            <FiUsers />
          </div>
          <div className="micro-kpi-content">
            <span className="label">Nhân Sự Quản Trị</span>
            <span className="value">{summary.uniqueEmpls} NV</span>
            <span className="sub">{summary.recentUpdatedCount} cập nhật 30D</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsMobileKpi);
