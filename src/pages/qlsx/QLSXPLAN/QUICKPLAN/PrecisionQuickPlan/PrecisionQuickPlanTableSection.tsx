import React, { useMemo } from "react";
import {
  AiFillFileExcel,
  AiFillFolderAdd,
  AiFillSave,
  AiOutlineDelete,
} from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import AGTable from "../../../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../../../api/services/excelService";
import { checkBP } from "../../../../../api/services/permissionService";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";
import { UserData } from "../../../../../api/GlobalInterface";
import { getColumnQuickPlanDataTable } from "./PrecisionQuickPlanColumns";

interface PrecisionQuickPlanTableSectionProps {
  userData?: UserData;
  showhideycsxtable: number;
  setShowHideYCSXTable: (mode: number) => void;
  plandatatable: QLSXPLANDATA[];
  handle_AddBlankPlan: () => void;
  handleConfirmSavePlan: () => void;
  handleConfirmDeletePlan: () => void;
  handleSaveQLSX: () => void;
  onCellEditingStopped: (params: any) => Promise<void>;
  onCellClick: (params: any) => Promise<void>;
  onSelectionChange: (params: any) => void;
  onToggleIsSetting: (row: QLSXPLANDATA) => void;
}

export const PrecisionQuickPlanTableSection: React.FC<PrecisionQuickPlanTableSectionProps> = ({
  userData,
  showhideycsxtable,
  setShowHideYCSXTable,
  plandatatable,
  handle_AddBlankPlan,
  handleConfirmSavePlan,
  handleConfirmDeletePlan,
  handleSaveQLSX,
  onCellEditingStopped,
  onCellClick,
  onSelectionChange,
  onToggleIsSetting,
}) => {
  const columns = useMemo(() => {
    return getColumnQuickPlanDataTable({ onToggleIsSetting });
  }, [onToggleIsSetting]);

  return (
    <div className="quickplan-table-pane">
      {/* 1 Dòng Toolbar Đầy Đủ 6 Nút */}
      <div className="quickplan-toolbar">
        <div className="toolbar-left">
          {/* Nút 1: Switch Tab */}
          <button
            type="button"
            className="stb-ghost-blue"
            onClick={() => {
              setShowHideYCSXTable(showhideycsxtable === 3 ? 1 : showhideycsxtable + 1);
            }}
            title="Chuyển đổi hiển thị Plan và YCSX"
          >
            <BiShow size={13} />
            <span>Switch Tab</span>
          </button>

          {/* Nút 2: Save Excel */}
          <button
            type="button"
            className="stb-success"
            onClick={() => SaveExcel(plandatatable, "Plan Data Table")}
            title="Xuất danh sách Plan nháp ra file Excel"
          >
            <AiFillFileExcel size={13} />
            <span>SAVE Excel</span>
          </button>

          {/* Nút 3: Add Blank PLAN */}
          <button
            type="button"
            className="stb-ghost-purple"
            onClick={handle_AddBlankPlan}
            title="Thêm một dòng Plan trống để chỉ thị tự do"
          >
            <AiFillFolderAdd size={13} />
            <span>Add Blank PLAN</span>
          </button>
        </div>

        <div className="toolbar-right">
          <span className="stb-badge stb-badge--emerald">
            {plandatatable.length} dòng Plan
          </span>

          <span className="stb-sep" />

          {/* Nút 4: LƯU PLAN (Có checkBP QLSX) */}
          <button
            type="button"
            className="stb-primary"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleConfirmSavePlan);
            }}
            title="Lưu các dòng Plan nháp đã tick chọn vào hệ thống chính thức"
          >
            <AiFillSave size={13} />
            <span>LƯU PLAN</span>
          </button>

          {/* Nút 5: XÓA PLAN NHÁP */}
          <button
            type="button"
            className="stb-ghost-rose"
            onClick={handleConfirmDeletePlan}
            title="Xóa các dòng Plan nháp đã tick chọn"
          >
            <AiOutlineDelete size={13} />
            <span>XÓA PLAN NHÁP</span>
          </button>

          {/* Nút 6: Lưu Data Định Mức (Có checkBP QLSX) */}
          <button
            type="button"
            className="stb-success"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleSaveQLSX);
            }}
            title="Lưu thông tin định mức máy, UPH, Loss xuống hệ thống"
          >
            <AiFillSave size={13} />
            <span>Lưu Data Định Mức</span>
          </button>
        </div>
      </div>

      {/* Bảng AGTable */}
      <div className="plan-grid-container">
        <AGTable
          showFilter={false}
          columns={columns}
          data={plandatatable}
          onCellEditingStopped={onCellEditingStopped}
          onCellClick={onCellClick}
          onSelectionChange={onSelectionChange}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionQuickPlanTableSection);
