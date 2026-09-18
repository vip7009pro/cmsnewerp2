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
import PrecisionAddInfoDeptPie from "./charts/PrecisionAddInfoDeptPie";
import {
  DeptChartItem,
  TrendChartItem,
  AuthorChartItem,
  DeptMediaChartItem,
} from "./useAddInfoData";

interface Props {
  deptChartData: DeptChartItem[];
  trendChartData: TrendChartItem[];
  topAuthorsData: AuthorChartItem[];
  deptMediaData: DeptMediaChartItem[];
}

const PrecisionAddInfoCharts: React.FC<Props> = ({
  deptChartData,
  trendChartData,
  topAuthorsData,
  deptMediaData,
}) => {
  return (
    <div className="precision-addinfo__chartsSection">
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
            <PrecisionAddInfoDeptPie data={deptChartData} />
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
                  tick={{ fontSize: 11, fill: "#10b981" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Số Bài Mới Trong Tháng"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  name="Lũy Kế Toàn Hệ Thống"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Top Tác Giả & Phân Bổ Định Dạng */}
      <div className="two-col-grid">
        {/* Biểu Đồ 3: Top Tác Giả (Stacked/Grouped BarChart) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#8b5cf6" />
              <span className="executive-card__title">Top Tác Giả Đóng Góp Bài Viết Nhiều Nhất</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(topAuthorsData, "Top_TacGia")}
              title="Xuất Excel top tác giả"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topAuthorsData}
                margin={{ top: 15, right: 15, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="author"
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="mediaCount"
                  name="Bài Có Hình Ảnh"
                  stackId="a"
                  fill="#8b5cf6"
                  radius={[0, 0, 0, 0]}
                  barSize={26}
                />
                <Bar
                  dataKey="textCount"
                  name="Bài Thuần Văn Bản"
                  stackId="a"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu Đồ 4: Phân Bổ Định Dạng Bài Viết Theo Bộ Phận */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiLayers size={13} color="#f59e0b" />
              <span className="executive-card__title">Phân Bổ Định Dạng Bài Đăng Theo Bộ Phận</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(deptMediaData, "DinhDang_PhongBan")}
              title="Xuất Excel định dạng bài đăng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
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
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "11.5px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="mediaCount"
                  name="Bài Kèm Ảnh"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="textCount"
                  name="Bài Thuần Text"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="pinnedCount"
                  name="Tin Được Ghim"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoCharts);
