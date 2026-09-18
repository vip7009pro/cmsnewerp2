import React from "react";
import {
  FiCheckCircle, FiAlertTriangle, FiXCircle, FiLayers,
  FiTrendingUp, FiTrendingDown,
} from "react-icons/fi";
import { P_STOCK_BY_MONTH_DATA } from "../../../../interfaces/khoInterface";

interface PrecisionKhoTPKpiProps {
  stockMonth: P_STOCK_BY_MONTH_DATA[];
  moc1: number;
  moc2: number;
}

const PrecisionKhoTPKpi: React.FC<PrecisionKhoTPKpiProps> = ({ stockMonth, moc1, moc2 }) => {
  const stockA = stockMonth.find((d) => d.PHANLOAI === "A")?.TOTAL_STOCK ?? 0;
  const stockB = stockMonth.find((d) => d.PHANLOAI === "B")?.TOTAL_STOCK ?? 0;
  const stockC = stockMonth.find((d) => d.PHANLOAI === "C")?.TOTAL_STOCK ?? 0;
  const total = stockA + stockB + stockC;
  const rateA = total > 0 ? (stockA / total) * 100 : 0;
  const rateC = total > 0 ? (stockC / total) * 100 : 0;

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const cards = [
    {
      label: `Tồn TP Mới — Loại A`,
      note: `< ${moc1} tháng`,
      amount: fmt(stockA) + " EA",
      meta: `${rateA.toFixed(1)}% tổng tồn`,
      color: "emerald",
      icon: <FiCheckCircle size={16} />,
      trend: rateA >= 60 ? "up" : null,
      trendLabel: "Tốt",
    },
    {
      label: `Tồn TP Trung Hạn — Loại B`,
      note: `${moc1}–${moc2} tháng`,
      amount: fmt(stockB) + " EA",
      meta: total > 0 ? `${((stockB / total) * 100).toFixed(1)}% tổng tồn` : "—",
      color: "amber",
      icon: <FiAlertTriangle size={16} />,
      trend: null,
      trendLabel: "",
    },
    {
      label: `Tồn TP Dài Hạn — Loại C`,
      note: `> ${moc2} tháng`,
      amount: fmt(stockC) + " EA",
      meta: `${rateC.toFixed(1)}% tổng tồn`,
      color: "rose",
      icon: <FiXCircle size={16} />,
      trend: rateC > 25 ? "down" : "up",
      trendLabel: rateC > 25 ? "Cảnh báo" : "Bình thường",
    },
    {
      label: "Tổng Tồn Thành Phẩm",
      note: "A + B + C",
      amount: fmt(total) + " EA",
      meta: `${stockMonth.length} nhóm phân loại`,
      color: "violet",
      icon: <FiLayers size={16} />,
      trend: total > 0 ? "up" : null,
      trendLabel: "Đang theo dõi",
    },
  ] as const;

  return (
    <section className="precision-khotp__kpi-grid">
      {cards.map((card) => (
        <div key={card.label} className={`kpi-card kpi-card--${card.color}`}>
          <div className="kpi-info">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-amount">{card.amount}</div>
            <div className="kpi-meta">
              <span>{card.meta}</span>
              {card.trend && (
                <span className={`growth-pill growth-pill--${card.trend}`}>
                  {card.trend === "up" ? <FiTrendingUp size={9} /> : <FiTrendingDown size={9} />}
                  <span>{card.trendLabel}</span>
                </span>
              )}
            </div>
          </div>
          <div className="kpi-icon-wrap">{card.icon}</div>
        </div>
      ))}
    </section>
  );
};

export default React.memo(PrecisionKhoTPKpi);
