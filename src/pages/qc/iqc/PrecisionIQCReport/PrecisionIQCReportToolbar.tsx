import React from 'react';
import {
  FiSearch,
  FiCalendar,
  FiTrendingUp,
  FiPackage,
  FiAlertTriangle,
  FiGrid,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { Autocomplete, TextField, Typography, createFilterOptions } from '@mui/material';
import { CodeListData } from '../../../kinhdoanh/interfaces/kdInterface';

interface PrecisionIQCReportToolbarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  worstBy: string;
  onWorstByChange: (val: string) => void;
  ngType: string;
  onNgTypeChange: (val: string) => void;
  custName: string;
  onCustNameChange: (val: string) => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData | null) => void;
  searchCodeArray: string[];
  onClearCodeArray: () => void;
  onRemoveCode: (code: string) => void;
  df: boolean;
  onDfChange: (val: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 100,
});

const PrecisionIQCReportToolbar: React.FC<PrecisionIQCReportToolbarProps> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  worstBy,
  onWorstByChange,
  ngType,
  onNgTypeChange,
  custName,
  onCustNameChange,
  codeList,
  selectedCode,
  onSelectCode,
  searchCodeArray,
  onClearCodeArray,
  onRemoveCode,
  df,
  onDfChange,
  onSearch,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'all', label: 'Xem Toàn Diện', icon: <FiGrid size={12} /> },
    { id: 'ppm', label: 'Xu Hướng Tỷ Lệ Lỗi PPM', icon: <FiTrendingUp size={12} /> },
    { id: 'vendor', label: 'Lỗi Nhà Cung Cấp (Vendor)', icon: <FiPackage size={12} /> },
    { id: 'failing', label: 'Kho Lỗi & Giữ Hàng', icon: <FiAlertTriangle size={12} /> },
  ];

  return (
    <div className="precision-iqc-toolbar">
      {/* Hàng 1: Bộ Lọc Tra Cứu */}
      <div className="precision-iqc-toolbar__controls-row">
        <div className="precision-iqc-toolbar__filters-group">
          {/* Từ ngày */}
          <div className="precision-iqc-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          {/* Đến ngày */}
          <div className="precision-iqc-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Tới ngày:</label>
            <input
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Worst By */}
          <div className="precision-iqc-toolbar__select-control">
            <label>Worst By:</label>
            <select value={worstBy} onChange={(e) => onWorstByChange(e.target.value)}>
              <option value="AMOUNT">AMOUNT</option>
              <option value="QTY">QTY</option>
            </select>
          </div>

          {/* NG Type */}
          <div className="precision-iqc-toolbar__select-control">
            <label>NG Type:</label>
            <select value={ngType} onChange={(e) => onNgTypeChange(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="P">PROCESS</option>
              <option value="M">MATERIAL</option>
            </select>
          </div>

          {/* Autocomplete Code Hàng */}
          <div className="precision-iqc-toolbar__autocomplete-wrap">
            <Autocomplete
              disableCloseOnSelect={false}
              size="small"
              disablePortal
              options={codeList}
              filterOptions={filterOptions}
              value={selectedCode}
              getOptionLabel={(option: CodeListData | any) =>
                option?.G_CODE ? `${option.G_CODE}: ${option.G_NAME_KD || ''}` : ''
              }
              renderInput={(params) => <TextField {...params} placeholder="Chọn Code sản phẩm..." />}
              renderOption={(props, option: any) => (
                <Typography component="li" style={{ fontSize: '0.72rem' }} {...props}>
                  {`${option.G_CODE}: ${option.G_NAME_KD || ''} - ${option.G_NAME || ''}`}
                </Typography>
              )}
              onChange={(_event: any, newValue: CodeListData | any) => {
                onSelectCode(newValue);
              }}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
            />
          </div>

          {/* Khách hàng */}
          <div className="precision-iqc-toolbar__text-input">
            <FiUser size={12} color="#64748b" />
            <label>Khách hàng:</label>
            <input
              type="text"
              placeholder="Nhập tên KH..."
              value={custName}
              onChange={(e) => onCustNameChange(e.target.value)}
              style={{ width: '100px' }}
            />
          </div>

          {/* Checkbox Default */}
          <label className="precision-iqc-toolbar__checkbox-pill">
            <input
              type="checkbox"
              checked={df}
              onChange={(e) => onDfChange(e.target.checked)}
            />
            <span>Mặc định (Default)</span>
          </label>

          {/* Nút Tìm kiếm */}
          <button
            type="button"
            className="precision-iqc-toolbar__btn-search"
            onClick={onSearch}
            title="Tra cứu dữ liệu báo cáo IQC"
          >
            <FiSearch size={12} />
            <span>Tra Cứu Dữ Liệu</span>
          </button>
        </div>

        {/* Danh sách chip các mã hàng đã chọn nếu có */}
        {searchCodeArray.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>Mã đã chọn:</span>
            {searchCodeArray.map((code) => (
              <span key={code} className="precision-iqc-toolbar__chip-badge">
                <span>{code}</span>
                <FiX className="chip-clear" size={11} onClick={() => onRemoveCode(code)} />
              </span>
            ))}
            <button
              type="button"
              onClick={onClearCodeArray}
              style={{
                background: 'none',
                border: 'none',
                color: '#f43f5e',
                fontSize: '10.5px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Xóa hết
            </button>
          </div>
        )}
      </div>

      {/* Hàng 2: Segmented Jump Tabs */}
      <div className="precision-iqc-toolbar__nav-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`nav-tab-btn ${activeTab === t.id ? 'nav-tab-btn--active' : ''}`}
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

export default React.memo(PrecisionIQCReportToolbar);
