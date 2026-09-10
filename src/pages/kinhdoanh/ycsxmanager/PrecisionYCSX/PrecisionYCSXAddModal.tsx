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
import DropdownSearch from "../../../../components/MyDropDownSearch/DropdownSearch";
import AGTable from "../../../../components/DataTable/AGTable";
import { getExcelUploadColumns } from "./PrecisionYCSXColumns";
import { CodeListData, CustomerListData, PONOLIST } from "../../interfaces/kdInterface";

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
                  <DropdownSearch
                    label="Chọn khách hàng"
                    placeholder="Tìm mã hoặc tên KH..."
                    suggestData={customerList}
                    selectedObj={selectedCust_CD}
                    setSelectedObj={onSelectCustomer}
                    primaryKey="CUST_CD"
                    searchFields={["CUST_CD", "CUST_NAME_KD"]}
                    displayFormat="CUST_CD-CUST_NAME_KD"
                  />
                </div>

                {/* Mã sản phẩm */}
                <div className="precision-ycsx__modalField" style={{ gridColumn: "span 2" }}>
                  <label>Mã sản phẩm G_CODE / G_NAME_KD *:</label>
                  <DropdownSearch
                    label="Chọn mã code"
                    placeholder="Tìm kiếm mã code ERP hoặc Code KD..."
                    suggestData={codeList}
                    selectedObj={selectedCode}
                    setSelectedObj={onSelectCode}
                    primaryKey="G_CODE"
                    searchFields={["G_CODE", "G_NAME_KD", "G_NAME"]}
                    displayFormat="G_CODE-G_NAME_KD"
                  />
                </div>

                {/* Số PO */}
                <div className="precision-ycsx__modalField">
                  <label>Số đơn đặt hàng (PO No):</label>
                  <DropdownSearch
                    label="Chọn PO No"
                    placeholder="Tìm PO..."
                    suggestData={ponolist}
                    selectedObj={selectedPoNo}
                    setSelectedObj={onSelectPoNo}
                    primaryKey="PO_NO"
                    searchFields={["PO_NO", "G_CODE"]}
                    displayFormat="PO_NO"
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1.6fr 0.8fr 1fr 0.8fr 0.9fr 0.8fr 1.2fr auto",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Khách hàng:</label>
                    <DropdownSearch
                      label="KH"
                      placeholder="Chọn KH..."
                      suggestData={customerList}
                      selectedObj={selectedCust_CD}
                      setSelectedObj={onSelectCustomer}
                      primaryKey="CUST_CD"
                      searchFields={["CUST_CD", "CUST_NAME_KD"]}
                      displayFormat="CUST_NAME_KD"
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Mã sản phẩm *:</label>
                    <DropdownSearch
                      label="Code"
                      placeholder="Chọn mã code..."
                      suggestData={codeList}
                      selectedObj={selectedCode}
                      setSelectedObj={onSelectCode}
                      primaryKey="G_CODE"
                      searchFields={["G_CODE", "G_NAME_KD", "G_NAME"]}
                      displayFormat="G_CODE-G_NAME_KD"
                    />
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Số lượng *:</label>
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
                    <label style={{ fontSize: 10 }}>Ngày giao *:</label>
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
                      <option value="TT">TT</option>
                      <option value="SP">SP</option>
                      <option value="RB">RB</option>
                      <option value="HQ">HQ</option>
                      <option value="VN">VN</option>
                      <option value="AM">AM</option>
                      <option value="DL">DL</option>
                      <option value="M4">M4</option>
                      <option value="GC">GC</option>
                      <option value="TM">TM</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Loại SX:</label>
                    <select
                      value={loaisx}
                      onChange={(e) => setLoaiSX(e.target.value)}
                    >
                      <option value="01">01 - Thường</option>
                      <option value="02">02 - SDI</option>
                      <option value="03">03 - ETC</option>
                      <option value="04">04 - SAMPLE</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Loại XH:</label>
                    <select
                      value={loaixh}
                      onChange={(e) => setLoaiXH(e.target.value)}
                    >
                      <option value="01">01 - GC</option>
                      <option value="02">02 - SK</option>
                      <option value="03">03 - KD</option>
                      <option value="04">04 - VN</option>
                      <option value="05">05 - SAMPLE</option>
                      <option value="06">06 - Vải bạc</option>
                      <option value="07">07 - ETC</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label style={{ fontSize: 10 }}>Ghi chú:</label>
                    <input
                      type="text"
                      placeholder="Ghi chú..."
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
                      padding: "0 12px",
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      fontWeight: 700,
                      borderRadius: 4,
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FiPlus size={14} /> + Thêm Dòng
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
                  showFilter={false}
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
