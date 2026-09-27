import React from "react";
import { FiRefreshCw, FiZap, FiBarChart2 } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionFailingMobileHeaderProps {
  userData?: UserData;
  filteredCount: number;
  totalCount: number;
  kpiStats: {
    total: number;
    passed: number;
    pending: number;
    passRate: string;
    pendingRate: string;
    totalQty: number;
  };
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenActionDrawer: () => void;
  onRefresh: () => void;
}

export const PrecisionFailingMobileHeader: React.FC<PrecisionFailingMobileHeaderProps> = ({
  userData,
  filteredCount,
  totalCount,
  kpiStats,
  showKpi,
  onToggleKpi,
  onOpenActionDrawer,
  onRefresh,
}) => {
  return (
    <div className="precision-failing-mobile-header">
      {/* Hàng 1: Brand badge, pulse live, tiêu đề, telemetry chip & nút thao tác */}
      <div className="mobile-header-top">
        <div className="header-title-box">
          <span className="brand-badge">QC • IQC</span>
          <span className="pulse-dot" title="Hệ thống Realtime" />
          <h1 className="header-title">QUẢN LÝ LÔ LỖI</h1>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`btn-action-kpi ${showKpi ? "is-active" : ""}`}
            onClick={onToggleKpi}
            title="Bật/Tắt Micro KPI"
          >
            <FiBarChart2 size={13} />
            <span>KPI</span>
          </button>

          <button
            type="button"
            className="btn-action-quick"
            onClick={onOpenActionDrawer}
            title="Mở bảng thao tác Nhập/Xuất & Phê duyệt"
          >
            <FiZap size={13} />
            <span>Thao Tác</span>
          </button>

          <button
            type="button"
            className="btn-action-refresh"
            onClick={onRefresh}
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Hàng 2: Telemetry chips tinh gọn */}
      <div className="mobile-header-chips">
        <span className="chip chip--count">
          Dòng: <strong>{filteredCount}</strong>/{totalCount}
        </span>
        <span className="chip chip--pending">
          Pending: <strong>{kpiStats.pending}</strong> ({kpiStats.pendingRate}%)
        </span>
        <span className="chip chip--pass">
          Pass: <strong>{kpiStats.passed}</strong> ({kpiStats.passRate}%)
        </span>
        <span className="chip chip--qty">
          Tồn: <strong>{kpiStats.totalQty.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
};

export default PrecisionFailingMobileHeader;
