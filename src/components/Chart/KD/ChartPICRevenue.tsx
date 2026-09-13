import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { PIC_REVENUE_DATA } from "../../../pages/kinhdoanh/interfaces/kdInterface";

const ENTERPRISE_PALETTE = [
  "#0284c7", "#10b981", "#7c3aed", "#f59e0b", "#e11d48", "#2563eb",
  "#059669", "#d97706", "#9333ea", "#0891b2", "#ea580c", "#4f46e5",
  "#16a34a", "#ca8a04", "#be123c", "#0d9488", "#475569", "#6366f1",
  "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#84cc16", "#f97316",
  "#6b7280", "#a855f7", "#22c55e", "#eab308",
];

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

interface ChartPICRevenueProps {
  data: PIC_REVENUE_DATA[];
}

const ChartPICRevenue: React.FC<ChartPICRevenueProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Sắp xếp dữ liệu giảm dần theo DELIVERY_AMOUNT
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.DELIVERY_AMOUNT || 0) - (a.DELIVERY_AMOUNT || 0));
  }, [data]);

  const totalRevenue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.DELIVERY_AMOUNT || 0), 0);
  }, [sortedData]);

  // Lọc theo từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter(
      (item) =>
        item.EMPL_NAME?.toLowerCase().includes(term) ||
        (item as any).EMPL_NO?.toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  // Callout labels cho lát cắt >= 3.5% (chống xén mép)
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index, name, value } = props;
    if (percent < 0.035) return null;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 2) * cos;
    const sy = cy + (outerRadius + 2) * sin;
    const mx = cx + (outerRadius + 11) * cos;
    const my = cy + (outerRadius + 11) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const color = ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length];
    const displayName = name && name.length > 11 ? `${name.slice(0, 10)}…` : name;

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
          {`${displayName}: $${formatCompact(value)}`}
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
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 7}
          outerRadius={outerRadius + 9}
          fill={fill}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = totalRevenue > 0 ? ((item.DELIVERY_AMOUNT / totalRevenue) * 100).toFixed(1) : "0";
      return (
        <div className="po-cust-tooltip">
          <div className="po-cust-tooltip__title">{item.EMPL_NAME}</div>
          <div className="po-cust-tooltip__row">
            <span className="label">Doanh Thu:</span>
            <span className="value">
              ${item.DELIVERY_AMOUNT?.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="po-cust-tooltip__row">
            <span className="label">Tỷ Trọng:</span>
            <span className="badge">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const activePIC = activeIndex !== null ? sortedData[activeIndex] : null;

  return (
    <div className="po-customer-chart">
      {/* Thanh Điều Khiển Chế Độ Xem */}
      <div className="po-customer-chart__controls">
        <div className="po-customer-chart__stat-pill">
          <span>Doanh Thu PIC:</span>
          <strong>${formatCompact(totalRevenue)}</strong>
          <span className="dot">•</span>
          <span>{sortedData.length} Nhân Sự</span>
        </div>

        <div className="po-customer-chart__view-btns">
          <button
            type="button"
            className={`view-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Xem song song Biểu đồ & Bảng dữ liệu"
          >
            <FiColumns size={11} />
            <span>Song Song</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "chart" ? "active" : ""}`}
            onClick={() => setViewMode("chart")}
            title="Xem biểu đồ tròn toàn khung"
          >
            <FiPieChart size={11} />
            <span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="Xem danh sách chi tiết toàn bộ nhân sự PIC"
          >
            <FiList size={11} />
            <span>Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Nội Dung Chính Theo Mode */}
      <div className="po-customer-chart__content">
        {/* Phân Hệ Biểu Đồ Tròn / Donut */}
        {viewMode !== "list" && (
          <div className={`po-customer-chart__donut-pane ${viewMode === "chart" ? "full" : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={sortedData}
                  dataKey="DELIVERY_AMOUNT"
                  nameKey="EMPL_NAME"
                  isAnimationActive={false}
                  cx="50%"
                  cy="50%"
                  innerRadius={viewMode === "chart" ? 60 : 46}
                  outerRadius={viewMode === "chart" ? 100 : 76}
                  paddingAngle={1}
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {sortedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Tâm Donut Thống Kê Nổi Bật */}
            <div className="po-donut-center">
              <span className="po-donut-center__label">
                {activePIC ? activePIC.EMPL_NAME : "DOANH THU PIC"}
              </span>
              <span className="po-donut-center__value">
                ${activePIC
                  ? formatCompact(activePIC.DELIVERY_AMOUNT)
                  : formatCompact(totalRevenue)}
              </span>
              <span className="po-donut-center__unit">
                {activePIC
                  ? `${((activePIC.DELIVERY_AMOUNT / (totalRevenue || 1)) * 100).toFixed(1)}%`
                  : "USD"}
              </span>
            </div>
          </div>
        )}

        {/* Phân Hệ Bảng Dữ Liệu Chi Tiết */}
        {viewMode !== "chart" && (
          <div className={`po-customer-chart__list-pane ${viewMode === "list" ? "full" : ""}`}>
            {/* Search Bar */}
            <div className="po-cust-search">
              <FiSearch size={12} className="po-cust-search__icon" />
              <input
                type="text"
                placeholder="Tìm nhanh nhân sự phụ trách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="po-cust-search__clear"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>

            {/* Header Danh Sách */}
            <div className="po-cust-table-header">
              <span className="col-rank">#</span>
              <span className="col-name">Nhân Sự PIC</span>
              <span className="col-balance">Doanh Thu ($)</span>
              <span className="col-share">Tỷ Trọng</span>
            </div>

            {/* Danh Sách Cuộn */}
            <div className="po-cust-table-body">
              {filteredData.length === 0 ? (
                <div className="po-cust-empty">Không tìm thấy nhân sự phù hợp</div>
              ) : (
                filteredData.map((item, idx) => {
                  const originalIndex = sortedData.findIndex(
                    (s) => s.EMPL_NAME === item.EMPL_NAME
                  );
                  const color = ENTERPRISE_PALETTE[originalIndex % ENTERPRISE_PALETTE.length];
                  const pct = totalRevenue > 0 ? ((item.DELIVERY_AMOUNT / totalRevenue) * 100).toFixed(1) : "0";
                  const isHovered = activeIndex === originalIndex;

                  return (
                    <div
                      key={`pic-row-${idx}`}
                      className={`po-cust-row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => setActiveIndex(originalIndex)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${originalIndex + 1}`}>
                        {originalIndex + 1}
                      </span>
                      <div className="col-name">
                        <span className="color-dot" style={{ backgroundColor: color }} />
                        <span className="name-text" title={item.EMPL_NAME}>
                          {item.EMPL_NAME}
                        </span>
                      </div>
                      <span className="col-balance">
                        ${item.DELIVERY_AMOUNT?.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                      <div className="col-share">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="pct-text">{pct}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChartPICRevenue);
