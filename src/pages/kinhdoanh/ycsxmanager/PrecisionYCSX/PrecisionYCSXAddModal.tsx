import React, { memo, useState } from "react";
import {
  FiX,
  FiEdit,
  FiUploadCloud,
  FiSave,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiGrid,
  FiFileText,
} from "react-icons/fi";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import AGTable from "../../../../components/DataTable/AGTable";
import { getExcelUploadColumns } from "./PrecisionYCSXColumns";
import { CodeListData, CustomerListData, PONOLIST } from "../../interfaces/kdInterface";

const filterCustomerOptions = createFilterOptions<CustomerListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CustomerListData) =>
    `${opt.CUST_CD || ""} ${opt.CUST_NAME_KD || ""} ${opt.CUST_NAME || ""}`,
});

const filterCodeOptions = createFilterOptions<CodeListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CodeListData) =>
    `${opt.G_CODE || ""} ${opt.G_NAME_KD || ""} ${opt.G_NAME || ""}`,
});

const filterPoOptions = createFilterOptions<PONOLIST>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: PONOLIST) => `${opt.PO_NO || ""} ${opt.G_CODE || ""}`,
});

interface Props {
  open: boolean;
  onClose: () => void;
  // Manual form props
  customerList: CustomerListData[];
  selectedCust_CD: CustomerListData | null;
  onSelectCustomer: (cust: CustomerListData) => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData) => void;
  newphanloai: string;
  setNewPhanLoai: (val: string) => void;
  loaisx: string;
  setLoaiSX: (val: string) => void;
  loaixh: string;
  setLoaiXH: (val: string) => void;
  isFirstLOT: boolean;
  setIsFirstLot: (val: boolean) => void;
  is_tam_thoi: string;
  setIs_Tam_Thoi: (val: string) => void;
  deliverydate: string;
  setNewDeliveryDate: (val: string) => void;
  selectedPoNo: PONOLIST | null;
  ponolist: PONOLIST[];
  onSelectPoNo: (po: PONOLIST) => void;
  newycsxqty: number;
  setNewYcsxQty: (val: number) => void;
  newycsxremark: string;
  setNewYcsxRemark: (val: string) => void;
  onSaveManual: () => void;
  onClearManual: () => void;
  // Excel upload props
  uploadExcelJson: any[];
  onUploadFile: (e: any) => void;
  onCheckExcel: () => void;
  onUpExcel: () => void;
  onInsertRow: () => void;
  onClearExcel: () => void;
  isCMS: boolean;
}

