import React from "react";
import moment from "moment";
import {
  FaFilter,
  FaTimes,
  FaUndo,
  FaSearch,
  FaCalendarAlt,
  FaIndustry,
  FaBarcode,
  FaBoxOpen,
  FaClipboardList,
} from "react-icons/fa";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionBaoCaoFullRollMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  allTime: boolean;
  factory: string;
  machine: string;
  machineList: MACHINE_LIST[];
  codeKd: string;
  codeCms: string;
  mName: string;
  mCode: string;
  prodRequestNo: string;
  planId: string;
  custNameKd: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onFactoryChange: (val: string) => void;
  onMachineChange: (val: string) => void;
  onCodeKdChange: (val: string) => void;
  onCodeCmsChange: (val: string) => void;
  onMNameChange: (val: string) => void;
  onMCodeChange: (val: string) => void;
  onProdRequestNoChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onCustNameKdChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const PrecisionBaoCaoFullRollMobileFilterDrawer: React.FC<
  PrecisionBaoCaoFullRollMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  allTime,
  factory,
  machine,
  machineList,
  codeKd,
  codeCms,
  mName,
  mCode,
  prodRequestNo,
  planId,
  custNameKd,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onFactoryChange,
  onMachineChange,
  onCodeKdChange,
  onCodeCmsChange,
  onMNameChange,
  onMCodeChange,
  onProdRequestNoChange,
  onPlanIdChange,
  onCustNameKdChange,
  onSearch,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleQuickDays = (days: number) => {
    const to = moment().format("YYYY-MM-DD");
    const from =
      days === 0 ? to : moment().subtract(days, "days").format("YYYY-MM-DD");
    onToDateChange(to);
    onFromDateChange(from);
    onAllTimeChange(false);
  };

  const isToday =
    fromDate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    toDate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    !allTime;

  const handleApply = () => {
    onSearch();
    onClose();
  };

  return (
    <div className="precision-mobile-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh kéo trang trí */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FaFilter className="filter-icon" />
            <span>BỘ LỌC BÁO CÁO FULL ROLL</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Nội Dung Điều Kiện Lọc */}
        <div className="drawer-body">
          {/* Nhóm 1: Khoảng ngày sản xuất / nạp liệu */}
          <div className="filter-section">
            <label className="section-label">
              <FaCalendarAlt size={11} />
              <span>Khoảng ngày sản xuất / nạp liệu:</span>
            </label>
            <div className="date-inputs-row">
              <div className="date-field">
                <span className="field-hint">Từ ngày</span>
                <input
                  type="date"
                  value={fromDate ? fromDate.slice(0, 10) : ""}
                  onChange={(e) => onFromDateChange(e.target.value)}
                  disabled={allTime}
                />
              </div>
              <div className="date-field">
                <span className="field-hint">Đến ngày</span>
                <input
                  type="date"
                  value={toDate ? toDate.slice(0, 10) : ""}
                  onChange={(e) => onToDateChange(e.target.value)}
                  disabled={allTime}
                />
              </div>
            </div>

            {/* Quick chọn ngày */}
            <div className="quick-dates-pills">
              <button
                type="button"
                className={`quick-pill ${isToday ? "quick-pill--active" : ""}`}
                onClick={() => handleQuickDays(0)}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(3)}
              >
                3 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(7)}
              >
                7 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(30)}
              >
                30 ngày
              </button>
            </div>

            {/* Checkbox All Time */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#334155",
                marginTop: "4px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={allTime}
                onChange={(e) => onAllTimeChange(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#2563eb" }}
              />
              <span>Tra cứu toàn bộ thời gian (All Time)</span>
            </label>
          </div>

          {/* Nhóm 2: Nhà máy & Máy sản xuất */}
          <div className="filter-section">
            <label className="section-label">
              <FaIndustry size={11} />
              <span>Khu vực sản xuất:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Nhà máy</span>
                <select
                  value={factory}
                  onChange={(e) => onFactoryChange(e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả NM)</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>
              <div className="input-group">
                <span className="field-hint">Máy (Line)</span>
                <select
                  value={machine}
                  onChange={(e) => onMachineChange(e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả máy)</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>
                      {m.EQ_NAME}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 3: Thông tin sản phẩm */}
          <div className="filter-section">
            <label className="section-label">
              <FaBarcode size={11} />
              <span>Sản phẩm:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Code KD</span>
                <input
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKd}
                  onChange={(e) => onCodeKdChange(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Code ERP</span>
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCms}
                  onChange={(e) => onCodeCmsChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Vật liệu */}
          <div className="filter-section">
            <label className="section-label">
              <FaBoxOpen size={11} />
              <span>Vật liệu sản xuất:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Tên Liệu</span>
                <input
                  type="text"
                  placeholder="SJ-203020HC..."
                  value={mName}
                  onChange={(e) => onMNameChange(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Mã Liệu</span>
                <input
                  type="text"
                  placeholder="A000001..."
                  value={mCode}
                  onChange={(e) => onMCodeChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 5: Đơn vị & Kế hoạch */}
          <div className="filter-section">
            <label className="section-label">
              <FaClipboardList size={11} />
              <span>Kế hoạch & Đơn hàng:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Số YCSX</span>
                <input
                  type="text"
                  placeholder="1F80008..."
                  value={prodRequestNo}
                  onChange={(e) => onProdRequestNoChange(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-hint">Số Chỉ Thị (Plan ID)</span>
                <input
                  type="text"
                  placeholder="A123456..."
                  value={planId}
                  onChange={(e) => onPlanIdChange(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 4 }}>
              <span className="field-hint">Khách Hàng</span>
              <input
                type="text"
                placeholder="SEV, SEVT, KH khác..."
                value={custNameKd}
                onChange={(e) => onCustNameKdChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Drawer: Nút Đặt Lại & Nút Áp Dụng */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            title="Đặt lại bộ lọc về mặc định"
          >
            <FaUndo size={11} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
            title="Áp dụng bộ lọc và tra cứu báo cáo"
          >
            <FaSearch size={12} />
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollMobileFilterDrawer);
