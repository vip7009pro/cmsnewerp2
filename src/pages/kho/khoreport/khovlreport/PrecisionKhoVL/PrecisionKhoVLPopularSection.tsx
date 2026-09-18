import React, { useMemo, useState } from "react";
import { FiPieChart, FiDownload, FiSearch } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import PrecisionWhPieChart from "../../components/PrecisionWhPieChart";
import AGTable from "../../../../../components/DataTable/AGTable";
import {
  MSTOCK_BY_POPULAR_DATA,
  MSTOCK_BY_POPULAR_DETAIL_DATA,
  M_INPUT_BY_POPULAR_DATA,
  M_INPUT_BY_POPULAR_DETAIL_DATA,
  M_OUTPUT_BY_POPULAR_DATA,
  M_OUTPUT_BY_POPULAR_DETAIL_DATA,
} from "../../../../interfaces/khoInterface";
import moment from "moment";

interface Props {
  stockPopular: MSTOCK_BY_POPULAR_DATA[];
  stockPopularDetail: MSTOCK_BY_POPULAR_DETAIL_DATA[];
  inputPopular: M_INPUT_BY_POPULAR_DATA[];
  inputPopularDetail: M_INPUT_BY_POPULAR_DETAIL_DATA[];
  outputPopular: M_OUTPUT_BY_POPULAR_DATA[];
  outputPopularDetail: M_OUTPUT_BY_POPULAR_DETAIL_DATA[];
  fromDate: string;
  toDate: string;
}

