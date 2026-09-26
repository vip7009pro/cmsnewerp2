import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiCalendar,
  FiFileText,
  FiBox,
  FiClock,
  FiSliders,
} from "react-icons/fi";
import { FaIndustry } from "react-icons/fa";
import { Assignment, ListAlt } from "@mui/icons-material";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionDataSxMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watch: any;
  setValue: (name: any, value: any) => void;
  machineList: MACHINE_LIST[];
  onLoadChiThi: () => void;
  onLoadYcsx: () => void;
  onReset: () => void;
}

export const PrecisionDataSxMobileFilterDrawer: React.FC<
  PrecisionDataSxMobileFilterDrawerProps
> = React.memo(({
  isOpen,
  onClose,
  watch,
  setValue,
  machineList,
  onLoadChiThi,
  onLoadYcsx,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleApplyChiThi = () => {
    onLoadChiThi();
    onClose();
  };

  const handleApplyYcsx = () => {
    onLoadYcsx();
    onClose();
  };

  const fromdate = watch("fromdate");
  const todate = watch("todate");
  const alltime = watch("alltime");
  const prodrequestno = watch("prodrequestno");
  const plan_id = watch("plan_id");
  const m_name = watch("m_name");
  const m_code = watch("m_code");
  const codeKD = watch("codeKD");
  const codeCMS = watch("codeCMS");
  const factory = watch("factory");
  const machine = watch("machine");
  const truSample = watch("truSample");
  const onlyClose = watch("onlyClose");
  const fullSummary = watch("fullSummary");

  return (
    <div
      className="precision-datasx-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-datasx-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#2563eb" />
            <span>BỘ LỌC DỮ LIỆU SẢN XUẤT</span>
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
              <FiCalendar size={14} color="#2563eb" />
              <span>Thời Gian Tra Cứu</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={fromdate || ""}
                  disabled={alltime}
                  onChange={(e) => setValue("fromdate", e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Tới ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={todate || ""}
                  disabled={alltime}
                  onChange={(e) => setValue("todate", e.target.value)}
                />
              </div>
            </div>

            {/* Checkbox All Time */}
            <label className="mobile-drawer-checkbox">
              <input
                type="checkbox"
                checked={alltime || false}
                onChange={(e) => setValue("alltime", e.target.checked)}
              />
              <span className="checkbox-text">
                <FiClock size={13} color="#2563eb" />
                <span>All Time (Tra cứu toàn bộ thời gian)</span>
              </span>
            </label>
          </div>

          {/* Nhóm 2: Lệnh & Chỉ Thị Sản Xuất */}
          <div className="filter-group">
            <span className="group-title">
              <FiFileText size={14} color="#059669" />
              <span>Lệnh & Chỉ Thị Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Số Chỉ Thị (PLAN ID):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: A123456..."
                  value={plan_id || ""}
                  onChange={(e) => setValue("plan_id", e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Số YCSX:</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 1F80008..."
                  value={prodrequestno || ""}
                  onChange={(e) => setValue("prodrequestno", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Sản Phẩm & Liệu */}
          <div className="filter-group">
            <span className="group-title">
              <FiBox size={14} color="#ea580c" />
              <span>Sản Phẩm & Liệu Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Code ERP (G_CODE):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 7C123xxx"
                  value={codeCMS || ""}
                  onChange={(e) => setValue("codeCMS", e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Code KD (G_NAME):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: GH63-xxxxxx"
                  value={codeKD || ""}
                  onChange={(e) => setValue("codeKD", e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col">
              <div className="field-item">
                <label>Tên Liệu (M_NAME):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: SJ-203020HC..."
                  value={m_name || ""}
                  onChange={(e) => setValue("m_name", e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Mã Liệu (M_CODE):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: A123456"
                  value={m_code || ""}
                  onChange={(e) => setValue("m_code", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Nhà Máy & Máy Sản Xuất */}
          <div className="filter-group">
            <span className="group-title">
              <FaIndustry size={13} color="#4f46e5" />
              <span>Nhà Máy & Máy Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Factory:</label>
                <select
                  className="mobile-drawer-select"
                  value={factory || "ALL"}
                  onChange={(e) => setValue("factory", e.target.value)}
                >
                  <option value="ALL">Tất cả nhà máy</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>

              <div className="field-item">
                <label>Máy Sản Xuất:</label>
                <select
                  className="mobile-drawer-select"
                  value={machine || "ALL"}
                  onChange={(e) => setValue("machine", e.target.value)}
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

          {/* Nhóm 5: Tùy Chọn Phân Tích */}
          <div className="filter-group">
            <span className="group-title">
              <FiSliders size={14} color="#7c3aed" />
              <span>Tùy Chọn Phân Tích</span>
            </span>

            <div className="checkbox-stack">
              <label className="mobile-drawer-checkbox">
                <input
                  type="checkbox"
                  checked={truSample ?? true}
                  onChange={(e) => setValue("truSample", e.target.checked)}
                />
                <span className="checkbox-text">
                  <span>Trừ Sample (Loại trừ lượng mẫu thử nghiệm)</span>
                </span>
              </label>

              <label className="mobile-drawer-checkbox">
                <input
                  type="checkbox"
                  checked={onlyClose || false}
                  onChange={(e) => setValue("onlyClose", e.target.checked)}
                />
                <span className="checkbox-text">
                  <span>Only Closed (Chỉ lấy các lệnh đã kết thúc)</span>
                </span>
              </label>

              <label className="mobile-drawer-checkbox">
                <input
                  type="checkbox"
                  checked={fullSummary || false}
                  onChange={(e) => setValue("fullSummary", e.target.checked)}
                />
                <span className="checkbox-text">
                  <span>Full Summary (Xem đầy đủ chi tiết các cột hao hụt)</span>
                </span>
              </label>
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
            className="btn-drawer-chithi"
            onClick={handleApplyChiThi}
            title="Áp dụng bộ lọc & Tra cứu dữ liệu Chỉ Thị"
          >
            <Assignment sx={{ fontSize: 16 }} />
            <span>Tra Chỉ Thị</span>
          </button>

          <button
            type="button"
            className="btn-drawer-ycsx"
            onClick={handleApplyYcsx}
            title="Áp dụng bộ lọc & Tra cứu dữ liệu YCSX"
          >
            <ListAlt sx={{ fontSize: 16 }} />
            <span>Tra YCSX</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default PrecisionDataSxMobileFilterDrawer;
