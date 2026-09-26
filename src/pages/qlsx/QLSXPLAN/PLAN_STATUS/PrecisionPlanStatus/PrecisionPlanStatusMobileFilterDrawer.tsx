import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiCalendar,
  FiFileText,
  FiBox,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { FaIndustry } from "react-icons/fa";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionPlanStatusMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  plan_id: string;
  setPlanID: (val: string) => void;
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  machineList: MACHINE_LIST[];
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionPlanStatusMobileFilterDrawer: React.FC<
  PrecisionPlanStatusMobileFilterDrawerProps
> = React.memo(({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  alltime,
  setAllTime,
  plan_id,
  setPlanID,
  prodrequestno,
  setProdRequestNo,
  codeCMS,
  setCodeCMS,
  codeKD,
  setCodeKD,
  factory,
  setFactory,
  machine,
  setMachine,
  machineList,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <div
      className="precision-plan-status-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-plan-status-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#0284c7" />
            <span>BỘ LỌC TIẾN ĐỘ CHỈ THỊ</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Thời Gian Tra Cứu */}
          <div className="filter-group">
            <span className="group-title">
              <FiCalendar size={14} color="#0284c7" />
              <span>Thời Gian Tra Cứu</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={fromdate.slice(0, 10)}
                  disabled={alltime}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Tới ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={todate.slice(0, 10)}
                  disabled={alltime}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* Checkbox All Time */}
            <label className="mobile-drawer-checkbox">
              <input
                type="checkbox"
                checked={alltime}
                onChange={(e) => setAllTime(e.target.checked)}
              />
              <span className="checkbox-text">
                <FiClock size={13} color="#0284c7" />
                <span>All Time (Tra cứu toàn bộ thời gian)</span>
              </span>
            </label>
          </div>

          {/* Nhóm 2: Lệnh & Chỉ Thị Sản Xuất */}
          <div className="filter-group">
            <span className="group-title">
              <FiFileText size={14} color="#059669" />
              <span>Lệnh &amp; Chỉ Thị Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Số Chỉ Thị (PLAN ID):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: A123456..."
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Số YCSX:</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 1F80008..."
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Sản Phẩm */}
          <div className="filter-group">
            <span className="group-title">
              <FiBox size={14} color="#ea580c" />
              <span>Sản Phẩm &amp; Mã Hàng</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Code ERP (G_CODE):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Code KD (G_NAME):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Nhà Máy & Máy Sản Xuất */}
          <div className="filter-group">
            <span className="group-title">
              <FaIndustry size={13} color="#4f46e5" />
              <span>Nhà Máy &amp; Thiết Bị Máy</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Nhà máy (Factory):</label>
                <select
                  className="mobile-drawer-select"
                  value={factory}
                  onChange={(e) => setFactory(e.target.value)}
                >
                  <option value="ALL">Tất cả nhà máy</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>

              <div className="field-item">
                <label>Thiết bị (Machine):</label>
                <select
                  className="mobile-drawer-select"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                >
                  <option value="ALL">Tất cả máy</option>
                  {machineList
                    .slice()
                    .sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME))
                    .map((ele: MACHINE_LIST, idx: number) => (
                      <option key={idx} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            title="Khôi phục mặc định"
          >
            <FiRotateCcw size={14} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
            title="Áp dụng bộ lọc &amp; Tra cứu dữ liệu"
          >
            <FiSearch size={15} />
            <span>Áp Dụng &amp; Tra Cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default PrecisionPlanStatusMobileFilterDrawer;
