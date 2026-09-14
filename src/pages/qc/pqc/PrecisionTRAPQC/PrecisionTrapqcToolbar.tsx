import React from 'react';
import {
  FiSearch,
  FiDownload,
  FiFileText,
  FiAlertCircle,
  FiScissors,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';
import { TrapqcMode } from './useTrapqcData';

interface PrecisionTrapqcToolbarProps {
  activeMode: TrapqcMode;
  onSwitchMode: (mode: TrapqcMode) => void;
  quickFilterText: string;
  onQuickFilterChange: (val: string) => void;
  recordCount: number;
  onExportExcel: (type: 'EX1' | 'EX2') => void;
  onOpenPivot?: () => void;
}

const PrecisionTrapqcToolbar: React.FC<PrecisionTrapqcToolbarProps> = ({
  activeMode,
  onSwitchMode,
  quickFilterText,
  onQuickFilterChange,
  recordCount,
  onExportExcel,
  onOpenPivot,
}) => {
  const modes = [
    { id: 'SETTING' as TrapqcMode, label: 'PQC1 Setting', icon: <FiFileText size={11} /> },
    { id: 'DEFECT' as TrapqcMode, label: 'PQC3 Defect', icon: <FiAlertCircle size={11} /> },
    { id: 'DAOFILM' as TrapqcMode, label: 'Dao - Film', icon: <FiScissors size={11} /> },
    { id: 'CNDB' as TrapqcMode, label: 'Chấp Nhận ĐB', icon: <FiCheckCircle size={11} /> },
  ];

  return (
    <div className="precision-trapqc-toolbar">
      {/* Bên trái: Chuyển đổi chế độ & Lọc nhanh */}
      <div className="precision-trapqc-toolbar__left">
        {/* Segmented Switcher */}
        <div className="precision-trapqc-toolbar__segment-switcher">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`segment-btn ${activeMode === m.id ? 'segment-btn--active' : ''}`}
              onClick={() => onSwitchMode(m.id)}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Ô Quick Filter trên lưới */}
        <div className="precision-trapqc-toolbar__quick-search">
          <FiSearch size={12} color="#64748b" />
          <input
            type="text"
            placeholder="Lọc nhanh trên bảng..."
            value={quickFilterText}
            onChange={(e) => onQuickFilterChange(e.target.value)}
          />
        </div>
      </div>

      {/* Bên phải: Badge số lượng & Cụm Xuất Excel */}
      <div className="precision-trapqc-toolbar__right">
        <span className="precision-trapqc-toolbar__badge-count">
          {recordCount.toLocaleString('en-US')} dòng
        </span>

        <button
          type="button"
          className="precision-trapqc-toolbar__btn-excel"
          onClick={() => onExportExcel('EX1')}
          title="Xuất file Excel dữ liệu đang lọc"
        >
          <FiDownload size={11} />
          <span>EX1 (Lọc)</span>
        </button>

        <button
          type="button"
          className="precision-trapqc-toolbar__btn-excel"
          onClick={() => onExportExcel('EX2')}
          title="Xuất file Excel toàn bộ dữ liệu"
        >
          <FiDownload size={11} />
          <span>EX2 (All)</span>
        </button>

        {onOpenPivot && (
          <button
            type="button"
            className="precision-trapqc-toolbar__btn-pivot"
            onClick={onOpenPivot}
            title="Mở phân tích bảng Pivot"
          >
            <FiBarChart2 size={11} />
            <span>PIVOT</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionTrapqcToolbar);
