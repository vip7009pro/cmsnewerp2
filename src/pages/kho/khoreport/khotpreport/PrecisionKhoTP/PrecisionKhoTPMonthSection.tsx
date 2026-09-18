import React, { useMemo, useState } from "react";
import { FiClock, FiDownload, FiSearch } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import PrecisionWhPieChart from "../../components/PrecisionWhPieChart";
import AGTable from "../../../../../components/DataTable/AGTable";
import {
  P_STOCK_BY_MONTH_DATA,
  P_STOCK_BY_MONTH_DETAIL_DATA,
} from "../../../../interfaces/khoInterface";

interface Props {
  stockPopularMonth: P_STOCK_BY_MONTH_DATA[];
  stockMonthDetailA: P_STOCK_BY_MONTH_DETAIL_DATA[];
  stockMonthDetailB: P_STOCK_BY_MONTH_DETAIL_DATA[];
  stockMonthDetailC: P_STOCK_BY_MONTH_DETAIL_DATA[];
  moc1: number;
  moc2: number;
}

const PrecisionKhoTPMonthSection: React.FC<Props> = ({
  stockPopularMonth,
  stockMonthDetailA, stockMonthDetailB, stockMonthDetailC,
  moc1, moc2,
}) => {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [searchC, setSearchC] = useState("");

  const filterData = (data: P_STOCK_BY_MONTH_DETAIL_DATA[], kw: string) => {
    if (!kw) return data;
    const k = kw.toLowerCase();
    return data.filter(
      (d) =>
        d.G_CODE?.toLowerCase().includes(k) ||
        d.G_NAME?.toLowerCase().includes(k) ||
        d.G_NAME_KD?.toLowerCase().includes(k)
    );
  };

  const filteredA = useMemo(() => filterData(stockMonthDetailA, searchA), [stockMonthDetailA, searchA]);
  const filteredB = useMemo(() => filterData(stockMonthDetailB, searchB), [stockMonthDetailB, searchB]);
  const filteredC = useMemo(() => filterData(stockMonthDetailC, searchC), [stockMonthDetailC, searchC]);

  const tableConfigs = [
    {
      label: `Tồn TP Loại A — < ${moc1} tháng`,
      data: filteredA,
      search: searchA,
      setSearch: setSearchA,
      exportName: `ProductStock_A_lt${moc1}m`,
      badge: "A",
      badgeBg: "#dcfce7",
      badgeColor: "#15803d",
    },
    {
      label: `Tồn TP Loại B — ${moc1}–${moc2} tháng`,
      data: filteredB,
      search: searchB,
      setSearch: setSearchB,
      exportName: `ProductStock_B_${moc1}-${moc2}m`,
      badge: "B",
      badgeBg: "#fef3c7",
      badgeColor: "#b45309",
    },
    {
      label: `Tồn TP Loại C — > ${moc2} tháng`,
      data: filteredC,
      search: searchC,
      setSearch: setSearchC,
      exportName: `ProductStock_C_gt${moc2}m`,
      badge: "C",
      badgeBg: "#fee2e2",
      badgeColor: "#b91c1c",
    },
  ];

  return (
    <div className="precision-khotp__section">
      {/* Section Header */}
      <div className="precision-khotp__section-header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiClock /></span>
          <span>Tình Hình Tồn Kho Thành Phẩm Dài Hạn</span>
        </div>
        <span className="section-note">
          A: &lt; {moc1} tháng &nbsp;|&nbsp; B: {moc1}–{moc2} tháng &nbsp;|&nbsp; C: &gt; {moc2} tháng
        </span>
      </div>

      {/* Pie chart Tồn By Month */}
      <div className="executive-card">
        <div className="executive-card__header">
          <div className="executive-card__title-wrap">
            <FiClock size={13} color="#7c3aed" />
            <span>Tồn Thành Phẩm Phân Loại Dài Hạn (Product Stock By Month)</span>
          </div>
          <button
            type="button"
            className="executive-card__btn-excel"
            onClick={() => SaveExcel(stockPopularMonth, "ProductStockByMonth")}
          >
            <FiDownload size={10} /><span>Excel</span>
          </button>
        </div>
        <div className="executive-card__body executive-card__body--chart">
          <PrecisionWhPieChart
            title="Tồn Thành Phẩm Phân Loại Dài Hạn"
            rawItems={stockPopularMonth}
            nameKey="PHANLOAI"
            valueKey="TOTAL_STOCK"
            unit="EA"
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
            excelFileName="ProductStockByMonth"
          />
        </div>
      </div>

      {/* 3 Detail Tables */}
      <div className="three-col-grid">
        {tableConfigs.map((cfg) => (
          <div key={cfg.label} className="precision-khotp__grid-container">
            <div className="precision-khotp__grid-toolbar">
              <div className="precision-khotp__grid-toolbar-left">
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
                <span className="precision-khotp__grid-toolbar-title">{cfg.label}</span>
                <div className="precision-khotp__search-box">
                  <FiSearch size={11} color="#94a3b8" />
                  <input
                    placeholder="Lọc nhanh..."
                    value={cfg.search}
                    onChange={(e) => cfg.setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="precision-khotp__grid-actions">
                <span className="precision-khotp__grid-toolbar-meta">
                  <strong>{cfg.data.length}</strong> dòng
                </span>
                <button
                  className="precision-khotp__grid-btn precision-khotp__grid-btn--excel"
                  onClick={() => SaveExcel(cfg.data, cfg.exportName)}
                >
                  <FiDownload size={10} /><span>Excel</span>
                </button>
              </div>
            </div>
            <div className="precision-khotp__grid-body">
              <AGTable showFilter={false} data={cfg.data} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionKhoTPMonthSection);
