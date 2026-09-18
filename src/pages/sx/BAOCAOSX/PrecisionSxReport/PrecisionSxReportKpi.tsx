import React from "react";
import { FiClock, FiActivity, FiCalendar, FiAward, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { SX_ACHIVE_DATA, SX_TREND_LOSS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionSxReportKpiProps {
  dailyLossData: SX_TREND_LOSS_DATA[];
  weeklyLossData: SX_TREND_LOSS_DATA[];
  monthlyLossData: SX_TREND_LOSS_DATA[];
  yearlyLossData: SX_TREND_LOSS_DATA[];
  dailyAchiveData: SX_ACHIVE_DATA[];
  weeklyAchiveData: SX_ACHIVE_DATA[];
  monthlyAchiveData: SX_ACHIVE_DATA[];
  yearlyAchiveData: SX_ACHIVE_DATA[];
}

const PrecisionSxReportKpi: React.FC<PrecisionSxReportKpiProps> = ({
  dailyLossData,
  weeklyLossData,
  monthlyLossData,
  yearlyLossData,
  dailyAchiveData,
  weeklyAchiveData,
  monthlyAchiveData,
  yearlyAchiveData,
}) => {
  // 1. Hôm qua
  const yLossCur = dailyLossData?.[dailyLossData.length - 2]?.LOSS_RATE ?? 0;
  const yLossPrev = dailyLossData?.[dailyLossData.length - 3]?.LOSS_RATE ?? 0;
  const yLossDiff = yLossCur - yLossPrev;
  const yAchive = dailyAchiveData?.[dailyAchiveData.length - 2]?.ACHIVE_RATE ?? 0;

  // 2. Tuần này
  const wLossCur = weeklyLossData?.[0]?.LOSS_RATE ?? 0;
  const wLossPrev = weeklyLossData?.[1]?.LOSS_RATE ?? 0;
  const wLossDiff = wLossCur - wLossPrev;
  const wAchive = weeklyAchiveData?.[0]?.ACHIVE_RATE ?? 0;

  // 3. Tháng này
  const mLossCur = monthlyLossData?.[0]?.LOSS_RATE ?? 0;
  const mLossPrev = monthlyLossData?.[1]?.LOSS_RATE ?? 0;
  const mLossDiff = mLossCur - mLossPrev;
  const mAchive = monthlyAchiveData?.[0]?.ACHIVE_RATE ?? 0;

  // 4. Năm nay
  const yrLossCur = yearlyLossData?.[0]?.LOSS_RATE ?? 0;
  const yrLossPrev = yearlyLossData?.[1]?.LOSS_RATE ?? 0;
  const yrLossDiff = yrLossCur - yrLossPrev;
  const yrAchive = yearlyAchiveData?.[0]?.ACHIVE_RATE ?? 0;

  const renderLossDiff = (diff: number) => {
    const isGood = diff <= 0; // Giảm tổn thất là tốt
    return (
      <span className={`growth-pill ${isGood ? "growth-pill--up" : "growth-pill--down"}`}>
        {diff >= 0 ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
        <span>{(Math.abs(diff) * 100).toFixed(1)}%</span>
      </span>
    );
  };

  return (
    <section className="precision-sx-kpi-grid">
      {/* Thẻ 1: Hôm qua */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Hôm Qua (Yesterday)</span>
          <div className="kpi-amount">
            {yLossCur.toLocaleString("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className="kpi-meta">
            <span>Đạt: <strong className="qty-val">{(yAchive * 100).toFixed(1)}%</strong></span>
            {renderLossDiff(yLossDiff)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiClock />
        </div>
      </div>

      {/* Thẻ 2: Tuần này */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tuần Này (This Week)</span>
          <div className="kpi-amount">
            {wLossCur.toLocaleString("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className="kpi-meta">
            <span>Đạt: <strong className="qty-val">{(wAchive * 100).toFixed(1)}%</strong></span>
            {renderLossDiff(wLossDiff)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* Thẻ 3: Tháng này */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Tháng Này (This Month)</span>
          <div className="kpi-amount">
            {mLossCur.toLocaleString("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className="kpi-meta">
            <span>Đạt: <strong className="qty-val">{(mAchive * 100).toFixed(1)}%</strong></span>
            {renderLossDiff(mLossDiff)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCalendar />
        </div>
      </div>

      {/* Thẻ 4: Năm nay */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Năm Nay (This Year)</span>
          <div className="kpi-amount">
            {yrLossCur.toLocaleString("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          <div className="kpi-meta">
            <span>Đạt: <strong className="qty-val">{(yrAchive * 100).toFixed(1)}%</strong></span>
            {renderLossDiff(yrLossDiff)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiAward />
        </div>
      </div>
    </section>
  );
};

export { PrecisionSxReportKpi };
export default React.memo(PrecisionSxReportKpi);
