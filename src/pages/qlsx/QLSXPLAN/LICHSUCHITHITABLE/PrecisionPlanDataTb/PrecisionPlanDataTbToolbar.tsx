import React from "react";
import {
  AiFillFileExcel,
  AiFillSave,
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlinePrinter,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiTransfer } from "react-icons/bi";
import { BsLightningCharge } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import { MACHINE_LIST, QLSXPLANDATA } from "../../interfaces/khsxInterface";

interface PrecisionPlanDataTbToolbarProps {
  fromdate: string;
  setFromDate: (date: string) => void;
  todate: string;
  setToDate: (date: string) => void;
  factory: string;
  setFactory: (factory: string) => void;
  machine: string;
  setMachine: (machine: string) => void;
  machine_list: MACHINE_LIST[];
  plandatatable: QLSXPLANDATA[];
  isLoading: boolean;
  actionLoading: boolean;
  actionProgress: number;
  onTraPlan: () => void;
  onToggleQuickPlan: () => void;
  onMovePlan: () => void;
  onDeletePlan: () => void;
  onUpdatePlan: () => void;
  onPrintChiThi: () => void;
  onPrintChiThiCombo: () => void;
  onPrintBanVe: () => void;
  isMobile?: boolean;
  onOpenFilterDrawer?: () => void;
}

