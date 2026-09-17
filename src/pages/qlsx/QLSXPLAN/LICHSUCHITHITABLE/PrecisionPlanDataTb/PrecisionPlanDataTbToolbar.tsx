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
  onTraPlan: () => void;
  onToggleQuickPlan: () => void;
  onMovePlan: () => void;
  onDeletePlan: () => void;
  onUpdatePlan: () => void;
  onPrintChiThi: () => void;
  onPrintChiThiCombo: () => void;
  onPrintBanVe: () => void;
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
  onTraPlan,
  onToggleQuickPlan,
  onMovePlan,
  onDeletePlan,
  onUpdatePlan,
  onPrintChiThi,
  onPrintChiThiCombo,
  onPrintBanVe,
}) => {
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
          title="Lưu các thông tin chỉnh sửa trên bảng"
        >
          <AiFillSave size={14} />
          Lưu PLAN
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
