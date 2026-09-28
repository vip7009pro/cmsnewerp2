// PrecisionIQCReportMobileToolbar.tsx - Mobile toolbar tinh gọn cho báo cáo IQC
// Hàng 1: nút mở bộ lọc (kèm badge số điều kiện) + nút Tra Cứu.
// Hàng 2: Segmented tabs chọn phân hệ (cuộn ngang, touch target >= 34px).
import React from 'react';
import { FiSearch, FiFilter, FiTrendingUp, FiPackage, FiAlertTriangle, FiGrid } from 'react-icons/fi';

interface PrecisionIQCReportMobileToolbarProps {
  activeFilterCount: number;
  onOpenFilter: () => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TABS = [
  { id: 'all', label: 'Toàn Diện', icon: <FiGrid size={12} /> },
  { id: 'ppm', label: 'PPM', icon: <FiTrendingUp size={12} /> },
  { id: 'vendor', label: 'Vendor', icon: <FiPackage size={12} /> },
  { id: 'failing', label: 'Kho Lỗi', icon: <FiAlertTriangle size={12} /> },
];

const PrecisionIQCReportMobileToolbar: React.FC<PrecisionIQCReportMobileToolbarProps> = ({
  activeFilterCount,
  onOpenFilter,
  onSearch,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="precision-iqc-mobile-toolbar">
      {/* Hàng 1: Bộ lọc + Tra cứu */}
      <div className="mobile-toolbar-actions">
        <button
          type="button"
          className={`btn-mobile-filter ${activeFilterCount > 0 ? 'has-filters' : ''}`}
          onClick={onOpenFilter}
          title="Mở bộ lọc báo cáo (thời gian, Worst By, NG Type, Code, Khách hàng)"
        >
          <FiFilter size={14} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>

        <button
          type="button"
          className="btn-mobile-search"
          onClick={onSearch}
          title="Tra cứu dữ liệu báo cáo IQC"
        >
          <FiSearch size={14} />
          <span>Tra Cứu Dữ Liệu</span>
        </button>
      </div>

      {/* Hàng 2: Segmented tabs phân hệ */}
      <div className="mobile-toolbar-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`mobile-nav-tab ${activeTab === t.id ? 'mobile-nav-tab--active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportMobileToolbar);
