import React from "react";
import {
  FiLayers,
  FiCheckCircle,
  FiCamera,
  FiActivity,
  FiSliders,
  FiUsers,
} from "react-icons/fi";
import { MainDefectsKpiSummary } from "./mainDefectsHelpers";

interface PrecisionMainDefectsKpiProps {
  summary: MainDefectsKpiSummary;
}

const PrecisionMainDefectsKpi: React.FC<PrecisionMainDefectsKpiProps> = ({ summary }) => {
  return (
    <div className="precision-maindefects__kpiGrid">
      {/* 1. Tổng Tiêu Chuẩn Lỗi */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Tiêu Chuẩn</span>
          <span className="kpi-value">{summary.totalDefects.toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Mã Hàng: <strong>{summary.uniqueProducts} G_CODE</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiLayers />
        </div>
      </div>

      {/* 2. Tiêu Chuẩn Đang Áp Dụng */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Đang Áp Dụng (USE_YN)</span>
          <span className="kpi-value">{summary.activeCount.toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Đạt <strong>{summary.activeRate.toFixed(1)}%</strong></span>
            <span>• Dừng: {summary.inactiveCount}</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCheckCircle />
        </div>
      </div>

      {/* 3. Thư Viện Trực Quan */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-info">
          <span className="kpi-label">Thư Viện Trực Quan</span>
          <span className="kpi-value">{summary.visualCount.toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Có Ảnh: <strong>{summary.visualRate.toFixed(1)}%</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCamera />
        </div>
      </div>

      {/* 4. Phân Bổ Theo Công Đoạn */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Công Đoạn Chính</span>
          <span className="kpi-value">
            CĐ1: {summary.cd1Count}
          </span>
          <div className="kpi-meta">
            <span>CĐ2: <strong>{summary.cd2Count}</strong></span>
            <span>• CĐ3: <strong>{summary.cd3Count}</strong></span>
            <span>• CĐ4+: <strong>{summary.cd4PlusCount}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* 5. Hạng Mục & Phương Pháp Test */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-info">
          <span className="kpi-label">Hạng Mục & PP Kiểm</span>
          <span className="kpi-value">{summary.uniqueTestItems}</span>
          <div className="kpi-meta">
            <span>Hạng Mục • <strong>{summary.uniqueTestMethods} Phương Pháp</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiSliders />
        </div>
      </div>

      {/* 6. Quản Trị & Cập Nhật */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Nhân Sự & Cập Nhật</span>
          <span className="kpi-value">{summary.uniqueEmpls}</span>
          <div className="kpi-meta">
            <span>Người Tạo • <strong>{summary.recentUpdatedCount} Cập Nhật 30D</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiUsers />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsKpi);
