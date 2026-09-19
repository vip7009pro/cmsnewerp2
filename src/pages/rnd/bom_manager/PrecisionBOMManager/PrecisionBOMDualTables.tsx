import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import React from "react";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiFillSave,
} from "react-icons/ai";
import { FaBoxes, FaCopy, FaDraftingCompass, FaMoneyBillWave } from "react-icons/fa";
import { MaterialListData } from "../../../qc/interfaces/qcInterface";

const filterOptions1 = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

interface PrecisionBOMDualTablesProps {
  bomsxTableJSX: React.ReactNode;
  bomgiaTableJSX: React.ReactNode;
  onSaveBOMSX: () => void;
  onAddRowBOMSX: () => void;
  onDeleteRowBOMSX: () => void;
  onSaveBOMGIA: () => void;
  onAddRowBOMGIA: () => void;
  onDeleteRowBOMGIA: () => void;
  onCloneBOMSX: () => void;
  onToggleDesignBom: () => void;
  onToggleEdit: () => void;
  enableEdit: boolean;
  pinBOM: boolean;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  bomsxCount: number;
  bomgiaCount: number;
  materialList: MaterialListData[];
  selectedMaterial: MaterialListData | null;
  setSelectedMaterial: (val: MaterialListData | null) => void;
}

const PrecisionBOMDualTables: React.FC<PrecisionBOMDualTablesProps> = ({
  bomsxTableJSX,
  bomgiaTableJSX,
  onSaveBOMSX,
  onAddRowBOMSX,
  onDeleteRowBOMSX,
  onSaveBOMGIA,
  onAddRowBOMGIA,
  onDeleteRowBOMGIA,
  onCloneBOMSX,
  onToggleDesignBom,
  onToggleEdit,
  enableEdit,
  pinBOM,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  bomsxCount,
  bomgiaCount,
  materialList = [],
  selectedMaterial,
  setSelectedMaterial,
}) => {
  return (
    <div className="dual-tables-container">
      {/* Material Selector Bar Before Adding Rows */}
      <div className="dual-tables-material-bar">
        <div className="mat-selector-left">
          <span className="mat-selector-label">Chọn VL trước khi thêm dòng:</span>
          <Autocomplete
            size="small"
            options={materialList}
            className="material-autocomplete"
            componentsProps={{
              popper: { className: "material-autocomplete-popper" },
              paper: { className: "material-autocomplete-paper" },
            }}
            ListboxProps={{ className: "material-autocomplete-list" }}
            filterOptions={filterOptions1}
            getOptionLabel={(option: any) =>
              `${option.M_NAME || ""}|${option.WIDTH_CD || 0}|${option.M_CODE || ""}`
            }
            isOptionEqualToValue={(option: any, value: any) => option.M_CODE === value?.M_CODE}
            value={selectedMaterial}
            onChange={(_, newValue: any) => setSelectedMaterial(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Tìm tên, mã, khổ vật liệu..."
                sx={{
                  width: 360,
                  "& .MuiInputBase-root": { height: 26, fontSize: 11, background: "#ffffff" },
                }}
              />
            )}
            renderOption={(props, option: any) => (
              <li {...props} style={{ fontSize: "11px", padding: "3px 8px" }}>
                <strong style={{ color: "#2563eb", marginRight: 6 }}>{option.M_CODE}</strong>
                <span style={{ fontWeight: 600, marginRight: 6 }}>{option.M_NAME}</span>
                <span style={{ color: "#64748b" }}>Khổ: {option.WIDTH_CD}mm</span>
              </li>
            )}
          />
          {selectedMaterial && (
            <span className="mat-chip-badge">
              {selectedMaterial.M_NAME} (Khổ: {selectedMaterial.WIDTH_CD}mm)
            </span>
          )}
        </div>
        <div className="mat-selector-right">
          <button
            type="button"
            className="btn-tool btn-tool--design"
            style={{ height: 22, fontSize: 10, padding: "0 8px" }}
            onClick={onToggleDesignBom}
            title="Mở công cụ thiết kế nhanh BOM"
          >
            <FaDraftingCompass size={11} style={{ marginRight: 3 }} /> DESIGN BOM
          </button>
        </div>
      </div>

      {/* Dual Tables Grid 50:50 */}
      <div className="dual-tables-grid">
        {/* ================= BẢNG TRÁI: BOM SẢN XUẤT (BOMSX) ================= */}
        <div className="table-panel">
          {/* Panel Header */}
          <div className="panel-header panel-header--emerald">
            <div className="title-wrap">
              <FaBoxes size={13} />
              <span className="title-text">BOM SẢN XUẤT (BOMSX)</span>
              <span className="state-chip">
                {enableEdit ? "Đang Sửa" : "Khóa Lưới"} {pinBOM ? "• Ghim" : ""}
              </span>
            </div>
            <div className="panel-meta">
              <span>Tổng: <strong>{bomsxCount}</strong> NVL</span>
            </div>
          </div>

          {/* Panel Toolbar Action Buttons */}
          <div className="panel-toolbar">
            <div className="btn-group">
              <button
                type="button"
                className="btn-tool btn-tool--save"
                onClick={onSaveBOMSX}
                title="Lưu dữ liệu BOM Sản Xuất"
              >
                <AiFillSave size={12} /> Lưu BOM
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--add"
                onClick={onAddRowBOMSX}
                title="Thêm một dòng nguyên vật liệu mới"
              >
                <AiFillPlusCircle size={12} /> Thêm dòng
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--delete"
                onClick={onDeleteRowBOMSX}
                title="Xóa các dòng NVL đã chọn"
              >
                <AiFillDelete size={12} /> Xóa dòng
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--edit"
                onClick={onToggleEdit}
                title="Bật/Tắt chế độ sửa trực tiếp trên bảng"
              >
                <AiFillEdit size={12} /> {enableEdit ? "Tắt Sửa" : "Bật Sửa"}
              </button>
            </div>

            <div className="analytics-group">
              <button type="button" className="btn-analytic" onClick={onExportEX1} title="Xuất lưới Excel">
                EX1
              </button>
              <button type="button" className="btn-analytic" onClick={onExportEX2} title="Xuất toàn bộ dữ liệu">
                EX2
              </button>
              <button
                type="button"
                className="btn-analytic btn-analytic--pivot"
                onClick={onOpenPivot}
                title="Phân tích xoay Pivot"
              >
                PIVOT
              </button>
            </div>
          </div>

          {/* AGTable View */}
          <div className="panel-table-wrap">{bomsxTableJSX}</div>

          {/* Panel Footer */}
         {/*  <div className="panel-footer">
            <span style={{ color: "#065f46" }}>
              ● Cấu trúc định mức kỹ thuật sản xuất
            </span>
            <span>Đã kiểm tra: 100% OK</span>
          </div> */}
        </div>

        {/* ================= BẢNG PHẢI: BOM GIÁ THÀNH (COSTING) ================= */}
        <div className="table-panel">
          {/* Panel Header */}
          <div className="panel-header panel-header--indigo">
            <div className="title-wrap">
              <FaMoneyBillWave size={13} />
              <span className="title-text">BOM GIÁ THÀNH (COSTING BOM)</span>
              <span className="state-chip">
                {enableEdit ? "Đang Sửa" : "Khóa Lưới"} {pinBOM ? "• Ghim" : ""}
              </span>
            </div>
            <div className="panel-meta">
              <button
                type="button"
                className="btn-tool btn-tool--clone"
                style={{ height: 20, fontSize: 9, padding: "0 6px" }}
                onClick={onCloneBOMSX}
                title="Sao chép toàn bộ NVL từ BOMSX sang BOM Giá"
              >
                <FaCopy size={10} style={{ marginRight: 2 }} /> Clone BOMSX
              </button>
            </div>
          </div>

          {/* Panel Toolbar Action Buttons */}
          <div className="panel-toolbar">
            <div className="btn-group">
              <button
                type="button"
                className="btn-tool btn-tool--save"
                onClick={onSaveBOMGIA}
                title="Lưu định mức BOM Giá Thành"
              >
                <AiFillSave size={12} /> Lưu Giá
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--add"
                onClick={onAddRowBOMGIA}
                title="Thêm một dòng NVL định mức giá"
              >
                <AiFillPlusCircle size={12} /> Thêm dòng
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--delete"
                onClick={onDeleteRowBOMGIA}
                title="Xóa dòng NVL giá đã chọn"
              >
                <AiFillDelete size={12} /> Xóa
              </button>
              <button
                type="button"
                className="btn-tool btn-tool--edit"
                onClick={onToggleEdit}
                title="Bật/Tắt sửa bảng giá"
              >
                <AiFillEdit size={12} /> {enableEdit ? "Tắt Sửa" : "Bật Sửa"}
              </button>
            </div>

            <div className="analytics-group">
              <button type="button" className="btn-analytic" onClick={onExportEX1} title="Xuất lưới Excel">
                EX1
              </button>
              <button type="button" className="btn-analytic" onClick={onExportEX2} title="Xuất toàn bộ dữ liệu">
                EX2
              </button>
              <button
                type="button"
                className="btn-analytic btn-analytic--pivot"
                onClick={onOpenPivot}
                title="Phân tích xoay Pivot"
              >
                PIVOT
              </button>
            </div>
          </div>

          {/* AGTable View */}
          <div className="panel-table-wrap">{bomgiaTableJSX}</div>

          {/* Panel Footer */}
         {/*  <div className="panel-footer">
            <span style={{ color: "#3730a3" }}>
              ● Định mức chi phí và giá vốn NVL
            </span>
            <span>Biên an toàn: 18.5%</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMDualTables);
