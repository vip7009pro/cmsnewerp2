import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { HiOutlineServer } from 'react-icons/hi';

interface PrecisionIQCReportHeaderProps {
  onReload: () => void;
}

const PrecisionIQCReportHeader: React.FC<PrecisionIQCReportHeaderProps> = ({ onReload }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
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
    <header className="precision-iqc-header">
      <div className="precision-iqc-header__left">
        <span className="precision-iqc-header__badge-brand">CMS ERP</span>
        <nav className="precision-iqc-header__breadcrumb" aria-label="Breadcrumb">
          <span>04. QC • IQC</span>
          <span>/</span>
          <span className="active">Báo Cáo Chỉ Số Chất Lượng & Xu Hướng Lỗi PPM (Quality Analytics)</span>
        </nav>
        <div className="precision-iqc-header__telemetry">
          <span className="pulse-dot"></span>
          <HiOutlineServer size={12} />
          <span>NET_SERVER: 3007</span>
        </div>
      </div>

      <div className="precision-iqc-header__right">
        <button
          type="button"
          className="precision-iqc-header__btn-action"
          onClick={onReload}
          title="Tải lại toàn bộ dữ liệu báo cáo"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-iqc-header__btn-action"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        >
          {isFullscreen ? <FiMinimize2 size={12} /> : <FiMaximize2 size={12} />}
          <span>{isFullscreen ? 'Thu Nhỏ' : 'Toàn Màn Hình'}</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionIQCReportHeader);
