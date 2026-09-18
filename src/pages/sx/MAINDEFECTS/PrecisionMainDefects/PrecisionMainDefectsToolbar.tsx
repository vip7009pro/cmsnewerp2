import React from "react";
import moment from "moment";
import {
  FiFilter,
  FiSearch,
  FiPieChart,
  FiGrid,
  FiLayers,
} from "react-icons/fi";

interface PrecisionMainDefectsToolbarProps {
  fromDate: string;
  toDate: string;
  allTime: boolean;
  codeKD: string;
  codeCMS: string;
  prodModel: string;
  processNumber: string;
  processOptions: number[];
  useYn: string;
  imageYn: string;
  activeTab: "all" | "charts" | "grid";
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onCodeKDChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onProdModelChange: (val: string) => void;
  onProcessNumberChange: (val: string) => void;
  onUseYnChange: (val: string) => void;
  onImageYnChange: (val: string) => void;
  onTabChange: (tab: "all" | "charts" | "grid") => void;
  onSearch: () => void;
}

const PrecisionMainDefectsToolbar: React.FC<PrecisionMainDefectsToolbarProps> = ({
  fromDate,
  toDate,
  allTime,
  codeKD,
  codeCMS,
  prodModel,
  processNumber,
  processOptions,
  useYn,
  imageYn,
  activeTab,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onCodeKDChange,
  onCodeCMSChange,
  onProdModelChange,
  onProcessNumberChange,
  onUseYnChange,
  onImageYnChange,
  onTabChange,
  onSearch,
}) => {
  const setQuickRange = (days: number) => {
    onAllTimeChange(false);
    onFromDateChange(moment().subtract(days, "days").format("YYYY-MM-DD"));
    onToDateChange(moment().format("YYYY-MM-DD"));
  };

  return (
    <div className="precision-maindefects__toolbar">
      {/* Hàng 1: Bộ lọc chính */}
      <div className="toolbar-row">
        <div className="filter-group">
          {/* Từ ngày - Tới ngày */}
          <div className="filter-pill">
            <label>Từ:</label>
            <input
              type="date"
              value={fromDate}
              disabled={allTime}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          <div className="filter-pill">
            <label>Đến:</label>
            <input
              type="date"
              value={toDate}
              disabled={allTime}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Nút chọn nhanh */}
          <div className="quick-dates">
            <button
              type="button"
              className="quick-btn"
              onClick={() => setQuickRange(0)}
              title="Xem hôm nay"
            >
              1D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => setQuickRange(7)}
              title="Xem 7 ngày gần nhất"
            >
              7D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => setQuickRange(30)}
              title="Xem 30 ngày gần nhất"
            >
              30D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => setQuickRange(90)}
              title="Xem 90 ngày gần nhất"
            >
              90D
            </button>
          </div>

          {/* Checkbox All Time */}
          <label className="checkbox-pill" title="Không giới hạn ngày">
            <input
              type="checkbox"
              checked={allTime}
              onChange={(e) => onAllTimeChange(e.target.checked)}
            />
            <span>All Time</span>
          </label>

          {/* Input Code KD */}
          <div className="filter-pill">
            <label>Code KD:</label>
            <input
              type="text"
              placeholder="GH63-..."
              value={codeKD}
              onChange={(e) => onCodeKDChange(e.target.value)}
            />
          </div>

          {/* Input Code ERP */}
          <div className="filter-pill">
            <label>Code ERP:</label>
            <input
              type="text"
              placeholder="7C123..."
              value={codeCMS}
              onChange={(e) => onCodeCMSChange(e.target.value)}
            />
          </div>

          {/* Input Model */}
          <div className="filter-pill">
            <label>Model:</label>
            <input
              type="text"
              placeholder="Model..."
              value={prodModel}
              onChange={(e) => onProdModelChange(e.target.value)}
            />
          </div>

          {/* Select Công Đoạn */}
          <div className="filter-pill">
            <label>Công Đoạn:</label>
            <select
              value={processNumber}
              onChange={(e) => onProcessNumberChange(e.target.value)}
            >
              <option value="All">Tất Cả CĐ</option>
              {processOptions.map((p) => (
                <option key={p} value={String(p)}>
                  Công Đoạn {p}
                </option>
              ))}
            </select>
          </div>

          {/* Select Hiệu Lực */}
          <div className="filter-pill">
            <label>Trạng Thái:</label>
            <select value={useYn} onChange={(e) => onUseYnChange(e.target.value)}>
              <option value="All">Tất Cả (Y/N)</option>
              <option value="Y">Đang Áp Dụng (Y)</option>
              <option value="N">Tạm Dừng (N)</option>
            </select>
          </div>

          {/* Select Hình Ảnh */}
          <div className="filter-pill">
            <label>Hình Ảnh:</label>
            <select value={imageYn} onChange={(e) => onImageYnChange(e.target.value)}>
              <option value="All">Tất Cả</option>
              <option value="YES">Có Hình Ảnh</option>
              <option value="NO">Chưa Có Ảnh</option>
            </select>
          </div>
        </div>

        <button type="button" className="btn-query" onClick={onSearch} title="Tải lại dữ liệu">
          <FiSearch size={12} />
          <span>Tải Dữ Liệu</span>
        </button>
      </div>

      {/* Hàng 2: Phân hệ chuyển đổi chế độ xem */}
      <div className="toolbar-row" style={{ paddingTop: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#64748b" }}>
          <FiFilter size={12} />
          <span>Chế độ hiển thị:</span>
        </div>

        <div className="segmented-switcher">
          <button
            type="button"
            className={`segment-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => onTabChange("all")}
          >
            <FiLayers size={11} />
            <span>Toàn Bộ (All)</span>
          </button>
          <button
            type="button"
            className={`segment-btn ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => onTabChange("charts")}
          >
            <FiPieChart size={11} />
            <span>Biểu Đồ & KPI</span>
          </button>
          <button
            type="button"
            className={`segment-btn ${activeTab === "grid" ? "active" : ""}`}
            onClick={() => onTabChange("grid")}
          >
            <FiGrid size={11} />
            <span>Bảng Dữ Liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsToolbar);
