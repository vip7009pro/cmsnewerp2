import React from "react";
import {
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineReload,
} from "react-icons/ai";
import { BiTransfer } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionPlanDataTbMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  machine_list: MACHINE_LIST[];
  onTraPlan: () => void;
  onMovePlan: () => void;
}

export const PrecisionPlanDataTbMobileFilterDrawer: React.FC<
  PrecisionPlanDataTbMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  factory,
  setFactory,
  machine,
  setMachine,
  machine_list,
  onTraPlan,
  onMovePlan,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onTraPlan();
    onClose();
  };

  const handleReset = () => {
    setFactory("NM1");
    setMachine("ALL");
  };

  const handleMoveAction = () => {
    onMovePlan();
    onClose();
  };

  return (
    <div
      className="plandatatb-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="plandatatb-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#2563eb" />
            <span>BỘ LỌC KẾ HOẠCH SẢN XUẤT</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Nhóm ngày kế hoạch & nhà máy */}
          <div className="filter-group">
            <span className="group-title">Thông Tin Tra Cứu</span>
            <div className="grid-2col">
              <div className="field-item">
                <label>PLAN DATE (Ngày KH):</label>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>FACTORY (Nhà máy):</label>
                <select
                  value={factory}
                  onChange={(e) => setFactory(e.target.value)}
                >
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>
            </div>

            <div className="field-item">
              <label>MACHINE (Chọn máy sản xuất):</label>
              <select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
              >
                <option value="ALL">-- TẤT CẢ MÁY --</option>
                {machine_list.map((ele: MACHINE_LIST, idx: number) => (
                  <option key={idx} value={ele.EQ_NAME}>
                    {ele.EQ_NAME}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nhóm Move Plan Date */}
          <div className="filter-group">
            <span className="group-title">Chuyển Ngày Kế Hoạch (Move Plan)</span>
            <div className="field-item">
              <label>MOVE TO DATE (Ngày muốn dời tới):</label>
              <input
                type="date"
                value={todate.slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-move-plan-drawer"
              onClick={handleMoveAction}
              title="Chuyển các dòng kế hoạch đã chọn sang ngày này"
            >
              <BiTransfer size={15} />
              <span>Dời Kế Hoạch Sang Ngày {todate.slice(0, 10)}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleReset}
          >
            <AiOutlineReload size={14} />
            <span>Mặc Định</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
          >
            <AiOutlineSearch size={16} />
            <span>Áp Dụng & Tra Cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPlanDataTbMobileFilterDrawer);
