import React from "react";
import { FiPackage, FiDownload, FiLayers, FiTrendingUp } from "react-icons/fi";
import { getCompany } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import ChartWeeklyPO from "../../../../components/Chart/KD/ChartWeekLyPO";
import ChartWeekLy from "../../../../components/Chart/KD/KDWeeklyClosing";
import ChartPOBalance from "../../../../components/Chart/KD/KDPOBalanceChart";
import KDPOBalanceSummaryByYear from "../../../../components/Chart/KD/KDPOBalanceSummaryByYear";
import KDPOBalanceSummaryByCustomer from "../../../../components/Chart/KD/KDPOBalanceSummaryByCustomer";
import KDPOBalanceSummaryByWeek from "../../../../components/Chart/KD/KDPOBalanceSummaryByWeek";
import CustomerPobalancebyTypeNew from "../../../../components/DataTable/CustomerPoBalanceByTypeNew";
import {
  PO_BALANCE_CUSTOMER,
  PO_BALANCE_DETAIL,
  PO_BALANCE_SUMMARY,
  RunningPOData,
  WeekLyPOData,
} from "../../interfaces/kdInterface";
import { WeeklyClosingData } from "../../../../api/GlobalInterface";
import { WidgetData_POBalanceSummary } from "./kdReportQueries";

interface PrecisionKDPOSectionProps {
  poBalanceSummaryWdg: WidgetData_POBalanceSummary;
  runningPOData: WeekLyPOData[];
  customerNewPOByWeek: any[];
  thisWeekData: WeeklyClosingData[];
  runningPOBalanceData: RunningPOData[];
  pobalanceSummary: PO_BALANCE_SUMMARY[];
  pobalanceDetail: PO_BALANCE_DETAIL[];
  pobalanceCustomer: PO_BALANCE_CUSTOMER[];
  selectedYW: string;
  onSelectPOYear: (e: any) => void;
  onSelectPOWeek: (e: any) => void;
}

const PrecisionKDPOSection: React.FC<PrecisionKDPOSectionProps> = ({
  poBalanceSummaryWdg,
  runningPOData,
  customerNewPOByWeek,
  thisWeekData,
  runningPOBalanceData,
  pobalanceSummary,
  pobalanceDetail,
  pobalanceCustomer,
  selectedYW,
  onSelectPOYear,
  onSelectPOWeek,
}) => {
  return (
    <div className="precision-kd-section">
      <div className="precision-kd-section__header">
        <div className="section-badge-title">
          <span className="icon-circle" style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
            <FiPackage />
          </span>
          <span>Tình Hình Đơn Hàng & Tồn Đơn (Purchase Order & PO Balance)</span>
        </div>
      </div>

      {/* Thẻ Widget PO Balance Summary */}
      <div className="executive-card" style={{ borderLeft: "4px solid #10b981" }}>
        <div className="executive-card__header">
          <div className="executive-card__title-wrap">
            <FiLayers size={13} color="#059669" />
            <span className="executive-card__title">PO Balance Information (Tổng Hợp Tồn Đơn PO)</span>
          </div>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
              Số Lượng Tồn Đơn (PO Balance Qty)
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "JetBrains Mono", color: "#0f172a" }}>
              {(poBalanceSummaryWdg.po_balance_qty * 1).toLocaleString("en-US")} <span style={{ fontSize: "12px", color: "#64748b" }}>EA</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
              Giá Trị Tồn Đơn (Balance Amount)
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "JetBrains Mono", color: "#2563eb" }}>
              ${poBalanceSummaryWdg.po_balance_amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
              <span style={{ fontSize: "12px", color: "#64748b" }}>USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* PO By Week & Delivery By Week */}
      <div className="two-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPackage size={13} color="#2563eb" />
              <span className="executive-card__title">PO By Week (Nhận PO Theo Tuần)</span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(runningPOData, "WeeklyPO")}
                title="Xuất Excel PO theo tuần"
              >
                <FiDownload size={11} />
                <span>Excel 1</span>
              </button>
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => SaveExcel(customerNewPOByWeek, "WeeklyPO2")}
                title="Xuất Excel PO theo tuần chi tiết khách hàng"
              >
                <FiDownload size={11} />
                <span>Excel 2</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body">
            <ChartWeeklyPO data={runningPOData} />
          </div>
        </div>

        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#059669" />
              <span className="executive-card__title">Delivery By Week (Giao Hàng Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(thisWeekData, "WeeklyClosing")}
              title="Xuất Excel giao hàng theo tuần"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body">
            <ChartWeekLy data={thisWeekData} />
          </div>
        </div>
      </div>

      {/* PO Balance Trending By Week */}
      <div className="one-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#7c3aed" />
              <span className="executive-card__title">PO Balance Trending By Week (Xu Hướng Tồn Đơn Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(runningPOBalanceData, "RunningPOBalance")}
              title="Xuất Excel xu hướng tồn đơn"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <ChartPOBalance data={runningPOBalanceData} />
          </div>
        </div>
      </div>

      {/* Cụm Biểu Đồ Tương Tác Chỉ Cho CMS */}
      {getCompany() === "CMS" && (
        <>
          <div className="two-col-grid">
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiLayers size={13} color="#2563eb" />
                  <span className="executive-card__title">PO Balance Summary By Year (Nhấp chọn năm)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(pobalanceSummary, "RunningPOBalance")}
                  title="Xuất Excel tồn đơn theo năm"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body executive-card__body--chart-lg">
                <KDPOBalanceSummaryByYear data={pobalanceSummary} onClick={onSelectPOYear} />
              </div>
            </div>

            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiPackage size={13} color="#059669" />
                  <span className="executive-card__title">PO Balance Customer - {selectedYW}</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(pobalanceCustomer, "RunningPOBalance")}
                  title="Xuất Excel tồn đơn theo khách hàng"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body executive-card__body--chart-lg">
                <KDPOBalanceSummaryByCustomer data={pobalanceCustomer} />
              </div>
            </div>
          </div>

          <div className="one-col-grid">
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiLayers size={13} color="#d97706" />
                  <span className="executive-card__title">PO Balance Summary By Week (Tồn Đơn Theo Tuần)</span>
                  {selectedYW && (
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, backgroundColor: "#fef3c7", color: "#b45309", fontWeight: 700, fontFamily: "JetBrains Mono" }}>
                      {selectedYW.startsWith("Y") ? `Năm ${selectedYW.replace("Y", "")}` : selectedYW}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() => SaveExcel(pobalanceDetail, `POBalanceWeek_${selectedYW}`)}
                  title="Xuất Excel tồn đơn theo tuần"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body executive-card__body--chart-lg">
                <KDPOBalanceSummaryByWeek data={pobalanceDetail} onClick={onSelectPOWeek} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bảng Customer PO Balance By Product Type */}
      <div className="one-col-grid">
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiPackage size={13} color="#2563eb" />
              <span className="executive-card__title">Customer PO Balance By Product Type (Tồn Đơn Theo Loại Sản Phẩm)</span>
            </div>
          </div>
          <div className="executive-card__body">
            <CustomerPobalancebyTypeNew />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDPOSection);
