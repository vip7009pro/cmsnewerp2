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
  FiColumns,
  FiDownload,
  FiList,
  FiPieChart,
  FiSearch,
} from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import {
  RND_NEWCODE_BY_CUSTOMER,
  RND_NEWCODE_BY_PRODTYPE,
} from "../../interfaces/rndInterface";

const ENTERPRISE_PALETTE = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#e11d48",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
  "#16a34a",
  "#9333ea",
  "#0284c7",
  "#ca8a04",
  "#be123c",
  "#0d9488",
  "#475569",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#3b82f6",
];

// SUB-COMPONENT: DONUT PHÂN TÍCH ĐA NĂNG
interface DonutAnalysisCardProps {
  title: string;
  data: Array<{ name: string; value: number; newCode?: number; ecn?: number }>;
  excelFileName: string;
  rawExportData: any[];
}

const DonutAnalysisCard: React.FC<DonutAnalysisCardProps> = ({
  title,
  data,
  excelFileName,
  rawExportData,
}) => {
  const [viewMode, setViewMode] = useState<"split" | "chart" | "list">("split");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Sắp xếp giảm dần theo value
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
  }, [data]);

  const totalValue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [sortedData]);

  // Lọc theo từ khóa
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return sortedData;
    const term = searchTerm.toLowerCase();
    return sortedData.filter((item) =>
      item.name?.toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  // Custom Callout label cho lát cắt >= 4%
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
          {`${displayName}: ${value} lot`}
        </text>
      </g>
    );
  };

  // Active shape khi hover
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
    <div className="executive-card">
      <div className="executive-card__header">
        <div className="executive-card__title-wrap">
          <FiPieChart size={13} color="#2563eb" />
          <span>{title}</span>
        </div>

        <div className="executive-card__actions">
          {/* Nút chuyển chế độ xem: Split / Chart / List */}
          <div className="executive-card__view-switch">
            <button
              type="button"
              className={viewMode === "split" ? "active" : ""}
              onClick={() => setViewMode("split")}
              title="Xem kết hợp (Biểu đồ + Xếp hạng)"
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
              title="Xem chỉ danh sách xếp hạng"
            >
              <FiList size={11} />
            </button>
          </div>

          <button
            type="button"
            className="executive-card__btn-excel"
            onClick={() => SaveExcel(rawExportData, excelFileName)}
            title="Xuất dữ liệu ra Excel"
          >
            <FiDownload size={11} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      <div className="executive-card__body executive-card__body--tall">
        {/* CHẾ ĐỘ 1: SPLIT VIEW (BIỂU ĐỒ + DANH SÁCH) */}
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
                    innerRadius={48}
                    outerRadius={75}
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {sortedData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]}
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
                              <span>Tổng số mã:</span>
                              <span className="val">{d.value} lot ({pct}%)</span>
                            </div>
                            {d.newCode !== undefined && (
                              <div className="tooltip-item">
                                <span>New Code:</span>
                                <span className="val">{d.newCode}</span>
                              </div>
                            )}
                            {d.ecn !== undefined && (
                              <div className="tooltip-item">
                                <span>ECN:</span>
                                <span className="val">{d.ecn}</span>
                              </div>
                            )}
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
                  placeholder="Lọc xếp hạng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="list-scroll">
                {filteredData.map((item, idx) => {
                  const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  const color = ENTERPRISE_PALETTE[idx % ENTERPRISE_PALETTE.length];
                  return (
                    <div
                      key={`item-${idx}`}
                      className="list-item"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="item-top">
                        <span className="item-name" title={item.name}>
                          #{idx + 1} {item.name}
                        </span>
                        <span className="item-val">
                          {item.value} lot ({pct.toFixed(1)}%)
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

        {/* CHẾ ĐỘ 2: CHỈ BIỂU ĐỒ (CHART ONLY) */}
        {viewMode === "chart" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <Pie
                data={sortedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                activeIndex={activeIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {sortedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length]}
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
                          <span>Tổng số:</span>
                          <span className="val">{d.value} lot ({pct}%)</span>
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

        {/* CHẾ ĐỘ 3: CHỈ DANH SÁCH XẾP HẠNG (LIST ONLY) */}
        {viewMode === "list" && (
          <div className="split-list-pane" style={{ borderLeft: "none", paddingLeft: 0 }}>
            <div className="list-search">
              <FiSearch size={10} color="#94a3b8" />
              <input
                type="text"
                placeholder="Lọc xếp hạng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="list-scroll">
              {filteredData.map((item, idx) => {
                const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                const color = ENTERPRISE_PALETTE[idx % ENTERPRISE_PALETTE.length];
                return (
                  <div key={`item-${idx}`} className="list-item">
                    <div className="item-top">
                      <span className="item-name" title={item.name}>
                        #{idx + 1} {item.name}
                      </span>
                      <span className="item-val">
                        {item.value} lot ({pct.toFixed(1)}%)
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
  );
};

// MAIN DISTRIBUTION SECTION
interface DistributionSectionProps {
  customerData: RND_NEWCODE_BY_CUSTOMER[];
  prodTypeData: RND_NEWCODE_BY_PRODTYPE[];
}

export const PrecisionRNDDistributionSection: React.FC<DistributionSectionProps> = React.memo(
  ({ customerData, prodTypeData }) => {
    // Chuẩn hóa dữ liệu theo khách hàng
    const formattedCustomerData = useMemo(() => {
      return (customerData || []).map((item) => {
        const itemAny = item as any;
        const ecnVal = itemAny.ECN || 0;
        return {
          name: item.CUST_NAME_KD || "Khác",
          value: (item.NEWCODE || 0) + ecnVal,
          newCode: item.NEWCODE,
          ecn: ecnVal,
        };
      });
    }, [customerData]);

    // Chuẩn hóa dữ liệu theo loại sản phẩm
    const formattedProdTypeData = useMemo(() => {
      return (prodTypeData || []).map((item) => {
        const itemAny = item as any;
        const ecnVal = itemAny.ECN || 0;
        return {
          name: itemAny.G_NAME_KD || item.PROD_TYPE || "Khác",
          value: (item.NEWCODE || 0) + ecnVal,
          newCode: item.NEWCODE,
          ecn: ecnVal,
        };
      });
    }, [prodTypeData]);

    return (
      <div className="precision-rnd-report__section">
        <div className="precision-rnd-report__sectionHeader">
          <div className="section-badge-title">
            <span className="icon-circle">
              <FiPieChart />
            </span>
            <span>Cơ Cấu Phát Triển Mã Mới (New Code Distribution)</span>
          </div>
        </div>

        <div className="two-col-grid">
          {/* CƠ CẤU THEO KHÁCH HÀNG */}
          <DonutAnalysisCard
            title="Cơ Cấu Theo Khách Hàng (By Customer)"
            data={formattedCustomerData}
            excelFileName="Newcode by Customer"
            rawExportData={customerData}
          />

          {/* CƠ CẤU THEO LOẠI SẢN PHẨM */}
          <DonutAnalysisCard
            title="Cơ Cấu Theo Loại Sản Phẩm (By Product Type)"
            data={formattedProdTypeData}
            excelFileName="Newcode by Prod Type"
            rawExportData={prodTypeData}
          />
        </div>
      </div>
    );
  }
);

PrecisionRNDDistributionSection.displayName = "PrecisionRNDDistributionSection";