const PrecisionKhoVLPopularSection: React.FC<Props> = ({
  stockPopular, stockPopularDetail,
  inputPopular, inputPopularDetail,
  outputPopular, outputPopularDetail,
  fromDate, toDate,
}) => {
  const [stockSearch, setStockSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [outputSearch, setOutputSearch] = useState("");

  const previousMonth = moment().subtract(1, "month");
  const firstDay = previousMonth.clone().startOf("month").format("YYYY-MM-DD");
  const lastDay = previousMonth.clone().endOf("month").format("YYYY-MM-DD");

  const filteredStock = useMemo(() => {
    const kw = stockSearch.toLowerCase();
    return kw
      ? stockPopularDetail.filter(
          (d) =>
            d.M_CODE?.toLowerCase().includes(kw) ||
            d.M_NAME?.toLowerCase().includes(kw) ||
            d.PHANLOAI?.toLowerCase().includes(kw)
        )
      : stockPopularDetail;
  }, [stockPopularDetail, stockSearch]);

  const filteredInput = useMemo(() => {
    const kw = inputSearch.toLowerCase();
    return kw
      ? inputPopularDetail.filter(
          (d) =>
            d.M_CODE?.toLowerCase().includes(kw) ||
            d.M_NAME?.toLowerCase().includes(kw) ||
            d.PHANLOAI?.toLowerCase().includes(kw)
        )
      : inputPopularDetail;
  }, [inputPopularDetail, inputSearch]);

  const filteredOutput = useMemo(() => {
    const kw = outputSearch.toLowerCase();
    return kw
      ? outputPopularDetail.filter(
          (d) =>
            d.M_CODE?.toLowerCase().includes(kw) ||
            d.M_NAME?.toLowerCase().includes(kw) ||
            d.PHANLOAI?.toLowerCase().includes(kw)
        )
      : outputPopularDetail;
  }, [outputPopularDetail, outputSearch]);

  return (
    <div className="precision-khovl__section">
      {/* Section Header */}
      <div className="precision-khovl__section-header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiPieChart /></span>
          <span>
            1. Tình Hình Nhập / Xuất / Tồn Theo Độ Thông Dụng ({fromDate} → {toDate})
          </span>
        </div>
        <span className="section-note">
          A: &gt;5,000 m² | B: 500–5,000 m² | C: ≤500 m² — dựa trên xuất tháng trước ({firstDay} – {lastDay})
        </span>
      </div>

      {/* Hàng 1: 3 Pie Charts */}
      <div className="two-col-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {/* Tồn Popular */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#0369a1" />
              <span>Tồn Liệu Theo Thông Dụng</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(stockPopular, "Stock_Popular")}
            >
              <FiDownload size={10} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart">
            <PrecisionWhPieChart
              title="Tồn Liệu Theo Thông Dụng"
              rawItems={stockPopular}
              nameKey="PHANLOAI"
              valueKey="TOTAL_STOCK"
              unit="m²"
              labelsMap={{
                A: "Thông dụng (>5k m²)",
                B: "Ít thông dụng (0.5-5k m²)",
                C: "Tồn xấu (≤500 m²)",
              }}
              colorsMap={{
                A: "#059669",
                B: "#d97706",
                C: "#dc2626",
              }}
              excelFileName="Stock_Popular"
            />
          </div>
        </div>

        {/* Input Popular */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#059669" />
              <span>Nhập Liệu Theo Thông Dụng</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(inputPopular, "Input_Popular")}
            >
              <FiDownload size={10} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart">
            <PrecisionWhPieChart
              title="Nhập Liệu Theo Thông Dụng"
              rawItems={inputPopular}
              nameKey="PHANLOAI"
              valueKey="IN_SQM"
              unit="m²"
              labelsMap={{
                A: "Thông dụng",
                B: "Ít thông dụng",
                C: "Tồn xấu",
              }}
              colorsMap={{
                A: "#059669",
                B: "#d97706",
                C: "#dc2626",
              }}
              excelFileName="Input_Popular"
            />
          </div>
        </div>

        {/* Output Popular */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPieChart size={13} color="#d97706" />
              <span>Xuất Liệu Theo Thông Dụng</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(outputPopular, "Output_Popular")}
            >
              <FiDownload size={10} /><span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart">
            <PrecisionWhPieChart
              title="Xuất Liệu Theo Thông Dụng"
              rawItems={outputPopular}
              nameKey="PHANLOAI"
              valueKey="OUT_SQM"
              unit="m²"
              labelsMap={{
                A: "Thông dụng",
                B: "Ít thông dụng",
                C: "Tồn xấu",
              }}
              colorsMap={{
                A: "#059669",
                B: "#d97706",
                C: "#dc2626",
              }}
              excelFileName="Output_Popular"
            />
          </div>
        </div>
      </div>

      {/* Hàng 2: 3 Detail AGTables */}
      <div className="two-col-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {/* Stock Detail */}
        <div className="precision-khovl__grid-container">
          <div className="precision-khovl__grid-toolbar">
            <div className="precision-khovl__grid-toolbar-left">
              <span className="precision-khovl__grid-toolbar-title">Chi Tiết Tồn Thông Dụng</span>
              <div className="precision-khovl__search-box">
                <FiSearch size={11} color="#94a3b8" />
                <input
                  placeholder="Lọc nhanh..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="precision-khovl__grid-actions">
              <button
                className="precision-khovl__grid-btn precision-khovl__grid-btn--excel"
                onClick={() => SaveExcel(filteredStock, "StockPopularDetail")}
              >
                <FiDownload size={10} /><span>Excel</span>
              </button>
            </div>
          </div>
          <div className="precision-khovl__grid-body">
            <AGTable showFilter={false} data={filteredStock} />
          </div>
        </div>

        {/* Input Detail */}
        <div className="precision-khovl__grid-container">
          <div className="precision-khovl__grid-toolbar">
            <div className="precision-khovl__grid-toolbar-left">
              <span className="precision-khovl__grid-toolbar-title">Chi Tiết Nhập Thông Dụng</span>
              <div className="precision-khovl__search-box">
                <FiSearch size={11} color="#94a3b8" />
                <input
                  placeholder="Lọc nhanh..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="precision-khovl__grid-actions">
              <button
                className="precision-khovl__grid-btn precision-khovl__grid-btn--excel"
                onClick={() => SaveExcel(filteredInput, "InputPopularDetail")}
              >
                <FiDownload size={10} /><span>Excel</span>
              </button>
            </div>
          </div>
          <div className="precision-khovl__grid-body">
            <AGTable showFilter={false} data={filteredInput} />
          </div>
        </div>

        {/* Output Detail */}
        <div className="precision-khovl__grid-container">
          <div className="precision-khovl__grid-toolbar">
            <div className="precision-khovl__grid-toolbar-left">
              <span className="precision-khovl__grid-toolbar-title">Chi Tiết Xuất Thông Dụng</span>
              <div className="precision-khovl__search-box">
                <FiSearch size={11} color="#94a3b8" />
                <input
                  placeholder="Lọc nhanh..."
                  value={outputSearch}
                  onChange={(e) => setOutputSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="precision-khovl__grid-actions">
              <button
                className="precision-khovl__grid-btn precision-khovl__grid-btn--excel"
                onClick={() => SaveExcel(filteredOutput, "OutputPopularDetail")}
              >
                <FiDownload size={10} /><span>Excel</span>
              </button>
            </div>
          </div>
          <div className="precision-khovl__grid-body">
            <AGTable showFilter={false} data={filteredOutput} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKhoVLPopularSection);
