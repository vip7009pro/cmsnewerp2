import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { WorstCodeData } from "../../../pages/qc/interfaces/qcInterface";
import { getGlobalSetting } from "../../../api/Api";
import { WEB_SETTING_DATA } from "../../../api/GlobalInterface";

const ENTERPRISE_PALETTE = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48", "#0891b2", "#ea580c", "#4f46e5", "#16a34a", "#9333ea", "#0284c7", "#ca8a04", "#be123c", "#0d9488", "#475569", "#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#84cc16", "#f97316"];

const formatCompact = (num: number, worstby: string) => {
  if (!num) return "0";
  if (worstby === "AMOUNT") {
    const currency = getGlobalSetting()?.filter((e: WEB_SETTING_DATA) => e.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ?? "USD";
    const symbol = currency === "USD" ? "$" : "₫";
    if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${symbol}${(num / 1e3).toFixed(1)}K`;
    return `${symbol}${num.toLocaleString("en-US")}`;
  }
  return num >= 1e6 ? `${(num / 1e6).toFixed(2)}M` : num >= 1e3 ? `${(num / 1e3).toFixed(1)}K` : num.toLocaleString("en-US");
};

interface Props {
  dailyClosingData: Array<WorstCodeData>;
  worstby: string;
  selectedErrName?: string;
  selectedErrCode?: string;
}

const ChartWorstCodeByErrCode: React.FC<Props> = ({
  dailyClosingData,
  worstby,
  selectedErrName,
  selectedErrCode,
}) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dataKey = worstby === "QTY" ? "NG_QTY" : "NG_AMOUNT";
  const unitLabel = worstby === "QTY" ? "EA" : "USD";

  const sortedData = useMemo(() => {
    if (!dailyClosingData || !Array.isArray(dailyClosingData)) return [];
    return [...dailyClosingData].sort((a, b) => ((b[dataKey] as number) || 0) - ((a[dataKey] as number) || 0));
  }, [dailyClosingData, dataKey]);

  const totalValue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + ((item[dataKey] as number) || 0), 0);
  }, [sortedData, dataKey]);

  const top5Data = useMemo(() => sortedData.slice(0, 5), [sortedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter(
      (item) =>
        item.G_NAME_KD?.toLowerCase().includes(term) ||
        item.G_CODE?.toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index, value } = props;
    if (percent < 0.04) return null;
    const RAD = Math.PI / 180, cos = Math.cos(-midAngle * RAD), sin = Math.sin(-midAngle * RAD);
    const sx = cx + (outerRadius + 2) * cos, sy = cy + (outerRadius + 2) * sin;
    const mx = cx + (outerRadius + 11) * cos, my = cy + (outerRadius + 11) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 10, ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const color = ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length];
    const name = top5Data[index]?.G_NAME_KD || "";
    const displayName = name.length > 10 ? `${name.slice(0, 9)}…` : name;

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none" strokeWidth={1.2} />
        <circle cx={ex} cy={ey} r={2} fill={color} />
        <text x={ex + (cos >= 0 ? 1 : -1) * 3} y={ey} textAnchor={textAnchor} fill="#1e293b" dominantBaseline="central" fontSize={10} fontWeight={700}>
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
      const item = payload[0].payload as WorstCodeData;
      const val = (item[dataKey] as number) || 0;
      const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : "0";
      return (
        <div className="pir-worst-tooltip">
          <div className="pir-worst-tooltip__title">{item.G_NAME_KD} ({item.G_CODE})</div>
          <div className="pir-worst-tooltip__row">
            <span className="label">{worstby === "QTY" ? "Số lượng lỗi:" : "Giá trị thiệt hại:"}</span>
            <span className="value">{formatCompact(val, worstby)}</span>
          </div>
          {item.INSPECT_TOTAL_QTY ? (
            <div className="pir-worst-tooltip__row">
              <span className="label">Tổng kiểm:</span>
              <span className="value">{item.INSPECT_TOTAL_QTY.toLocaleString("en-US")} EA</span>
            </div>
          ) : null}
          <div className="pir-worst-tooltip__row">
            <span className="label">Tỷ trọng lỗi:</span>
            <span className="badge">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const activeItem = activeIndex !== null ? top5Data[activeIndex] : null;

  return (
    <div className="chart-worst-code-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {/* Header Info */}
      <div className="pir-chart-card__top">
        <div className="pir-chart-card__title-area">
          <span className="pir-chart-card__badge" style={{ background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}>
            {selectedErrCode || "SẢN PHẨM"}
          </span>
          <span className="pir-chart-card__title">
            Phân Bổ Sản Phẩm Lỗi {selectedErrName ? `• ${selectedErrName}` : ""}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="pir-donut-controls">
        <div className="pir-donut-controls__stat">
          <span>Tổng {worstby === "QTY" ? "Số Lượng" : "Giá Trị"}:</span>
          <strong>{formatCompact(totalValue, worstby)}</strong>
          <span className="dot">•</span>
          <span>{sortedData.length} Mã Hàng</span>
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
      <div className="pir-donut-content" style={{ flex: "1 1 auto", minHeight: 280 }}>
        {/* Donut Chart Pane */}
        {viewMode !== "list" && (
          <div className={`pir-donut-pane ${viewMode === "chart" ? "full" : ""}`}>
            {sortedData.length === 0 ? (
              <div className="pir-donut-empty">Không có dữ liệu sản phẩm</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={top5Data}
                      dataKey={dataKey}
                      nameKey="G_NAME_KD"
                      isAnimationActive={false}
                      cx="50%"
                      cy="50%"
                      innerRadius={viewMode === "chart" ? 55 : 42}
                      outerRadius={viewMode === "chart" ? 95 : 72}
                      paddingAngle={1}
                      activeIndex={activeIndex !== null ? activeIndex : undefined}
                      activeShape={renderActiveShape}
                      label={renderCustomizedLabel}
                      labelLine={false}
                      onMouseEnter={(_, idx) => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {top5Data.map((_, index) => (
                        <Cell key={`code-cell-${index}`} fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center */}
                <div className="pir-donut-center">
                  <span className="pir-donut-center__label">
                    {activeItem ? activeItem.G_NAME_KD : "TỔNG CỘNG"}
                  </span>
                  <span className="pir-donut-center__value">
                    {formatCompact(activeItem ? ((activeItem[dataKey] as number) || 0) : totalValue, worstby)}
                  </span>
                  <span className="pir-donut-center__unit">
                    {activeItem ? `${((((activeItem[dataKey] as number) || 0) / (totalValue || 1)) * 100).toFixed(1)}%` : unitLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Ranking List Pane */}
        {viewMode !== "chart" && (
          <div className={`pir-donut-list ${viewMode === "list" ? "full" : ""}`}>
            <div className="pir-donut-search">
              <FiSearch size={12} className="pir-donut-search__icon" />
              <input
                type="text"
                placeholder="Tìm nhanh sản phẩm, mã G_CODE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="pir-donut-search__clear" onClick={() => setSearchTerm("")}>×</button>
              )}
            </div>

            <div className="pir-donut-list__header">
              <span className="col-rank">#</span>
              <span className="col-name">Sản Phẩm (KD)</span>
              <span className="col-val">{worstby === "QTY" ? "Số Lượng" : "Giá Trị"}</span>
              <span className="col-share">Tỷ Trọng</span>
            </div>

            <div className="pir-donut-list__body">
              {filteredData.length === 0 ? (
                <div className="pir-donut-empty">Không tìm thấy sản phẩm phù hợp</div>
              ) : (
                filteredData.map((item, idx) => {
                  const origIdx = sortedData.findIndex((s) => s.G_CODE === item.G_CODE);
                  const color = ENTERPRISE_PALETTE[origIdx % ENTERPRISE_PALETTE.length];
                  const val = (item[dataKey] as number) || 0;
                  const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : "0";
                  const isHovered = activeIndex === origIdx && origIdx < 5;

                  return (
                    <div
                      key={`code-row-${idx}`}
                      className={`pir-donut-row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => (origIdx < 5 ? setActiveIndex(origIdx) : null)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${origIdx + 1}`}>{origIdx + 1}</span>
                      <div className="col-name">
                        <span className="color-dot" style={{ backgroundColor: color }} />
                        <a
                          href={`/banve/${item.G_CODE}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="name-text"
                          title={`${item.G_NAME_KD} (${item.G_CODE}) - Bấm để xem bản vẽ PDF`}
                          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}
                        >
                          <span>{item.G_NAME_KD}</span>
                          <PictureAsPdfIcon style={{ fontSize: 11, color: "#ef4444", opacity: 0.75 }} />
                        </a>
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

export default React.memo(ChartWorstCodeByErrCode);
