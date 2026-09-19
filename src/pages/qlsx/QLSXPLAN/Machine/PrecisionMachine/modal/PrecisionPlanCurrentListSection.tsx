import React, { useMemo, useRef } from "react";
import {
  AiFillSave,
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlinePrinter,
  AiOutlineReload,
} from "react-icons/ai";
import { FcDeleteRow } from "react-icons/fc";
import { MdResetTv } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import AGTable from "../../../../../../components/DataTable/AGTable";
import { QLSXPLANDATA } from "../../../interfaces/khsxInterface";
import { getColumnPlanDataTable } from "./PrecisionPlanColumns";

interface CurrentListSectionProps {
  plans: QLSXPLANDATA[];
  selectedPlan: QLSXPLANDATA;
  onSelectPlan: (plan: QLSXPLANDATA) => void;
  onMovePlan: (direction: "UP" | "DOWN", plan: QLSXPLANDATA) => void;
  onDeletePlan: (plan: QLSXPLANDATA) => void;
  onStartPlan: (plan: QLSXPLANDATA) => void;
  onFinishPlan: (plan: QLSXPLANDATA) => void;
  // Toolbar Buttons nguyên bản
  showYCSX: boolean;
  onToggleYCSX: () => void;
  onPrintChiThi: (selectedRows: QLSXPLANDATA[]) => void;
  onPrintYCKT: () => void;
  onSavePlanBatch: () => void;
  onRefreshPlans: () => void;
  onSaveDataDinhMuc: () => void;
  onSetDMMD: () => void;
  canSetDMMD: boolean;
  totalMachineTime: number;
  // Dùng để IS_SETTING checkbox hoạt động
  plandatatable?: QLSXPLANDATA[];
  setPlanDataTable?: React.Dispatch<React.SetStateAction<QLSXPLANDATA[]>>;
}

