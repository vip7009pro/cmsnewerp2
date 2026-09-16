import React from "react";
import { FiPieChart, FiDownload, FiUsers } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { CSChartCustomerIssue } from "./CSChartCustomerIssue";
import { CSChartPICIssue } from "./CSChartPICIssue";
import { CS_CONFIRM_BY_CUSTOMER_DATA } from "../../interfaces/qcInterface";

interface Props {
  csConfirmDataByCustomer: CS_CONFIRM_BY_CUSTOMER_DATA[];
  csConfirmDataByPIC: CS_CONFIRM_BY_CUSTOMER_DATA[];
}

export const PrecisionCSReportBreakdownSection: React.FC<Props> = ({
  csConfirmDataByCustomer,
  csConfirmDataByPIC,
}) => {
  return (
    <div className="pcs-section">
      <div className="pcs-section__header">
        <div className="pcs-section__title-group">
          <FiPieChart size={14} color="#7c3aed" />
          <h2 className="pcs-section__title">Phân Tích Cơ Cấu Sự Cố Theo Khách Hàng & PIC (Issue Breakdown Analytics)</h2>
          <span className="pcs-section__tag">Donut Intelligence</span>
        </div>
      </div>

      <div className="pcs-section__grid">
        {/* Customer Issue Donut Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiPieChart size={12} color="#2563eb" />
              <span className="pcs-chart-card__title">Sự Cố Theo Khách Hàng (Customer Breakdown)</span>
              <span className="pcs-chart-card__badge">{csConfirmDataByCustomer.length} Đối Tác</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csConfirmDataByCustomer, "CS_Issue_By_Customer")}
              title="Xuất Excel sự cố theo khách hàng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body pcs-chart-card__chart-body--tall">
            <CSChartCustomerIssue data={csConfirmDataByCustomer} />
          </div>
        </div>

        {/* PIC Issue Donut Card */}
        <div className="pcs-chart-card">
          <div className="pcs-chart-card__top">
            <div className="pcs-chart-card__title-area">
              <FiUsers size={12} color="#0284c7" />
              <span className="pcs-chart-card__title">Sự Cố Theo Nhân Sự PIC (PIC Breakdown)</span>
              <span className="pcs-chart-card__badge">{csConfirmDataByPIC.length} Nhân Sự</span>
            </div>
            <button
              type="button"
              className="pcs-chart-card__btn-excel"
              onClick={() => SaveExcel(csConfirmDataByPIC, "CS_Issue_By_PIC")}
              title="Xuất Excel sự cố theo nhân sự PIC"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="pcs-chart-card__chart-body pcs-chart-card__chart-body--tall">
            <CSChartPICIssue data={csConfirmDataByPIC} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCSReportBreakdownSection);
