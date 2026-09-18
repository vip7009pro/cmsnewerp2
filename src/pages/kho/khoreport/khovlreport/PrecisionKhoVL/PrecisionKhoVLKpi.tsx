import React from "react";
import {
  FiPackage, FiAlertTriangle, FiXCircle, FiTrendingUp,
  FiTrendingDown, FiActivity,
} from "react-icons/fi";
import {
  MSTOCK_BY_POPULAR_DATA,
  M_INPUT_BY_POPULAR_DATA,
} from "../../../../interfaces/khoInterface";

interface PrecisionKhoVLKpiProps {
  stockPopular: MSTOCK_BY_POPULAR_DATA[];
  inputPopular: M_INPUT_BY_POPULAR_DATA[];
}

const PrecisionKhoVLKpi: React.FC<PrecisionKhoVLKpiProps> = ({
  stockPopular,
  inputPopular,
}) => {
  // Tính tổng tồn theo phân loại
  const stockA = stockPopular.find((d) => d.PHANLOAI === "A")?.TOTAL_STOCK ?? 0;
  const stockB = stockPopular.find((d) => d.PHANLOAI === "B")?.TOTAL_STOCK ?? 0;
  const stockC = stockPopular.find((d) => d.PHANLOAI === "C")?.TOTAL_STOCK ?? 0;
  const totalIn = inputPopular.reduce((sum, d) => sum + (d.IN_SQM || 0), 0);
  const totalStock = stockA + stockB + stockC;
  const rateA = totalStock > 0 ? (stockA / totalStock) * 100 : 0;
  const rateC = totalStock > 0 ? (stockC / totalStock) * 100 : 0;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const cards = [
    {
      label: "Tồn Liệu Thông Dụng (A)",
      note: "SQM > 5,000 m²",
      amount: fmt(stockA) + " m²",
      meta: `${rateA.toFixed(1)}% tổng tồn`,
      color: "emerald",
      icon: <FiPackage size={16} />,
      trend: rateA >= 50 ? "up" : "down",
      trendLabel: rateA >= 50 ? "Khỏe mạnh" : "Cần chú ý",
    },
    {
      label: "Tồn Ít Thông Dụng (B)",
      note: "500 m² < SQM ≤ 5,000 m²",
      amount: fmt(stockB) + " m²",
      meta: totalStock > 0 ? `${((stockB / totalStock) * 100).toFixed(1)}% tổng tồn` : "—",
      color: "amber",
      icon: <FiAlertTriangle size={16} />,
      trend: null,
      trendLabel: "",
    },
    {
      label: "Tồn Xấu (C)",
      note: "SQM ≤ 500 m²",
      amount: fmt(stockC) + " m²",
      meta: `${rateC.toFixed(1)}% tổng tồn`,
      color: "rose",
      icon: <FiXCircle size={16} />,
      trend: rateC > 30 ? "down" : "up",
      trendLabel: rateC > 30 ? "Cảnh báo" : "Bình thường",
    },
    {
      label: "Tổng Input Kỳ Này",
      note: "Tổng nhập liệu kỳ báo cáo",
      amount: fmt(totalIn) + " m²",
      meta: `A+B+C: ${inputPopular.length} nhóm`,
      color: "blue",
      icon: <FiActivity size={16} />,
      trend: totalIn > 0 ? "up" : null,
      trendLabel: "Đang nhập",
    },
  ] as const;

  return (
    <section className="precision-khovl__kpi-grid">
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

export default React.memo(PrecisionKhoVLKpi);
