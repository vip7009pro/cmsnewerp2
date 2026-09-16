import React from "react";

interface PrecisionRNRToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  factory: string;
  setFactory: (val: string) => void;
  testType: string;
  setTestType: (val: string) => void;
  testID: string;
  setTestID: (val: string) => void;
  empl_name: string;
  setEmpl_Name: (val: string) => void;
  selectedData: "detail" | "summaryByEmpl" | "summaryByDept";
  onSelectDataChange: (val: "detail" | "summaryByEmpl" | "summaryByDept") => void;
  onSearch: () => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoading: boolean;
  quickFilterText: string;
  setQuickFilterText: (val: string) => void;
  onExportExcelFiltered: () => void;
  onExportExcelAll: () => void;
  filteredCount: number;
  totalCount: number;
}

const PrecisionRNRToolbar: React.FC<PrecisionRNRToolbarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  alltime,
  setAllTime,
  factory,
  setFactory,
  testType,
  setTestType,
  testID,
  setTestID,
  empl_name,
  setEmpl_Name,
  selectedData,
  onSelectDataChange,
  onSearch,
  handleSearchKeyDown,
  isLoading,
  quickFilterText,
  setQuickFilterText,
  onExportExcelFiltered,
  onExportExcelAll,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="precision-rnr__toolbar">
      {/* Hàng 1: Filters */}
      <div className="precision-rnr__toolbarRow">
        <div className="precision-rnr__filterGroup">
          <div className="precision-rnr__filterItem">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              disabled={alltime}
            />
          </div>

          <div className="precision-rnr__filterItem">
            <label>Tới ngày:</label>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              disabled={alltime}
            />
          </div>

          <label className="precision-rnr__checkbox">
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time</span>
          </label>

          <div className="precision-rnr__filterItem">
            <label>Nhà máy:</label>
            <select
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="NM1">NM1 (Nhà máy 1)</option>
              <option value="NM2">NM2 (Nhà máy 2)</option>
            </select>
          </div>

          <div className="precision-rnr__filterItem">
            <label>Loại Test:</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            >
              <option value="ALL">ALL (Tất cả)</option>
              <option value="G_RNR">G_RNR (Gauge R&R)</option>
              <option value="Test_LT">Test_LT (Lý Thuyết)</option>
              <option value="Test_CC">Test_CC (Chứng Chỉ)</option>
            </select>
          </div>

          <div className="precision-rnr__filterItem">
            <label>Test ID:</label>
            <input
              type="text"
              placeholder="Nhập Test ID..."
              value={testID}
              onChange={(e) => setTestID(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className="precision-rnr__filterItem">
            <label>Tên NV:</label>
            <input
              type="text"
              placeholder="Tên nhân viên..."
              value={empl_name}
              onChange={(e) => setEmpl_Name(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <button
            type="button"
            className="precision-rnr__searchBtn"
            onClick={onSearch}
            disabled={isLoading}
            title="Tra cứu dữ liệu (Enter)"
          >
            <span className="material-symbols-outlined">
              {isLoading ? "sync" : "search"}
            </span>
            <span>{isLoading ? "Đang Tra..." : "Tra Dữ Liệu"}</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Segment Switcher & Table Actions */}
      <div className="precision-rnr__toolbarRow">
        {/* Segment Switcher */}
        <div className="precision-rnr__segmentNav">
          <button
            type="button"
            className={`precision-rnr__segmentBtn ${selectedData === "detail" ? "active" : ""}`}
            onClick={() => onSelectDataChange("detail")}
          >
            <span className="material-symbols-outlined">list_alt</span>
            <span>Chi Tiết Câu Đề Thi</span>
          </button>

          <button
            type="button"
            className={`precision-rnr__segmentBtn ${selectedData === "summaryByEmpl" ? "active" : ""}`}
            onClick={() => onSelectDataChange("summaryByEmpl")}
          >
            <span className="material-symbols-outlined">person_outline</span>
            <span>Tổng Hợp Theo Nhân Viên</span>
          </button>

          <button
            type="button"
            className={`precision-rnr__segmentBtn ${selectedData === "summaryByDept" ? "active" : ""}`}
            onClick={() => onSelectDataChange("summaryByDept")}
          >
            <span className="material-symbols-outlined">corporate_fare</span>
            <span>Phân Tích Theo Bộ Phận</span>
          </button>
        </div>

        {/* Quick Search & Excel Actions */}
        <div className="precision-rnr__gridToolbarLeft" style={{ justifyContent: "flex-end" }}>
          <div className="precision-rnr__quickSearch">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              placeholder="Lọc nhanh trên bảng..."
            />
            {quickFilterText && (
              <button
                type="button"
                onClick={() => setQuickFilterText("")}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8", padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="precision-rnr__gridActions">
            <button
              type="button"
              className="precision-rnr__actionBtn precision-rnr__actionBtn--excel"
              onClick={onExportExcelFiltered}
              title="Xuất các dòng đang lọc ra Excel"
            >
              <span className="material-symbols-outlined">download</span>
              <span>EX1</span>
              <span className="badge-sub">Đang Lọc</span>
            </button>

            <button
              type="button"
              className="precision-rnr__actionBtn precision-rnr__actionBtn--excel"
              onClick={onExportExcelAll}
              title="Xuất toàn bộ kết quả ra Excel"
            >
              <span className="material-symbols-outlined">file_download</span>
              <span>EX2</span>
              <span className="badge-sub">Toàn Bộ</span>
            </button>
          </div>

          <div className="precision-rnr__gridMeta">
            Hiển thị: <strong>{filteredCount.toLocaleString("en-US")}</strong> / {totalCount.toLocaleString("en-US")} dòng
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionRNRToolbar);
