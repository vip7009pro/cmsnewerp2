import React from "react";
import {
  FiSearch,
  FiX,
  FiDownload,
  FiTable,
  FiBarChart2,
} from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";

interface PrecisionPOandStockFullToolbarProps {
  code: string;
  onChangeCode: (val: string) => void;
  /** Mobile (≤768px): dồn bộ lọc thành 2 hàng gọn và bỏ cụm thống kê trùng lặp với bảng KPI */
  isMobile?: boolean;
  onlyPoBalance: boolean;
  onToggleOnlyPoBalance: () => void;
  onSearchGCode: () => void;
  onSearchKD: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onTogglePivot: () => void;
  poBalance?: number;
  totalStock?: number;
  responseRate?: string;
  isLoading?: boolean;
}

const PrecisionPOandStockFullToolbar: React.FC<PrecisionPOandStockFullToolbarProps> = ({
  code,
  onChangeCode,
  onlyPoBalance,
  onToggleOnlyPoBalance,
  onSearchGCode,
  onSearchKD,
  onExportEX1,
  onExportEX2,
  onTogglePivot,
  poBalance = 0,
  totalStock = 0,
  responseRate = "0.00%",
  isLoading,
  isMobile = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchGCode();
    }
  };

  /* Ô nhập mã tra cứu (dùng chung cho cả 2 viewport) */
  const codeFieldNode = (
    <div className="field-code">
      <label htmlFor="code-search-input">Code:</label>
      <div className="input-box">
        <span className="prefix-icon">
          <MdQrCodeScanner size={16} />
        </span>
        <input
          id="code-search-input"
          type="text"
          placeholder={isMobile ? "Mã G_CODE / G_NAME..." : "Nhập mã G_CODE hoặc G_NAME..."}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        {code && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => onChangeCode("")}
            title="Xóa tìm kiếm"
          >
            <FiX size={14} />
          </button>
        )}
      </div>
    </div>
  );

  /* Checkbox chỉ lọc code còn tồn PO */
  const onlyPoBalanceNode = (
    <label className="checkbox-label" title="Chỉ lọc những mã sản phẩm còn số dư tồn PO">
      <input
        type="checkbox"
        checked={onlyPoBalance}
        onChange={onToggleOnlyPoBalance}
        disabled={isLoading}
      />
      <span>Chỉ code tồn PO</span>
    </label>
  );

  /* 2 nút tra cứu */
  const searchButtonsNode = (
    <>
      <button
        type="button"
        className="btn-search-gcode"
        onClick={onSearchGCode}
        disabled={isLoading}
        title="Tra cứu dữ liệu theo mã G_CODE (Hoặc nhấn Enter)"
      >
        <FiSearch size={14} />
        <span>Search(G_CODE)</span>
      </button>

      <button
        type="button"
        className="btn-search-kd"
        onClick={onSearchKD}
        disabled={isLoading}
        title="Tra cứu dữ liệu theo tên Kinh Doanh (G_NAME_KD)"
      >
        <FiSearch size={14} />
        <span>Search(KD)</span>
      </button>
    </>
  );

  return (
    <div className="precision-po-stock__toolbar">
      {/* Cụm bộ lọc bên trái */}
      <div className="toolbar-left">
        {isMobile ? (
          <>
            {/* Mobile hàng 1: ô nhập search + checkbox "Chỉ code tồn PO" */}
            <div className="toolbar-row toolbar-row--filter">
              {codeFieldNode}
              {onlyPoBalanceNode}
            </div>

            {/* Mobile hàng 2: 2 nút Search (G_CODE) / Search (KD) */}
            <div className="toolbar-row toolbar-row--search">
              {searchButtonsNode}
            </div>
          </>
        ) : (
          <>
            {codeFieldNode}
            {onlyPoBalanceNode}

            <div className="divider-v" />

            {searchButtonsNode}

            <div className="divider-v" />

            {/* Cụm thống kê realtime hiển thị cùng hàng */}
            <div className="toolbar-stats">
              <span className="stat-item">
                Tổng PO Balance:{" "}
                <strong className="stat-val stat-val--po">
                  {poBalance.toLocaleString("en-US")} EA
                </strong>
              </span>
              <span className="stat-dot">•</span>
              <span className="stat-item">
                Tổng tồn kho:{" "}
                <strong className="stat-val stat-val--stock">
                  {totalStock.toLocaleString("en-US")} EA
                </strong>
              </span>
              <span className="stat-dot">•</span>
              <span className="stat-item stat-item--rate">
                Tỷ lệ đáp ứng:{" "}
                <strong className="stat-rate-badge">
                  {responseRate}
                </strong>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Cụm nút hành động bên phải */}
      <div className="toolbar-right">
        <button
          type="button"
          className="btn-tool-ex1"
          onClick={onExportEX1}
          disabled={isLoading}
          title="Xuất file Excel cho các dòng dữ liệu đang hiển thị trên bảng"
        >
          <FiDownload size={14} />
          <span>{isMobile ? "EX1" : "EX1 (Hiển thị)"}</span>
        </button>

        <button
          type="button"
          className="btn-tool-ex2"
          onClick={onExportEX2}
          disabled={isLoading}
          title="Xuất toàn bộ dữ liệu gốc ra file Excel"
        >
          <FiTable size={14} />
          <span>{isMobile ? "EX2" : "EX2 (Raw Data)"}</span>
        </button>

        <button
          type="button"
          className="btn-tool-pivot"
          onClick={onTogglePivot}
          disabled={isLoading}
          title="Phân tích dữ liệu đa chiều Pivot Table"
        >
          <FiBarChart2 size={14} />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPOandStockFullToolbar);
