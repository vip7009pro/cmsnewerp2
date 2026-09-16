import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FiPieChart, FiList, FiColumns, FiSearch } from "react-icons/fi";
import { CS_CONFIRM_BY_CUSTOMER_DATA } from "../../interfaces/qcInterface";
import { ENTERPRISE_PALETTE, formatCompact, renderActiveShape, renderCustomizedLabel } from "./csDonutHelpers";

interface Props {
  data: CS_CONFIRM_BY_CUSTOMER_DATA[];
}

export const CSChartPICIssue: React.FC<Props> = ({ data }) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.TOTAL || 0) - (a.TOTAL || 0));
  }, [data]);

  const totalIssues = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.TOTAL || 0), 0);
  }, [sortedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter((item) =>
      (item.EMPL_NAME || (item as any).PIC_NAME || "").toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CS_CONFIRM_BY_CUSTOMER_DATA;
      const picName = item.EMPL_NAME || (item as any).PIC_NAME || "Chưa rõ";
      const pct = totalIssues > 0 ? (((item.TOTAL || 0) / totalIssues) * 100).toFixed(1) : "0";
      return (
        <div className="pcs-tooltip">
          <div className="pcs-tooltip__title">{picName}</div>
          <div className="pcs-tooltip__row">
            <span className="label">Tổng sự cố phụ trách:</span>
            <span className="value">{item.TOTAL?.toLocaleString("en-US")} vụ</span>
          </div>
          {item.C !== undefined && (
            <div className="pcs-tooltip__row">
              <span className="label">Lỗi CMS (C):</span>
              <span className="value text-blue">{item.C?.toLocaleString("en-US")}</span>
            </div>
          )}
          {item.K !== undefined && (
            <div className="pcs-tooltip__row">
              <span className="label">Lỗi Khách (K):</span>
              <span className="value text-rose">{item.K?.toLocaleString("en-US")}</span>
            </div>
          )}
          <div className="pcs-tooltip__row">
            <span className="label">Tỷ trọng:</span>
            <span className="badge">{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const activePIC = activeIndex !== null ? sortedData[activeIndex] : null;

  return (
    <div className="pcs-donut-chart">
      <div className="pcs-donut-chart__controls">
        <div className="pcs-donut-chart__stat-pill">
          <span>Sự Cố Theo PIC:</span>
          <strong>{formatCompact(totalIssues)} vụ</strong>
          <span className="dot">•</span>
          <span>{sortedData.length} Nhân Sự</span>
        </div>

        <div className="pcs-donut-chart__view-btns">
          <button
            type="button"
            className={`view-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Xem song song Biểu đồ & Bảng dữ liệu"
          >
            <FiColumns size={11} /><span>Song Song</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "chart" ? "active" : ""}`}
            onClick={() => setViewMode("chart")}
            title="Xem biểu đồ tròn toàn khung"
          >
            <FiPieChart size={11} /><span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="Xem danh sách chi tiết toàn bộ nhân sự PIC"
          >
            <FiList size={11} /><span>Danh Sách</span>
          </button>
        </div>
      </div>

      <div className="pcs-donut-chart__content">
        {viewMode !== "list" && (
          <div className={`pcs-donut-chart__donut-pane ${viewMode === "chart" ? "full" : ""}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={sortedData}
                  dataKey="TOTAL"
                  nameKey="EMPL_NAME"
                  isAnimationActive={false}
                  cx="50%" cy="50%"
                  innerRadius={viewMode === "chart" ? 62 : 48}
                  outerRadius={viewMode === "chart" ? 105 : 80}
                  paddingAngle={1}
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {sortedData.map((_, index) => (
                    <Cell key={`pic-cell-${index}`} fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pcs-donut-chart__donut-center">
              <span className="pcs-donut-chart__donut-center-label">
                {activePIC ? (activePIC.EMPL_NAME || (activePIC as any).PIC_NAME || "PIC") : "SỰ CỐ PIC"}
              </span>
              <span className="pcs-donut-chart__donut-center-value">
                {activePIC ? formatCompact(activePIC.TOTAL) : formatCompact(totalIssues)}
              </span>
              <span className="pcs-donut-chart__donut-center-unit">
                {activePIC ? `${(((activePIC.TOTAL || 0) / (totalIssues || 1)) * 100).toFixed(1)}%` : "VỤ"}
              </span>
            </div>
          </div>
        )}

        {viewMode !== "chart" && (
          <div className={`pcs-donut-chart__list-pane ${viewMode === "list" ? "full" : ""}`}>
            <div className="pcs-donut-chart__search">
              <FiSearch size={12} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm nhanh nhân sự phụ trách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="pcs-donut-chart__search-clear" onClick={() => setSearchTerm("")}>×</button>
              )}
            </div>

            <div className="pcs-donut-chart__list-header">
              <span className="col-rank">#</span>
              <span className="col-name">Nhân Sự PIC</span>
              <span className="col-val">Sự Cố</span>
              <span className="col-share">Tỷ Trọng</span>
            </div>

            <div className="pcs-donut-chart__list-body">
              {filteredData.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "0.72rem" }}>
                  Không tìm thấy nhân sự phù hợp
                </div>
              ) : (
                filteredData.map((item, idx) => {
                  const origIdx = sortedData.findIndex(
                    (s) => (s.EMPL_NAME || (s as any).PIC_NAME) === (item.EMPL_NAME || (item as any).PIC_NAME)
                  );
                  const color = ENTERPRISE_PALETTE[origIdx % ENTERPRISE_PALETTE.length];
                  const pct = totalIssues > 0 ? (((item.TOTAL || 0) / totalIssues) * 100).toFixed(1) : "0";
                  const isHovered = activeIndex === origIdx;
                  const displayName = item.EMPL_NAME || (item as any).PIC_NAME || "Chưa rõ";

                  return (
                    <div
                      key={`pic-row-${idx}`}
                      className={`pcs-donut-chart__row ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => setActiveIndex(origIdx)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <span className={`col-rank rank-${origIdx + 1}`}>{origIdx + 1}</span>
                      <div className="col-name">
                        <span className="color-dot" style={{ backgroundColor: color }} />
                        <span className="name-text" title={displayName}>{displayName}</span>
                      </div>
                      <span className="col-val">{item.TOTAL?.toLocaleString("en-US")}</span>
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

export default React.memo(CSChartPICIssue);
