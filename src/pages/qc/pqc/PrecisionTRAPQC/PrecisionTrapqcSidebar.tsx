import React from 'react';
import {
  FiFilter,
  FiSearch,
  FiCalendar,
  FiLayers,
  FiUser,
  FiTag,
  FiBox,
  FiHash,
} from 'react-icons/fi';

interface PrecisionTrapqcSidebarProps {
  alltime: boolean;
  onAllTimeChange: (val: boolean) => void;
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  factory: string;
  onFactoryChange: (val: string) => void;
  codeKD: string;
  onCodeKDChange: (val: string) => void;
  codeCMS: string;
  onCodeCMSChange: (val: string) => void;
  empl_name: string;
  onEmplNameChange: (val: string) => void;
  cust_name: string;
  onCustNameChange: (val: string) => void;
  prod_type: string;
  onProdTypeChange: (val: string) => void;
  prodrequestno: string;
  onProdRequestNoChange: (val: string) => void;
  process_lot_no: string;
  onProcessLotNoChange: (val: string) => void;
  id: string;
  onIdChange: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const PrecisionTrapqcSidebar: React.FC<PrecisionTrapqcSidebarProps> = ({
  alltime,
  onAllTimeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  factory,
  onFactoryChange,
  codeKD,
  onCodeKDChange,
  codeCMS,
  onCodeCMSChange,
  empl_name,
  onEmplNameChange,
  cust_name,
  onCustNameChange,
  prod_type,
  onProdTypeChange,
  prodrequestno,
  onProdRequestNoChange,
  process_lot_no,
  onProcessLotNoChange,
  id,
  onIdChange,
  onSearch,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <aside className="precision-trapqc-sidebar">
      <div className="precision-trapqc-sidebar__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiFilter size={13} color="#2563eb" />
          <span>BỘ LỌC TRA CỨU PQC</span>
        </div>
      </div>

      <div className="precision-trapqc-sidebar__form-body">
        {/* Toggle All Time */}
        <label className="precision-trapqc-sidebar__toggle-pill">
          <input
            type="checkbox"
            checked={alltime}
            onChange={(e) => onAllTimeChange(e.target.checked)}
          />
          <span>Tra cứu toàn bộ thời gian (All Time)</span>
        </label>

        {/* Từ ngày - Đến ngày */}
        {!alltime && (
          <>
            <div className="precision-trapqc-sidebar__field">
              <label><FiCalendar size={11} /> Từ ngày:</label>
              <input
                type="date"
                value={fromDate.slice(0, 10)}
                onChange={(e) => onFromDateChange(e.target.value)}
              />
            </div>
            <div className="precision-trapqc-sidebar__field">
              <label><FiCalendar size={11} /> Đến ngày:</label>
              <input
                type="date"
                value={toDate.slice(0, 10)}
                onChange={(e) => onToDateChange(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Nhà máy */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiLayers size={11} /> Nhà máy (Factory):</label>
          <select value={factory} onChange={(e) => onFactoryChange(e.target.value)}>
            <option value="All">Tất cả nhà máy (All)</option>
            <option value="NM1">Nhà máy 1 (NM1)</option>
            <option value="NM2">Nhà máy 2 (NM2)</option>
          </select>
        </div>

        {/* Code KD */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiTag size={11} /> Code KD:</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx..."
            value={codeKD}
            onChange={(e) => onCodeKDChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Code ERP */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiHash size={11} /> Code ERP (CMS):</label>
          <input
            type="text"
            placeholder="7C123xxx..."
            value={codeCMS}
            onChange={(e) => onCodeCMSChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Tên nhân viên */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiUser size={11} /> Tên nhân viên Line QC:</label>
          <input
            type="text"
            placeholder="Nhập tên nhân viên..."
            value={empl_name}
            onChange={(e) => onEmplNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Khách hàng */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiUser size={11} /> Khách hàng:</label>
          <input
            type="text"
            placeholder="Tên khách hàng..."
            value={cust_name}
            onChange={(e) => onCustNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Loại sản phẩm */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiBox size={11} /> Loại sản phẩm (TSP):</label>
          <input
            type="text"
            placeholder="TSP, Tape, Tem..."
            value={prod_type}
            onChange={(e) => onProdTypeChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Số YCSX */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiHash size={11} /> Số YCSX (Prod Request):</label>
          <input
            type="text"
            placeholder="1H23456..."
            value={prodrequestno}
            onChange={(e) => onProdRequestNoChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* LOT SX */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiTag size={11} /> LOT SX (Process Lot):</label>
          <input
            type="text"
            placeholder="ED2H3076..."
            value={process_lot_no}
            onChange={(e) => onProcessLotNoChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* ID */}
        <div className="precision-trapqc-sidebar__field">
          <label><FiHash size={11} /> ID bản ghi:</label>
          <input
            type="text"
            placeholder="PQC1_ID / PQC3_ID..."
            value={id}
            onChange={(e) => onIdChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Nút Tra cứu */}
        <button
          type="button"
          className="precision-trapqc-sidebar__btn-search"
          onClick={onSearch}
          disabled={isLoading}
        >
          <FiSearch size={13} />
          <span>{isLoading ? 'Đang Tra Cứu...' : 'Tra Cứu Dữ Liệu'}</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionTrapqcSidebar);
