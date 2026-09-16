import React from "react";
import { PQC_PPM_DATA } from "../../interfaces/qcInterface";

interface PrecisionPQCReportKpiProps {
  dailyppm: PQC_PPM_DATA[];
  weeklyppm: PQC_PPM_DATA[];
  monthlyppm: PQC_PPM_DATA[];
  yearlyppm: PQC_PPM_DATA[];
}

export const PrecisionPQCReportKpi: React.FC<PrecisionPQCReportKpiProps> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  const cards = [
    {
      title: "Hôm Nay (Today NG)",
      badge: "Hôm Nay",
      color: "blue",
      rate: dailyppm[0]?.NG_RATE ?? 0,
      processRate: dailyppm[0]?.NG_RATE ?? 0,
      materialRate: dailyppm[0]?.NG_RATE ?? 0,
    },
    {
      title: "Tuần Này (This Week NG)",
      badge: "Tuần Này",
      color: "emerald",
      rate: weeklyppm[0]?.NG_RATE ?? 0,
      processRate: weeklyppm[0]?.NG_RATE ?? 0,
      materialRate: weeklyppm[0]?.NG_RATE ?? 0,
    },
    {
      title: "Tháng Này (This Month NG)",
      badge: "Tháng Này",
      color: "amber",
      rate: monthlyppm[0]?.NG_RATE ?? 0,
      processRate: monthlyppm[0]?.NG_RATE ?? 0,
      materialRate: monthlyppm[0]?.NG_RATE ?? 0,
    },
    {
      title: "Năm Nay (This Year NG)",
      badge: "Năm Nay",
      color: "rose",
      rate: yearlyppm[0]?.NG_RATE ?? 0,
      processRate: yearlyppm[0]?.NG_RATE ?? 0,
      materialRate: yearlyppm[0]?.NG_RATE ?? 0,
    },
  ];

  const formatPercent = (val: number) => {
    return (val || 0).toLocaleString("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="precision-pqc-kpis">
      {cards.map((card, idx) => (
        <div key={idx} className={`kpi-card ${card.color}`}>
          <div className="kpi-header-row">
            <span className="kpi-title">{card.title}</span>
            <span className="kpi-badge">{card.badge}</span>
          </div>
          <div className="kpi-main-stat">{formatPercent(card.rate)}</div>
          <div className="kpi-breakdown-row">
            <div className="stat-item">
              <span>Công đoạn:</span>
              <span className="val">{formatPercent(card.processRate)}</span>
            </div>
            <div className="stat-item">
              <span>Vật liệu:</span>
              <span className="val">{formatPercent(card.materialRate)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(PrecisionPQCReportKpi);
