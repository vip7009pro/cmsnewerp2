import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { WorstData } from "../../interfaces/qcInterface";
import { getGlobalSetting } from "../../../../api/Api";
import { WEB_SETTING_DATA } from "../../../../api/GlobalInterface";

const ENTERPRISE_PALETTE = [
  "#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48", "#0891b2",
  "#ea580c", "#4f46e5", "#16a34a", "#9333ea", "#0284c7", "#ca8a04",
  "#be123c", "#0d9488", "#475569", "#6366f1", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#84cc16", "#f97316",
];

const formatCompact = (num: number, worstby: string) => {
  if (!num) return "0";
  if (worstby === "AMOUNT") {
    const currency = getGlobalSetting()?.filter(
      (e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY"
    )[0]?.CURRENT_VALUE ?? "USD";
    const symbol = currency === "USD" ? "$" : "₫";
    if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${symbol}${(num / 1e3).toFixed(1)}K`;
    return `${symbol}${num.toLocaleString("en-US")}`;
  }
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toLocaleString("en-US");
};

interface Props {
  worstdatatable: WorstData[];
  worstby: string;
}

export const PrecisionInspectReportWorstDonut: React.FC<Props> = ({
  worstdatatable,
  worstby,
}) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dataKey = worstby === "QTY" ? "NG_QTY" : "NG_AMOUNT";
  const unitLabel = worstby === "QTY" ? "EA" : "USD";

  const sortedData = useMemo(() => {
    if (!worstdatatable || worstdatatable.length === 0) return [];
    return [...worstdatatable].sort((a, b) => (b[dataKey] || 0) - (a[dataKey] || 0));
  }, [worstdatatable, dataKey]);

  const totalValue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  }, [sortedData, dataKey]);

  const top5Data = useMemo(() => sortedData.slice(0, 5), [sortedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter(
      (item) =>
        item.ERR_NAME_VN?.toLowerCase().includes(term) ||
        item.ERR_NAME_KR?.toLowerCase().includes(term) ||
        item.ERR_CODE?.toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index, value } = props;
    if (percent < 0.04) return null;
    const RADIAN = Math.PI / 180;
    const cos = Math.cos(-midAngle * RADIAN);
    const sin = Math.sin(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 2) * cos;
    const sy = cy + (outerRadius + 2) * sin;
    const mx = cx + (outerRadius + 11) * cos;
    const my = cy + (outerRadius + 11) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const color = ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length];
    const name = top5Data[index]?.ERR_NAME_VN || "";
    const displayName = name.length > 11 ? `${name.slice(0, 10)}…` : name;

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
          {`${displayName}: ${formatCompact(value, worstby)}`}
        </text>
      </g>
    );
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius - 2} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 7} outerRadius={outerRadius + 9} fill={fill} />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as WorstData;
      const val = item[dataKey] || 0;
      const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : "0";
      return (
        <div className="pir-worst-tooltip">
          <div className="pir-worst-tooltip__title">{item.ERR_NAME_VN} ({item.ERR_NAME_KR})</div>
          <div className="pir-worst-tooltip__row">
            <span className="label">{worstby === "QTY" ? "Số lượng:" : "Giá trị:"}</span>
            <span className="value">{formatCompact(val, worstby)}</span>
          </div>
          <div className="pir-worst-tooltip__row">
            <span className="label">Tỷ Trọng:</span>
            <span className="badge">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const activeItem = activeIndex !== null ? top5Data[activeIndex] : null;

  return (
    <div className="pir-chart-card">
      <div className="pir-chart-card__top">
        <div className="pir-chart-card__title-area">
          <span className="pir-chart-card__badge">TOP 5</span>
          <span className="pir-chart-card__title">Phân Bổ Lỗi Theo Loại Khuyết Tật (Defect Distribution)</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="pir-donut-controls">
        <div className="pir-donut-controls__stat">
          <span>Tổng {worstby === "QTY" ? "Số Lượng" : "Giá Trị"}:</span>
          <strong>{formatCompact(totalValue, worstby)}</strong>
          <span className="dot">•</span>
          <span>{sortedData.length} Loại Lỗi</span>
        </div>
        <div className="pir-donut-controls__btns">
          <button type="button" className={`pir-vbtn ${viewMode === "split" ? "active" : ""}`} onClick={() => setViewMode("split")}>
            <FiColumns size={11} /><span>Song Song</span>
          </button>
          <button type="button" className={`pir-vbtn ${viewMode === "chart" ? "active" : ""}`} onClick={() => setViewMode("chart")}>
            <FiPieChart size={11} /><span>Biểu Đồ</span>
          </button>
          <button type="button" className={`pir-vbtn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
            <FiList size={11} /><span>Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pir-donut-content">
        {/* Donut Chart Pane */}
        {viewMode !== "list" && (
          <div className={`pir-donut-pane ${viewMode === "chart" ? "full" : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={top5Data}
                  dataKey={dataKey}
                  nameKey="ERR_NAME_VN"
                  isAnimationActive={false}
                  cx="50%" cy="50%"
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
                  {top5Data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center */}
            <div className="pir-donut-center">
              <span className="pir-donut-center__label">
                {activeItem ? activeItem.ERR_NAME_VN : "TỔNG CỘNG"}
              </span>
              <span className="pir-donut-center__value">
                {formatCompact(activeItem ? (activeItem[dataKey] || 0) : totalValue, worstby)}
              </span>
              <span className="pir-donut-center__unit">
                {activeItem ? `${(((activeItem[dataKey] || 0) / (totalValue || 1)) * 100).toFixed(1)}%` : unitLabel}
              </span>
            </div>
          </div>
        )}

        {/* Ranking List Pane */}
        {viewMode !== "chart" && (
          <div className={`pir-donut-list ${viewMode === "list" ? "full" : ""}`}>
            <div className="pir-donut-search">
              <FiSearch size={12} className="pir-donut-search__icon" />
              <input type="text" placeholder="Tìm nhanh loại lỗi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && <button type="button" className="pir-donut-search__clear" onClick={() => setSearchTerm("")}>×</button>}
            </div>
            <div className="pir-donut-list__header">
              <span className="col-rank">#</span>
              <span className="col-name">Loại Lỗi</span>
              <span className="col-val">{worstby === "QTY" ? "Số Lượng" : "Giá Trị"}</span>
              <span className="col-share">Tỷ Trọng</span>
            </div>
            <div className="pir-donut-list__body">
              {filteredData.length === 0 ? (
                <div className="pir-donut-empty">Không tìm thấy loại lỗi phù hợp</div>
              ) : (
                filteredData.map((item, idx) => {
                  const origIdx = sortedData.findIndex((s) => s.ERR_CODE === item.ERR_CODE);
                  const color = ENTERPRISE_PALETTE[origIdx % ENTERPRISE_PALETTE.length];
                  const val = item[dataKey] || 0;
                  const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : "0";
                  const isHovered = activeIndex === origIdx && origIdx < 5;
                  return (
                    <div
                      key={`row-${idx}`}
                      className={`pir-donut-row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => (origIdx < 5 ? setActiveIndex(origIdx) : null)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${origIdx + 1}`}>{origIdx + 1}</span>
                      <div className="col-name">
                        <span className="color-dot" style={{ backgroundColor: color }} />
                        <span className="name-text" title={`${item.ERR_NAME_VN} (${item.ERR_NAME_KR})`}>
                          {item.ERR_NAME_VN}
                        </span>
                      </div>
                      <span className="col-val">{formatCompact(val, worstby)}</span>
                      <div className="col-share">
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
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

export default React.memo(PrecisionInspectReportWorstDonut);
