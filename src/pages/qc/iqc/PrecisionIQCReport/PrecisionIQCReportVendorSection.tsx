import React from 'react';
import { FiPackage, FiDownload, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { IQC_VENDOR_NGRATE_DATA } from '../../interfaces/qcInterface';
import { SaveExcel } from '../../../../api/services/excelService';
import IQcWeeklyVendorNGRateTrending from '../../../../components/Chart/IQC/IQcWeeklyVendorNGRateTrending';
import IQcMonthlyVendorNGRateTrending from '../../../../components/Chart/IQC/IQcMonthlyVendorNGRateTrending';

interface PrecisionIQCReportVendorSectionProps {
  weeklyvendorppm: IQC_VENDOR_NGRATE_DATA[];
  monthlyvendorppm: IQC_VENDOR_NGRATE_DATA[];
}

const PrecisionIQCReportVendorSection: React.FC<PrecisionIQCReportVendorSectionProps> = ({
  weeklyvendorppm,
  monthlyvendorppm,
}) => {
  return (
    <div className="precision-iqc-section">
      <div className="precision-iqc-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiPackage />
          </span>
          <span>2. Xu Hướng Lỗi Nhà Cung Cấp Vật Tư (Vendor Incoming Defects Trending)</span>
        </div>
        <span className="section-meta">WEEKLY • MONTHLY VENDOR PPM</span>
      </div>

      {/* Cặp Biểu Đồ: Vendor Weekly & Monthly Trending */}
      <div className="two-col-grid">
        {/* Vendor Weekly Trending */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiBarChart2 size={13} color="#7c3aed" />
              <span className="executive-card__title">
                Vendor Weekly Incoming Defects Trending (Theo Tuần)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(weeklyvendorppm, 'Vendor Weekly IncomingDefects Trending')}
              title="Xuất Excel Vendor Weekly"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQcWeeklyVendorNGRateTrending dldata={[...weeklyvendorppm].reverse()} />
          </div>
        </div>

        {/* Vendor Monthly Trending */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCalendar size={13} color="#0284c7" />
              <span className="executive-card__title">
                Vendor Monthly Incoming Defects Trending (Theo Tháng)
              </span>
            </div>
            <button
              type="button"
              className="executive-card__btn-excel"
              onClick={() => SaveExcel(monthlyvendorppm, 'Vendor Monthly Incoming Defects Trending')}
              title="Xuất Excel Vendor Monthly"
            >
              <FiDownload size={11} />
              <span>Excel</span>
            </button>
          </div>
          <div className="executive-card__body executive-card__body--chart-lg">
            <IQcMonthlyVendorNGRateTrending dldata={[...monthlyvendorppm].reverse()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportVendorSection);
