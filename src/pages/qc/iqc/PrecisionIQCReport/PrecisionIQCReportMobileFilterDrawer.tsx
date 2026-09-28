// PrecisionIQCReportMobileFilterDrawer.tsx - Bottom Sheet bộ lọc báo cáo IQC (Zero-Blur)
// Trên mobile: toàn bộ bộ lọc nhiều trường của desktop được gom vào sheet này.
import React, { useState, useEffect } from 'react';
import { FiX, FiRotateCcw, FiCheck, FiCalendar, FiUser, FiFilter, FiTrash2 } from 'react-icons/fi';
import { Autocomplete, TextField, Typography, createFilterOptions } from '@mui/material';
import { CodeListData } from '../../../kinhdoanh/interfaces/kdInterface';

interface PrecisionIQCReportMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  worstBy: string;
  ngType: string;
  custName: string;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  searchCodeArray: string[];
  df: boolean;
  onApply: (filters: {
    fromDate: string;
    toDate: string;
    worstBy: string;
    ngType: string;
    custName: string;
    df: boolean;
  }) => void;
  onSelectCode: (code: CodeListData | null) => void;
  onRemoveCode: (code: string) => void;
  onClearCodeArray: () => void;
  onReset: () => void;
}

const filterOptions = createFilterOptions({ matchFrom: 'any', limit: 100 });

const PrecisionIQCReportMobileFilterDrawer: React.FC<PrecisionIQCReportMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  worstBy,
  ngType,
  custName,
  codeList,
  selectedCode,
  searchCodeArray,
  df,
  onApply,
  onSelectCode,
  onRemoveCode,
  onClearCodeArray,
  onReset,
}) => {
  const [localFromDate, setLocalFromDate] = useState(fromDate);
  const [localToDate, setLocalToDate] = useState(toDate);
  const [localWorstBy, setLocalWorstBy] = useState(worstBy);
  const [localNgType, setLocalNgType] = useState(ngType);
  const [localCustName, setLocalCustName] = useState(custName);
  const [localDf, setLocalDf] = useState(df);

  useEffect(() => {
    if (isOpen) {
      setLocalFromDate(fromDate);
      setLocalToDate(toDate);
      setLocalWorstBy(worstBy);
      setLocalNgType(ngType);
      setLocalCustName(custName);
      setLocalDf(df);
    }
  }, [isOpen, fromDate, toDate, worstBy, ngType, custName, df]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      fromDate: localFromDate,
      toDate: localToDate,
      worstBy: localWorstBy,
      ngType: localNgType,
      custName: localCustName,
      df: localDf,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalWorstBy('AMOUNT');
    setLocalNgType('ALL');
    setLocalCustName('');
    setLocalDf(true);
    onReset();
    onClose();
  };

  return (
    <div className="precision-iqc-drawer-overlay" onClick={onClose}>
      <div className="precision-iqc-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={15} />
            <span>BỘ LỌC BÁO CÁO IQC</span>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} title="Đóng">
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-field">
            <label className="drawer-label">
              <FiCalendar size={12} /> Từ ngày
            </label>
            <input
              type="date"
              className="drawer-input"
              value={localFromDate.slice(0, 10)}
              onChange={(e) => setLocalFromDate(e.target.value)}
            />
          </div>

          <div className="drawer-field">
            <label className="drawer-label">
              <FiCalendar size={12} /> Tới ngày
            </label>
            <input
              type="date"
              className="drawer-input"
              value={localToDate.slice(0, 10)}
              onChange={(e) => setLocalToDate(e.target.value)}
            />
          </div>

          <div className="drawer-field">
            <label className="drawer-label">Worst By (Xếp hạng lỗi)</label>
            <select
              className="drawer-input"
              value={localWorstBy}
              onChange={(e) => setLocalWorstBy(e.target.value)}
            >
              <option value="AMOUNT">AMOUNT (Số tiền)</option>
              <option value="QTY">QTY (Số lượng)</option>
            </select>
          </div>

          <div className="drawer-field">
            <label className="drawer-label">NG Type (Phân loại lỗi)</label>
            <select
              className="drawer-input"
              value={localNgType}
              onChange={(e) => setLocalNgType(e.target.value)}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="P">PROCESS (Công đoạn)</option>
              <option value="M">MATERIAL (Nguyên vật liệu)</option>
            </select>
          </div>

          <div className="drawer-field">
            <label className="drawer-label">Code / Liệu sản phẩm</label>
            <Autocomplete
              size="small"
              disableCloseOnSelect={false}
              options={codeList}
              filterOptions={filterOptions}
              value={selectedCode}
              getOptionLabel={(option: CodeListData | any) =>
                option?.G_CODE ? `${option.G_CODE}: ${option.G_NAME_KD || ''}` : ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Chọn Code sản phẩm..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      padding: '4px 8px !important',
                      height: '38px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  }}
                />
              )}
              renderOption={(props, option: any) => (
                <Typography component="li" style={{ fontSize: '0.80rem' }} {...props}>
                  {`${option.G_CODE}: ${option.G_NAME_KD || ''} - ${option.G_NAME || ''}`}
                </Typography>
              )}
              onChange={(_event: any, newValue: CodeListData | any) => onSelectCode(newValue)}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
              slotProps={{ popper: { sx: { zIndex: 13000 } } }}
            />
            {searchCodeArray.length > 0 && (
              <div className="drawer-code-chips">
                {searchCodeArray.map((code) => (
                  <span key={code} className="drawer-code-chip">
                    <span>{code}</span>
                    <button
                      type="button"
                      className="chip-clear"
                      onClick={() => onRemoveCode(code)}
                      title={`Bỏ mã ${code}`}
                    >
                      <FiX size={11} />
                    </button>
                  </span>
                ))}
                <button type="button" className="drawer-code-clear" onClick={onClearCodeArray}>
                  <FiTrash2 size={11} />
                  <span>Xóa hết</span>
                </button>
              </div>
            )}
          </div>

          <div className="drawer-field">
            <label className="drawer-label">
              <FiUser size={12} /> Khách hàng
            </label>
            <input
              type="text"
              className="drawer-input"
              placeholder="Nhập tên khách hàng..."
              value={localCustName}
              onChange={(e) => setLocalCustName(e.target.value)}
            />
          </div>

          <label className="drawer-checkbox-row">
            <input
              type="checkbox"
              checked={localDf}
              onChange={(e) => setLocalDf(e.target.checked)}
            />
            <span>Mặc định (Default) — dùng khoảng thời gian chuẩn của hệ thống</span>
          </label>
        </div>

        <div className="drawer-footer">
          <button type="button" className="drawer-foot-btn drawer-foot-btn--ghost" onClick={handleReset}>
            <FiRotateCcw size={14} />
            <span>Đặt lại</span>
          </button>
          <button type="button" className="drawer-foot-btn drawer-foot-btn--primary" onClick={handleApply}>
            <FiCheck size={15} />
            <span>Áp dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionIQCReportMobileFilterDrawer);
