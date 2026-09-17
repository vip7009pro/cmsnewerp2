import React, { useMemo } from "react";
import { FiActivity, FiDownload, FiChevronUp, FiChevronDown, FiLayers, FiCpu, FiTool, FiSliders } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import { PROD_PLAN_CAPA_DATA } from "../../interfaces/khsxInterface";
import PrecisionLongTermCapaChart from "./PrecisionLongTermCapaChart";

interface PrecisionLongTermCapaSectionProps {
  capaData: PROD_PLAN_CAPA_DATA[];
  activeTab: "ALL" | "FR" | "SR" | "DC" | "ED";
  isCollapsed: boolean;
  onTabChange: (tab: "ALL" | "FR" | "SR" | "DC" | "ED") => void;
  onToggleCollapse: () => void;
}

const PrecisionLongTermCapaSection: React.FC<PrecisionLongTermCapaSectionProps> = ({
  capaData,
  activeTab,
  isCollapsed,
  onTabChange,
  onToggleCollapse,
}) => {
  const frData = useMemo(
    () => capaData.filter((item) => item.EQ_SERIES === "FR"),
    [capaData]
  );
  const srData = useMemo(
    () => capaData.filter((item) => item.EQ_SERIES === "SR"),
    [capaData]
  );
  const dcData = useMemo(
    () => capaData.filter((item) => item.EQ_SERIES === "DC"),
    [capaData]
  );
  const edData = useMemo(
    () => capaData.filter((item) => item.EQ_SERIES === "ED"),
    [capaData]
  );

  const showFR = activeTab === "ALL" || activeTab === "FR";
  const showSR = activeTab === "ALL" || activeTab === "SR";
  const showDC = activeTab === "ALL" || activeTab === "DC";
  const showED = activeTab === "ALL" || activeTab === "ED";

  const isSingle = activeTab !== "ALL";
  const chartHeight = isSingle ? 280 : 210;

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
          {/* Tab Switcher */}
          <div className="capa-tabs">
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "ALL" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("ALL")}
            >
              Tất cả (4 máy)
            </button>
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "FR" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("FR")}
            >
              FR (Dập FR)
            </button>
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "SR" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("SR")}
            >
              SR (Dập SR)
            </button>
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "DC" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("DC")}
            >
              DC (Dán DC)
            </button>
            <button
              type="button"
              className={`capa-tab-btn ${activeTab === "ED" ? "capa-tab-btn--active" : ""}`}
              onClick={() => onTabChange("ED")}
            >
              ED (Bế ED)
            </button>
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

      {/* 2. Body lưới hiển thị các Executive Cards */}
      {!isCollapsed && (
        <div
          className={`precision-longterm-capa-section__grid ${
            isSingle ? "precision-longterm-capa-section__grid--single" : ""
          }`}
        >
          {/* FR Card */}
          {showFR && (
            <div className="executive-card executive-card--fr">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <span className="executive-card__icon-circle">
                    <FiCpu />
                  </span>
                  <span className="executive-card__title">FR PLAN CAPA (Công Đoạn FR)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(frData, "FR_PLAN_CAPA")}
                  title="Xuất Excel dữ liệu FR Capa"
                >
                  <FiDownload size={10} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <PrecisionLongTermCapaChart
                  data={frData}
                  barColor="#4f46e5"
                  chartHeight={chartHeight}
                />
              </div>
            </div>
          )}

          {/* SR Card */}
          {showSR && (
            <div className="executive-card executive-card--sr">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <span className="executive-card__icon-circle">
                    <FiLayers />
                  </span>
                  <span className="executive-card__title">SR PLAN CAPA (Công Đoạn SR)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(srData, "SR_PLAN_CAPA")}
                  title="Xuất Excel dữ liệu SR Capa"
                >
                  <FiDownload size={10} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <PrecisionLongTermCapaChart
                  data={srData}
                  barColor="#059669"
                  chartHeight={chartHeight}
                />
              </div>
            </div>
          )}

          {/* DC Card */}
          {showDC && (
            <div className="executive-card executive-card--dc">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <span className="executive-card__icon-circle">
                    <FiTool />
                  </span>
                  <span className="executive-card__title">DC PLAN CAPA (Công Đoạn DC)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(dcData, "DC_PLAN_CAPA")}
                  title="Xuất Excel dữ liệu DC Capa"
                >
                  <FiDownload size={10} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <PrecisionLongTermCapaChart
                  data={dcData}
                  barColor="#d97706"
                  chartHeight={chartHeight}
                />
              </div>
            </div>
          )}

          {/* ED Card */}
          {showED && (
            <div className="executive-card executive-card--ed">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <span className="executive-card__icon-circle">
                    <FiSliders />
                  </span>
                  <span className="executive-card__title">ED PLAN CAPA (Công Đoạn ED)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(edData, "ED_PLAN_CAPA")}
                  title="Xuất Excel dữ liệu ED Capa"
                >
                  <FiDownload size={10} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <PrecisionLongTermCapaChart
                  data={edData}
                  barColor="#e11d48"
                  chartHeight={chartHeight}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionLongTermCapaSection);
