import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Area,
  Line,
  ReferenceLine,
} from "recharts";
import { DailyChartItem } from "./useTinhHinhChotData";

interface PrecisionTinhHinhChotChartsProps {
  data: DailyChartItem[];
  factoryFilter: "ALL" | "NM1" | "NM2";
  onFactoryFilterChange: (factory: "ALL" | "NM1" | "NM2") => void;
  onClose?: () => void;
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.find((p: any) => p.dataKey === "TOTAL")?.value ?? 0;
    const daChot = payload.find((p: any) => p.dataKey === "DA_CHOT")?.value ?? 0;
    const chuaChot = payload.find((p: any) => p.dataKey === "CHUA_CHOT")?.value ?? 0;
    const daHS = payload.find((p: any) => p.dataKey === "DA_NHAP_HIEUSUAT")?.value ?? 0;
    const tlChot = payload.find((p: any) => p.dataKey === "TL_CHOT")?.value ?? 0;
    const tlHS = payload.find((p: any) => p.dataKey === "TL_HIEUSUAT")?.value ?? 0;

    return (
      <div className="precision-thc-tooltip">
        <div className="precision-thc-tooltip__header">
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Ngày: {label}</span>
        </div>
        <div className="precision-thc-tooltip__body">
          <div className="tooltip-row">
            <span className="dot" style={{ backgroundColor: "#94a3b8" }} />
            <span className="label">Tổng Chỉ Thị:</span>
            <span className="value font-bold">{total.toLocaleString()}</span>
          </div>
          <div className="tooltip-row">
            <span className="dot" style={{ backgroundColor: "#10b981" }} />
            <span className="label">Đã Chốt BC:</span>
            <span className="value text-emerald font-bold">{daChot.toLocaleString()}</span>
          </div>
          <div className="tooltip-row">
            <span className="dot" style={{ backgroundColor: "#ef4444" }} />
            <span className="label">Chưa Chốt BC:</span>
            <span className="value text-red font-bold">{chuaChot.toLocaleString()}</span>
          </div>
          <div className="tooltip-row">
            <span className="dot" style={{ backgroundColor: "#06b6d4" }} />
            <span className="label">Đã Nhập HS:</span>
            <span className="value text-cyan font-bold">{daHS.toLocaleString()}</span>
          </div>
          <div className="tooltip-divider" />
          <div className="tooltip-row">
            <span className="label">Tỷ Lệ Chốt:</span>
            <span className="value text-emerald font-bold">{tlChot}%</span>
          </div>
          <div className="tooltip-row">
            <span className="label">Tỷ Lệ Nhập HS:</span>
            <span className="value text-cyan font-bold">{tlHS}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const PrecisionTinhHinhChotCharts: React.FC<PrecisionTinhHinhChotChartsProps> = ({
  data,
  factoryFilter,
  onFactoryFilterChange,
  onClose,
}) => {
  return (
    <div className="precision-thc-charts-container">
      {/* Header thanh điều khiển biểu đồ */}
      <div className="precision-thc-charts__header">
        <div className="precision-thc-charts__title-group">
          <span className="material-symbols-outlined icon">analytics</span>
          <span className="title">Phân Tích Xu Hướng Chốt Báo Cáo Sản Xuất Theo Ngày</span>
          <span className="tag">Realtime Executive</span>
        </div>

        <div className="precision-thc-charts__actions">
          {/* Segmented Filter Nhà Máy */}
          <div className="segmented-filter">
            <button
              type="button"
              className={`segmented-btn ${factoryFilter === "ALL" ? "active" : ""}`}
              onClick={() => onFactoryFilterChange("ALL")}
            >
              Hợp Nhất (All)
            </button>
            <button
              type="button"
              className={`segmented-btn ${factoryFilter === "NM1" ? "active" : ""}`}
              onClick={() => onFactoryFilterChange("NM1")}
            >
              Nhà Máy 1
            </button>
            <button
              type="button"
              className={`segmented-btn ${factoryFilter === "NM2" ? "active" : ""}`}
              onClick={() => onFactoryFilterChange("NM2")}
            >
              Nhà Máy 2
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              className="btn-icon-close"
              onClick={onClose}
              title="Thu gọn biểu đồ"
            >
              <span className="material-symbols-outlined">expand_less</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid 2 Biểu Đồ */}
      <div className="precision-thc-charts__grid">
        {/* Biểu đồ 1: Sản lượng chỉ thị & chốt báo cáo */}
        <div className="chart-card">
          <div className="chart-card__header">
            <span className="chart-card__title">
              1. Khối Lượng Chỉ Thị & Tiến Độ Chốt Báo Cáo
            </span>
            <span className="chart-card__sub">
              (Bar: Tổng chỉ thị • Area: Đã chốt • Line đỏ: Chưa chốt)
            </span>
          </div>
          <div className="chart-card__body">
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={data} margin={{ top: 10, right: 12, left: -15, bottom: 4 }}>
                <defs>
                  <linearGradient id="colorDaChot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="SX_DATE"
                  tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  height={22}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  width={40}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={9}
                  wrapperStyle={{ paddingBottom: 6, fontSize: "10.5px", fontWeight: 600 }}
                />
                <Bar
                  name="Tổng Chỉ Thị"
                  dataKey="TOTAL"
                  fill="#cbd5e1"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Area
                  name="Đã Chốt BC"
                  type="monotone"
                  dataKey="DA_CHOT"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDaChot)"
                />
                <Line
                  name="Chưa Chốt"
                  type="monotone"
                  dataKey="CHUA_CHOT"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#ef4444" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Tỷ lệ hoàn thành chốt và nhập hiệu suất */}
        <div className="chart-card">
          <div className="chart-card__header">
            <span className="chart-card__title">
              2. Tỷ Lệ Hoàn Thành Chốt (%) & Nhập Hiệu Suất (%)
            </span>
            <span className="chart-card__sub">
              (Benchmark mục tiêu 100% toàn ngày)
            </span>
          </div>
          <div className="chart-card__body">
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={data} margin={{ top: 10, right: 12, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="SX_DATE"
                  tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  height={22}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickFormatter={(val) => `${val}%`}
                  width={40}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={9}
                  wrapperStyle={{ paddingBottom: 6, fontSize: "10.5px", fontWeight: 600 }}
                />
                <ReferenceLine
                  y={100}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{ value: "100%", fill: "#10b981", fontSize: 9, position: "top" }}
                />
                <Line
                  name="Tỷ Lệ Chốt (%)"
                  type="monotone"
                  dataKey="TL_CHOT"
                  stroke="#059669"
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: "#059669" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  name="Tỷ Lệ Nhập HS (%)"
                  type="monotone"
                  dataKey="TL_HIEUSUAT"
                  stroke="#0284c7"
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: "#0284c7" }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhHinhChotCharts);
