import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InspectionDailyFcost from "../../../../components/Chart/INSPECTION/InspectDailyFcost";
import InspectionWeeklyFcost from "../../../../components/Chart/INSPECTION/InspectWeeklyFcost";
import InspectionMonthlyFcost from "../../../../components/Chart/INSPECTION/InspectMonthlyFcost";
import InspectionYearlyFcost from "../../../../components/Chart/INSPECTION/InspectYearlyFcost";
import { InspectSummary, DailyPPMData, WeeklyPPMData, MonthlyPPMData, YearlyPPMData } from "../../interfaces/qcInterface";

interface Props {
  dailyFcostData: InspectSummary[];
  weeklyFcostData: InspectSummary[];
  monthlyFcostData: InspectSummary[];
  annualyFcostData: InspectSummary[];
  dailyppm: DailyPPMData[];
  weeklyppm: WeeklyPPMData[];
  monthlyppm: MonthlyPPMData[];
  yearlyppm: YearlyPPMData[];
  onExportDaily: () => void;
  onExportWeekly: () => void;
  onExportMonthly: () => void;
  onExportYearly: () => void;
}

export const PrecisionInspectReportFCostSection: React.FC<Props> = ({
  dailyFcostData, weeklyFcostData, monthlyFcostData, annualyFcostData,
  dailyppm, weeklyppm, monthlyppm, yearlyppm,
  onExportDaily, onExportWeekly, onExportMonthly, onExportYearly,
}) => {
  const chartCards = [
    { badge: "NGÀY", title: "Daily F-Cost Trending", data: dailyFcostData, ppm: dailyppm, onExport: onExportDaily },
    { badge: "TUẦN", title: "Weekly F-Cost Trending", data: weeklyFcostData, ppm: weeklyppm, onExport: onExportWeekly },
    { badge: "THÁNG", title: "Monthly F-Cost Trending", data: monthlyFcostData, ppm: monthlyppm, onExport: onExportMonthly },
    { badge: "NĂM", title: "Yearly F-Cost Trending", data: annualyFcostData, ppm: yearlyppm, onExport: onExportYearly },
  ];

  const ChartComponents = [InspectionDailyFcost, InspectionWeeklyFcost, InspectionMonthlyFcost, InspectionYearlyFcost];

  return (
    <section className="pir-section">
      <div className="pir-section__header">
        <div className="pir-section__title-group">
          <MonetizationOnIcon style={{ fontSize: 18, color: "#d97706" }} />
          <h2 className="pir-section__title">1. Chi Phí Tổn Thất F-Cost (Failure Cost Trending)</h2>
          <span className="pir-section__tag">USD</span>
        </div>
      </div>

      <div className="pir-section__grid">
        {chartCards.map((card, idx) => {
          const ChartComp = ChartComponents[idx];
          return (
            <div key={card.badge} className="pir-chart-card">
              <div className="pir-chart-card__top">
                <div className="pir-chart-card__title-area">
                  <span className="pir-chart-card__badge">{card.badge}</span>
                  <span className="pir-chart-card__title">{card.title}</span>
                </div>
                <button type="button" className="pir-chart-card__btn-excel" onClick={card.onExport} title="Xuất Excel">
                  <FileDownloadIcon style={{ fontSize: 13 }} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="pir-chart-card__chart-body">
                <ChartComp
                  dldata={[...card.data].reverse()}
                  dlppmdata={[...card.ppm].reverse()}
                  processColor="#89fc98"
                  materialColor="#41d5fa"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
