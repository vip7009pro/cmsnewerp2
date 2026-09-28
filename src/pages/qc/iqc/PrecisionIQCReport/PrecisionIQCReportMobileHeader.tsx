// PrecisionIQCReportMobileHeader.tsx - Mobile-only compact header cho báo cáo IQC
// (brand + quick actions + dải chip trạng thái). Desktop dùng PrecisionIQCReportHeader.
import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiBarChart2 } from 'react-icons/fi';

interface PrecisionIQCReportMobileHeaderProps {
  onReload: () => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
}

const PrecisionIQCReportMobileHeader: React.FC<PrecisionIQCReportMobileHeaderProps> = ({
  onReload,
  onOpenFilter,
  activeFilterCount,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div className="precision-iqc-mobile-header">
      <div className="mobile-header-top">
        <div className="header-title-box">
          <span className="brand-badge">QC • IQC</span>
          <span className="pulse-dot" title="Hệ thống Realtime" />
          <h1 className="header-title">IQC REPORT</h1>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`btn-action-kpi ${activeFilterCount > 0 ? 'is-active' : ''}`}
            onClick={onOpenFilter}
            title="Mở bộ lọc báo cáo"
          >
            <FiBarChart2 size={15} />
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          <button
            type="button"
            className="btn-action-refresh"
            onClick={onReload}
            title="Tải lại toàn bộ dữ liệu báo cáo"
          >
            <FiRefreshCw size={14} />
          </button>

          <button
            type="button"
            className="btn-action-refresh"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportMobileHeader);
