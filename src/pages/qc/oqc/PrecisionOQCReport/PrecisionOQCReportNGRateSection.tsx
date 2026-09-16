import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import OQCDailyNGRate from "../../../../components/Chart/OQC/OQCDailyNGRate";
import OQCWeeklyNGRate from "../../../../components/Chart/OQC/OQCWeeklyNGRate";
import OQCMonthlyNGRate from "../../../../components/Chart/OQC/OQCMonthlyNGRate";
import OQCYearlyNGRate from "../../../../components/Chart/OQC/OQCYearlyNGRate";
import { OQC_TREND_DATA } from "../../interfaces/qcInterface";

interface Props {
  dailyppm: OQC_TREND_DATA[];
  weeklyppm: OQC_TREND_DATA[];
  monthlyppm: OQC_TREND_DATA[];
  yearlyppm: OQC_TREND_DATA[];
  onExportDaily: () => void;
  onExportWeekly: () => void;
  onExportMonthly: () => void;
  onExportYearly: () => void;
}

export const PrecisionOQCReportNGRateSection: React.FC<Props> = ({
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
    <section className="poqc-section">
      <div className="poqc-section__header">
        <div className="poqc-section__title-group">
          <ShowChartIcon style={{ fontSize: 18, color: "#2563eb" }} />
          <h2 className="poqc-section__title">1. Xu Hướng Tỷ Lệ Lỗi Xuất Hàng OQC (OQC NG Rate Trending)</h2>
          <span className="poqc-section__tag">PERCENTAGE %</span>
        </div>
      </div>

      <div className="poqc-section__grid">
        {/* Card 1: Daily NG Rate */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">NGÀY</span>
              <span className="poqc-chart-card__title">Tỷ Lệ Lỗi Theo Ngày (Daily NG Rate)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportDaily}
              title="Xuất dữ liệu Excel ngày"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <OQCDailyNGRate
              dldata={[...dailyppm].reverse()}
              processColor="#85d9f3"
              materialColor="#ff0000"
            />
          </div>
        </div>

        {/* Card 2: Weekly NG Rate */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">TUẦN</span>
              <span className="poqc-chart-card__title">Tỷ Lệ Lỗi Theo Tuần (Weekly NG Rate)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportWeekly}
              title="Xuất dữ liệu Excel tuần"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <OQCWeeklyNGRate
              dldata={[...weeklyppm].reverse()}
              processColor="#85d9f3"
              materialColor="#ff0000"
            />
          </div>
        </div>

        {/* Card 3: Monthly NG Rate */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">THÁNG</span>
              <span className="poqc-chart-card__title">Tỷ Lệ Lỗi Theo Tháng (Monthly NG Rate)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportMonthly}
              title="Xuất dữ liệu Excel tháng"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <OQCMonthlyNGRate
              dldata={[...monthlyppm].reverse()}
              processColor="#85d9f3"
              materialColor="#ff0000"
            />
          </div>
        </div>

        {/* Card 4: Yearly NG Rate */}
        <div className="poqc-chart-card">
          <div className="poqc-chart-card__top">
            <div className="poqc-chart-card__title-area">
              <span className="poqc-chart-card__badge">NĂM</span>
              <span className="poqc-chart-card__title">Tỷ Lệ Lỗi Theo Năm (Yearly NG Rate)</span>
            </div>
            <button
              type="button"
              className="poqc-chart-card__btn-excel"
              onClick={onExportYearly}
              title="Xuất dữ liệu Excel năm"
            >
              <FileDownloadIcon style={{ fontSize: 13 }} />
              <span>Excel</span>
            </button>
          </div>
          <div className="poqc-chart-card__chart-body">
            <OQCYearlyNGRate
              dldata={[...yearlyppm].reverse()}
              processColor="#85d9f3"
              materialColor="#ff0000"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
