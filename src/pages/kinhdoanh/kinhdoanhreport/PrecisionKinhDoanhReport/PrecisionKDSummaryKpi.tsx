import React from "react";
import { FiTrendingUp, FiTrendingDown, FiClock, FiCalendar, FiActivity, FiAward } from "react-icons/fi";
import { DailyClosingData, YearlyClosingData } from "./kdReportQueries";
import { MonthlyClosingData } from "../../interfaces/kdInterface";
import { WeeklyClosingData } from "../../../../api/GlobalInterface";

interface PrecisionKDSummaryKpiProps {
  yesterdayData: DailyClosingData[];
  thisWeekData: WeeklyClosingData[];
  thisMonthData: MonthlyClosingData[];
  thisYearData: YearlyClosingData[];
}

const PrecisionKDSummaryKpi: React.FC<PrecisionKDSummaryKpiProps> = ({
  yesterdayData,
  thisWeekData,
  thisMonthData,
  thisYearData,
}) => {
  // Tính toán Yesterday
  const yCur = yesterdayData?.[yesterdayData.length - 2];
  const yPrev = yesterdayData?.[yesterdayData.length - 3];
  const yAmount = yCur?.DELIVERED_AMOUNT || 0;
  const yQty = yCur?.DELIVERY_QTY || 0;
  const yRate = yPrev?.DELIVERED_AMOUNT ? ((yAmount * 1.0) / yPrev.DELIVERED_AMOUNT - 1) * 100 : 0;

  // Tính toán This Week
  const wCur = thisWeekData?.[thisWeekData.length - 1];
  const wPrev = thisWeekData?.[thisWeekData.length - 2];
  const wAmount = wCur?.DELIVERED_AMOUNT || 0;
  const wQty = wCur?.DELIVERY_QTY || 0;
  const wRate = wPrev?.DELIVERED_AMOUNT ? ((wAmount * 1.0) / wPrev.DELIVERED_AMOUNT - 1) * 100 : 0;

  // Tính toán This Month
  const mCur = thisMonthData?.[thisMonthData.length - 1];
  const mPrev = thisMonthData?.[thisMonthData.length - 2];
  const mAmount = mCur?.DELIVERED_AMOUNT || 0;
  const mQty = mCur?.DELIVERY_QTY || 0;
  const mRate = mPrev?.DELIVERED_AMOUNT ? ((mAmount * 1.0) / mPrev.DELIVERED_AMOUNT - 1) * 100 : 0;

  // Tính toán This Year
  const yrCur = thisYearData?.[thisYearData.length - 1];
  const yrPrev = thisYearData?.[thisYearData.length - 2];
  const yrAmount = yrCur?.DELIVERED_AMOUNT || 0;
  const yrQty = yrCur?.DELIVERY_QTY || 0;
  const yrRate = yrPrev?.DELIVERED_AMOUNT ? ((yrAmount * 1.0) / yrPrev.DELIVERED_AMOUNT - 1) * 100 : 0;

  const renderGrowth = (rate: number) => {
    const isUp = rate >= 0;
    return (
      <span className={`growth-pill ${isUp ? "growth-pill--up" : "growth-pill--down"}`}>
        {isUp ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
        <span>{Math.abs(rate).toFixed(1)}%</span>
      </span>
    );
  };

  return (
    <section className="precision-kd-kpi-grid">
      {/* Card 1: Hôm Qua (Yesterday) */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Hôm Qua (Yesterday)</span>
          <div className="kpi-amount">
            ${yAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-meta">
            <span>Giao: <strong className="qty-val">{yQty.toLocaleString("en-US")} EA</strong></span>
            {renderGrowth(yRate)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiClock />
        </div>
      </div>

      {/* Card 2: Tuần Này (This Week) */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tuần Này (This Week)</span>
          <div className="kpi-amount">
            ${wAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-meta">
            <span>Giao: <strong className="qty-val">{wQty.toLocaleString("en-US")} EA</strong></span>
            {renderGrowth(wRate)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* Card 3: Tháng Này (This Month) */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Tháng Này (This Month)</span>
          <div className="kpi-amount">
            ${mAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-meta">
            <span>Giao: <strong className="qty-val">{mQty.toLocaleString("en-US")} EA</strong></span>
            {renderGrowth(mRate)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCalendar />
        </div>
      </div>

      {/* Card 4: Năm Nay (This Year) */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Năm Nay (This Year)</span>
          <div className="kpi-amount">
            ${yrAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-meta">
            <span>Giao: <strong className="qty-val">{yrQty.toLocaleString("en-US")} EA</strong></span>
            {renderGrowth(yrRate)}
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiAward />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionKDSummaryKpi);
