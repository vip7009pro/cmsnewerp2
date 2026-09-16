import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendIcon from "@mui/icons-material/Send";
import UndoIcon from "@mui/icons-material/Undo";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

interface PrecisionQLGNKpiProps {
  kpis: {
    total: number;
    phCount: number;
    thCount: number;
    pendingCfm: number;
  };
}

export const PrecisionQLGNKpi: React.FC<PrecisionQLGNKpiProps> = ({ kpis }) => {
  return (
    <div className="precision-qlgn-kpis">
      <div className="kpi-card blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Lượt Giao Nhận</span>
          <span className="kpi-value">{kpis.total.toLocaleString()}</span>
        </div>
        <div className="kpi-icon-wrapper blue">
          <AssignmentIcon fontSize="small" />
        </div>
      </div>

      <div className="kpi-card emerald">
        <div className="kpi-info">
          <span className="kpi-label">Đã Phát Hành (PH)</span>
          <span className="kpi-value">{kpis.phCount.toLocaleString()}</span>
        </div>
        <div className="kpi-icon-wrapper emerald">
          <SendIcon fontSize="small" />
        </div>
      </div>

      <div className="kpi-card amber">
        <div className="kpi-info">
          <span className="kpi-label">Thu Hồi (TH)</span>
          <span className="kpi-value">{kpis.thCount.toLocaleString()}</span>
        </div>
        <div className="kpi-icon-wrapper amber">
          <UndoIcon fontSize="small" />
        </div>
      </div>

      <div className="kpi-card rose">
        <div className="kpi-info">
          <span className="kpi-label">Chờ Xác Nhận (Pending CFM)</span>
          <span className="kpi-value">{kpis.pendingCfm.toLocaleString()}</span>
        </div>
        <div className="kpi-icon-wrapper rose">
          <PendingActionsIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLGNKpi);
