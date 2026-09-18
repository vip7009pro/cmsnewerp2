import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiTrendingUp,
  FiAward,
  FiPieChart,
  FiBarChart2,
  FiDownload,
} from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  KpiTrendDataPoint,
  TopEmplMetData,
  RateDistData,
  TopEmplQtyData,
} from "./kpiNvSxHelpers";

const renderChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e293b",
        color: "#f8fafc",
        padding: "7px 11px",
        borderRadius: 6,
        fontSize: "11px",
        border: "1px solid #334155",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, color: "#93c5fd" }}>{label}</div>
      {payload.map((p: any, idx: number) => (
        <div
          key={idx}
          style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}
        >
          <span style={{ color: p.color || "#cbd5e1" }}>{p.name}:</span>
          <strong style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {p.value?.toLocaleString("en-US")} {p.unit || ""}
          </strong>
        </div>
      ))}
    </div>
  );
};

interface PrecisionKpiNvSxChartsProps {
  periodTrendData: KpiTrendDataPoint[];
  topEmplMetData: TopEmplMetData[];
  rateDistData: RateDistData[];
  topEmplQtyData: TopEmplQtyData[];
  option: string;
}

const PrecisionKpiNvSxCharts: React.FC<PrecisionKpiNvSxChartsProps> = ({
  periodTrendData,
  topEmplMetData,
  rateDistData,
  topEmplQtyData,
  option,
}) => {
  return (
    <div className="precision-kpinvsx__chartsSection">
      {/* Cặp Biểu Đồ 1: Xu Hướng Theo Chu Kỳ & Top 10 Nhân Viên Sản Lượng Mét */}
      <div className="two-col-grid">
        {/* Biểu đồ 1: Tiến Độ Hoàn Thành & Sản Lượng Theo Thời Gian */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={14} color="#2563eb" />
              <span className="executive-card__title">
                Xu Hướng Sản Lượng Mét & Tỷ Lệ Hoàn Thành ({option})
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(periodTrendData, `KPI_Trend_${option}`)}
              title="Xuất Excel dữ liệu xu hướng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={periodTrendData} margin={{ top: 10, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10.5, fill: "#64748b" }} />
                <YAxis
                  yAxisId="left-axis"
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <YAxis
                  yAxisId="right-axis"
                  orientation="right"
                  domain={[0, (dataMax: number) => Math.max(120, Math.ceil(dataMax * 1.1))]}
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
                />
                <Bar
                  yAxisId="left-axis"
                  dataKey="outputMetTt"
                  name="Mét Thực Tế (m)"
                  fill="#3b82f6"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  yAxisId="left-axis"
                  type="monotone"
                  dataKey="planMet"
                  name="Mét Kế Hoạch (m)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2.5 }}
                />
                <Line
                  yAxisId="right-axis"
                  type="monotone"
                  dataKey="avgRateM"
                  name="Tỷ Lệ Đạt (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Top 10 Nhân Viên Có Sản Lượng Mét Cao Nhất */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAward size={14} color="#059669" />
              <span className="executive-card__title">Top 10 Nhân Viên Sản Lượng Mét Cao Nhất</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(topEmplMetData, "Top10_Empl_Met")}
              title="Xuất Excel dữ liệu top nhân viên"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topEmplMetData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="empl" tick={{ fontSize: 10.5, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
                />
                <Bar
                  dataKey="outputMetTt"
                  name="Mét Thực Tế (m)"
                  fill="#059669"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="planMet"
                  name="Mét Kế Hoạch (m)"
                  fill="#cbd5e1"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Cơ Cấu Phân Bổ Tỷ Lệ Đạt KPI & So Sánh Sản Lượng Con EA */}
      <div className="two-col-grid">
        {/* Biểu đồ 3: Cơ Cấu Phân Bổ Tỷ Lệ Đạt KPI Nhân Viên */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={14} color="#7c3aed" />
              <span className="executive-card__title">Cơ Cấu Phân Bổ Tỷ Lệ Đạt KPI Nhân Viên</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(rateDistData, "Rate_Distribution")}
              title="Xuất Excel dữ liệu phân bổ KPI"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--donut">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={rateDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                >
                  {rateDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} lượt (${item.payload.percentage}%)`,
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 4: So Sánh Sản Lượng Con EA Kế Hoạch vs Thực Tế */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={14} color="#d97706" />
              <span className="executive-card__title">So Sánh Sản Lượng Con (EA) Top Nhân Viên</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(topEmplQtyData, "Top10_Empl_Qty")}
              title="Xuất Excel dữ liệu sản lượng con"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topEmplQtyData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="empl" tick={{ fontSize: 10.5, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingBottom: 6 }}
                />
                <Bar
                  dataKey="outputEaTt"
                  name="Con Thực Tế (EA)"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="planQty"
                  name="Kế Hoạch (EA)"
                  fill="#e2e8f0"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionKpiNvSxCharts };
export default React.memo(PrecisionKpiNvSxCharts);
