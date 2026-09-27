// PrecisionIncomingMobileHeader.tsx - Mobile-only compact header (brand, telemetry chips, quick actions)
import React from "react";
import { FiRefreshCw, FiBarChart2, FiEdit3 } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionIncomingMobileHeaderProps {
  userData: UserData | undefined;
  filteredCount: number;
  totalCount: number;
  passRate: string;
  dtcTestCount: number;
  holdingCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  onOpenInputSheet: () => void;
  onRefresh: () => void;
}

export const PrecisionIncomingMobileHeader: React.FC<PrecisionIncomingMobileHeaderProps> = ({
  userData,
  filteredCount,
  totalCount,
  passRate,
  dtcTestCount,
  holdingCount,
  showKpi,
  onToggleKpi,
  onOpenInputSheet,
  onRefresh,
}) => {
  return (
    <div className="precision-incoming-mobile-header">
      {/* Hàng 1: Brand + tiêu đề + thao tác nhanh */}
      <div className="mobile-header-top">
        <div className="header-title-box">
          <span className="brand-badge">QC • IQC</span>
          <span className="pulse-dot" title="Hệ thống Realtime" />
          <h1 className="header-title">INCOMING</h1>
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
            className="btn-action-new"
            onClick={onOpenInputSheet}
            title="Mở phiếu đăng ký kiểm tra lô mới"
          >
            <FiEdit3 size={13} />
            <span>Nhập</span>
          </button>

          <button
            type="button"
            className="btn-action-refresh"
            onClick={onRefresh}
            title="Tra cứu lại dữ liệu Incoming"
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
        <span className="chip chip--pass">
          Pass: <strong>{passRate}%</strong>
        </span>
        <span className="chip chip--dtc">
          ĐTC: <strong>{dtcTestCount}</strong>
        </span>
        <span className={`chip chip--hold ${holdingCount > 0 ? "is-alert" : ""}`}>
          Hold/NCR: <strong>{holdingCount}</strong>
        </span>
        {userData?.EMPL_NO && <span className="chip chip--user">{userData.EMPL_NO}</span>}
      </div>
    </div>
  );
};

export default PrecisionIncomingMobileHeader;
