import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PieChartIcon from "@mui/icons-material/PieChart";
import OQCNGByCustomer from "../../../../components/Chart/OQC/OQCNGByCustomer";
import OQCNGByProdType from "../../../../components/Chart/OQC/OQCNGByProdType";
import { OQC_NG_BY_CUSTOMER, OQC_NG_BY_PRODTYPE } from "../../interfaces/qcInterface";

interface Props {
  oqcNGByCustomer: OQC_NG_BY_CUSTOMER[];
  oqcNGByProdType: OQC_NG_BY_PRODTYPE[];
  onExportCustomer: () => void;
  onExportProdType: () => void;
}

export const PrecisionOQCReportCustomerProdSection: React.FC<Props> = ({
  oqcNGByCustomer,
  oqcNGByProdType,
  onExportCustomer,
  onExportProdType,
}) => {
  return (
    <section className="poqc-section">
      <div className="poqc-section__header">
        <div className="poqc-section__title-group">
          <PieChartIcon style={{ fontSize: 18, color: "#d97706" }} />
          <h2 className="poqc-section__title">3. Phân Bổ Sự Cố Theo Khách Hàng & Chủng Loại Sản Phẩm</h2>
          <span className="poqc-section__tag">DEEP BREAKDOWN</span>
        </div>
      </div>

      <div className="poqc-section__grid">
        {/* Card 1: NG By Customer */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge" style={{ background: "#eff6ff", color: "#2563eb" }}>
                CUSTOMER
              </span>
              <span className="poqc-chart-card__title">Sự Cố Theo Khách Hàng (NG By Customer)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportCustomer}
              title="Xuất dữ liệu Excel Khách Hàng"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body poqc-chart-card__chart-body--tall">
            <OQCNGByCustomer data={[...oqcNGByCustomer].reverse()} />
          </div>
        </div>

        {/* Card 2: NG By Product Type */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge" style={{ background: "#fffbeb", color: "#d97706" }}>
                PROD TYPE
              </span>
              <span className="poqc-chart-card__title">Sự Cố Theo Chủng Loại Sản Phẩm (NG By Product Type)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportProdType}
              title="Xuất dữ liệu Excel Chủng Loại SP"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body poqc-chart-card__chart-body--tall">
            <OQCNGByProdType data={[...oqcNGByProdType].reverse()} />
          </div>
        </div>
      </div>
    </section>
  );
};
