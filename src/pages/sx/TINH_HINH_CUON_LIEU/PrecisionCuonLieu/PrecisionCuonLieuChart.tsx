import React from "react";
import SXWeeklyLossRoll from "../../../../components/Chart/SX/SXWeeklyLossRoll";
import SXDailyRollLoss from "../../../../components/Chart/SX/SXDailyRollLoss";
import { SX_LOSS_ROLL_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import CloseIcon from "@mui/icons-material/Close";

interface PrecisionCuonLieuChartProps {
  lossRollData: SX_LOSS_ROLL_DATA[];
  dailyGraph: boolean;
  onClose: () => void;
}

export const PrecisionCuonLieuChart: React.FC<PrecisionCuonLieuChartProps> = ({
  lossRollData,
  dailyGraph,
  onClose,
}) => {
  return (
    <div className="precision-cuonlieu__chartCard">
      <div className="chart-card-header">
        <div className="title-group">
          <span className="chart-title">
            XU HƯỚNG TỔN THẤT CUỘN LIỆU (ROLL LOSS TRENDING)
          </span>
          <span className="chart-badge">
            {dailyGraph ? "📅 THEO NGÀY (DAILY)" : "📊 THEO TUẦN (WEEKLY)"}
          </span>
        </div>

        <button
          type="button"
          className="btn-close-chart"
          onClick={onClose}
          title="Thu gọn biểu đồ"
        >
          <CloseIcon style={{ fontSize: "0.95rem" }} />
        </button>
      </div>

      <div className="chart-body">
        {dailyGraph ? (
          <SXDailyRollLoss
            dldata={lossRollData}
            materialColor="#38bdf8"
            processColor="#818cf8"
          />
        ) : (
          <SXWeeklyLossRoll
            dldata={lossRollData}
            materialColor="#38bdf8"
            processColor="#818cf8"
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuChart);
