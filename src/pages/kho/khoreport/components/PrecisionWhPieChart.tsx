import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch, FiDownload, FiInfo } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";

export interface WhPieDataItem {
  name: string;
  value: number;
  label?: string;
  color?: string;
  [key: string]: any;
}

const ENTERPRISE_PALETTE = [
  "#2563eb", // Blue
  "#059669", // Emerald
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#e11d48", // Rose
  "#0891b2", // Cyan
  "#ea580c", // Orange
  "#4f46e5", // Indigo
];

const formatCompact = (num: number, unit = "m²") => {
  if (!num || isNaN(num)) return `0 ${unit}`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M ${unit}`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K ${unit}`;
  return `${num.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${unit}`;
};

interface PrecisionWhPieChartProps {
  title: string;
  rawItems: any[];
  nameKey: string;
  valueKey: string;
  unit?: string;
  labelsMap?: Record<string, string>;
  colorsMap?: Record<string, string>;
  excelFileName?: string;
}

const PrecisionWhPieChart: React.FC<PrecisionWhPieChartProps> = ({
  title,
  rawItems,
  nameKey,
  valueKey,
  unit = "m²",
  labelsMap = {},
  colorsMap = {},
  excelFileName,
}) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Chuẩn hóa dữ liệu sang cấu trúc thống nhất
  const normalizedData = useMemo<WhPieDataItem[]>(() => {
    if (!rawItems || !Array.isArray(rawItems)) return [];
    return rawItems
      .filter((item) => item != null)
      .map((item, idx) => {
        const rawName = String(item[nameKey] ?? `Nhóm ${idx + 1}`);
        const val = Number(item[valueKey] ?? 0);
        const descriptiveLabel = labelsMap[rawName] || rawName;
        const assignedColor =
          colorsMap[rawName] ||
          (rawName === "A"
            ? "#059669"
            : rawName === "B"
            ? "#d97706"
            : rawName === "C"
            ? "#dc2626"
            : ENTERPRISE_PALETTE[idx % ENTERPRISE_PALETTE.length]);

        return {
          name: rawName,
          value: isNaN(val) ? 0 : val,
          label: descriptiveLabel,
          color: assignedColor,
          original: item,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [rawItems, nameKey, valueKey, labelsMap, colorsMap]);

  const totalValue = useMemo(() => {
    return normalizedData.reduce((sum, item) => sum + item.value, 0);
  }, [normalizedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return normalizedData;
    const term = searchTerm.toLowerCase();
    return normalizedData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.label && item.label.toLowerCase().includes(term))
    );
  }, [normalizedData, searchTerm]);

  // Sector phóng to khi hover chuột
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

  // Nhãn callout bên ngoài bánh
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name, value, index } = props;
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 2) * cos;
    const sy = cy + (outerRadius + 2) * sin;
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 8;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const item = normalizedData[index];
    const color = item?.color || ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length];

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
          {`${name}: ${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Tooltip thông minh
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as WhPieDataItem;
      const share = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : "0.0";
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "8px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "11px",
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 800, color: d.color, marginBottom: 2 }}>
            {d.name} {d.label ? `— ${d.label}` : ""}
          </div>
          <div style={{ color: "#334155" }}>
            Số lượng: <strong>{d.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}</strong> {unit}
          </div>
          <div style={{ color: "#2563eb", fontWeight: 700 }}>
            Tỷ trọng: <strong>{share}%</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  const activeItem = activeIndex !== null ? normalizedData[activeIndex] : null;

  return (
    <div className="po-customer-chart">
      {/* Controls Bar: Tiêu đề + Thống kê + Nút đổi chế độ */}
      <div className="po-customer-chart__controls">
        <div className="po-customer-chart__stat-pill">
          <span>Tổng:</span>
          <strong>{formatCompact(totalValue, unit)}</strong>
          <span className="dot">•</span>
          <span>{normalizedData.length} phân nhóm</span>
        </div>

        <div className="po-customer-chart__view-btns">
          <button
            type="button"
            className={`view-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Xem song song Biểu đồ & Bảng phân tích"
          >
            <FiColumns size={10} />
            <span>Song Song</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "chart" ? "active" : ""}`}
            onClick={() => setViewMode("chart")}
            title="Xem biểu đồ toàn khung"
          >
            <FiPieChart size={10} />
            <span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="Xem danh sách chi tiết"
          >
            <FiList size={10} />
            <span>Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {normalizedData.length === 0 ? (
        <div className="po-cust-empty">
          <FiInfo size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />
          Chưa có dữ liệu phân loại cho mục này.
        </div>
      ) : (
        <div className="po-customer-chart__content">
          {/* Vùng Biểu Đồ Tròn / Donut */}
          {viewMode !== "list" && (
            <div className={`po-customer-chart__donut-pane ${viewMode === "chart" ? "full" : ""}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={normalizedData}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                    cx="50%"
                    cy="50%"
                    innerRadius={viewMode === "chart" ? 75 : 54}
                    outerRadius={viewMode === "chart" ? 120 : 88}
                    paddingAngle={2}
                    activeIndex={activeIndex !== null ? activeIndex : undefined}
                    activeShape={renderActiveShape}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {normalizedData.map((item, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={item.color || ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Tâm Donut Thống Kê */}
              <div className="po-donut-center" style={{ width: 95 }}>
                <span className="po-donut-center__label" style={{ fontSize: "9.5px", maxWidth: "90px" }}>
                  {activeItem ? activeItem.name : "TỔNG CỘNG"}
                </span>
                <span className="po-donut-center__value" style={{ fontSize: "14px" }}>
                  {activeItem
                    ? formatCompact(activeItem.value, unit)
                    : formatCompact(totalValue, unit)}
                </span>
                <span className="po-donut-center__unit" style={{ fontSize: "9.5px" }}>
                  {activeItem
                    ? `${((activeItem.value / (totalValue || 1)) * 100).toFixed(1)}%`
                    : unit}
                </span>
              </div>
            </div>
          )}

          {/* Vùng Bảng Danh Sách Phân Tích */}
          {viewMode !== "chart" && (
            <div className={`po-customer-chart__list-pane ${viewMode === "list" ? "full" : ""}`}>
              {/* Thanh Tìm Kiếm Nhanh */}
              <div className="po-cust-search">
                <FiSearch size={11} className="po-cust-search__icon" />
                <input
                  type="text"
                  placeholder="Lọc phân loại..."
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

              {/* Tiêu Đề Bảng */}
              <div className="po-cust-table-header">
                <span style={{ textAlign: "center" }}>#</span>
                <span>Phân Nhóm</span>
                <span className="col-balance">Số Lượng</span>
                <span className="col-share">Tỷ Trọng</span>
              </div>

              {/* Danh Sách Các Hàng */}
              <div className="po-cust-table-body">
                {filteredData.map((item, idx) => {
                  const share = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  const isHovered = activeIndex !== null && normalizedData[activeIndex]?.name === item.name;

                  return (
                    <div
                      key={item.name}
                      className={`po-cust-row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => {
                        const originalIndex = normalizedData.findIndex((d) => d.name === item.name);
                        setActiveIndex(originalIndex >= 0 ? originalIndex : null);
                      }}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${idx + 1}`}>{idx + 1}</span>
                      <div className="col-name" title={item.label}>
                        <span className="color-dot" style={{ backgroundColor: item.color }} />
                        <span className="name-text">
                          <strong>{item.name}</strong>
                          {item.label && <span style={{ color: "#64748b", fontWeight: "normal", marginLeft: 3 }}>({item.label})</span>}
                        </span>
                      </div>
                      <span className="col-balance">
                        {item.value.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                      </span>
                      <div className="col-share">
                        <span className="share-pct">{share.toFixed(1)}%</span>
                        <div className="share-bar">
                          <div
                            className="share-bar__fill"
                            style={{
                              width: `${Math.min(100, Math.max(share, 3))}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionWhPieChart);
