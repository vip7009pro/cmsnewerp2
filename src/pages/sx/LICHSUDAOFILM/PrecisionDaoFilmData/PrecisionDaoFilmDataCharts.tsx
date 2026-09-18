import React from "react";
import {
  FiBarChart2,
  FiPieChart,
  FiCalendar,
  FiDownload,
  FiActivity,
  FiLayers,
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
import {
  TypeDistributionItem,
  TopPressItem,
  DailyTrendItem,
  FactoryStatusItem,
} from "./useDaoFilmData";

interface PrecisionDaoFilmDataChartsProps {
  typeDistributionData: TypeDistributionItem[];
  topPressData: TopPressItem[];
  dailyTrendData: DailyTrendItem[];
  factoryStatusData: FactoryStatusItem[];
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div className="custom-chart-tooltip__title">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="custom-chart-tooltip__item"
            style={{ color: entry.color || "#ffffff" }}
          >
            <span>{entry.name}:</span>
            <strong>{Number(entry.value).toLocaleString("en-US")}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PrecisionDaoFilmDataCharts: React.FC<PrecisionDaoFilmDataChartsProps> = React.memo(
  ({
    typeDistributionData,
    topPressData,
    dailyTrendData,
    factoryStatusData,
  }) => {
    return (
      <div className="precision-df-charts">
        {/* Cặp Biểu Đồ 1: Chủng Loại & So Sánh Tuổi Thọ Top 10 Dao */}
        <div className="two-col-grid" style={{ marginBottom: 10 }}>
          {/* Chart 1: Phân Bổ Chủng Loại */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiPieChart size={13} color="#0284c7" />
                <span className="executive-card__title">
                  Phân Bổ Chủng Loại Dao & Bản Phim (Type Distribution)
                </span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(typeDistributionData, "DaoFilmTypeDistribution")}
                title="Xuất Excel dữ liệu chủng loại"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              {typeDistributionData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                  Chưa có dữ liệu để hiển thị biểu đồ
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={32}
                      formatter={(val) => <span style={{ fontSize: 11, color: "#475569" }}>{val}</span>}
                    />
                    <Pie
                      data={typeDistributionData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={45}
                      outerRadius={78}
                      paddingAngle={3}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Top 10 Lượt Dập vs Định Mức */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiBarChart2 size={13} color="#10b981" />
                <span className="executive-card__title">
                  Top 10 Dao Dập Nhiều Nhất & Định Mức (Press Lifetime)
                </span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(topPressData, "DaoFilmTopPress")}
                title="Xuất Excel dữ liệu lượt dập dao"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              {topPressData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                  Chưa có dữ liệu lượt dập
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={topPressData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      tick={{ fontSize: 9.5, fill: "#64748b" }}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={24}
                      formatter={(val) => <span style={{ fontSize: 11, color: "#475569" }}>{val}</span>}
                    />
                    <Bar dataKey="totalPress" name="Lượt Dập Thực Tế" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="standardPress" name="Định Mức Chuẩn" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Cặp Biểu Đồ 2: Xu Hướng Theo Ngày & Phân Bổ Nhà Máy */}
        <div className="two-col-grid">
          {/* Chart 3: Xu Hướng Theo Ngày */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiCalendar size={13} color="#d97706" />
                <span className="executive-card__title">
                  Xu Hướng Giao Nhận & Xuất Dao Theo Ngày (Activity Trend)
                </span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(dailyTrendData, "DaoFilmDailyTrend")}
                title="Xuất Excel dữ liệu xu hướng ngày"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              {dailyTrendData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                  Chưa có dữ liệu theo ngày
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      angle={-20}
                      textAnchor="end"
                      tick={{ fontSize: 9.5, fill: "#64748b" }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={24}
                      formatter={(val) => <span style={{ fontSize: 11, color: "#475569" }}>{val}</span>}
                    />
                    <Bar yAxisId="left" dataKey="count" name="Số Lượt (Records)" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="pressCount" name="Lượt Dập (Press)" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 4: Phân Bổ Nhà Máy & Trạng Thái OK/NG */}
          <div className="executive-card">
            <div className="executive-card__header">
              <div className="executive-card__title-wrap">
                <FiActivity size={13} color="#7c3aed" />
                <span className="executive-card__title">
                  Cơ Cấu Nhà Máy & Trạng Thái Sức Khỏe Khuôn (Factory & Health)
                </span>
              </div>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(factoryStatusData, "DaoFilmFactoryStatus")}
                title="Xuất Excel dữ liệu nhà máy"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
            <div className="executive-card__body">
              {factoryStatusData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 230, color: "#94a3b8", fontSize: 12 }}>
                  Chưa có dữ liệu nhà máy
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={factoryStatusData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="factory" tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={24}
                      formatter={(val) => <span style={{ fontSize: 11, color: "#475569" }}>{val}</span>}
                    />
                    <Bar dataKey="ok" name="Trạng Thái OK" fill="#10b981" stackId="a" radius={[0, 0, 3, 3]} />
                    <Bar dataKey="ng" name="Trạng Thái NG/Khác" fill="#f43f5e" stackId="a" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataCharts;
