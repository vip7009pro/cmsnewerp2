import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BarChartIcon from "@mui/icons-material/BarChart";
import InspectionDailyPPM from "../../../../components/Chart/INSPECTION/InspectionDailyPPM";
import InspectionWeeklyPPM from "../../../../components/Chart/INSPECTION/InspectionWeeklyPPM";
import InspectionMonthlyPPM from "../../../../components/Chart/INSPECTION/InspectionMonthlyPPM";
import InspectionYearlyPPM from "../../../../components/Chart/INSPECTION/InspectionYearlyPPM";
import {
  DailyPPMData,
  WeeklyPPMData,
  MonthlyPPMData,
  YearlyPPMData,
} from "../../interfaces/qcInterface";

interface Props {
  insp_dailyppm: DailyPPMData[];
  insp_weeklyppm: WeeklyPPMData[];
  insp_monthlyppm: MonthlyPPMData[];
  insp_yearlyppm: YearlyPPMData[];
  onExportDaily: () => void;
  onExportWeekly: () => void;
  onExportMonthly: () => void;
  onExportYearly: () => void;
}

export const PrecisionOQCReportInspectionPPMSection: React.FC<Props> = ({
  insp_dailyppm,
  insp_weeklyppm,
  insp_monthlyppm,
  insp_yearlyppm,
  onExportDaily,
  onExportWeekly,
  onExportMonthly,
  onExportYearly,
}) => {
  return (
    <section className="poqc-section">
      <div className="poqc-section__header">
        <div className="poqc-section__title-group">
          <BarChartIcon style={{ fontSize: 18, color: "#10b981" }} />
          <h2 className="poqc-section__title">2. Xu Hướng Chỉ Số PPM Kiểm Tra Xuất Hàng (Inspection PPM Trending)</h2>
          <span className="poqc-section__tag">CMS EXCLUSIVE</span>
        </div>
      </div>

      <div className="poqc-section__grid">
        {/* Card 1: Daily Inspection PPM */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">NGÀY</span>
              <span className="poqc-chart-card__title">PPM Kiểm Tra Theo Ngày (Daily PPM)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportDaily}
              title="Xuất dữ liệu PPM ngày"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <InspectionDailyPPM
              dldata={[...insp_dailyppm].reverse()}
              processColor="#eeeb30"
              materialColor="#53eb34"
            />
          </div>
        </div>

        {/* Card 2: Weekly Inspection PPM */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">TUẦN</span>
              <span className="poqc-chart-card__title">PPM Kiểm Tra Theo Tuần (Weekly PPM)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportWeekly}
              title="Xuất dữ liệu PPM tuần"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <InspectionWeeklyPPM
              dldata={[...insp_weeklyppm].reverse()}
              processColor="#eeeb30"
              materialColor="#53eb34"
            />
          </div>
        </div>

        {/* Card 3: Monthly Inspection PPM */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">THÁNG</span>
              <span className="poqc-chart-card__title">PPM Kiểm Tra Theo Tháng (Monthly PPM)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportMonthly}
              title="Xuất dữ liệu PPM tháng"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <InspectionMonthlyPPM
              dldata={[...insp_monthlyppm].reverse()}
              processColor="#eeeb30"
              materialColor="#53eb34"
            />
          </div>
        </div>

        {/* Card 4: Yearly Inspection PPM */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">NĂM</span>
              <span className="poqc-chart-card__title">PPM Kiểm Tra Theo Năm (Yearly PPM)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportYearly}
              title="Xuất dữ liệu PPM năm"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <InspectionYearlyPPM
              dldata={[...insp_yearlyppm].reverse()}
              processColor="#eeeb30"
              materialColor="#53eb34"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
