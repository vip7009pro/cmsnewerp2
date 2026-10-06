import React, { useMemo } from "react";
import {
  FiActivity,
  FiDownload,
  FiChevronUp,
  FiChevronDown,
  FiLayers,
  FiCpu,
  FiTool,
  FiSliders,
} from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  MACHINE_LIST,
  PROD_PLAN_CAPA_DATA,
} from "../../interfaces/khsxInterface";
import PrecisionLongTermCapaChart from "./PrecisionLongTermCapaChart";

interface PrecisionLongTermCapaSectionProps {
  capaData: PROD_PLAN_CAPA_DATA[];
  machineList?: MACHINE_LIST[];
  activeTab: string;
  isCollapsed: boolean;
  onTabChange: (tab: string) => void;
  onToggleCollapse: () => void;
}

interface SeriesMeta {
  color: string;
  label: string;
  icon: React.ReactNode;
}

const KNOWN_SERIES_META: Record<
  string,
  { color: string; label: string; icon: React.ReactNode }
> = {
  FR: { color: "#4f46e5", label: "Dập FR", icon: <FiCpu /> },
  SR: { color: "#059669", label: "Dập SR", icon: <FiLayers /> },
  DC: { color: "#d97706", label: "Dán DC", icon: <FiTool /> },
  ED: { color: "#e11d48", label: "Bế ED", icon: <FiSliders /> },
  SP: { color: "#0891b2", label: "In SP", icon: <FiCpu /> },
  IN: { color: "#7c3aed", label: "In Lụa", icon: <FiActivity /> },
};

const PALETTE = [
  "#4f46e5",
  "#059669",
  "#d97706",
  "#e11d48",
  "#0891b2",
  "#7c3aed",
  "#2563eb",
  "#ea580c",
  "#0d9488",
  "#db2777",
];

const getSeriesMeta = (series: string, index: number): SeriesMeta => {
  const upper = series?.toUpperCase() || "";
  if (KNOWN_SERIES_META[upper]) {
    return KNOWN_SERIES_META[upper];
  }
  const color = PALETTE[index % PALETTE.length];
  return {
    color,
    label: `Công Đoạn ${series}`,
    icon: <FiCpu />,
  };
};

const PrecisionLongTermCapaSection: React.FC<PrecisionLongTermCapaSectionProps> = ({
  capaData,
  machineList = [],
  activeTab,
  isCollapsed,
  onTabChange,
  onToggleCollapse,
}) => {
  // 1. Trích xuất danh sách dòng máy (loại bỏ 'NA', 'NO', 'ALL')
  const seriesList = useMemo(() => {
    const listFromMachines = (machineList || [])
      .map((m) => m.EQ_NAME)
      .filter(
        (name) => name && name !== "NA" && name !== "NO" && name !== "ALL"
      );

    const set = new Set(listFromMachines);
    (capaData || []).forEach((item) => {
      if (
        item.EQ_SERIES &&
        item.EQ_SERIES !== "NA" &&
        item.EQ_SERIES !== "NO" &&
        item.EQ_SERIES !== "ALL"
      ) {
        set.add(item.EQ_SERIES);
      }
    });

    // Fallback nếu chưa có dữ liệu nạp
    if (set.size === 0) {
      ["FR", "SR", "DC", "ED"].forEach((s) => set.add(s));
    }

    return Array.from(set);
  }, [machineList, capaData]);

  // 2. Nhóm dữ liệu Capa theo từng dòng máy
  const seriesDataMap = useMemo(() => {
    const map = new Map<string, PROD_PLAN_CAPA_DATA[]>();
    seriesList.forEach((s) => map.set(s, []));
    (capaData || []).forEach((item) => {
      if (map.has(item.EQ_SERIES)) {
        map.get(item.EQ_SERIES)!.push(item);
      }
    });
    return map;
  }, [seriesList, capaData]);

  const isSingle = activeTab !== "ALL";
  const chartHeight = isSingle ? 280 : 210;

  // Lọc danh sách dòng máy cần hiển thị theo tab đang chọn
  const visibleSeries = useMemo(() => {
    if (activeTab === "ALL") return seriesList;
    return seriesList.filter((s) => s === activeTab);
  }, [activeTab, seriesList]);

  return (
    <div className="precision-longterm-capa-section">
      {/* 1. Header Bar của khối biểu đồ */}
      <div className="precision-longterm-capa-section__header">
        <div className="precision-longterm-capa-section__title-wrap">
          <span className="icon-badge">
            <FiActivity />
          </span>
          <div>
            <span className="title">Biểu Đồ Năng Lực Sản Xuất (Production Capa Analytics)</span>
            <span className="subtitle" style={{ marginLeft: 8 }}>
              Tải theo ngày & chuỗi máy
            </span>
          </div>
        </div>

        <div className="precision-longterm-capa-section__controls">
          {/* Dynamic Tab Switcher */}
          <div className="capa-tabs">
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "ALL" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("ALL")}
            >
              Tất cả ({seriesList.length} máy)
            </button>
            {seriesList.map((series, idx) => {
              const meta = getSeriesMeta(series, idx);
              return (
                <button
                  key={series}
                  type="button"
                  className={`capa-tab-btn ${activeTab === series ? "capa-tab-btn--active" : ""}`}
                  onClick={() => onTabChange(series)}
                >
                  {series} ({meta.label})
                </button>
              );
            })}
          </div>

          {/* Toggle Thu gọn / Mở rộng */}
          <button
            type="button"
            className="btn-toggle-capa"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Mở rộng biểu đồ" : "Thu gọn biểu đồ để xem bảng rộng hơn"}
          >
            {isCollapsed ? (
              <>
                <FiChevronDown size={13} />
                <span>Mở biểu đồ</span>
              </>
            ) : (
              <>
                <FiChevronUp size={13} />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Body lưới hiển thị các Executive Cards động */}
      {!isCollapsed && (
        <div
          className={`precision-longterm-capa-section__grid ${
            isSingle ? "precision-longterm-capa-section__grid--single" : ""
          }`}
        >
          {visibleSeries.map((series, idx) => {
            const meta = getSeriesMeta(series, idx);
            const seriesData = seriesDataMap.get(series) || [];
            const upper = series.toUpperCase();
            const isKnown = ["FR", "SR", "DC", "ED"].includes(upper);
            const knownClass = isKnown ? `executive-card--${upper.toLowerCase()}` : "";

            return (
              <div
                key={series}
                className={`executive-card ${knownClass}`}
                style={
                  !isKnown
                    ? {
                        borderTop: `3px solid ${meta.color}`,
                      }
                    : undefined
                }
              >
                <div className="executive-card__header">
                  <div className="executive-card__title-wrap">
                    <span
                      className="executive-card__icon-circle"
                      style={
                        !isKnown
                          ? {
                              backgroundColor: `${meta.color}15`,
                              color: meta.color,
                            }
                          : undefined
                      }
                    >
                      {meta.icon}
                    </span>
                    <span className="executive-card__title">
                      {series} PLAN CAPA ({meta.label})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="executive-card__btn-excel"
                    onClick={() => SaveExcel(seriesData, `${series}_PLAN_CAPA`)}
                    title={`Xuất Excel dữ liệu ${series} Capa`}
                  >
                    <FiDownload size={10} />
                    <span>Excel</span>
                  </button>
                </div>
                <div className="executive-card__body">
                  <PrecisionLongTermCapaChart
                    data={seriesData}
                    barColor={meta.color}
                    chartHeight={chartHeight}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionLongTermCapaSection);
