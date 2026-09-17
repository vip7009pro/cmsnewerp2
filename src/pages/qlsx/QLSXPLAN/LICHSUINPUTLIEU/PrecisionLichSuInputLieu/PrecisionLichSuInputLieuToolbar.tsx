import React, { useState } from "react";
import { FiSearch, FiRefreshCw, FiDownload, FiFilter, FiCalendar, FiFileText, FiTag, FiBox } from "react-icons/fi";

interface PrecisionLichSuInputLieuToolbarProps {
  fromDate: string;
  toDate: string;
  allTime: boolean;
  prodRequestNo: string;
  planId: string;
  codeCMS: string;
  codeKD: string;
  mName: string;
  mCode: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onProdRequestNoChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onCodeKDChange: (val: string) => void;
  onMNameChange: (val: string) => void;
  onMCodeChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onExportExcel: () => void;
}

const PrecisionLichSuInputLieuToolbar: React.FC<PrecisionLichSuInputLieuToolbarProps> = ({
  fromDate,
  toDate,
  allTime,
  prodRequestNo,
  planId,
  codeCMS,
  codeKD,
  mName,
  mCode,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onProdRequestNoChange,
  onPlanIdChange,
  onCodeCMSChange,
  onCodeKDChange,
  onMNameChange,
  onMCodeChange,
  onSearch,
  onReset,
  onExportExcel,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-inputlieu-toolbar">
      {/* Hàng 1: Bộ Lọc Chính & Nút Thao Tác */}
      <div className="precision-inputlieu-toolbar__row">
        <div className="precision-inputlieu-toolbar__filters">
          {/* Từ ngày */}
          <div className="precision-inputlieu-toolbar__item">
            <FiCalendar size={11} color="#2563eb" />
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate}
              disabled={allTime}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          {/* Tới ngày */}
          <div className="precision-inputlieu-toolbar__item">
            <FiCalendar size={11} color="#2563eb" />
            <label>Tới ngày:</label>
            <input
              type="date"
              value={toDate}
              disabled={allTime}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Checkbox All Time */}
          <label className="precision-inputlieu-toolbar__checkbox-pill">
            <input
              type="checkbox"
              checked={allTime}
              onChange={(e) => onAllTimeChange(e.target.checked)}
            />
            <span>All Time</span>
          </label>

          {/* Số YCSX */}
          <div className="precision-inputlieu-toolbar__item">
            <FiFileText size={11} color="#059669" />
            <label>YCSX:</label>
            <input
              type="text"
              placeholder="VD: 1F80008..."
              value={prodRequestNo}
              onChange={(e) => onProdRequestNoChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Số Chỉ Thị Plan ID */}
          <div className="precision-inputlieu-toolbar__item">
            <FiTag size={11} color="#7c3aed" />
            <label>PLAN ID:</label>
            <input
              type="text"
              placeholder="VD: A123456..."
              value={planId}
              onChange={(e) => onPlanIdChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Cụm Nút Action */}
        <div className="precision-inputlieu-toolbar__actions">
          <button
            type="button"
            className="btn-action btn-action--primary"
            onClick={onSearch}
            title="Tra cứu lịch sử cấp liệu"
          >
            <FiSearch size={11} />
            <span>Tra Lịch Sử</span>
          </button>

          <button
            type="button"
            className="btn-action btn-action--ghost"
            onClick={onReset}
            title="Khôi phục bộ lọc mặc định"
          >
            <FiRefreshCw size={11} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="btn-action btn-action--excel"
            onClick={onExportExcel}
            title="Xuất toàn bộ kết quả tra cứu ra file Excel"
          >
            <FiDownload size={11} />
            <span>SAVE Excel</span>
          </button>

          <button
            type="button"
            className="btn-action btn-action--toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Mở rộng / Thu gọn bộ lọc nâng cao"
          >
            <FiFilter size={11} />
            <span>{showAdvanced ? "Thu gọn" : "Nâng cao"}</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Bộ Lọc Nâng Cao (Code ERP, Code KD, Tên Liệu, Mã Liệu) */}
      {showAdvanced && (
        <div className="precision-inputlieu-toolbar__row" style={{ paddingTop: 2, borderTop: "1px dashed #e2e8f0" }}>
          <div className="precision-inputlieu-toolbar__filters">
            {/* Code ERP */}
            <div className="precision-inputlieu-toolbar__item">
              <label>Code ERP:</label>
              <input
                type="text"
                placeholder="7C123xxx"
                value={codeCMS}
                onChange={(e) => onCodeCMSChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Code KD */}
            <div className="precision-inputlieu-toolbar__item">
              <label>Code KD:</label>
              <input
                type="text"
                placeholder="GH63-xxxxxx"
                value={codeKD}
                onChange={(e) => onCodeKDChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Tên Liệu */}
            <div className="precision-inputlieu-toolbar__item">
              <FiBox size={11} color="#ea580c" />
              <label>Tên Liệu:</label>
              <input
                type="text"
                placeholder="SJ-203020HC..."
                value={mName}
                style={{ width: 130 }}
                onChange={(e) => onMNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Mã Liệu CMS */}
            <div className="precision-inputlieu-toolbar__item">
              <label>Mã Liệu:</label>
              <input
                type="text"
                placeholder="A123456"
                value={mCode}
                onChange={(e) => onMCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionLichSuInputLieuToolbar);
