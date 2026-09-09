import React from 'react';
import moment from 'moment';

interface PrecisionDieuChuyenHeaderProps {
  onExportExcel: () => void;
  onSaveSchedule?: () => void;
  onUndo?: () => void;
}

const PrecisionDieuChuyenHeader: React.FC<PrecisionDieuChuyenHeaderProps> = ({
  onExportExcel,
  onSaveSchedule,
  onUndo,
}) => {
  const currentDateStr = moment().format('DD/MM/YYYY');

  return (
    <div className="precision-dieuchuyen__header">
      {/* Breadcrumb & Telemetry */}
      <div className="header-top">
        <div className="header-breadcrumb">
          <span className="icon-box">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              alt_route
            </span>
          </span>
          <span className="dept-text">01. NHÂN SỰ & HÀNH CHÍNH</span>
          <span className="divider">&gt;</span>
          <span className="module-title">NS2 - ĐIỀU CHUYỂN TEAM & CHI VIỆN SẢN XUẤT</span>
        </div>

        <div className="header-sync-group">
          <div className="sync-pill">
            <span className="pulse-dot"></span>
            <span>SOCKET REALTIME SYNC</span>
          </div>
          <div className="mes-pill">MES & HRM SYNC ACTIVE</div>
        </div>
      </div>

      {/* Main Title & Action Buttons */}
      <div className="header-main">
        <div className="header-title-wrap">
          <h1>Kế hoạch Điều chuyển Nhân sự & Chi viện Ca Sản Xuất</h1>
          <span className="date-badge">Hôm nay, {currentDateStr}</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="precision-dieuchuyen__btnWhite"
            onClick={onExportExcel}
            title="Xuất bảng điều chuyển ra file Excel (.xlsx)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#059669' }}>
              file_download
            </span>
            <span>Xuất Excel (EX1)</span>
          </button>

          {onUndo && (
            <button
              type="button"
              className="precision-dieuchuyen__btnWhite"
              onClick={onUndo}
              title="Khôi phục trạng thái phân bổ gần nhất"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#64748b' }}>
                undo
              </span>
              <span>Hoàn tác</span>
            </button>
          )}

          {onSaveSchedule && (
            <button
              type="button"
              className="precision-dieuchuyen__btnPrimary"
              onClick={onSaveSchedule}
              title="Xác nhận và lưu phân bổ ca điều chuyển"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                save
              </span>
              <span>Lưu phân bổ ca</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDieuChuyenHeader);
