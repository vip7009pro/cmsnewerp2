import React from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { PQCSummary, PQC_PPM_DATA } from "../../interfaces/qcInterface";
import PQCFCOSTTABLE from "../../inspection/PQCFCOSTTABLE";
import PQCDailyFcost from "../../../../components/Chart/PQC/PQCDailyFcost";
import PQCWeeklyFcost from "../../../../components/Chart/PQC/PQCWeeklyFcost";
import PQCMonthlyFcost from "../../../../components/Chart/PQC/PQCMonthlyFcost";
import PQCYearlyFcost from "../../../../components/Chart/PQC/PQCYearlyFcost";

interface PrecisionPQCReportFCostSectionProps {
  inspectSummary: PQCSummary[];
  dailyppm: PQC_PPM_DATA[];
  weeklyppm: PQC_PPM_DATA[];
  monthlyppm: PQC_PPM_DATA[];
  yearlyppm: PQC_PPM_DATA[];
  onExportDailyFCost: () => void;
  onExportWeeklyFCost: () => void;
  onExportMonthlyFCost: () => void;
  onExportYearlyFCost: () => void;
}

export const PrecisionPQCReportFCostSection: React.FC<PrecisionPQCReportFCostSectionProps> = ({
  inspectSummary,
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
  onExportDailyFCost,
  onExportWeeklyFCost,
  onExportMonthlyFCost,
  onExportYearlyFCost,
}) => {
  return (
    <div className="precision-section">
      <div className="section-header">
        <div className="section-title">
          <MonetizationOnIcon style={{ color: "#10b981", fontSize: "1.1rem" }} />
          <span>3. CHI PHÍ TỔN THẤT CHẤT LƯỢNG (PQC F-COST STATUS)</span>
        </div>
      </div>

      {/* Bảng Tổng Hợp F-Cost Summary */}
      <div className="executive-chart-card fcost-summary-card">
        <div className="chart-card-header">
          <span className="chart-name">Bảng Tổng Hợp Chỉ Số F-Cost (PQC F-Cost Summary)</span>
        </div>
        <div className="fcost-table-wrapper">
          <PQCFCOSTTABLE data={inspectSummary} />
        </div>
      </div>

      {/* 4 Biểu đồ F-Cost Trending */}
      <div className="charts-grid-2col">
        {/* Daily F-Cost */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Chi Phí F-Cost Hàng Ngày (Daily F-Cost)</span>
            <button className="btn-export-excel" onClick={onExportDailyFCost} title="Xuất Daily F-Cost ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCDailyFcost dldata={[...dailyppm].reverse()} processColor="#8b5cf6" materialColor="#38bdf8" />
          </div>
        </div>

        {/* Weekly F-Cost */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Chi Phí F-Cost Hàng Tuần (Weekly F-Cost)</span>
            <button className="btn-export-excel" onClick={onExportWeeklyFCost} title="Xuất Weekly F-Cost ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCWeeklyFcost dldata={[...weeklyppm].reverse()} processColor="#8b5cf6" materialColor="#38bdf8" />
          </div>
        </div>

        {/* Monthly F-Cost */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Chi Phí F-Cost Hàng Tháng (Monthly F-Cost)</span>
            <button className="btn-export-excel" onClick={onExportMonthlyFCost} title="Xuất Monthly F-Cost ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCMonthlyFcost dldata={[...monthlyppm].reverse()} processColor="#8b5cf6" materialColor="#38bdf8" />
          </div>
        </div>

        {/* Yearly F-Cost */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Chi Phí F-Cost Hàng Năm (Yearly F-Cost)</span>
            <button className="btn-export-excel" onClick={onExportYearlyFCost} title="Xuất Yearly F-Cost ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCYearlyFcost dldata={[...yearlyppm].reverse()} processColor="#8b5cf6" materialColor="#38bdf8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQCReportFCostSection);
