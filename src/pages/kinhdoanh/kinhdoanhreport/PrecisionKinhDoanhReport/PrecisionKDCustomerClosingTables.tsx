import React from "react";
import { FiTable, FiDownload } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import CustomerDailyClosing from "../../../../components/DataTable/CustomerDailyClosing";
import CustomerWeeklyClosing from "../../../../components/DataTable/CustomerWeeklyClosing";
import CustomerMonthlyClosing from "../../../../components/DataTable/CustomerMonthlyClosing";

interface PrecisionKDCustomerClosingTablesProps {
  dailyClosingData: any[];
  columns: any[];
  weeklyClosingData: any[];
  columnsweek: any[];
  monthlyvRevenuebyCustomer: any[];
  columnsmonth: any[];
}

const PrecisionKDCustomerClosingTables: React.FC<PrecisionKDCustomerClosingTablesProps> = ({
  dailyClosingData,
  columns,
  weeklyClosingData,
  columnsweek,
  monthlyvRevenuebyCustomer,
  columnsmonth,
}) => {
  return (
    <div className="precision-kd-section">
      <div className="precision-kd-section__header">
        <div className="section-badge-title">
          <span className="icon-circle"><FiTable /></span>
          <span>Bảng Biểu Chi Tiết Khách Hàng (Customer Closing Ledgers)</span>
        </div>
      </div>

      {/* 2 Bảng: Daily & Weekly Closing */}
      <div className="two-col-grid">
        {/* Customer Daily Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTable size={13} color="#2563eb" />
              <span className="executive-card__title">Customer Daily Closing (Khách Hàng Theo Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyClosingData, "CustomerDailyClosing")}
              title="Xuất Excel dữ liệu khách hàng theo ngày"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <CustomerDailyClosing data={dailyClosingData} columns={columns} />
          </div>
        </div>

        {/* Customer Weekly Closing */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTable size={13} color="#059669" />
              <span className="executive-card__title">Customer Weekly Closing (Khách Hàng Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyClosingData, "CustomerWeeklyClosing")}
              title="Xuất Excel dữ liệu khách hàng theo tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <CustomerWeeklyClosing data={weeklyClosingData} columns={columnsweek} />
          </div>
        </div>
      </div>

      {/* Bảng Customer Monthly Closing */}
      <div className="one-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTable size={13} color="#d97706" />
              <span className="executive-card__title">Customer Monthly Closing (Khách Hàng Theo Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyvRevenuebyCustomer, "CustomerMonthlyClosing")}
              title="Xuất Excel dữ liệu khách hàng theo tháng"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <CustomerMonthlyClosing data={monthlyvRevenuebyCustomer} columns={columnsmonth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDCustomerClosingTables);
