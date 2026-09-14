import React from 'react';
import { FiAlertTriangle, FiDownload, FiClock, FiActivity } from 'react-icons/fi';
import { IQC_FAILING_TREND_DATA, IQC_FAIL_PENDING } from '../../interfaces/qcInterface';
import { SaveExcel } from '../../../../api/services/excelService';
import IQCWeeklyFailingTrending from '../../../../components/Chart/IQC/IQCWeeklyFailingTrending';
import IQC_FAILING_PENDING from '../../../../components/Chart/IQC/IQC_FAILING_PENDING';

interface PrecisionIQCReportFailingSectionProps {
  weeklyfailingtrending: IQC_FAILING_TREND_DATA[];
  weeklyholdingtrending: IQC_FAILING_TREND_DATA[];
  iqcfailpending: IQC_FAIL_PENDING[];
  iqcholdingpending: IQC_FAIL_PENDING[];
}

const PrecisionIQCReportFailingSection: React.FC<PrecisionIQCReportFailingSectionProps> = ({
  weeklyfailingtrending,
  weeklyholdingtrending,
  iqcfailpending,
  iqcholdingpending,
}) => {
  return (
    <div className="precision-iqc-section">
      <div className="precision-iqc-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiAlertTriangle />
          </span>
          <span>3. Phân Tích Kho Lỗi & Hàng Chặn Giữ (Failing & Holding Analytics)</span>
        </div>
        <span className="section-meta">PROCESS & INCOMING FAIL / HOLDING</span>
      </div>

      {/* Cặp Biểu Đồ 1: Trending Weekly Failing & Holding */}
      <div className="two-col-grid">
        {/* Weekly Failing (Process) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiActivity size={13} color="#8b5cf6" />
              <span className="executive-card__title">
                Weekly Failing Trending (Xu Hướng Kho Lỗi - PROCESS)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyfailingtrending, 'WeeklyFailingTrendingData')}
              title="Xuất Excel Weekly Failing"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCWeeklyFailingTrending
              dldata={weeklyfailingtrending}
              processColor="#8b89fc"
              materialColor="#41d5fa"
            />
          </div>
        </div>

        {/* Weekly Holding (Incoming) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#06b6d4" />
              <span className="executive-card__title">
                Weekly Holding Trending (Xu Hướng Giữ Hàng - INCOMING)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyholdingtrending, 'WeeklyHoldingTrendingData')}
              title="Xuất Excel Weekly Holding"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQCWeeklyFailingTrending
              dldata={weeklyholdingtrending}
              processColor="#8b89fc"
              materialColor="#41d5fa"
            />
          </div>
        </div>
      </div>

      {/* Cặp Biểu Đồ 2: Pending Weekly Failing & Holding */}
      <div className="two-col-grid">
        {/* Weekly Failing Pending (Process) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiAlertTriangle size={13} color="#f43f5e" />
              <span className="executive-card__title">
                Weekly Failing Pending (Tồn Chờ Xử Lý - PROCESS)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(iqcfailpending, 'WeeklyFailingPendingData')}
              title="Xuất Excel Failing Pending"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQC_FAILING_PENDING data={iqcfailpending} />
          </div>
        </div>

        {/* Weekly Holding Pending (Incoming) */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#f59e0b" />
              <span className="executive-card__title">
                Weekly Holding Pending (Tồn Chờ Xử Lý - INCOMING)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(iqcholdingpending, 'WeeklyHoldingPendingData')}
              title="Xuất Excel Holding Pending"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQC_FAILING_PENDING data={iqcholdingpending} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportFailingSection);
