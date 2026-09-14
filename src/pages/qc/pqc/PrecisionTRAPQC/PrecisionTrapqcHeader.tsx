import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { HiOutlineServer } from 'react-icons/hi';

interface PrecisionTrapqcHeaderProps {
  onReload: () => void;
}

const PrecisionTrapqcHeader: React.FC<PrecisionTrapqcHeaderProps> = ({ onReload }) => {
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
    <header className="precision-trapqc-header">
      <div className="precision-trapqc-header__left">
        <span className="precision-trapqc-header__badge-brand">CMS ERP</span>
        <nav className="precision-trapqc-header__breadcrumb" aria-label="Breadcrumb">
          <span>04. QC • PQC</span>
          <span>/</span>
          <span className="active">Tra Cứu Dữ Liệu Kiểm Tra Công Đoạn (PQC Data Explorer)</span>
        </nav>
        <div className="precision-trapqc-header__telemetry">
          <span className="pulse-dot"></span>
          <HiOutlineServer size={12} />
          <span>NET_SERVER: 3007</span>
        </div>
      </div>

      <div className="precision-trapqc-header__right">
        <button
          type="button"
          className="precision-trapqc-header__btn-action"
          onClick={onReload}
          title="Tải lại dữ liệu tra cứu"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        <button
          type="button"
          className="precision-trapqc-header__btn-action"
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

export default React.memo(PrecisionTrapqcHeader);
