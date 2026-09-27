import React from "react";
import { FiRefreshCw, FiBarChart2, FiLayers } from "react-icons/fi";
import { AiOutlineSwapRight } from "react-icons/ai";

interface PrecisionKhoAoMobileHeaderProps {
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  nextPlan: string;
  totalRecords: number;
  filteredRecords: number;
  showKpiSummary: boolean;
  onToggleKpiSummary: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrecisionKhoAoMobileHeader: React.FC<PrecisionKhoAoMobileHeaderProps> = React.memo(({
  activeTab,
  nextPlan,
  totalRecords,
  filteredRecords,
  showKpiSummary,
  onToggleKpiSummary,
  onRefresh,
  isLoading,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case "TON":
        return "TỒN KHO MAIN";
      case "LS_IN":
        return "LỊCH SỬ NHẬP";
      case "LS_OUT":
        return "LỊCH SỬ XUẤT";
    }
  };

  return (
    <div className="precision-khoao-mobile-header">
      <div className="mobile-header-top">
        <div className="mobile-brand-box">
          <div className="mobile-brand-icon">
            <FiLayers size={14} />
          </div>
          <div className="mobile-title-block">
            <div className="mobile-title-row">
              <span className="mobile-badge-tag">QLSX</span>
              <span className="mobile-main-title">KHO SX MAIN</span>
            </div>
            <div className="mobile-sub-status">
              <span className="live-dot" />
              <span className="tab-indicator">{getTabLabel()}</span>
              <span className="count-pill">
                {filteredRecords !== totalRecords ? (
                  <>
                    <strong>{filteredRecords}</strong>/{totalRecords} cuộn
                  </>
                ) : (
                  <>
                    <strong>{totalRecords}</strong> cuộn
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mobile-header-actions">
          {nextPlan && (
            <div className="mobile-next-plan-chip" title="Chỉ thị tiếp nhận">
              <AiOutlineSwapRight size={12} />
              <span>{nextPlan}</span>
            </div>
          )}

          <button
            type="button"
            className={`mobile-btn-icon ${showKpiSummary ? "active" : ""}`}
            onClick={onToggleKpiSummary}
            title={showKpiSummary ? "Ẩn tóm tắt KPI" : "Xem tóm tắt KPI"}
          >
            <FiBarChart2 size={16} />
          </button>

          <button
            type="button"
            className="mobile-btn-icon"
            onClick={onRefresh}
            disabled={isLoading}
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw
              size={15}
              className={isLoading ? "spin-animation" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
});
