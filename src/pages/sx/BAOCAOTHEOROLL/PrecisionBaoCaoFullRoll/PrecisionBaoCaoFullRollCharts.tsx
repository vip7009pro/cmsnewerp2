import React from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiPieChart,
  FiDownload,
  FiTrendingUp,
} from "react-icons/fi";
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
import { SaveExcel } from "../../../../api/services/excelService";

interface DailyTrendItem {
  date: string;
  input_met: number;
  used_met: number;
  result_met: number;
  setting_met: number;
  ng_met: number;
}

interface TopProductItem {
  name: string;
  used_met: number;
  result_ea: number;
}

interface MaterialBreakdownItem {
  name: string;
  value: number;
  color: string;
}

interface PrecisionBaoCaoFullRollChartsProps {
  dailyTrendData: DailyTrendItem[];
  topProductsData: TopProductItem[];
  materialBreakdownData: MaterialBreakdownItem[];
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div className="custom-chart-tooltip__title">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="custom-chart-tooltip__item" style={{ color: entry.color || "#0f172a" }}>
            <span>{entry.name}:</span>
            <strong>{Number(entry.value).toLocaleString("en-US")} {entry.unit || "m"}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PrecisionBaoCaoFullRollCharts: React.FC<PrecisionBaoCaoFullRollChartsProps> = ({
  dailyTrendData,
  topProductsData,
  materialBreakdownData,
}) => {
  return (
    <div className="precision-bcfr-charts">
      {/* Cặp Biểu Đồ 1: Xu hướng cấp liệu & Cơ cấu hao hụt theo ngày */}
      <div className="two-col-grid" style={{ marginBottom: 10 }}>
        {/* Chart 1: Daily Production & Material Trend */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#0284c7" />
              <span className="executive-card__title">Xu Hướng Cấp Liệu & Sản Xuất Ngày (Daily Trend)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyTrendData, "DailyMaterialTrend")}
              title="Xuất Excel dữ liệu xu hướng ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            {dailyTrendData.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                Chưa có dữ liệu để hiển thị biểu đồ
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <ComposedChart data={dailyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                  <Bar dataKey="input_met" name="Liệu Nhập" fill="#38bdf8" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="used_met" name="Đã Dùng" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Line type="monotone" dataKey="result_met" name="Thành Phẩm OK" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Daily Production Loss Breakdown */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#f59e0b" />
              <span className="executive-card__title">Cơ Cấu Hao Hụt & Thành Phẩm Theo Ngày</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyTrendData, "DailyLossBreakdown")}
              title="Xuất Excel dữ liệu hao hụt theo ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            {dailyTrendData.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                Chưa có dữ liệu để hiển thị biểu đồ
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={dailyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                  <Bar dataKey="setting_met" name="Cân Chỉnh (Setting)" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="ng_met" name="Lỗi Công Đoạn (NG)" stackId="a" fill="#ef4444" />
                  <Bar dataKey="result_met" name="Thành Phẩm OK" stackId="a" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Top Sản Phẩm & Phân Bổ Sử Dụng Liệu */}
      <div className="two-col-grid">
        {/* Chart 3: Top 10 Products by Used Material */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#0d9488" />
              <span className="executive-card__title">Top 10 Mã Hàng Tiêu Thụ Liệu Lớn Nhất (Mét)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(topProductsData, "TopProductsUsed")}
              title="Xuất Excel top 10 sản phẩm"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            {topProductsData.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                Chưa có dữ liệu để hiển thị biểu đồ
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9.5, fill: "#334155" }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="used_met" name="Mét Đã Dùng" fill="#0284c7" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Material Utilization Breakdown (Donut Chart) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#7c3aed" />
              <span className="executive-card__title">Phân Bổ Tỷ Trọng Sử Dụng Liệu (Material Utilization)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(materialBreakdownData, "MaterialBreakdown")}
              title="Xuất Excel cơ cấu sử dụng liệu"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {materialBreakdownData.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                Chưa có dữ liệu để hiển thị biểu đồ
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={materialBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {materialBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [
                      `${Number(val).toLocaleString("en-US")} m`,
                      "Số Lượng",
                    ]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollCharts);
export { PrecisionBaoCaoFullRollCharts };
