import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { SX_LOSSTIME_REASON_DATA } from "../../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

const ENTERPRISE_PALETTE = [
  "#dc2626", "#ea580c", "#d97706", "#2563eb", "#059669", "#7c3aed",
  "#e11d48", "#0891b2", "#4f46e5", "#16a34a", "#9333ea", "#0284c7",
  "#ca8a04", "#be123c", "#0d9488", "#475569", "#6366f1", "#10b981",
  "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#84cc16",
];

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

interface PrecisionSxPieLossReasonProps {
  data: SX_LOSSTIME_REASON_DATA[];
}

const PrecisionSxPieLossReason: React.FC<PrecisionSxPieLossReasonProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.LOSS_TIME || 0) - (a.LOSS_TIME || 0));
  }, [data]);

  const totalTime = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.LOSS_TIME || 0), 0);
  }, [sortedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter((item) => item.REASON?.toLowerCase().includes(term));
  }, [sortedData, searchTerm]);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index, name, value } = props;
    if (percent < 0.04) return null;

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
          {`${displayName}: ${formatCompact(value)}p`}
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
      const pct = totalTime > 0 ? ((item.LOSS_TIME / totalTime) * 100).toFixed(1) : "0";
      return (
        <div className="po-cust-tooltip">
          <div className="po-cust-tooltip__title">{item.REASON}</div>
          <div className="po-cust-tooltip__row">
            <span className="label">Thời Gian:</span>
            <span className="value">{item.LOSS_TIME?.toLocaleString("en-US")} phút</span>
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

  const activeItem = activeIndex !== null ? sortedData[activeIndex] : null;

  return (
    <div className="po-customer-chart">
      {/* Controls Bar */}
      <div className="po-customer-chart__controls">
        <div className="po-customer-chart__stat-pill">
          <span>Tổng Dừng:</span>
          <strong>{formatCompact(totalTime)} phút</strong>
          <span className="dot">•</span>
          <span>{sortedData.length} Lý Do</span>
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
            title="Xem danh sách chi tiết"
          >
            <FiList size={11} />
            <span>Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="po-customer-chart__content">
        {viewMode !== "list" && (
          <div className={`po-customer-chart__donut-pane ${viewMode === "chart" ? "full" : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={sortedData}
                  dataKey="LOSS_TIME"
                  nameKey="REASON"
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

            <div className="po-donut-center">
              <span className="po-donut-center__label">
                {activeItem ? activeItem.REASON : "TỔNG DỪNG"}
              </span>
              <span className="po-donut-center__value">
                {activeItem ? formatCompact(activeItem.LOSS_TIME) : formatCompact(totalTime)}
              </span>
              <span className="po-donut-center__unit">
                {activeItem ? `${((activeItem.LOSS_TIME / (totalTime || 1)) * 100).toFixed(1)}%` : "PHÚT"}
              </span>
            </div>
          </div>
        )}

        {viewMode !== "chart" && (
          <div className={`po-customer-chart__list-pane ${viewMode === "list" ? "full" : ""}`}>
            <div className="po-cust-search">
              <FiSearch size={12} className="po-cust-search__icon" />
              <input
                type="text"
                placeholder="Tìm lý do dừng máy..."
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

            <div className="po-cust-table-header">
              <span className="col-rank">#</span>
              <span className="col-name">Lý Do Dừng</span>
              <span className="col-balance">Số Phút</span>
              <span className="col-share">Tỷ Trọng</span>
            </div>

            <div className="po-cust-table-body">
              {filteredData.length === 0 ? (
                <div className="po-cust-empty">Không có dữ liệu phù hợp</div>
              ) : (
                filteredData.map((item, idx) => {
                  const originalIndex = sortedData.findIndex((s) => s.REASON === item.REASON);
                  const color = ENTERPRISE_PALETTE[originalIndex % ENTERPRISE_PALETTE.length];
                  const pct = totalTime > 0 ? ((item.LOSS_TIME / totalTime) * 100).toFixed(1) : "0";
                  const isHovered = activeIndex === originalIndex;

                  return (
                    <div
                      key={`reason-row-${idx}`}
                      className={`po-cust-row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => setActiveIndex(originalIndex)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${originalIndex + 1}`}>
                        {originalIndex + 1}
                      </span>
                      <div className="col-name">
                        <span className="color-dot" style={{ backgroundColor: color }} />
                        <span className="name-text" title={item.REASON}>
                          {item.REASON}
                        </span>
                      </div>
                      <span className="col-balance">
                        {item.LOSS_TIME?.toLocaleString("en-US")} min
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

export default React.memo(PrecisionSxPieLossReason);
