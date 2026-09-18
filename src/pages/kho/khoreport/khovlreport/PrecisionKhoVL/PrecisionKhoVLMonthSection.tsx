import React, { useMemo, useState } from "react";
import { FiClock, FiDownload, FiSearch } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import PrecisionWhPieChart from "../../components/PrecisionWhPieChart";
import AGTable from "../../../../../components/DataTable/AGTable";
import {
  MSTOCK_BY_POPULAR_DATA,
  MSTOCK_BY_POPULAR_DETAIL_DATA,
} from "../../../../interfaces/khoInterface";

interface Props {
  stockPopularMonth: MSTOCK_BY_POPULAR_DATA[];
  stockMonthDetailA: MSTOCK_BY_POPULAR_DETAIL_DATA[];
  stockMonthDetailB: MSTOCK_BY_POPULAR_DETAIL_DATA[];
  stockMonthDetailC: MSTOCK_BY_POPULAR_DETAIL_DATA[];
  moc1: number;
  moc2: number;
}

const PrecisionKhoVLMonthSection: React.FC<Props> = ({
  stockPopularMonth,
  stockMonthDetailA, stockMonthDetailB, stockMonthDetailC,
  moc1, moc2,
}) => {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [searchC, setSearchC] = useState("");

  const filterData = (data: MSTOCK_BY_POPULAR_DETAIL_DATA[], kw: string) => {
    if (!kw) return data;
    const k = kw.toLowerCase();
    return data.filter(
      (d) =>
        d.M_CODE?.toLowerCase().includes(k) ||
        d.M_NAME?.toLowerCase().includes(k)
    );
  };

  const filteredA = useMemo(() => filterData(stockMonthDetailA, searchA), [stockMonthDetailA, searchA]);
  const filteredB = useMemo(() => filterData(stockMonthDetailB, searchB), [stockMonthDetailB, searchB]);
  const filteredC = useMemo(() => filterData(stockMonthDetailC, searchC), [stockMonthDetailC, searchC]);

  const tableConfigs = [
    {
      label: `Detail A — Tồn dưới ${moc1} tháng`,
      data: filteredA,
      search: searchA,
      setSearch: setSearchA,
      exportName: `StockByMonth_A_lt${moc1}m`,
      color: "#059669",
      badge: "A",
      badgeBg: "#dcfce7",
      badgeColor: "#15803d",
    },
    {
      label: `Detail B — ${moc1}–${moc2} tháng`,
      data: filteredB,
      search: searchB,
      setSearch: setSearchB,
      exportName: `StockByMonth_B_${moc1}-${moc2}m`,
      color: "#d97706",
      badge: "B",
      badgeBg: "#fef3c7",
      badgeColor: "#b45309",
    },
    {
      label: `Detail C — Tồn trên ${moc2} tháng`,
      data: filteredC,
      search: searchC,
      setSearch: setSearchC,
      exportName: `StockByMonth_C_gt${moc2}m`,
      color: "#dc2626",
      badge: "C",
      badgeBg: "#fee2e2",
      badgeColor: "#b91c1c",
    },
  ];

  return (
    <div className="precision-khovl__section">
      {/* Section Header */}
      <div className="precision-khovl__section-header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiClock /></span>
          <span>2. Tình Hình Tồn Liệu Dài Hạn</span>
        </div>
        <span className="section-note">
          A: tồn &lt; {moc1} tháng &nbsp;|&nbsp; B: {moc1}–{moc2} tháng &nbsp;|&nbsp; C: tồn &gt; {moc2} tháng
        </span>
      </div>

      {/* Pie chart Tồn By Month */}
      <div className="executive-card">
        <div className="executive-card__header">
          <div className="executive-card__title-wrap">
            <FiClock size={13} color="#7c3aed" />
            <span>Tồn Liệu Phân Loại Dài Hạn (Stock By Month Category)</span>
          </div>
          <button
            type="button"
            className="executive-card__btn-excel"
            onClick={() => SaveExcel(stockPopularMonth, "StockByMonth")}
          >
            <FiDownload size={10} /><span>Excel</span>
          </button>
        </div>
        <div className="executive-card__body executive-card__body--chart">
          <PrecisionWhPieChart
            title="Tồn Liệu Phân Loại Dài Hạn"
            rawItems={stockPopularMonth}
            nameKey="PHANLOAI"
            valueKey="TOTAL_STOCK"
            unit="m²"
            labelsMap={{
              A: `Tồn < ${moc1} tháng`,
              B: `${moc1}–${moc2} tháng`,
              C: `Tồn > ${moc2} tháng`,
            }}
            colorsMap={{
              A: "#059669",
              B: "#d97706",
              C: "#dc2626",
            }}
            excelFileName="StockByMonth"
          />
        </div>
      </div>

      {/* 3 Detail Tables */}
      <div className="three-col-grid">
        {tableConfigs.map((cfg) => (
          <div key={cfg.label} className="precision-khovl__grid-container">
            <div className="precision-khovl__grid-toolbar">
              <div className="precision-khovl__grid-toolbar-left">
                <span
                  style={{
                    display: "inline-block",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 800,
                    background: cfg.badgeBg,
                    color: cfg.badgeColor,
                  }}
                >
                  {cfg.badge}
                </span>
                <span className="precision-khovl__grid-toolbar-title">{cfg.label}</span>
                <div className="precision-khovl__search-box">
                  <FiSearch size={11} color="#94a3b8" />
                  <input
                    placeholder="Lọc nhanh..."
                    value={cfg.search}
                    onChange={(e) => cfg.setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="precision-khovl__grid-actions">
                <span className="precision-khovl__grid-toolbar-meta">
                  <strong>{cfg.data.length}</strong> dòng
                </span>
                <button
                  className="precision-khovl__grid-btn precision-khovl__grid-btn--excel"
                  onClick={() => SaveExcel(cfg.data, cfg.exportName)}
                >
                  <FiDownload size={10} /><span>Excel</span>
                </button>
              </div>
            </div>
            <div className="precision-khovl__grid-body">
              <AGTable showFilter={false} data={cfg.data} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionKhoVLMonthSection);
