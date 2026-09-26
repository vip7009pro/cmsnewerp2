import React from "react";
import { AiOutlineAppstore, AiOutlineSetting, AiOutlineBarChart } from "react-icons/ai";
import { IconButton } from "@mui/material";

interface PrecisionEqStatus2MobileHeaderProps {
  totalMachines: number;
  filteredCount: number;
  showKpi: boolean;
  onToggleKpi: () => void;
  canManage: boolean;
  onOpenEQManager: () => void;
}

export const PrecisionEqStatus2MobileHeader: React.FC<PrecisionEqStatus2MobileHeaderProps> = React.memo(({
  totalMachines,
  filteredCount,
  showKpi,
  onToggleKpi,
  canManage,
  onOpenEQManager,
}) => {
  return (
    <header className="eqs2_mobile_header">
      <div className="eqs2_mobile_header__left">
        <div className="eqs2_mobile_header__icon">
          <AiOutlineAppstore size={20} color="#0284c7" />
        </div>
        <div className="eqs2_mobile_header__titles">
          <div className="eqs2_mobile_header__title">Thiết Bị Realtime</div>
          <div className="eqs2_mobile_header__meta">
            <span className="live-indicator">
              <span className="live-dot" />
              Live 3s
            </span>
            <span className="machine-count">
              {filteredCount === totalMachines ? `${totalMachines} máy` : `${filteredCount}/${totalMachines} máy`}
            </span>
          </div>
        </div>
      </div>

      <div className="eqs2_mobile_header__actions">
        <button
          type="button"
          className={`btn-kpi-toggle ${showKpi ? "is-active" : ""}`}
          onClick={onToggleKpi}
          title={showKpi ? "Ẩn tóm tắt KPI" : "Hiện tóm tắt KPI"}
        >
          <AiOutlineBarChart size={16} />
          <span>KPI</span>
        </button>

        {canManage && (
          <IconButton
            size="small"
            className="btn-eq-manager"
            onClick={onOpenEQManager}
            title="Quản lý thiết bị"
          >
            <AiOutlineSetting size={18} color="#0b8a4a" />
          </IconButton>
        )}
      </div>
    </header>
  );
});

export default PrecisionEqStatus2MobileHeader;
