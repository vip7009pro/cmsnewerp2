import React from 'react';
import { FiTrendingUp, FiDownload, FiCalendar, FiActivity } from 'react-icons/fi';
import { IQC_TREND_DATA } from '../../interfaces/qcInterface';
import { SaveExcel } from '../../../../api/services/excelService';
import IQCDailyNGRate from '../../../../components/Chart/IQC/IQCDailyNGRate';
import IQCWeeklyNGRate from '../../../../components/Chart/IQC/IQCWeeklyNGRate';
import IQCMonthlyNGRate from '../../../../components/Chart/IQC/IQCMonthlyNGRate';
import IQCYearlyNGRate from '../../../../components/Chart/IQC/IQCYearlyNGRate';

interface PrecisionIQCReportPPMSectionProps {
  dailyppm: IQC_TREND_DATA[];
  weeklyppm: IQC_TREND_DATA[];
  monthlyppm: IQC_TREND_DATA[];
  yearlyppm: IQC_TREND_DATA[];
}

const PrecisionIQCReportPPMSection: React.FC<PrecisionIQCReportPPMSectionProps> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  return (
    <div className="precision-iqc-section">
      <div className="precision-iqc-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiTrendingUp />
          </span>
          <span>1. Xu Hướng Tỷ Lệ Lỗi IQC (PPM NG Trending Analytics)</span>
        </div>
        <span className="section-meta">DAILY • WEEKLY • MONTHLY • YEARLY</span>
      </div>

      {/* Cặp Biểu Đồ 1: Daily & Weekly NG Rate */}
      <div className="two-col-grid">
        {/* Daily NG Rate */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#2563eb" />
              <span className="executive-card__title">Daily NG Rate (Tỷ Lệ Lỗi Theo Ngày)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(dailyppm, 'DailyPPMData')}
              title="Xuất Excel dữ liệu Daily PPM"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCDailyNGRate dldata={dailyppm} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>

        {/* Weekly NG Rate */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiActivity size={13} color="#059669" />
              <span className="executive-card__title">Weekly NG Rate (Tỷ Lệ Lỗi Theo Tuần)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyppm, 'WeeklyPPMData')}
              title="Xuất Excel dữ liệu Weekly PPM"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCWeeklyNGRate dldata={weeklyppm} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Monthly & Yearly NG Rate */}
      <div className="two-col-grid">
        {/* Monthly NG Rate */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#d97706" />
              <span className="executive-card__title">Monthly NG Rate (Tỷ Lệ Lỗi Theo Tháng)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyppm, 'MonthlyPPMData')}
              title="Xuất Excel dữ liệu Monthly PPM"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCMonthlyNGRate dldata={monthlyppm} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>

        {/* Yearly NG Rate */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiTrendingUp size={13} color="#dc2626" />
              <span className="executive-card__title">Yearly NG Rate (Tỷ Lệ Lỗi Theo Năm)</span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(yearlyppm, 'YearlyPPMData')}
              title="Xuất Excel dữ liệu Yearly PPM"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCYearlyNGRate dldata={[...yearlyppm].reverse()} processColor="#53eb34" materialColor="#ff0000" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportPPMSection);
