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
} from "recharts";
import { FiPieChart, FiTrendingUp, FiUsers, FiLayers, FiDownload } from "react-icons/fi";
import { SaveExcel } from "../../../api/services/excelService";
import PrecisionPostDeptPie from "./charts/PrecisionPostDeptPie";
import {
  DeptChartItem,
  TrendChartItem,
  AuthorChartItem,
  DeptMediaChartItem,
} from "./usePostManagerData";

interface Props {
  deptChartData: DeptChartItem[];
  trendChartData: TrendChartItem[];
  topAuthorsData: AuthorChartItem[];
  deptMediaData: DeptMediaChartItem[];
}

const PrecisionPostManagerCharts: React.FC<Props> = ({
  deptChartData,
  trendChartData,
  topAuthorsData,
  deptMediaData,
}) => {
  return (
    <div className="precision-postmanager__chartsSection">
      {/* Cặp Biểu Đồ 1: Cơ Cấu Phòng Ban & Xu Hướng Tháng */}
      <div className="two-col-grid">
        {/* Biểu Đồ 1: Donut Đa Chế Độ */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#0284c7" />
              <span className="executive-card__title">Cơ Cấu Bài Đăng Theo Phòng Ban</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(deptChartData, "CoCau_PhongBan")}
              title="Xuất Excel cơ cấu phòng ban"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <PrecisionPostDeptPie data={deptChartData} />
          </div>
        </div>

        {/* Biểu Đồ 2: Xu Hướng Phát Hành Theo Tháng (ComposedChart) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#10b981" />
              <span className="executive-card__title">Xu Hướng Phát Hành Tin Theo Tháng</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(trendChartData, "XuHuong_TheoThang")}
              title="Xuất Excel xu hướng phát hành"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trendChartData}
                margin={{ top: 15, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "8px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "11px",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                            Tháng: {label}
                          </div>
                          <div style={{ color: "#0284c7" }}>
                            Số bài mới: <strong>{payload[0]?.value} bài</strong>
                          </div>
                          <div style={{ color: "#10b981" }}>
                            Lũy kế: <strong>{payload[1]?.value} bài</strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Số Bài Mới"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  name="Lũy Kế Tích Lũy"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 1.5, stroke: "#ffffff" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Top Tác Giả & Phân Bổ Định Dạng */}
      <div className="two-col-grid">
        {/* Biểu Đồ 3: Top Tác Giả Đóng Góp */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#8b5cf6" />
              <span className="executive-card__title">Top Tác Giả Đóng Góp Bài Viết Hàng Đầu</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(topAuthorsData, "Top_TacGia")}
              title="Xuất Excel danh sách tác giả"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topAuthorsData}
                layout="vertical"
                margin={{ top: 10, right: 30, bottom: 10, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="author"
                  tick={{ fontSize: 11, fill: "#334155", fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "8px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "11px",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>Tác giả: {d.author}</div>
                          <div style={{ color: "#8b5cf6", fontWeight: 600 }}>
                            Tổng số bài: {d.total}
                          </div>
                          <div style={{ color: "#0284c7" }}>Kèm hình ảnh: {d.mediaCount}</div>
                          <div style={{ color: "#64748b" }}>Chỉ văn bản: {d.textCount}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" name="Số bài viết" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu Đồ 4: Phân Bổ Định Dạng (Ảnh vs Văn Bản vs Ghim) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiLayers size={13} color="#f59e0b" />
              <span className="executive-card__title">Phân Bổ Định Dạng Tin Theo Bộ Phận</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(deptMediaData, "PhanBo_DinhDang")}
              title="Xuất Excel phân bổ định dạng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deptMediaData}
                margin={{ top: 15, right: 15, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "8px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "11px",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                            {label}
                          </div>
                          <div style={{ color: "#0284c7" }}>Có hình ảnh: {payload[0]?.value} bài</div>
                          <div style={{ color: "#94a3b8" }}>Chỉ văn bản: {payload[1]?.value} bài</div>
                          <div style={{ color: "#f59e0b" }}>Ghim nổi bật: {payload[2]?.value} bài</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar
                  dataKey="mediaCount"
                  name="Có Ảnh"
                  stackId="a"
                  fill="#0284c7"
                  radius={[0, 0, 0, 0]}
                  barSize={22}
                />
                <Bar
                  dataKey="textCount"
                  name="Văn Bản"
                  stackId="a"
                  fill="#cbd5e1"
                  radius={[0, 0, 0, 0]}
                  barSize={22}
                />
                <Bar
                  dataKey="pinnedCount"
                  name="Tin Ghim"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostManagerCharts);
