import React from "react";
import {
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BiRefresh, BiReset } from "react-icons/bi";
import { FaWarehouse } from "react-icons/fa";
import { FcDeleteRow } from "react-icons/fc";
import { GiCurvyKnife } from "react-icons/gi";
import AGTable from "../../../../../components/DataTable/AGTable";
import { checkBP } from "../../../../../api/services/permissionService";
import { column_planmaterialtable } from "./PrecisionPlanDataTbColumns";
import { QLSXCHITHIDATA, QLSXPLANDATA } from "../../interfaces/khsxInterface";
import { f_handleGetChiThiTable } from "../../utils/khsxUtils";
import Swal from "sweetalert2";

interface PrecisionPlanDataTbDangKyLieuModalProps {
  showhideM: boolean;
  onClose: () => void;
  selectedPlan: QLSXPLANDATA;
  chithidatatable: QLSXCHITHIDATA[];
  setChiThiDataTable: (data: QLSXCHITHIDATA[]) => void;
  gridMaterialRef: any;
  qlsxchithidatafilter: any;
  clickedRow: any;
  userData: any;
  selectMaterialRow: () => void;
  handleConfirmDKXL: () => void;
  handleConfirmDeleteLieu: () => void;
  handleConfirmRESETLIEU: () => void;
  handle_xuatdao_sample: () => void;
  handle_xuatlieu_sample: () => void;
  showkhoao: boolean;
  setShowKhoAo: (show: boolean) => void;
}

export const PrecisionPlanDataTbDangKyLieuModal: React.FC<
  PrecisionPlanDataTbDangKyLieuModalProps
> = ({
  showhideM,
  onClose,
  selectedPlan,
  chithidatatable,
  setChiThiDataTable,
  gridMaterialRef,
  qlsxchithidatafilter,
  clickedRow,
  userData,
  selectMaterialRow,
  handleConfirmDKXL,
  handleConfirmDeleteLieu,
  handleConfirmRESETLIEU,
  handle_xuatdao_sample,
  handle_xuatlieu_sample,
  showkhoao,
  setShowKhoAo,
}) => {
  if (!showhideM) return null;

  return (
    <div className="precision-lieu-modal-backdrop">
      <div className="precision-lieu-modal-window">
        {/* Header */}
        <div className="precision-lieu-modal-window__header">
          <div className="plan-info-badges">
            <span className="badge-plan-id">{selectedPlan?.PLAN_ID}</span>
            <span className="badge-gname">{selectedPlan?.G_NAME}</span>
            <span className="badge-pill">PD: {selectedPlan?.PD}</span>
            <span className="badge-pill">CAVITY: {selectedPlan?.CAVITY}</span>
            <span className="badge-pill">
              PLAN_QTY: {selectedPlan?.PLAN_QTY?.toLocaleString("en-US")}
            </span>
          </div>
          <button
            className="btn-close-lieu-modal"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <AiOutlineClose />
          </button>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="precision-lieu-modal-window__toolbar">
          <button
            className="tb-lieu-btn tb-lieu-btn--check"
            onClick={selectMaterialRow}
            title="Chọn tất cả dòng vật tư có Tồn > 0"
          >
            <AiOutlineCheck size={14} />
            Select (Tồn &gt; 0)
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--save"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleConfirmDKXL);
            }}
            title="Lưu chỉ thị và tiến hành đăng ký xuất kho"
          >
            <AiOutlineBarcode size={14} />
            Lưu CT + ĐKXK
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--danger"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleConfirmDeleteLieu);
            }}
            title="Xóa dòng liệu đã chọn"
          >
            <FcDeleteRow size={15} />
            Xóa Liệu
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--amber"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handleConfirmRESETLIEU);
            }}
            title="Reset nạp lại định mức vật liệu"
          >
            <BiReset size={15} />
            RESET Liệu
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--purple"
            onClick={() => {
              if (selectedPlan && selectedPlan.PLAN_ID !== "XXX") {
                checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], () => {
                  setShowKhoAo(!showkhoao);
                });
              } else {
                Swal.fire("Thông báo", "Hãy chọn một chỉ thị", "error");
              }
            }}
            title="Mở cửa sổ Kho Ảo Sản Xuất"
          >
            <FaWarehouse size={13} />
            Kho SX Main
          </button>

          <button
            className="tb-lieu-btn"
            onClick={async () => {
              setChiThiDataTable(await f_handleGetChiThiTable(selectedPlan));
            }}
            title="Tải lại bảng chỉ thị vật liệu"
          >
            <BiRefresh size={16} />
            Refresh chỉ thị
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--danger"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_xuatdao_sample);
            }}
            title="Xuất dao mẫu thử"
          >
            <GiCurvyKnife size={14} />
            Xuất dao sample
          </button>

          <button
            className="tb-lieu-btn tb-lieu-btn--save"
            onClick={() => {
              checkBP(userData, ["QLSX"], ["ALL"], ["ALL"], handle_xuatlieu_sample);
            }}
            title="Xuất liệu mẫu thử"
          >
            <AiOutlineArrowRight size={14} />
            Xuất liệu sample
          </button>
        </div>

        {/* AGTable Grid */}
        <div className="precision-lieu-modal-window__grid">
          <AGTable
            ref={gridMaterialRef}
            columns={column_planmaterialtable}
            data={chithidatatable}
            onRowClick={(params: any) => {
              clickedRow.current = params.data;
            }}
            onSelectionChange={(params: any) => {
              qlsxchithidatafilter.current = params!.api.getSelectedRows();
            }}
          />
        </div>
      </div>
    </div>
  );
};