export const PrecisionPlanCurrentListSection: React.FC<CurrentListSectionProps> = React.memo(
  ({
    plans,
    selectedPlan,
    onSelectPlan,
    onMovePlan,
    onDeletePlan,
    onStartPlan,
    onFinishPlan,
    showYCSX,
    onToggleYCSX,
    onPrintChiThi,
    onPrintYCKT,
    onSavePlanBatch,
    onRefreshPlans,
    onSaveDataDinhMuc,
    onSetDMMD,
    canSetDMMD,
    totalMachineTime,
    plandatatable,
    setPlanDataTable,
  }) => {
    const gridPlanRef = useRef<any>(null);

    const columns = useMemo(
      () =>
        getColumnPlanDataTable({
          plandatatable,
          setPlanDataTable,
          onMovePlan,
          onDeletePlan,
          onStartPlan,
          onFinishPlan,
        }),
      [plandatatable, setPlanDataTable, onMovePlan, onDeletePlan, onStartPlan, onFinishPlan]
    );

    // Mỗi click đều reload detail, kể cả khi người dùng click lại cùng plan.
    const handleCellClick = React.useCallback(
      (params: any) => {
        if (params?.data) onSelectPlan(params.data);
      },
      [onSelectPlan]
    );

    // Lấy các row đã check để in multi chỉ thị
    const handlePrintChiThiSelected = React.useCallback(() => {
      const api = gridPlanRef.current?.api;
      if (!api) {
        // Fallback: in selectedPlan đang chọn
        onPrintChiThi([selectedPlan]);
        return;
      }
      const selectedRows: QLSXPLANDATA[] = api.getSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        onPrintChiThi(selectedRows);
      } else {
        // Nếu chưa check row nào, in row đang chọn
        onPrintChiThi([selectedPlan]);
      }
    }, [onPrintChiThi, selectedPlan]);

    return (
      <div className="machine-plan-container">
        {/* THANH TOOLBAR ĐẦY ĐỦ NGUYÊN BẢN (CHUẨN STITCH HIGH-DENSITY - 1 DÒNG DUY NHẤT) */}
        <div className="plan-list-toolbar">
          <div className="toolbar-btn-group">
            {/* NHÓM 1: HIỂN THỊ & IN ẤN */}
            <button type="button" onClick={onToggleYCSX} className="stb-ghost-rose" title="Ẩn / Hiện cửa sổ tra cứu YCSX">
              <TbLogout size={11} />
              <span>{showYCSX ? "Hide YCSX" : "Show YCSX"}</span>
            </button>

            <button type="button" onClick={handlePrintChiThiSelected} className="stb-ghost-blue" title="In Chỉ Thị Sản Xuất (check nhiều row để in hàng loạt)">
              <AiOutlinePrinter size={11} />
              <span>Print Chỉ Thị</span>
            </button>

            <button type="button" onClick={onPrintYCKT} className="stb-ghost-purple" title="In Yêu Cầu Kỹ Thuật">
              <AiOutlinePrinter size={11} />
              <span>Print YCKT</span>
            </button>

            <div className="stb-sep" />

            {/* NHÓM 2: QUẢN LÝ KẾ HOẠCH TRÊN MÁY */}
            <button type="button" onClick={onSavePlanBatch} className="stb-primary" title="Lưu toàn bộ danh sách PLAN trên máy">
              <AiFillSave size={11} />
              <span>Lưu PLAN</span>
            </button>

            <button
              type="button"
              disabled={!selectedPlan || selectedPlan.PLAN_ID === "XXX"}
              onClick={() => onDeletePlan(selectedPlan)}
              className="stb-ghost-rose"
              title="Xóa kế hoạch đang chọn"
            >
              <FcDeleteRow size={12} />
              <span>Xóa PLAN</span>
            </button>

            <button type="button" onClick={onRefreshPlans} className="stb-ghost-amber" title="Tải lại danh sách PLAN">
              <AiOutlineReload size={11} />
              <span>Refresh PLAN</span>
            </button>

            {/* Di chuyển Lên / Xuống */}
            <div className="stb-move-group">
              <button
                type="button"
                disabled={!selectedPlan || selectedPlan.PLAN_ID === "XXX"}
                onClick={() => onMovePlan("UP", selectedPlan)}
                title="Di chuyển lên"
              >
                <AiOutlineArrowUp size={10} /> Lên
              </button>
              <button
                type="button"
                disabled={!selectedPlan || selectedPlan.PLAN_ID === "XXX"}
                onClick={() => onMovePlan("DOWN", selectedPlan)}
                title="Di chuyển xuống"
              >
                <AiOutlineArrowDown size={10} /> Xuống
              </button>
            </div>

            <div className="stb-sep" />

            {/* NHÓM 3: ĐỊNH MỨC */}
            <button type="button" onClick={onSaveDataDinhMuc} className="stb-success" title="Lưu Data Định Mức (f_saveQLSX) cho mã hàng">
              <AiFillSave size={11} />
              <span>Lưu Data ĐM</span>
            </button>

            {canSetDMMD && (
              <button type="button" onClick={onSetDMMD} className="stb-ghost-fuchsia" title="Áp dụng định mức mặc định theo dòng máy">
                <MdResetTv size={11} />
                <span>ĐM MĐ</span>
              </button>
            )}
          </div>

          {/* Phải: Total time & Badge Plan */}
          <div className="toolbar-info-group">
            <span className="stb-badge stb-badge--emerald">
              Total: {(totalMachineTime || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} min
            </span>
            {selectedPlan && selectedPlan.PLAN_ID !== "XXX" && (
              <span className="stb-badge stb-badge--blue">
                {selectedPlan.PLAN_ID}
              </span>
            )}
          </div>
        </div>

        {/* Bảng Kế Hoạch Đang Có Trên Máy (Chỉ dùng onCellClick ổn định) */}
        <div className="plans-table-box">
          <AGTable
            ref={gridPlanRef}
            columns={columns}
            data={plans}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Hàng Thẻ Chip SLC (Số lượng cần dập 4 công đoạn) */}
        <div className="slc-chip-bar">
          {selectedPlan?.EQ1 && selectedPlan.EQ1 !== "NO" && selectedPlan.EQ1 !== "NA" && (
            <div className="slc-chip">
              <span>SLC1:</span>
              <span className="val">
                {(selectedPlan.SLC_CD1 || 0).toLocaleString("en-US")} EA
              </span>
            </div>
          )}

          {selectedPlan?.EQ2 && selectedPlan.EQ2 !== "NO" && selectedPlan.EQ2 !== "NA" && (
            <div className="slc-chip">
              <span>SLC2:</span>
              <span className="val">
                {(selectedPlan.SLC_CD2 || 0).toLocaleString("en-US")} EA
              </span>
            </div>
          )}

          {selectedPlan?.EQ3 && selectedPlan.EQ3 !== "NO" && selectedPlan.EQ3 !== "NA" && (
            <div className="slc-chip">
              <span>SLC3:</span>
              <span className="val">
                {(selectedPlan.SLC_CD3 || 0).toLocaleString("en-US")} EA
              </span>
            </div>
          )}

          {selectedPlan?.EQ4 && selectedPlan.EQ4 !== "NO" && selectedPlan.EQ4 !== "NA" && (
            <div className="slc-chip">
              <span>SLC4:</span>
              <span className="val">
                {(selectedPlan.SLC_CD4 || 0).toLocaleString("en-US")} EA
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
