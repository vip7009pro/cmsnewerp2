import React from "react";
import { FiSearch, FiLayers, FiBarChart2, FiGrid } from "react-icons/fi";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionBaoCaoFullRollToolbarProps {
  fromDate: string;
  toDate: string;
  codeKd: string;
  codeCms: string;
  mName: string;
  mCode: string;
  prodRequestNo: string;
  planId: string;
  custNameKd: string;
  factory: string;
  machine: string;
  allTime: boolean;
  machineList: MACHINE_LIST[];
  isLoading: boolean;
  viewMode: "all" | "charts" | "grid";
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onCodeKdChange: (val: string) => void;
  onCodeCmsChange: (val: string) => void;
  onMNameChange: (val: string) => void;
  onMCodeChange: (val: string) => void;
  onProdRequestNoChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onCustNameKdChange: (val: string) => void;
  onFactoryChange: (val: string) => void;
  onMachineChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onViewModeChange: (mode: "all" | "charts" | "grid") => void;
  onSearch: () => void;
}

const PrecisionBaoCaoFullRollToolbar: React.FC<PrecisionBaoCaoFullRollToolbarProps> = ({
  fromDate,
  toDate,
  codeKd,
  codeCms,
  mName,
  mCode,
  prodRequestNo,
  planId,
  custNameKd,
  factory,
  machine,
  allTime,
  machineList,
  isLoading,
  viewMode,
  onFromDateChange,
  onToDateChange,
  onCodeKdChange,
  onCodeCmsChange,
  onMNameChange,
  onMCodeChange,
  onProdRequestNoChange,
  onPlanIdChange,
  onCustNameKdChange,
  onFactoryChange,
  onMachineChange,
  onAllTimeChange,
  onViewModeChange,
  onSearch,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-bcfr-toolbar">
      {/* Hàng 1: Thời gian, Nhà máy, Máy, Action Button và View Switcher */}
      <div className="precision-bcfr-toolbar__row1">
        <div className="precision-bcfr-toolbar__left-controls">
          <div className="filter-item">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="filter-item">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="filter-item">
            <label>Factory:</label>
            <select
              value={factory}
              onChange={(e) => onFactoryChange(e.target.value)}
              onKeyDown={handleKeyDown}
            >
              <option value="ALL">ALL</option>
              <option value="NM1">NM1</option>
              <option value="NM2">NM2</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Machine:</label>
            <select
              value={machine}
              onChange={(e) => onMachineChange(e.target.value)}
              onKeyDown={handleKeyDown}
            >
              <option value="ALL">ALL</option>
              {machineList.map((ele, idx) => (
                <option key={idx} value={ele.EQ_NAME}>
                  {ele.EQ_NAME}
                </option>
              ))}
            </select>
          </div>

          <label className="filter-item filter-item--checkbox">
            <input
              type="checkbox"
              checked={allTime}
              onChange={(e) => onAllTimeChange(e.target.checked)}
            />
            <span>All Time</span>
          </label>

          <button
            type="button"
            className="precision-bcfr-toolbar__btn-load"
            onClick={onSearch}
            disabled={isLoading}
          >
            <FiSearch size={12} />
            <span>{isLoading ? "Đang tải..." : "Tra Dữ Liệu"}</span>
          </button>
        </div>

        {/* Segmented View Mode Switcher */}
        <div className="segmented-switch">
          <button
            type="button"
            className={`segmented-switch__btn ${viewMode === "all" ? "segmented-switch__btn--active" : ""}`}
            onClick={() => onViewModeChange("all")}
            title="Xem toàn bộ Dashboard và Bảng dữ liệu"
          >
            <FiLayers size={11} />
            <span>Toàn Bộ</span>
          </button>
          <button
            type="button"
            className={`segmented-switch__btn ${viewMode === "charts" ? "segmented-switch__btn--active" : ""}`}
            onClick={() => onViewModeChange("charts")}
            title="Chỉ xem KPI và Biểu đồ phân tích"
          >
            <FiBarChart2 size={11} />
            <span>Biểu Đồ</span>
          </button>
          <button
            type="button"
            className={`segmented-switch__btn ${viewMode === "grid" ? "segmented-switch__btn--active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Chỉ xem Bảng dữ liệu chi tiết"
          >
            <FiGrid size={11} />
            <span>Bảng Dữ Liệu</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Chi tiết tìm kiếm sản phẩm & vật liệu */}
      <div className="precision-bcfr-toolbar__row2">
        <div className="filter-item">
          <label>Code KD:</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx"
            value={codeKd}
            onChange={(e) => onCodeKdChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123xxx"
            value={codeCms}
            onChange={(e) => onCodeCmsChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Tên Liệu:</label>
          <input
            type="text"
            placeholder="SJ-203020HC"
            value={mName}
            onChange={(e) => onMNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Mã Liệu:</label>
          <input
            type="text"
            placeholder="A000001"
            value={mCode}
            onChange={(e) => onMCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Số YCSX:</label>
          <input
            type="text"
            placeholder="1F80008"
            value={prodRequestNo}
            onChange={(e) => onProdRequestNoChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Số Chỉ Thị:</label>
          <input
            type="text"
            placeholder="A123456"
            value={planId}
            onChange={(e) => onPlanIdChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="filter-item">
          <label>Khách Hàng:</label>
          <input
            type="text"
            placeholder="SEV"
            value={custNameKd}
            onChange={(e) => onCustNameKdChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollToolbar);
export { PrecisionBaoCaoFullRollToolbar };
