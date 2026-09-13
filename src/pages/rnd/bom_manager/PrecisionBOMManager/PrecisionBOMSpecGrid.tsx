import { Autocomplete, Checkbox, createFilterOptions, TextField } from "@mui/material";
import React from "react";
import moment from "moment";
import {
  FaBarcode,
  FaBoxOpen,
  FaBuilding,
  FaCheckCircle,
  FaCogs,
  FaPrint,
  FaRulerCombined,
} from "react-icons/fa";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { MACHINE_LIST, PROD_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { FSC_LIST_DATA } from "../../../muahang/interfaces/muaInterface";
import { CODE_FULL_INFO, MASTER_MATERIAL_HSD } from "../../interfaces/rndInterface";
import PrecisionBOMProcessGrid from "./PrecisionBOMProcessGrid";

const filterOptions1 = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

interface PrecisionBOMSpecGridProps {
  codeFullInfo: CODE_FULL_INFO;
  handleSetCodeInfo: (field: string, val: any) => void;
  enableform: boolean;
  customerList: CustomerListData[];
  machineList: MACHINE_LIST[];
  masterMaterialList: MASTER_MATERIAL_HSD[];
  selectedMasterMaterial: any;
  setSelectedMasterMaterial: (val: any) => void;
  currentProcessList: PROD_PROCESS_DATA[];
  tempSelectedMachine: string;
  setTempSelectedMachine: (val: string) => void;
  tempSelectedProcess: React.MutableRefObject<any>;
  onAddProcess: () => void;
  onDeleteProcess: () => void;
  onSaveProcess: () => void;
  fscList: FSC_LIST_DATA[];
  company: string;
  onUploadCAD: (e: any) => void;
  onUploadAppsheet: (e: any) => void;
  showHideTemLot: boolean;
  onToggleTemLot: () => void;
  onPrintTemLot: () => void;
}

const PrecisionBOMSpecGrid: React.FC<PrecisionBOMSpecGridProps> = ({
  codeFullInfo,
  handleSetCodeInfo,
  enableform,
  customerList = [],
  machineList = [],
  masterMaterialList = [],
  selectedMasterMaterial,
  setSelectedMasterMaterial,
  currentProcessList = [],
  tempSelectedMachine,
  setTempSelectedMachine,
  tempSelectedProcess,
  onAddProcess,
  onDeleteProcess,
  onSaveProcess,
  fscList = [],
  company,
  onUploadCAD,
  onUploadAppsheet,
  showHideTemLot,
  onToggleTemLot,
  onPrintTemLot,
}) => {
  return (
    <div className="precision-bom__spec-container">
      {/* Current Code Banner & Update Telemetry */}
      <div className="code-banner">
        <div className="left-identity">
          <span className="badge-active-code">MÃ HIỆN HÀNH</span>
          <span className="code-primary">{codeFullInfo?.G_CODE || "CHƯA CHỌN MÃ"}</span>
          <span className="code-name">: {codeFullInfo?.G_NAME || codeFullInfo?.G_NAME_KD || "---"}</span>
        </div>
        <div className="right-meta">
          <span className="rev-badge">Rev.{codeFullInfo?.REV_NO || "A"}</span>
          <span className="update-info">
            Update {codeFullInfo?.UPD_COUNT ?? 0} lần / Người update: {codeFullInfo?.UPD_EMPL || "SYS"} / Cuối:{" "}
            {codeFullInfo?.UPD_DATE ? moment.utc(codeFullInfo.UPD_DATE).format("YYYY-MM-DD HH:mm:ss") : "---"}
          </span>
        </div>
      </div>

      {/* 5 Group Columns Grid + Process Table */}
      <div className="spec-grid-layout">
        <div className="spec-grid">
          {/* Nhóm 1: THÔNG TIN KHÁCH HÀNG & PHÂN LOẠI */}
          <div className="spec-card">
            <div className="spec-title spec-title--blue">
              <FaBuilding size={11} />
              <span>1. Khách Hàng & Phân Loại</span>
            </div>
            <div className="spec-fields">
              <div className="spec-row">
                <span className="field-label">Khách hàng:</span>
                <Autocomplete
                  disabled={enableform}
                  size="small"
                  options={customerList}
                  filterOptions={filterOptions1}
                  getOptionLabel={(opt: any) => `${opt.CUST_NAME_KD || ""}${opt.CUST_CD || ""}`}
                  isOptionEqualToValue={(opt: any, val: any) => opt.CUST_CD === val?.CUST_CD}
                  value={customerList.find((c) => c.CUST_CD === codeFullInfo?.CUST_CD) || null}
                  onChange={(_, newVal: any) => {
                    handleSetCodeInfo("CUST_CD", newVal ? newVal.CUST_CD : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Chọn KH..."
                      sx={{ width: 115, "& .MuiInputBase-root": { height: 22, fontSize: 10 } }}
                    />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} style={{ fontSize: "11px", padding: "2px 6px" }}>
                      {`${option.CUST_NAME_KD} (${option.CUST_CD})`}
                    </li>
                  )}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Dự án/Project:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  value={codeFullInfo?.PROD_PROJECT ?? ""}
                  onChange={(e) => handleSetCodeInfo("PROD_PROJECT", e.target.value)}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Model:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  value={codeFullInfo?.PROD_MODEL ?? ""}
                  onChange={(e) => handleSetCodeInfo("PROD_MODEL", e.target.value)}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Đặc tính SP:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.CODE_12 ?? "7"}
                  onChange={(e) => handleSetCodeInfo("CODE_12", e.target.value)}
                >
                  <option value="6">Bán Thành Phẩm</option>
                  <option value="7">Thành Phẩm</option>
                  <option value="8">Nguyên Chiếc K Ribbon</option>
                  <option value="9">Nguyên Chiếc Ribbon</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Phân loại:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.PROD_TYPE ?? (company === "CMS" ? "TSP" : "LABEL")}
                  onChange={(e) => handleSetCodeInfo("PROD_TYPE", e.target.value)}
                >
                  <option value="TSP">TSP</option>
                  <option value="OLED">OLED</option>
                  <option value="UV">UV</option>
                  <option value="TAPE">TAPE</option>
                  <option value="LABEL">LABEL</option>
                  <option value="RIBBON">RIBBON</option>
                  <option value="SPT">SPT</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">{company === "CMS" ? "Code KD:" : "Code KT:"}</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  value={codeFullInfo?.G_NAME_KD ?? ""}
                  onChange={(e) => handleSetCodeInfo("G_NAME_KD", e.target.value)}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">VL Chính:</span>
                <Autocomplete
                  disabled={enableform}
                  size="small"
                  options={masterMaterialList}
                  filterOptions={filterOptions1}
                  getOptionLabel={(opt: any) => `${opt.M_NAME || ""}`}
                  isOptionEqualToValue={(opt: any, val: any) => opt.M_NAME === val.M_NAME}
                  value={
                    masterMaterialList.find((m) => m.M_NAME === codeFullInfo?.PROD_MAIN_MATERIAL) || null
                  }
                  onChange={(_, newVal: any) => {
                    setSelectedMasterMaterial(newVal);
                    handleSetCodeInfo("PROD_MAIN_MATERIAL", newVal ? newVal.M_NAME : "");
                    if (newVal?.EXP_DATE !== undefined) {
                      handleSetCodeInfo("EXP_DATE", newVal.EXP_DATE);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Chọn VL chính..."
                      sx={{ width: 115, "& .MuiInputBase-root": { height: 22, fontSize: 10 } }}
                    />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} style={{ fontSize: "11px", padding: "2px 6px" }}>
                      {`${option.M_NAME} | HSD: ${option.EXP_DATE ?? 0}T`}
                    </li>
                  )}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Mô tả/Spec:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  value={codeFullInfo?.DESCR ?? ""}
                  onChange={(e) => handleSetCodeInfo("DESCR", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 2: KÍCH THƯỚC & CAVITY */}
          <div className="spec-card">
            <div className="spec-title spec-title--emerald">
              <FaRulerCombined size={11} />
              <span>2. Kích Thước & Cavity</span>
            </div>
            <div className="spec-fields">
              <div className="spec-row">
                <span className="field-label">Dài SP (L):</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_LENGTH ?? 0}
                  onChange={(e) => handleSetCodeInfo("G_LENGTH", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Rộng SP (W):</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_WIDTH ?? 0}
                  onChange={(e) => handleSetCodeInfo("G_WIDTH", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Bước P/D:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.PD ?? 0}
                  onChange={(e) => handleSetCodeInfo("PD", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Cavity hàng:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_C_R ?? 1}
                  onChange={(e) => handleSetCodeInfo("G_C_R", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Cavity cột:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_C ?? 1}
                  onChange={(e) => handleSetCodeInfo("G_C", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">K/c hàng:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_LG ?? 0}
                  onChange={(e) => handleSetCodeInfo("G_LG", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">K/c cột:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.G_CG ?? 0}
                  onChange={(e) => handleSetCodeInfo("G_CG", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Liner T/P:</span>
                <div style={{ display: "flex", gap: "2px", maxWidth: "115px" }}>
                  <input
                    className="field-input"
                    style={{ width: "55px" }}
                    disabled={enableform}
                    type="number"
                    value={codeFullInfo?.G_SG_L ?? 0}
                    onChange={(e) => handleSetCodeInfo("G_SG_L", Number(e.target.value))}
                  />
                  <input
                    className="field-input"
                    style={{ width: "55px" }}
                    disabled={enableform}
                    type="number"
                    value={codeFullInfo?.G_SG_R ?? 0}
                    onChange={(e) => handleSetCodeInfo("G_SG_R", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nhóm 3: DAO & ĐÓNG GÓI */}
          <div className="spec-card">
            <div className="spec-title spec-title--orange">
              <FaBoxOpen size={11} />
              <span>3. Dao & Đóng Gói</span>
            </div>
            <div className="spec-fields">
              <div className="spec-row">
                <span className="field-label">Hướng cuộn:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.PACK_DRT ?? "1"}
                  onChange={(e) => handleSetCodeInfo("PACK_DRT", e.target.value)}
                >
                  <option value="1">Hàng mặt ngoài</option>
                  <option value="0">Hàng mặt trong</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Loại dao:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.KNIFE_TYPE ?? 0}
                  onChange={(e) => handleSetCodeInfo("KNIFE_TYPE", Number(e.target.value))}
                >
                  <option value={0}>PVC</option>
                  <option value={1}>PINACLE</option>
                  <option value={2}>NO</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Tuổi dao:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.KNIFE_LIFECYCLE ?? 70000}
                  onChange={(e) => handleSetCodeInfo("KNIFE_LIFECYCLE", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Packing Type:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.CODE_33 ?? "03"}
                  onChange={(e) => handleSetCodeInfo("CODE_33", e.target.value)}
                >
                  <option value="02">ROLL</option>
                  <option value="03">SHEET</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Đơn vị:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.PROD_DVT ?? "01"}
                  onChange={(e) => handleSetCodeInfo("PROD_DVT", e.target.value)}
                >
                  <option value="01">EA</option>
                  <option value="02">Met</option>
                  <option value="03">Cuộn</option>
                  <option value="04">Bộ</option>
                  <option value="05">Gói</option>
                  <option value="06">Kg</option>
                  <option value="99">X</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Packing QTY:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.ROLE_EA_QTY ?? 0}
                  onChange={(e) => handleSetCodeInfo("ROLE_EA_QTY", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">RPM:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.RPM ?? 0}
                  onChange={(e) => handleSetCodeInfo("RPM", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">PIN DISTANCE:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.PIN_DISTANCE ?? 0}
                  onChange={(e) => handleSetCodeInfo("PIN_DISTANCE", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: CÔNG NGHỆ & THIẾT BỊ */}
          <div className="spec-card">
            <div className="spec-title spec-title--purple">
              <FaCogs size={11} />
              <span>4. Thiết Bị & Dây Chuyền</span>
            </div>
            <div className="spec-fields">
              <div className="spec-row">
                <span className="field-label">Process Type:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  value={codeFullInfo?.PROCESS_TYPE ?? "1"}
                  onChange={(e) => handleSetCodeInfo("PROCESS_TYPE", e.target.value)}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Máy 1:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.EQ1 ?? "NA"}
                  onChange={(e) => handleSetCodeInfo("EQ1", e.target.value)}
                >
                  <option value="NA">NA</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>{m.EQ_NAME}</option>
                  ))}
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Máy 2:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.EQ2 ?? "NA"}
                  onChange={(e) => handleSetCodeInfo("EQ2", e.target.value)}
                >
                  <option value="NA">NA</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>{m.EQ_NAME}</option>
                  ))}
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Máy 3:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.EQ3 ?? "NA"}
                  onChange={(e) => handleSetCodeInfo("EQ3", e.target.value)}
                >
                  <option value="NA">NA</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>{m.EQ_NAME}</option>
                  ))}
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Máy 4:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.EQ4 ?? "NA"}
                  onChange={(e) => handleSetCodeInfo("EQ4", e.target.value)}
                >
                  <option value="NA">NA</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>{m.EQ_NAME}</option>
                  ))}
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Số bước dao:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.PROD_DIECUT_STEP ?? 1}
                  onChange={(e) => handleSetCodeInfo("PROD_DIECUT_STEP", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">Số lần in:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="number"
                  value={codeFullInfo?.PROD_PRINT_TIMES ?? 0}
                  onChange={(e) => handleSetCodeInfo("PROD_PRINT_TIMES", Number(e.target.value))}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">PO / FSC:</span>
                <div style={{ display: "flex", gap: "2px", maxWidth: "115px" }}>
                  <select
                    className="field-input"
                    style={{ width: "50px" }}
                    disabled={enableform}
                    value={codeFullInfo?.PO_TYPE ?? "E1"}
                    onChange={(e) => handleSetCodeInfo("PO_TYPE", e.target.value)}
                  >
                    <option value="E1">E1</option>
                    <option value="E2">E2</option>
                  </select>
                  <select
                    className="field-input"
                    style={{ width: "60px" }}
                    disabled={enableform}
                    value={codeFullInfo?.FSC ?? "N"}
                    onChange={(e) => handleSetCodeInfo("FSC", e.target.value)}
                  >
                    <option value="Y">FSC</option>
                    <option value="N">K-FSC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Nhóm 5: PHÊ DUYỆT, BẢN VẼ, HSD */}
          <div className="spec-card">
            <div className="spec-title spec-title--teal">
              <FaCheckCircle size={11} />
              <span>5. Phê Duyệt & Bản Vẽ</span>
            </div>
            <div className="spec-fields">
              <div className="spec-row">
                <span className="field-label">Remark:</span>
                <input
                  className="field-input"
                  disabled={enableform}
                  type="text"
                  placeholder="Ghi chú..."
                  value={codeFullInfo?.REMK ?? ""}
                  onChange={(e) => handleSetCodeInfo("REMK", e.target.value)}
                />
              </div>
              <div className="spec-row">
                <span className="field-label">QL_HSD / HSD:</span>
                <div style={{ display: "flex", gap: "2px", maxWidth: "115px" }}>
                  <select
                    className="field-input"
                    style={{ width: "45px" }}
                    disabled={enableform}
                    value={codeFullInfo?.QL_HSD ?? "N"}
                    onChange={(e) => handleSetCodeInfo("QL_HSD", e.target.value)}
                  >
                    <option value="Y">YES</option>
                    <option value="N">NO</option>
                  </select>
                  <select
                    className="field-input"
                    style={{ width: "65px" }}
                    disabled={enableform}
                    value={Number(codeFullInfo?.EXP_DATE ?? 0)}
                    onChange={(e) => handleSetCodeInfo("EXP_DATE", Number(e.target.value))}
                  >
                    <option value={0}>Chưa có</option>
                    <option value={6}>6 tháng</option>
                    <option value={12}>12 tháng</option>
                    <option value={18}>18 tháng</option>
                    <option value={24}>24 tháng</option>
                  </select>
                </div>
              </div>
              <div className="spec-row">
                <span className="field-label">Phê duyệt:</span>
                <select
                  className="field-input"
                  disabled={enableform}
                  value={codeFullInfo?.APPROVED_YN ?? "N"}
                  onChange={(e) => handleSetCodeInfo("APPROVED_YN", e.target.value)}
                >
                  <option value="Y">ĐÃ DUYỆT [Khóa]</option>
                  <option value="N">CHƯA DUYỆT</option>
                </select>
              </div>
              <div className="spec-row">
                <span className="field-label">Mở/Khóa (USE):</span>
                <label style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
                  <Checkbox
                    size="small"
                    disabled={enableform}
                    checked={codeFullInfo?.USE_YN === "Y"}
                    onChange={(e) => handleSetCodeInfo("USE_YN", e.target.checked ? "Y" : "N")}
                    sx={{ padding: 0 }}
                  />
                  <span style={{ fontSize: "10px", fontWeight: 700 }}>
                    {codeFullInfo?.USE_YN === "Y" ? "ĐANG DÙNG" : "KHÓA"}
                  </span>
                </label>
              </div>

              {/* Upload Files Row */}
              <div className="card-action-row">
                <div className="upload-btn-bar">
                  <span className="field-label">Up CAD:</span>
                  <input
                    type="file"
                    accept=".pdf"
                    disabled={enableform}
                    onChange={onUploadCAD}
                  />
                </div>
                {company === "CMS" && (
                  <div className="upload-btn-bar">
                    <span className="field-label">Appsheet:</span>
                    <input
                      type="file"
                      accept=".docx"
                      disabled={enableform}
                      onChange={onUploadAppsheet}
                    />
                  </div>
                )}
                {company === "CMS" && (
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                    <button
                      type="button"
                      className="btn-mini-upload"
                      style={{ flex: 1, background: "#4f46e5" }}
                      onClick={onToggleTemLot}
                    >
                      <FaBarcode size={10} style={{ marginRight: 2 }} />
                      {showHideTemLot ? "Ẩn Tem" : "Tem LOT"}
                    </button>
                    {showHideTemLot && (
                      <button
                        type="button"
                        className="btn-mini-upload"
                        style={{ background: "#059669" }}
                        onClick={onPrintTemLot}
                      >
                        <FaPrint size={10} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bảng nhỏ AG Table: Máy & Công Đoạn (CD/EQ) */}
        <PrecisionBOMProcessGrid
          currentProcessList={currentProcessList}
          machineList={machineList}
          tempSelectedMachine={tempSelectedMachine}
          setTempSelectedMachine={setTempSelectedMachine}
          tempSelectedProcess={tempSelectedProcess}
          onAddProcess={onAddProcess}
          onDeleteProcess={onDeleteProcess}
          onSaveProcess={onSaveProcess}
          enableform={enableform}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMSpecGrid);
