import React, { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import {
  FiAlertTriangle,
  FiColumns,
  FiDownload,
  FiList,
  FiPieChart,
  FiSearch,
} from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { DAOFILM_ERR_DATA } from "../../interfaces/rndInterface";

const ERROR_PALETTE = [
  "#e11d48", // Rose 600
  "#ea580c", // Orange 600
  "#d97706", // Amber 600
  "#7c3aed", // Violet 600
  "#2563eb", // Blue 600
  "#0891b2", // Cyan 600
  "#059669", // Emerald 600
  "#4f46e5", // Indigo 600
  "#9333ea", // Purple 600
  "#be123c", // Rose 700
  "#c2410c", // Orange 700
  "#b45309", // Amber 700
  "#6d28d9", // Violet 700
  "#1d4ed8", // Blue 700
];

interface DaoFilmErrSectionProps {
  data: DAOFILM_ERR_DATA[];
}

export const PrecisionRNDDaoFilmErrSection: React.FC<DaoFilmErrSectionProps> = React.memo(
  ({ data }) => {
    const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Chuẩn hóa và sắp xếp giảm dần theo số lượng / giá trị
    const sortedData = useMemo(() => {
      if (!data || !Array.isArray(data)) return [];
      return (data as any[])
        .map((item) => ({
          name: item.ERR_NAME || item.REASON || item.NAME || "Khác",
          value: Number(item.QTY || item.COUNT || item.AMOUNT || item.TOTAL || 0),
          raw: item,
        }))
        .filter((x) => x.value > 0)
        .sort((a, b) => b.value - a.value);
    }, [data]);

    const totalValue = useMemo(() => {
      return sortedData.reduce((sum, item) => sum + item.value, 0);
    }, [sortedData]);

    // Lọc theo từ khóa
    const filteredData = useMemo(() => {
      if (!searchTerm.trim()) return sortedData;
      const term = searchTerm.toLowerCase();
      return sortedData.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
    }, [sortedData, searchTerm]);

    // Custom Callout Label
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
      const color = ERROR_PALETTE[index % ERROR_PALETTE.length];
      const displayName = name.length > 14 ? `${name.slice(0, 13)}…` : name;

      return (
        <g>
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={color}
            fill="none"
            strokeWidth={1.2}
          />
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
            outerRadius={outerRadius + 5}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
        </g>
      );
    };

    return (
      <div className="precision-rnd-report__section">
        <div className="precision-rnd-report__sectionHeader">
          <div className="section-badge-title">
            <span className="icon-circle" style={{ backgroundColor: "#fff1f2", color: "#e11d48" }}>
              <FiAlertTriangle />
            </span>
            <span>Tỉ Trọng Nguyên Nhân Xuất Dao Film (Dao Film Error Analytics)</span>
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#e11d48" />
              <span>Phân Tích Nguyên Nhân & Tỉ Trọng Lỗi Dao Film</span>
            </div>

            <div className="executive-card__actions">
              <div className="executive-card__view-switch">
                <button
                  type="button"
                  className={viewMode === "split" ? "active" : ""}
                  onClick={() => setViewMode("split")}
                  title="Xem kết hợp"
                >
                  <FiColumns size={11} />
                </button>
                <button
                  type="button"
                  className={viewMode === "chart" ? "active" : ""}
                  onClick={() => setViewMode("chart")}
                  title="Xem chỉ biểu đồ"
                >
                  <FiPieChart size={11} />
                </button>
                <button
                  type="button"
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                  title="Xem chỉ bảng xếp hạng"
                >
                  <FiList size={11} />
                </button>
              </div>

              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(data, "Dao Film Err")}
                title="Xuất Excel dữ liệu lỗi dao film"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="executive-card__body executive-card__body--tall">
            {/* CHẾ ĐỘ 1: SPLIT */}
            {viewMode === "split" && (
              <div className="split-container">
                <div className="split-chart-pane">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={sortedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={88}
                        activeIndex={activeIndex ?? undefined}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        label={renderCustomizedLabel}
                        labelLine={false}
                      >
                        {sortedData.map((_, index) => (
                          <Cell
                            key={`err-cell-${index}`}
                            fill={ERROR_PALETTE[index % ERROR_PALETTE.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0;
                            return (
                              <div className="recharts-custom-tooltip">
                                <div className="tooltip-title">{d.name}</div>
                                <div className="tooltip-item">
                                  <span>Số lượng lỗi:</span>
                                  <span className="val">{d.value} ({pct}%)</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="split-list-pane">
                  <div className="list-search">
                    <FiSearch size={10} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Lọc nguyên nhân..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="list-scroll">
                    {filteredData.map((item, idx) => {
                      const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                      const color = ERROR_PALETTE[idx % ERROR_PALETTE.length];
                      return (
                        <div
                          key={`err-item-${idx}`}
                          className="list-item"
                          onMouseEnter={() => setActiveIndex(idx)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          <div className="item-top">
                            <span className="item-name" title={item.name}>
                              #{idx + 1} {item.name}
                            </span>
                            <span className="item-val">
                              {item.value} ({pct.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="item-bar-wrap">
                            <div
                              className="item-bar-fill"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ 2: CHART ONLY */}
            {viewMode === "chart" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                  <Pie
                    data={sortedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={115}
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {sortedData.map((_, index) => (
                      <Cell
                        key={`err-cell-${index}`}
                        fill={ERROR_PALETTE[index % ERROR_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0;
                        return (
                          <div className="recharts-custom-tooltip">
                            <div className="tooltip-title">{d.name}</div>
                            <div className="tooltip-item">
                              <span>Số lượng:</span>
                              <span className="val">{d.value} ({pct}%)</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* CHẾ ĐỘ 3: LIST ONLY */}
            {viewMode === "list" && (
              <div className="split-list-pane" style={{ borderLeft: "none", paddingLeft: 0 }}>
                <div className="list-search">
                  <FiSearch size={10} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Lọc nguyên nhân..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="list-scroll">
                  {filteredData.map((item, idx) => {
                    const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                    const color = ERROR_PALETTE[idx % ERROR_PALETTE.length];
                    return (
                      <div key={`err-item-${idx}`} className="list-item">
                        <div className="item-top">
                          <span className="item-name" title={item.name}>
                            #{idx + 1} {item.name}
                          </span>
                          <span className="item-val">
                            {item.value} ({pct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="item-bar-wrap">
                          <div
                            className="item-bar-fill"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PrecisionRNDDaoFilmErrSection.displayName = "PrecisionRNDDaoFilmErrSection";