const PrecisionYCSXAddModal: React.FC<Props> = ({
  open,
  onClose,
  customerList,
  selectedCust_CD,
  onSelectCustomer,
  codeList,
  selectedCode,
  onSelectCode,
  newphanloai,
  setNewPhanLoai,
  loaisx,
  setLoaiSX,
  loaixh,
  setLoaiXH,
  isFirstLOT,
  setIsFirstLot,
  is_tam_thoi,
  setIs_Tam_Thoi,
  deliverydate,
  setNewDeliveryDate,
  selectedPoNo,
  ponolist,
  onSelectPoNo,
  newycsxqty,
  setNewYcsxQty,
  newycsxremark,
  setNewYcsxRemark,
  onSaveManual,
  onClearManual,
  uploadExcelJson,
  onUploadFile,
  onCheckExcel,
  onUpExcel,
  onInsertRow,
  onClearExcel,
  isCMS,
}) => {
  const [activeMode, setActiveMode] = useState<"manual" | "excel">("manual");
  const excelColumns = getExcelUploadColumns(isCMS);

  if (!open) return null;

  return (
    <div className="precision-ycsx-modal-backdrop" onClick={onClose}>
      <div
        className="precision-ycsx-modal-container"
        style={{ maxWidth: 1100, width: "95vw", height: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="title-group">
            <div className="badge-icon">
              <FiPlus />
            </div>
            <div>
              <h3>TẠO YÊU CẦU SẢN XUẤT MỚI (YCSX HUB)</h3>
              <p>Khởi tạo lệnh sản xuất đơn lẻ hoặc nhập hàng loạt từ bảng tính Excel</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <FiX />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="precision-ycsx__modalModeTabs">
          <button
            type="button"
            className={`precision-ycsx__modalModeTab ${
              activeMode === "manual" ? "precision-ycsx__modalModeTab--active" : ""
            }`}
            onClick={() => setActiveMode("manual")}
          >
            <FiEdit />
            <span>1. Nhập Thủ Công (Từng Phiếu)</span>
          </button>
          <button
            type="button"
            className={`precision-ycsx__modalModeTab ${
              activeMode === "excel" ? "precision-ycsx__modalModeTab--active" : ""
            }`}
            onClick={() => setActiveMode("excel")}
          >
            <FiUploadCloud />
            <span>2. Thêm Hàng Loạt (Excel & Nhập Lưới)</span>
            {uploadExcelJson.length > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "#2563eb",
                  color: "#fff",
                  padding: "1px 6px",
                  borderRadius: 10,
                }}
              >
                {uploadExcelJson.length} dòng
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: 16 }}>
          {activeMode === "manual" ? (
            /* ── CHẾ ĐỘ 1: NHẬP THỦ CÔNG ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="precision-ycsx__modalGridForm">
                {/* Khách hàng */}
                <div className="precision-ycsx__modalField">
                  <label>Khách hàng *:</label>
                  <Autocomplete
                    size="small"
                    options={customerList}
                    filterOptions={filterCustomerOptions}
                    isOptionEqualToValue={(opt, val) => opt?.CUST_CD === val?.CUST_CD}
                    getOptionLabel={(opt) => {
                      if (!opt) return "";
                      if (typeof opt === "string") return opt;
                      return `${opt.CUST_CD || ""}: ${opt.CUST_NAME_KD || opt.CUST_NAME || ""}`;
                    }}
                    value={selectedCust_CD}
                    onChange={(_, val) => onSelectCustomer(val as CustomerListData)}
                    openOnFocus
                    autoHighlight
                    clearOnEscape
                    slotProps={{
                      popper: { sx: { zIndex: 120000 } },
                    }}
                    noOptionsText="Không tìm thấy khách hàng"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Chọn hoặc gõ mã KH..."
                        variant="outlined"
                      />
                    )}
                  />
                </div>

                {/* Mã sản phẩm */}
                <div className="precision-ycsx__modalField" style={{ gridColumn: "span 2" }}>
                  <label>Mã sản phẩm G_CODE / G_NAME_KD *:</label>
                  <Autocomplete
                    size="small"
                    options={codeList}
                    filterOptions={filterCodeOptions}
                    isOptionEqualToValue={(opt, val) => opt?.G_CODE === val?.G_CODE}
                    getOptionLabel={(opt) => {
                      if (!opt) return "";
                      if (typeof opt === "string") return opt;
                      return `${opt.G_CODE || ""}: ${opt.G_NAME_KD || opt.G_NAME || ""}`;
                    }}
                    value={selectedCode}
                    onChange={(_, val) => onSelectCode(val as CodeListData)}
                    openOnFocus
                    autoHighlight
                    clearOnEscape
                    slotProps={{
                      popper: { sx: { zIndex: 120000 } },
                    }}
                    noOptionsText="Không tìm thấy mã sản phẩm"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Chọn hoặc gõ G_CODE, G_NAME_KD..."
                        variant="outlined"
                      />
                    )}
                  />
                </div>

                {/* Số PO */}
                <div className="precision-ycsx__modalField">
                  <label>Số đơn đặt hàng (PO No):</label>
                  <Autocomplete
                    size="small"
                    options={ponolist}
                    filterOptions={filterPoOptions}
                    isOptionEqualToValue={(opt, val) => opt?.PO_NO === val?.PO_NO}
                    getOptionLabel={(opt) => {
                      if (!opt) return "";
                      if (typeof opt === "string") return opt;
                      return `${opt.PO_NO || ""}${opt.RD_DATE ? ` (${opt.RD_DATE})` : ""}`;
                    }}
                    value={selectedPoNo}
                    onChange={(_, val) => onSelectPoNo(val as PONOLIST)}
                    openOnFocus
                    autoHighlight
                    clearOnEscape
                    slotProps={{
                      popper: { sx: { zIndex: 120000 } },
                    }}
                    noOptionsText="Không có PO phù hợp"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Chọn PO No..."
                        variant="outlined"
                      />
                    )}
                  />
                </div>

                {/* Số lượng */}
                <div className="precision-ycsx__modalField">
                  <label>Số lượng yêu cầu (EA) *:</label>
                  <input
                    type="number"
                    min={0}
                    value={newycsxqty}
                    onChange={(e) => setNewYcsxQty(Number(e.target.value))}
                    placeholder="Nhập số lượng sản xuất..."
                    style={{ fontWeight: 700 }}
                  />
                </div>

                {/* Ngày giao hàng */}
                <div className="precision-ycsx__modalField">
                  <label>Ngày giao hàng (DELIVERY_DT) *:</label>
                  <input
                    type="date"
                    value={deliverydate ? deliverydate.slice(0, 10) : ""}
                    onChange={(e) => setNewDeliveryDate(e.target.value)}
                  />
                </div>

                {/* Phân loại */}
                <div className="precision-ycsx__modalField">
                  <label>Phân loại hàng:</label>
                  <select
                    value={newphanloai}
                    onChange={(e) => setNewPhanLoai(e.target.value)}
                  >
                    <option value="TT">Hàng Thường (TT)</option>
                    <option value="SP">Sample sang FL (SP)</option>
                    <option value="RB">Ribbon (RB)</option>
                    <option value="HQ">Hàn Quốc (HQ)</option>
                    <option value="VN">Việt Nam (VN)</option>
                    <option value="AM">Amazon (AM)</option>
                    <option value="DL">Đổi LOT (DL)</option>
                    <option value="M4">NM4 (M4)</option>
                    <option value="GC">Hàng Gia Công (GC)</option>
                    <option value="TM">Hàng Thương Mại (TM)</option>
                    {!isCMS && <option value="GD">Gia Công Đặc Biệt (GD)</option>}
                  </select>
                </div>

                {/* Loại SX */}
                <div className="precision-ycsx__modalField">
                  <label>Loại SX (CODE_55):</label>
                  <select
                    value={loaisx}
                    onChange={(e) => setLoaiSX(e.target.value)}
                  >
                    <option value="01">01 - Thông Thường</option>
                    <option value="02">02 - SDI</option>
                    <option value="03">03 - ETC</option>
                    <option value="04">04 - SAMPLE</option>
                  </select>
                </div>

                {/* Loại XH */}
                <div className="precision-ycsx__modalField">
                  <label>Loại xuất hàng (CODE_50):</label>
                  <select
                    value={loaixh}
                    onChange={(e) => setLoaiXH(e.target.value)}
                  >
                    <option value="01">01 - GC</option>
                    <option value="02">02 - SK</option>
                    <option value="03">03 - KD</option>
                    <option value="04">04 - VN</option>
                    <option value="05">05 - SAMPLE</option>
                    <option value="06">06 - Vải bạc 4</option>
                    <option value="07">07 - ETC</option>
                  </select>
                </div>

                {/* First LOT */}
                {isCMS && (
                  <div className="precision-ycsx__modalField">
                    <label>FIRST LOT:</label>
                    <select
                      value={isFirstLOT ? "Y" : "N"}
                      onChange={(e) => setIsFirstLot(e.target.value === "Y")}
                    >
                      <option value="N">Bình thường (Not First LOT)</option>
                      <option value="Y">First LOT</option>
                    </select>
                  </div>
                )}

                {/* YC Tạm thời */}
                {isCMS && (
                  <div className="precision-ycsx__modalField">
                    <label>YC TẠM THỜI:</label>
                    <select
                      value={is_tam_thoi}
                      onChange={(e) => setIs_Tam_Thoi(e.target.value)}
                    >
                      <option value="N">Bình thường</option>
                      <option value="Y">Tạm thời</option>
                    </select>
                  </div>
                )}

                {/* Ghi chú */}
                <div className="precision-ycsx__modalField" style={{ gridColumn: isCMS ? "span 1" : "span 2" }}>
                  <label>REMARK / GHI CHÚ:</label>
                  <input
                    type="text"
                    placeholder="Ghi chú thêm về yêu cầu sản xuất..."
                    value={newycsxremark}
                    onChange={(e) => setNewYcsxRemark(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ── CHẾ ĐỘ 2: THÊM HÀNG LOẠT (EXCEL & NHẬP NHANH VÀO LƯỚI) ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Box 1: Nhập nhanh từng dòng trực tiếp vào lưới (Không cần chuyển tab) */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                    <FiEdit style={{ color: "#2563eb" }} /> THÊM TỪNG DÒNG TRỰC TIẾP VÀO LƯỚI (QUICK ADD TO GRID)
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    Chọn thông tin bên dưới và bấm "Thêm Dòng Lưới" để đưa vào bảng preview
                  </span>
                </div>

                {/* Grid 2 hàng đầy đủ 100% các trường */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isCMS ? "1.2fr 1.8fr 1fr 0.9fr 1fr 1fr" : "1.2fr 2fr 1.2fr 1fr 1fr 1fr",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  {/* Hàng 1 */}
                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Khách hàng *:</label>
                    <Autocomplete
                      size="small"
                      options={customerList}
                      filterOptions={filterCustomerOptions}
                      isOptionEqualToValue={(opt, val) => opt?.CUST_CD === val?.CUST_CD}
                      getOptionLabel={(opt) => (typeof opt === "string" ? opt : `${opt?.CUST_CD || ""}: ${opt?.CUST_NAME_KD || ""}`)}
                      value={selectedCust_CD}
                      onChange={(_, val) => onSelectCustomer(val as CustomerListData)}
                      openOnFocus
                      autoHighlight
                      clearOnEscape
                      slotProps={{ popper: { sx: { zIndex: 120000 } } }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" placeholder="Mã KH..." variant="outlined" />
                      )}
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Mã sản phẩm (G_CODE) *:</label>
                    <Autocomplete
                      size="small"
                      options={codeList}
                      filterOptions={filterCodeOptions}
                      isOptionEqualToValue={(opt, val) => opt?.G_CODE === val?.G_CODE}
                      getOptionLabel={(opt) => (typeof opt === "string" ? opt : `${opt?.G_CODE || ""}: ${opt?.G_NAME_KD || opt?.G_NAME || ""}`)}
                      value={selectedCode}
                      onChange={(_, val) => onSelectCode(val as CodeListData)}
                      openOnFocus
                      autoHighlight
                      clearOnEscape
                      slotProps={{ popper: { sx: { zIndex: 120000 } } }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" placeholder="Mã G_CODE hoặc tên..." variant="outlined" />
                      )}
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Số đơn PO:</label>
                    <Autocomplete
                      size="small"
                      options={ponolist}
                      filterOptions={filterPoOptions}
                      isOptionEqualToValue={(opt, val) => opt?.PO_NO === val?.PO_NO}
                      getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.PO_NO || "")}
                      value={selectedPoNo}
                      onChange={(_, val) => onSelectPoNo(val as PONOLIST)}
                      openOnFocus
                      autoHighlight
                      clearOnEscape
                      slotProps={{ popper: { sx: { zIndex: 120000 } } }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" placeholder="PO No..." variant="outlined" />
                      )}
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Số lượng (EA) *:</label>
                    <input
                      type="number"
                      min={0}
                      value={newycsxqty}
                      onChange={(e) => setNewYcsxQty(Number(e.target.value))}
                      placeholder="SL..."
                      style={{ fontWeight: 700 }}
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Ngày giao hàng *:</label>
                    <input
                      type="date"
                      value={deliverydate ? deliverydate.slice(0, 10) : ""}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Phân loại:</label>
                    <select
                      value={newphanloai}
                      onChange={(e) => setNewPhanLoai(e.target.value)}
                    >
                      <option value="TT">Hàng Thường (TT)</option>
                      <option value="SP">Sample sang FL (SP)</option>
                      <option value="RB">Ribbon (RB)</option>
                      <option value="HQ">Hàn Quốc (HQ)</option>
                      <option value="VN">Việt Nam (VN)</option>
                      <option value="AM">Amazon (AM)</option>
                      <option value="DL">Đổi LOT (DL)</option>
                      <option value="M4">NM4 (M4)</option>
                      <option value="GC">Hàng Gia Công (GC)</option>
                      <option value="TM">Hàng Thương Mại (TM)</option>
                      {!isCMS && <option value="GD">Gia Công Đặc Biệt (GD)</option>}
                    </select>
                  </div>
                </div>

                {/* Hàng 2 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isCMS ? "1fr 1fr 1fr 1fr 2fr auto" : "1fr 1fr 2.5fr auto",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Loại SX (CODE_55):</label>
                    <select
                      value={loaisx}
                      onChange={(e) => setLoaiSX(e.target.value)}
                    >
                      <option value="01">01 - Thông Thường</option>
                      <option value="02">02 - SDI</option>
                      <option value="03">03 - ETC</option>
                      <option value="04">04 - SAMPLE</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Loại XH (CODE_50):</label>
                    <select
                      value={loaixh}
                      onChange={(e) => setLoaiXH(e.target.value)}
                    >
                      <option value="01">01 - GC</option>
                      <option value="02">02 - SK</option>
                      <option value="03">03 - KD</option>
                      <option value="04">04 - VN</option>
                      <option value="05">05 - SAMPLE</option>
                      <option value="06">06 - Vải bạc 4</option>
                      <option value="07">07 - ETC</option>
                    </select>
                  </div>

                  {isCMS && (
                    <div className="field-group">
                      <label style={{ fontSize: 10 }}>FIRST LOT:</label>
                      <select
                        value={isFirstLOT ? "Y" : "N"}
                        onChange={(e) => setIsFirstLot(e.target.value === "Y")}
                      >
                        <option value="N">Bình thường (N)</option>
                        <option value="Y">First LOT (Y)</option>
                      </select>
                    </div>
                  )}

                  {isCMS && (
                    <div className="field-group">
                      <label style={{ fontSize: 10 }}>YC TẠM THỜI:</label>
                      <select
                        value={is_tam_thoi}
                        onChange={(e) => setIs_Tam_Thoi(e.target.value)}
                      >
                        <option value="N">Bình thường (N)</option>
                        <option value="Y">Tạm thời (Y)</option>
                      </select>
                    </div>
                  )}

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Ghi chú (REMARK):</label>
                    <input
                      type="text"
                      placeholder="Ghi chú thêm..."
                      value={newycsxremark}
                      onChange={(e) => setNewYcsxRemark(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={onInsertRow}
                    style={{
                      height: 28,
                      padding: "0 14px",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      borderRadius: 4,
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FiPlus size={14} /> + Thêm Dòng Lưới
                  </button>
                </div>
              </div>

              {/* Box 2: Tải file Excel & Cụm thao tác Hàng Loạt */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label
                    htmlFor="ycsx-excel-file"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: "#059669",
                      color: "#fff",
                      borderRadius: "4px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <FiUploadCloud size={15} />
                    <span>Chọn Tệp Excel (.xlsx, .xls)</span>
                  </label>
                  <input
                    id="ycsx-excel-file"
                    type="file"
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    onChange={onUploadFile}
                  />
                  <span style={{ fontSize: "11.5px", color: "#475569" }}>
                    Tổng số dòng trong lưới:{" "}
                    <strong style={{ color: uploadExcelJson.length > 0 ? "#2563eb" : "inherit" }}>
                      {uploadExcelJson.length.toLocaleString()} dòng
                    </strong>
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    onClick={onCheckExcel}
                    disabled={uploadExcelJson.length === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: uploadExcelJson.length === 0 ? "#f1f5f9" : "#2563eb",
                      color: uploadExcelJson.length === 0 ? "#94a3b8" : "#fff",
                      border: "none",
                      cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <FiCheckCircle size={14} /> 1. KIỂM TRA (CHECK)
                  </button>

                  <button
                    type="button"
                    onClick={onUpExcel}
                    disabled={uploadExcelJson.length === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: uploadExcelJson.length === 0 ? "#f1f5f9" : "#10b981",
                      color: uploadExcelJson.length === 0 ? "#94a3b8" : "#fff",
                      border: "none",
                      cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <FiUploadCloud size={14} /> 2. TẢI LÊN (UPLOAD)
                  </button>

                  <button
                    type="button"
                    onClick={onClearExcel}
                    disabled={uploadExcelJson.length === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 10px",
                      borderRadius: 4,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: "#ffffff",
                      color: "#e11d48",
                      border: "1px solid #fecdd3",
                      cursor: uploadExcelJson.length === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <FiTrash2 size={13} /> Xóa Lưới
                  </button>
                </div>
              </div>

              {/* Box 3: Bảng xem trước dữ liệu (Đảm bảo chiều cao hiển thị 380px) */}
              <div className="modal-agtable-wrapper">
                <AGTable
                  showFilter={true}
                  columns={excelColumns}
                  data={uploadExcelJson}
                  toolbar={
                    <div
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#475569",
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      Bảng Xem Trước Dữ Liệu YCSX ({uploadExcelJson.length} bản ghi)
                    </div>
                  }
                  onSelectionChange={() => {}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="hint-text">
            <span>* Lưu ý: Kiểm tra đầy đủ Mã code ERP, Mã khách hàng và Ngày giao hàng trước khi lưu.</span>
          </div>
          <div className="action-btns">
            {activeMode === "manual" ? (
              <>
                <button className="btn-secondary" onClick={onClearManual}>
                  Làm mới (Clear)
                </button>
                <button className="btn-secondary" onClick={onClose}>
                  Đóng
                </button>
                <button className="btn-primary" onClick={onSaveManual}>
                  <FiSave /> Lưu YCSX Mới
                </button>
              </>
            ) : (
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXAddModal);
