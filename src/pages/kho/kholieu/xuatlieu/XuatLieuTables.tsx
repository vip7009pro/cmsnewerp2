import React, { useMemo } from "react";
import { MdFormatListBulleted, MdQrCode, MdDelete } from "react-icons/md";
import AGTable from "../../../../components/DataTable/AGTable";
import { DKXL_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { WH_M_OUTPUT_DATA } from "../../interfaces/khoInterface";

interface XuatLieuTablesProps {
  dangkyxuatlieutable: DKXL_DATA[];
  prepareOutData: WH_M_OUTPUT_DATA[];
  onSelectionScannedChange: (rows: WH_M_OUTPUT_DATA[]) => void;
  onDeleteSelectedScanned: () => void;
  selectedScannedCount: number;
}

const XuatLieuTables: React.FC<XuatLieuTablesProps> = ({
  dangkyxuatlieutable,
  prepareOutData,
  onSelectionScannedChange,
  onDeleteSelectedScanned,
  selectedScannedCount,
}) => {
  // Cấu hình cột Bảng Đăng Ký Xuất Liệu (DKXL)
  const columns_dkxl = useMemo(
    () => [
      { field: "M_CODE", headerName: "M_CODE", width: 85, headerCheckboxSelection: true, checkboxSelection: true },
      { field: "M_NAME", headerName: "M_NAME", width: 110 },
      { field: "WIDTH_CD", headerName: "SIZE", width: 55 },
      { field: "OUT_PRE_QTY", headerName: "DKY", width: 60 },
      { field: "OUT_CFM_QTY", headerName: "OUT", width: 60 },
    ],
    []
  );

  // Cấu hình cột Bảng Danh Sách Cuộn Đã Bắn Barcode
  const columns_outputMaterial = useMemo(
    () => [
      { field: "M_CODE", headerName: "M_CODE", width: 90, headerCheckboxSelection: true, checkboxSelection: true },
      { field: "M_NAME", headerName: "M_NAME", width: 125 },
      { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
      { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 110 },
      { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
      { field: "UNIT_QTY", headerName: "UNIT_QTY", width: 80 },
      { field: "TOTAL_QTY", headerName: "TOTAL_QTY", width: 85 },
      { field: "LIEUQL_SX", headerName: "LIEUQL_SX", width: 80 },
      { field: "WAHS_CD", headerName: "WAHS_CD", width: 75 },
      { field: "LOC_CD", headerName: "LOC_CD", width: 75 },
      { field: "OUT_DATE", headerName: "OUT_DATE", width: 90 },
      { field: "OUT_NO", headerName: "OUT_NO", width: 80 },
      { field: "OUT_SEQ", headerName: "OUT_SEQ", width: 80 },
      { field: "IN_DATE", headerName: "IN_DATE", width: 90 },
      { field: "USE_YN", headerName: "USE_YN", width: 75 },
    ],
    []
  );

  // Tổng số cuộn và mét đã quét
  const totalScannedRolls = useMemo(
    () => prepareOutData.reduce((sum, item) => sum + (Number(item.ROLL_QTY) || 0), 0),
    [prepareOutData]
  );

  const totalScannedMeters = useMemo(
    () => prepareOutData.reduce((sum, item) => sum + (Number(item.TOTAL_QTY) || 0), 0),
    [prepareOutData]
  );

  return (
    <div className="xuatlieu__tablesContainer">
      {/* BẢNG 1: ĐĂNG KÝ XUẤT LIỆU (DKXL) */}
      <div className="xuatlieu__tableCard">
        <div className="card-header">
          <div className="header-title header-title--dkxl">
            <MdFormatListBulleted />
            <span>Đăng Ký Xuất Liệu</span>
            <span className="counter-chip">{dangkyxuatlieutable.length} mã</span>
          </div>
        </div>

        <div className="card-body">
          <AGTable
            columns={columns_dkxl}
            data={dangkyxuatlieutable}
          />
        </div>
      </div>

      {/* BẢNG 2: DANH SÁCH CUỘN ĐÃ BẮN BARCODE */}
      <div className="xuatlieu__tableCard">
        <div className="card-header">
          <div className="header-title header-title--scanned">
            <MdQrCode />
            <span>Cuộn Đã Bắn Barcode</span>
            <span className="counter-chip">{prepareOutData.length} cuộn | {totalScannedMeters.toLocaleString("en-US")} m</span>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-delete-item"
              onClick={onDeleteSelectedScanned}
              disabled={selectedScannedCount === 0}
              title="Xóa các cuộn đã tích chọn khỏi danh sách xuất"
            >
              <MdDelete size={13} />
              <span>Xóa Cuộn Chọn ({selectedScannedCount})</span>
            </button>
          </div>
        </div>

        <div className="card-body">
          <AGTable
            columns={columns_outputMaterial}
            data={prepareOutData}
            onSelectionChange={(params: any) => {
              const rows = params?.api?.getSelectedRows() || [];
              onSelectionScannedChange(rows);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(XuatLieuTables);
