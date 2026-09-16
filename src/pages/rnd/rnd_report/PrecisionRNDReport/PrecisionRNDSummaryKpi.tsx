import React from "react";
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiClock,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { RNDKpiItem, RNDKpiSummary } from "./rndReportTypes";

interface SummaryKpiProps {
  kpiSummary: RNDKpiSummary;
}

export const PrecisionRNDSummaryKpi: React.FC<SummaryKpiProps> = React.memo(
  ({ kpiSummary }) => {
    const renderGrowth = (rate: number) => {
      const isUp = rate >= 0;
      return (
        <span
          className={`growth-pill ${
            isUp ? "growth-pill--up" : "growth-pill--down"
          }`}
        >
          {isUp ? <FiTrendingUp size={9} /> : <FiTrendingDown size={9} />}
          <span>{Math.abs(rate).toFixed(1)}%</span>
        </span>
      );
    };

    const renderCard = (
      title: string,
      data: RNDKpiItem,
      type: "blue" | "emerald" | "amber" | "violet",
      icon: React.ReactNode
    ) => (
      <div className={`kpi-card kpi-card--${type}`}>
        <div className="kpi-info">
          <span className="kpi-label">{title}</span>
          <div className="kpi-amount">{data.total.toLocaleString("en-US")}</div>
          <div className="kpi-meta">
            <span className="detail-code">
              New: <strong>{data.newCode}</strong> • ECN: <strong>{data.ecn}</strong>
            </span>
            {renderGrowth(data.rate)}
          </div>
        </div>
        <div className="kpi-icon-wrap">{icon}</div>
      </div>
    );

    return (
      <section className="precision-rnd-report__kpiGrid">
        {renderCard(
          "Hôm Nay (Today Code)",
          kpiSummary.today,
          "blue",
          <FiClock />
        )}
        {renderCard(
          "Tuần Này (This Week)",
          kpiSummary.thisWeek,
          "emerald",
          <FiActivity />
        )}
        {renderCard(
          "Tháng Này (This Month)",
          kpiSummary.thisMonth,
          "amber",
          <FiCalendar />
        )}
        {renderCard(
          "Năm Nay (This Year)",
          kpiSummary.thisYear,
          "violet",
          <FiAward />
        )}
      </section>
    );
  }
);

PrecisionRNDSummaryKpi.displayName = "PrecisionRNDSummaryKpi";
