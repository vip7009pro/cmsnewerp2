import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from "recharts";
import {
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiDownload,
  FiLayers,
} from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  TopDefectChartData,
  ProcessDistChartData,
  CreationTrendChartData,
  TopModelChartData,
  ENTERPRISE_CHART_COLORS,
} from "./mainDefectsHelpers";

const renderChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", color: "#f8fafc", padding: "6px 10px", borderRadius: 6, fontSize: "11px", border: "1px solid #334155" }}>
      <div style={{ fontWeight: 700, marginBottom: 3, color: "#93c5fd" }}>{label}</div>
      {payload.map((p: any, idx: number) => (
        <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <span style={{ color: p.color || "#cbd5e1" }}>{p.name}:</span>
          <strong style={{ fontFamily: "JetBrains Mono" }}>{p.value?.toLocaleString("en-US")}</strong>
        </div>
      ))}
    </div>
  );
};

interface PrecisionMainDefectsChartsProps {
  top10Defects: TopDefectChartData[];
  processDistribution: ProcessDistChartData[];
  creationTrend: CreationTrendChartData[];
  top10Models: TopModelChartData[];
}

const PrecisionMainDefectsCharts: React.FC<PrecisionMainDefectsChartsProps> = ({
  top10Defects,
  processDistribution,
  creationTrend,
  top10Models,
}) => {
  return (
    <div className="precision-maindefects__chartsSection">
      {/* Cặp Biểu Đồ 1: Top 10 Lỗi & Cơ Cấu Công Đoạn */}
      <div className="two-col-grid">
        {/* Biểu đồ 1: Top 10 Lỗi Phổ Biến */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#2563eb" />
              <span className="executive-card__title">Top 10 Hạng Mục Lỗi Phổ Biến Nhất</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(top10Defects, "Top10Defects")}
              title="Xuất Excel dữ liệu top 10 lỗi"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top10Defects}
                margin={{ top: 10, right: 15, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="DEFECT"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  tick={{ fontSize: 9.5, fill: "#475569" }}
                  height={40}
                />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10.5px", paddingBottom: "4px" }}
                />
                <Bar dataKey="COUNT" name="Số Tiêu Chuẩn" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="PRODUCTS" name="Số Mã Hàng" fill="#059669" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Phân Bổ Theo Công Đoạn (Donut Chart) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#7c3aed" />
              <span className="executive-card__title">Cơ Cấu Tiêu Chuẩn Theo Công Đoạn</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(processDistribution, "ProcessDistribution")}
              title="Xuất Excel phân bổ công đoạn"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} tiêu chuẩn (${item?.payload?.percent || 0}%)`,
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10.5px", paddingTop: "4px" }}
                />
                <Pie
                  data={processDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {processDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ENTERPRISE_CHART_COLORS[index % ENTERPRISE_CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Xu Hướng Thiết Lập & Top Models */}
      <div className="two-col-grid">
        {/* Biểu đồ 3: Xu Hướng Thiết Lập Theo Thời Gian */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#059669" />
              <span className="executive-card__title">Xu Hướng Chuẩn Hóa Lỗi Theo Tháng</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(creationTrend, "CreationTrend")}
              title="Xuất Excel xu hướng thiết lập"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={creationTrend}
                margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="PERIOD"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  height={25}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  allowDecimals={false}
                />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10.5px", paddingBottom: "4px" }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="NEW_STANDARDS"
                  name="Tạo Mới Trong Tháng"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="TOTAL_CUMULATIVE"
                  name="Lũy Kế Tích Lũy"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 4: Top 10 Model Có Nhiều Tiêu Chuẩn Nhất */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiLayers size={13} color="#d97706" />
              <span className="executive-card__title">Top 10 Model Có Nhiều Quy Chuẩn Nhất</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(top10Models, "Top10Models")}
              title="Xuất Excel top 10 models"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top10Models}
                margin={{ top: 10, right: 15, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="PROD_MODEL"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  tick={{ fontSize: 9.5, fill: "#475569" }}
                  height={40}
                />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip content={renderChartTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10.5px", paddingBottom: "4px" }}
                />
                <Bar
                  dataKey="ACTIVE"
                  name="Đang Dùng (Y)"
                  stackId="modelStack"
                  fill="#059669"
                />
                <Bar
                  dataKey="INACTIVE"
                  name="Tạm Dừng (N)"
                  stackId="modelStack"
                  fill="#94a3b8"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsCharts);
