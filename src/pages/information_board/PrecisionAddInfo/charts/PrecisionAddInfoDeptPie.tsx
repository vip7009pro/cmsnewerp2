import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { DeptChartItem } from "../useAddInfoData";

const PALETTE = [
  "#0284c7", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4",
  "#f97316", "#6366f1", "#84cc16", "#14b8a6", "#3b82f6", "#d97706",
  "#e11d48", "#475569", "#a855f7", "#059669",
];

interface Props {
  data: DeptChartItem[];
}

const PrecisionAddInfoDeptPie: React.FC<Props> = ({ data }) => {
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
          {`${displayName}: ${value}`}
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
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 8}
          fill={fill}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={{ background: "#ffffff", padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
            Số bài: <strong>{item.value}</strong> ({item.pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="po-customer-chart">
      {/* Controls */}
      <div className="po-customer-chart__controls">
        <div className="po-customer-chart__stat-pill">
          <span>Tổng:</span>
          <strong>{total} bài</strong>
          <span className="dot">•</span>
          <span>{data.length} phòng ban</span>
        </div>

        <div className="po-customer-chart__view-toggle">
          <button
            type="button"
            className={`po-customer-chart__toggle-btn ${viewMode === "split" ? "is-active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Xem Song Song (Biểu Đồ & Bảng Tỷ Trọng)"
          >
            <FiColumns size={11} />
            <span>Song Song</span>
          </button>
          <button
            type="button"
            className={`po-customer-chart__toggle-btn ${viewMode === "chart" ? "is-active" : ""}`}
            onClick={() => setViewMode("chart")}
            title="Xem Toàn Khung Biểu Đồ"
          >
            <FiPieChart size={11} />
            <span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={`po-customer-chart__toggle-btn ${viewMode === "list" ? "is-active" : ""}`}
            onClick={() => setViewMode("list")}
            title="Xem Danh Sách Chi Tiết"
          >
            <FiList size={11} />
            <span>Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Main Views */}
      {viewMode === "split" && (
        <div className="po-customer-chart__split-layout">
          <div className="po-customer-chart__chart-side">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="po-donut-center">
              <span className="title">{activeItem ? activeItem.name : "TỔNG SỐ"}</span>
              <span className="value">{activeItem ? activeItem.value : total}</span>
              <span className="pct">{activeItem ? `${activeItem.pct}%` : "100%"}</span>
            </div>
          </div>

          <div className="po-customer-chart__list-side">
            <div className="po-cust-search">
              <FiSearch size={11} color="#94a3b8" />
              <input
                type="text"
                placeholder="Lọc phòng ban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="po-cust-list">
              {filteredData.map((item, idx) => {
                const color = PALETTE[idx % PALETTE.length];
                return (
                  <div
                    key={idx}
                    className={`po-cust-row ${activeIndex === idx ? "is-selected" : ""}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="left-wrap">
                      <span className="color-dot" style={{ background: color }} />
                      <span className="name" title={item.name}>{item.name}</span>
                    </div>
                    <div className="right-wrap">
                      <span className="val">{item.value}</span>
                      <div className="share-bar">
                        <div className="fill" style={{ width: `${item.pct}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === "chart" && (
        <div style={{ width: "100%", height: "calc(100% - 36px)", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={2}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="po-donut-center">
            <span className="title">{activeItem ? activeItem.name : "TỔNG SỐ"}</span>
            <span className="value">{activeItem ? activeItem.value : total}</span>
            <span className="pct">{activeItem ? `${activeItem.pct}%` : "100%"}</span>
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div style={{ width: "100%", height: "calc(100% - 36px)", display: "flex", flexDirection: "column" }}>
          <div className="po-cust-search" style={{ marginBottom: "8px" }}>
            <FiSearch size={11} color="#94a3b8" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="po-cust-list">
            {filteredData.map((item, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              return (
                <div key={idx} className="po-cust-row">
                  <div className="left-wrap">
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", width: "18px" }}>#{idx + 1}</span>
                    <span className="color-dot" style={{ background: color }} />
                    <span className="name">{item.name}</span>
                  </div>
                  <div className="right-wrap">
                    <span className="val">{item.value} bài ({item.pct}%)</span>
                    <div className="share-bar" style={{ width: "50px" }}>
                      <div className="fill" style={{ width: `${item.pct}%`, background: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionAddInfoDeptPie);
