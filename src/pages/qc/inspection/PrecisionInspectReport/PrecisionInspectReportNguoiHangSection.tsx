import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GroupsIcon from "@mui/icons-material/Groups";
import InspectDailyNguoiHangTrending from "../../../../components/Chart/INSPECTION/InspectDailyNguoiHangTrending";
import InspectWeeklyNguoiHangTrending from "../../../../components/Chart/INSPECTION/InspectWeeklyNguoiHangTrending";
import InspectMonthlyNguoiHangTrending from "../../../../components/Chart/INSPECTION/InspectMonthlyNguoiHangTrending";
import InspectYearlyNguoiHangTrending from "../../../../components/Chart/INSPECTION/InspectYearlyNguoiHangTrending";
import { TREND_NGUOI_HANG_DATA } from "../../interfaces/qcInterface";

interface Props {
  dailyNguoiHangData: TREND_NGUOI_HANG_DATA[];
  weeklyNguoiHangData: TREND_NGUOI_HANG_DATA[];
  monthlyNguoiHangData: TREND_NGUOI_HANG_DATA[];
  annualyNguoiHangData: TREND_NGUOI_HANG_DATA[];
  onExportDaily: () => void;
  onExportWeekly: () => void;
  onExportMonthly: () => void;
  onExportYearly: () => void;
}

export const PrecisionInspectReportNguoiHangSection: React.FC<Props> = ({
  dailyNguoiHangData, weeklyNguoiHangData, monthlyNguoiHangData, annualyNguoiHangData,
  onExportDaily, onExportWeekly, onExportMonthly, onExportYearly,
}) => {
  const chartCards = [
    { badge: "NGÀY", title: "Daily Inspect Employee Data", data: dailyNguoiHangData, onExport: onExportDaily },
    { badge: "TUẦN", title: "Weekly Inspect Employee Data", data: weeklyNguoiHangData, onExport: onExportWeekly },
    { badge: "THÁNG", title: "Monthly Inspect Employee Data", data: monthlyNguoiHangData, onExport: onExportMonthly },
    { badge: "NĂM", title: "Yearly Inspect Employee Data", data: annualyNguoiHangData, onExport: onExportYearly },
  ];

  const ChartComponents = [
    InspectDailyNguoiHangTrending,
    InspectWeeklyNguoiHangTrending,
    InspectMonthlyNguoiHangTrending,
    InspectYearlyNguoiHangTrending,
  ];

  return (
    <section className="pir-section">
      <div className="pir-section__header">
        <div className="pir-section__title-group">
          <GroupsIcon style={{ fontSize: 18, color: "#059669" }} />
          <h2 className="pir-section__title">2. Tỉ Lệ Người Hàng (Employee Inspection Trending)</h2>
          <span className="pir-section__tag">TRENDING</span>
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
                  processColor={idx === 0 ? "#9affb0" : "#89fc98"}
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
