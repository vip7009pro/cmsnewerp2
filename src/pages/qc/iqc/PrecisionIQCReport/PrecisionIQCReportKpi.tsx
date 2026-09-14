import React from 'react';
import { FiClock, FiActivity, FiCalendar, FiAward } from 'react-icons/fi';
import { IQC_TREND_DATA } from '../../interfaces/qcInterface';

interface PrecisionIQCReportKpiProps {
  dailyppm: IQC_TREND_DATA[];
  weeklyppm: IQC_TREND_DATA[];
  monthlyppm: IQC_TREND_DATA[];
  yearlyppm: IQC_TREND_DATA[];
}

const PrecisionIQCReportKpi: React.FC<PrecisionIQCReportKpiProps> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  const dCur = dailyppm?.[dailyppm.length - 1];
  const dRate = dCur?.NG_RATE ?? 0;
  const dMat = dCur?.OK_CNT ?? 0;
  const dProc = dCur?.PD_CNT ?? 0;

  const wCur = weeklyppm?.[weeklyppm.length - 1];
  const wRate = wCur?.NG_RATE ?? 0;
  const wMat = wCur?.OK_CNT ?? 0;
  const wProc = wCur?.PD_CNT ?? 0;

  const mCur = monthlyppm?.[monthlyppm.length - 1];
  const mRate = mCur?.NG_RATE ?? 0;
  const mMat = mCur?.OK_CNT ?? 0;
  const mProc = mCur?.PD_CNT ?? 0;

  const yCur = yearlyppm?.[yearlyppm.length - 1];
  const yRate = yCur?.NG_RATE ?? 0;
  const yMat = yCur?.OK_CNT ?? 0;
  const yProc = yCur?.PD_CNT ?? 0;

  return (
    <section className="precision-iqc-kpi-grid">
      {/* Card 1: Today NG */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Hôm Nay (Today NG)</span>
          <div className="kpi-amount">
            {dRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            <span className="unit">PPM</span>
          </div>
          <div className="kpi-meta">
            <span>Liệu: <strong className="qty-val">{dMat.toLocaleString('en-US')}</strong></span>
            <span>•</span>
            <span>C.Đoạn: <strong className="qty-val">{dProc.toLocaleString('en-US')}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiClock />
        </div>
      </div>

      {/* Card 2: This Week NG */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tuần Này (This Week NG)</span>
          <div className="kpi-amount">
            {wRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            <span className="unit">PPM</span>
          </div>
          <div className="kpi-meta">
            <span>Liệu: <strong className="qty-val">{wMat.toLocaleString('en-US')}</strong></span>
            <span>•</span>
            <span>C.Đoạn: <strong className="qty-val">{wProc.toLocaleString('en-US')}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* Card 3: This Month NG */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Tháng Này (This Month NG)</span>
          <div className="kpi-amount">
            {mRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            <span className="unit">PPM</span>
          </div>
          <div className="kpi-meta">
            <span>Liệu: <strong className="qty-val">{mMat.toLocaleString('en-US')}</strong></span>
            <span>•</span>
            <span>C.Đoạn: <strong className="qty-val">{mProc.toLocaleString('en-US')}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCalendar />
        </div>
      </div>

      {/* Card 4: This Year NG */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Năm Nay (This Year NG)</span>
          <div className="kpi-amount">
            {yRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            <span className="unit">PPM</span>
          </div>
          <div className="kpi-meta">
            <span>Liệu: <strong className="qty-val">{yMat.toLocaleString('en-US')}</strong></span>
            <span>•</span>
            <span>C.Đoạn: <strong className="qty-val">{yProc.toLocaleString('en-US')}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiAward />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionIQCReportKpi);
