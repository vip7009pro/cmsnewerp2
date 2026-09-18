import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { DeptChartItem } from "../usePostManagerData";

const PALETTE = [
  "#0284c7", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4",
  "#f97316", "#6366f1", "#84cc16", "#14b8a6", "#3b82f6", "#d97706",
  "#e11d48", "#475569", "#a855f7", "#059669",
];

interface Props {
  data: DeptChartItem[];
}

const PrecisionPostDeptPie: React.FC<Props> = ({ data }) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) => item.name?.toLowerCase().includes(term));
  }, [data, searchTerm]);

  // Callout labels cho mode chart
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index, name, value } = props;
    if (percent < 0.04) return null;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 2) * cos;
    const sy = cy + (outerRadius + 2) * sin;
    const mx = cx + (outerRadius + 12) * cos;
    const my = cy + (outerRadius + 12) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const color = PALETTE[index % PALETTE.length];
    const displayName = name && name.length > 12 ? `${name.slice(0, 11)}…` : name;

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none" strokeWidth={1.2} />
        <circle cx={ex} cy={ey} r={2} fill={color} />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 3}
          y={ey}
          textAnchor={textAnchor}
          fill="#1e293b"
          dominantBaseline="central"
          fontSize={10}
          fontWeight={700}
        >
          {displayName} ({value})
        </text>
      </g>
    );
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const activeItem = activeIndex !== null && filteredData[activeIndex] ? filteredData[activeIndex] : null;

  return (
    <div className="po-customer-chart">
      {/* 1. Header Controls (Segmented Modes & Quick Search) */}
      <div className="po-customer-chart__controls">
        <div className="po-customer-chart__segmented">
          <button
            type="button"
            className={viewMode === "split" ? "active" : ""}
            onClick={() => setViewMode("split")}
            title="Xem song song Donut & Bảng danh sách"
          >
            <FiColumns size={11} />
            <span>Song Song</span>
          </button>
          <button
            type="button"
            className={viewMode === "chart" ? "active" : ""}
            onClick={() => setViewMode("chart")}
            title="Phóng to Biểu đồ tròn"
          >
            <FiPieChart size={11} />
            <span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
            title="Xem danh sách chi tiết"
          >
            <FiList size={11} />
            <span>Danh Sách</span>
          </button>
        </div>

        <div className="po-customer-chart__search">
          <FiSearch size={11} color="#94a3b8" />
          <input
            type="text"
            placeholder="Lọc phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Chart / List Body */}
      <div className={`po-customer-chart__content po-customer-chart__content--${viewMode}`}>
        {/* Vùng Donut Chart */}
        {viewMode !== "list" && (
          <div className="po-customer-chart__left">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={viewMode === "split" ? 54 : 70}
                  outerRadius={viewMode === "split" ? 82 : 110}
                  paddingAngle={2}
                  dataKey="value"
                  label={viewMode === "chart" ? renderCustomizedLabel : false}
                  labelLine={false}
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                >
                  {filteredData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "6px 10px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            fontSize: "11px",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{d.name}</div>
                          <div style={{ color: "#0284c7", fontWeight: 600 }}>
                            {d.value} bài ({d.pct}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Tâm Donut Thống Kê Tổng & Trạng Thái Hover */}
            <div className="po-customer-chart__center-label">
              <div className="val">
                {activeItem ? activeItem.value : total}
              </div>
              <div className="lbl" title={activeItem ? activeItem.name : "TỔNG SỐ BÀI"}>
                {activeItem ? activeItem.name : "TỔNG BÀI"}
              </div>
              {activeItem && (
                <div className="pct">{activeItem.pct}%</div>
              )}
            </div>
          </div>
        )}

        {/* Vùng Bảng Danh Sách Phân Bổ Tỷ Trọng */}
        {viewMode !== "chart" && (
          <div
            className="po-customer-chart__right"
            style={{ width: viewMode === "list" ? "100%" : undefined }}
          >
            {filteredData.map((item, index) => {
              const color = PALETTE[index % PALETTE.length];
              const isHovered = activeIndex === index;
              return (
                <div
                  key={item.code || index}
                  className="row-item"
                  style={{
                    borderColor: isHovered ? color : undefined,
                    background: isHovered ? "#f1f5f9" : undefined,
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="name-box">
                    <span className="dot" style={{ background: color }} />
                    <span className="name" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="val-box">
                    <span className="num">{item.value} bài</span>
                    <span className="share">{item.pct}%</span>
                  </div>
                </div>
              );
            })}

            {filteredData.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "11px" }}>
                Không có dữ liệu phòng ban
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostDeptPie);
