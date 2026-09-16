import React from "react";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { PQC_PPM_DATA } from "../../interfaces/qcInterface";
import PQCDailyNGRate from "../../../../components/Chart/PQC/PQCDailyNGRate";
import PQCWeeklyNGRate from "../../../../components/Chart/PQC/PQCWeeklyNGRate";
import PQCMonthlyNGRate from "../../../../components/Chart/PQC/PQCMonthlyNGRate";
import PQCYearlyNGRate from "../../../../components/Chart/PQC/PQCYearlyNGRate";

interface PrecisionPQCReportPPMSectionProps {
  dailyppm: PQC_PPM_DATA[];
  weeklyppm: PQC_PPM_DATA[];
  monthlyppm: PQC_PPM_DATA[];
  yearlyppm: PQC_PPM_DATA[];
  onExportDaily: () => void;
  onExportWeekly: () => void;
  onExportMonthly: () => void;
  onExportYearly: () => void;
}

export const PrecisionPQCReportPPMSection: React.FC<PrecisionPQCReportPPMSectionProps> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
  onExportDaily,
  onExportWeekly,
  onExportMonthly,
  onExportYearly,
}) => {
  return (
    <div className="precision-section">
      <div className="section-header">
        <div className="section-title">
          <ShowChartIcon style={{ color: "#2563eb", fontSize: "1.1rem" }} />
          <span>1. XU HƯỚNG TỶ LỆ LỖI PQC (PQC NG RATE TRENDING)</span>
        </div>
      </div>

      <div className="charts-grid-2col">
        {/* Daily NG Rate */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Tỷ Lệ Lỗi Hàng Ngày (Daily NG Rate)</span>
            <button className="btn-export-excel" onClick={onExportDaily} title="Xuất dữ liệu Daily PPM ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCDailyNGRate dldata={[...dailyppm].reverse()} processColor="#10b981" materialColor="#f43f5e" />
          </div>
        </div>

        {/* Weekly NG Rate */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Tỷ Lệ Lỗi Hàng Tuần (Weekly NG Rate)</span>
            <button className="btn-export-excel" onClick={onExportWeekly} title="Xuất dữ liệu Weekly PPM ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCWeeklyNGRate dldata={[...weeklyppm].reverse()} processColor="#10b981" materialColor="#f43f5e" />
          </div>
        </div>

        {/* Monthly NG Rate */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Tỷ Lệ Lỗi Hàng Tháng (Monthly NG Rate)</span>
            <button className="btn-export-excel" onClick={onExportMonthly} title="Xuất dữ liệu Monthly PPM ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCMonthlyNGRate dldata={[...monthlyppm].reverse()} processColor="#10b981" materialColor="#f43f5e" />
          </div>
        </div>

        {/* Yearly NG Rate */}
        <div className="executive-chart-card">
          <div className="chart-card-header">
            <span className="chart-name">Tỷ Lệ Lỗi Hàng Năm (Yearly NG Rate)</span>
            <button className="btn-export-excel" onClick={onExportYearly} title="Xuất dữ liệu Yearly PPM ra Excel">
              <FileDownloadIcon style={{ fontSize: "0.85rem" }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="chart-content">
            <PQCYearlyNGRate dldata={[...yearlyppm].reverse()} processColor="#10b981" materialColor="#f43f5e" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQCReportPPMSection);