export const PrecisionPlanDataTbToolbar: React.FC<PrecisionPlanDataTbToolbarProps> = ({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  factory,
  setFactory,
  machine,
  setMachine,
  machine_list,
  plandatatable,
  isLoading,
  actionLoading,
  actionProgress,
  onTraPlan,
  onToggleQuickPlan,
  onMovePlan,
  onDeletePlan,
  onUpdatePlan,
  onPrintChiThi,
  onPrintChiThiCombo,
  onPrintBanVe,
  isMobile = false,
  onOpenFilterDrawer,
}) => {
  if (isMobile) {
    return (
      <div className="precision-plandatatb__toolbar is-mobile">
        {/* HÀNG 1: Chọn ngày + Chọn máy + Chọn xưởng + Nút Tra PLAN */}
        <div className="toolbar-mobile-row toolbar-mobile-row--search">
          <div className="mobile-field-group mobile-field-group--date">
            <label className="field-lbl">NGÀY:</label>
            <input
              type="date"
              className="mobile-input-date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="mobile-field-group mobile-field-group--machine">
            <select
              className="mobile-select-machine"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            >
              <option value="ALL">ALL MÁY</option>
              {machine_list.map((ele: MACHINE_LIST, index: number) => (
                <option key={index} value={ele.EQ_NAME}>
                  {ele.EQ_NAME}
                </option>
              ))}
            </select>
          </div>

          <select
            className="mobile-select-factory"
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
            title="Chọn nhà máy"
          >
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>

          <button
            type="button"
            className="tb-btn tb-btn--primary btn-tra-plan"
            onClick={onTraPlan}
            disabled={isLoading}
            title="Tra cứu kế hoạch theo ngày và máy"
          >
            <AiOutlineSearch size={14} />
            <span>{isLoading ? "..." : "Tra PLAN"}</span>
          </button>
        </div>

        {/* HÀNG 2: MOVE TO DATE + Nút MOVE PLAN + Nút QUICK PLAN */}
        <div className="toolbar-mobile-row toolbar-mobile-row--move">
          <div className="mobile-field-group mobile-field-group--move">
            <label className="field-lbl">MOVE TO:</label>
            <input
              type="date"
              className="mobile-input-date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="tb-btn tb-btn--amber btn-move-plan"
            onClick={onMovePlan}
            title="Dời các dòng kế hoạch đã chọn sang ngày MOVE TO"
          >
            <BiTransfer size={13} />
            <span>MOVE PLAN</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--indigo btn-quick-plan"
            onClick={onToggleQuickPlan}
            title="Mở bảng Quick Plan"
          >
            <BsLightningCharge size={12} />
            <span>QUICK PLAN</span>
          </button>
        </div>

        {/* HÀNG 3: Dải nút thao tác & in ấn đầy đủ màu sắc */}
        <div className="toolbar-mobile-row toolbar-mobile-row--actions">
          <button
            type="button"
            className="tb-btn tb-btn--primary btn-save-plan"
            onClick={onUpdatePlan}
            disabled={actionLoading}
            title="Lưu các thông tin chỉnh sửa trên bảng"
          >
            <AiFillSave size={13} />
            <span>{actionLoading ? `${actionProgress}% Lưu` : "Lưu PLAN"}</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--cyan"
            onClick={onPrintChiThi}
            title="In phiếu chỉ thị cho các plan đã chọn"
          >
            <AiOutlinePrinter size={13} />
            <span>In Chỉ Thị</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--primary"
            onClick={onPrintChiThiCombo}
            title="In chỉ thị combo theo YCSX"
          >
            <AiOutlinePrinter size={13} />
            <span>In Combo</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--orange"
            onClick={onPrintBanVe}
            title="In bản vẽ kỹ thuật"
          >
            <AiOutlinePrinter size={13} />
            <span>Bản Vẽ</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--success"
            onClick={() => SaveExcel(plandatatable, "PlanDataTable")}
            title="Xuất bảng Excel"
          >
            <AiFillFileExcel size={13} />
            <span>SAVE Excel</span>
          </button>

          <button
            type="button"
            className="tb-btn tb-btn--danger"
            onClick={onDeletePlan}
            title="Xóa kế hoạch đã chọn"
          >
            <AiOutlineDelete size={13} />
            <span>DELETE PLAN</span>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="precision-plandatatb__toolbar">
      <div className="filter-fields">
        <div className="filter-item">
          <label>PLAN DATE:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>FACTORY:</label>
          <select
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        <div className="filter-item">
          <label>MACHINE:</label>
          <select
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
          >
            <option value="ALL">ALL</option>
            {machine_list.map((ele: MACHINE_LIST, index: number) => (
              <option key={index} value={ele.EQ_NAME}>
                {ele.EQ_NAME}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>MOVE TO DATE:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="tb-btn tb-btn--primary"
          onClick={onTraPlan}
          disabled={isLoading}
          title="Tra cứu kế hoạch sản xuất theo ngày"
        >
          <AiOutlineSearch size={14} />
          {isLoading ? "Đang tải..." : "Tra PLAN"}
        </button>

        <button
          className="tb-btn tb-btn--indigo"
          onClick={onToggleQuickPlan}
          title="Mở bảng Quick Plan"
        >
          <BsLightningCharge size={13} />
          QUICK PLAN
        </button>

        <button
          className="tb-btn tb-btn--amber"
          onClick={onMovePlan}
          title="Chuyển ngày kế hoạch đã chọn sang MOVE TO DATE"
        >
          <BiTransfer size={14} />
          MOVE PLAN
        </button>

        <button
          className="tb-btn tb-btn--danger"
          onClick={onDeletePlan}
          title="Xóa kế hoạch đã chọn"
        >
          <AiOutlineDelete size={14} />
          DELETE PLAN
        </button>

        <button
          className="tb-btn tb-btn--success"
          onClick={() => SaveExcel(plandatatable, "PlanDataTable")}
          title="Xuất bảng Excel"
        >
          <AiFillFileExcel size={14} />
          SAVE Excel
        </button>

        <button
          className="tb-btn tb-btn--primary"
          onClick={onUpdatePlan}
          disabled={actionLoading}
          title="Lưu các thông tin chỉnh sửa trên bảng"
        >
          <AiFillSave size={14} />
          {actionLoading ? `${actionProgress}% Đang lưu...` : "Lưu PLAN"}
        </button>

        <button
          className="tb-btn tb-btn--cyan"
          onClick={onPrintChiThi}
          title="In phiếu chỉ thị cho các plan đã chọn"
        >
          <AiOutlinePrinter size={14} />
          Print Chỉ Thị
        </button>

        <button
          className="tb-btn tb-btn--primary"
          onClick={onPrintChiThiCombo}
          title="In chỉ thị combo theo YCSX"
        >
          <AiOutlinePrinter size={14} />
          Print Combo
        </button>

        <button
          className="tb-btn tb-btn--orange"
          onClick={onPrintBanVe}
          title="In bản vẽ kỹ thuật"
        >
          <AiOutlinePrinter size={14} />
          Print Bản Vẽ
        </button>
      </div>
    </div>
  );
};
