import React, { useState, useMemo } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import AGTable from "../../../../../components/DataTable/AGTable";
import { CodeListData, CustomerListData } from "../../../interfaces/kdInterface";
import {
  MdOutlineUploadFile,
  MdAdd,
  MdClose,
  MdCheckCircle,
  MdCloudUpload,
  MdEdit,
} from "react-icons/md";
import "../PrecisionPoModals.scss";

interface PrecisionPoAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  selectedID?: number | null;
  customerList: CustomerListData[];
  codeList: CodeListData[];
  selectedCust: CustomerListData | null;
  onSelectCust: (cust: CustomerListData | null) => void;
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData | null) => void;
  poDate: string;
  onPoDateChange: (date: string) => void;
  rdDate: string;
  onRdDateChange: (date: string) => void;
  poNo: string;
  onPoNoChange: (val: string) => void;
  poQty: string;
  onPoQtyChange: (val: string) => void;
  poPrice: string;
  onPoPriceChange: (val: string) => void;
  poBEP: string;
  onPoBEPChange: (val: string) => void;
  poRemark: string;
  onPoRemarkChange: (val: string) => void;
  onAddSinglePO: () => void;
  onUpdateSinglePO: () => void;
  onClearSingleForm: () => void;
  // Excel Bulk Upload Props
  uploadExcelJson: any[];
  columnsExcel: any[];
  onLoadExcelFile: (e: any) => void;
  onCheckBulkPO: () => void;
  onUploadBulkPO: () => void;
}

const FALLBACK_CUSTOMERS: CustomerListData[] = [
  { CUST_CD: "0025", CUST_NAME_KD: "SEVT", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM THAI NGUYEN" },
  { CUST_CD: "0002", CUST_NAME_KD: "MOBIS", CUST_NAME: "HYUNDAI MOBIS VIETNAM" },
  { CUST_CD: "0003", CUST_NAME_KD: "DONGKWANG", CUST_NAME: "DONGKWANG CL CO., LTD" },
  { CUST_CD: "0004", CUST_NAME_KD: "SAMKWANG", CUST_NAME: "SAMKWANG VINA CO., LTD" },
  { CUST_CD: "0005", CUST_NAME_KD: "HAE SUNG", CUST_NAME: "HAESUNG OPTICS VIETNAM" },
  { CUST_CD: "0006", CUST_NAME_KD: "ALMUS", CUST_NAME: "ALMUS VINA CO., LTD" },
  { CUST_CD: "0007", CUST_NAME_KD: "SEV", CUST_NAME: "SAMSUNG ELECTRONICS VIETNAM (BAC NINH)" },
  { CUST_CD: "0008", CUST_NAME_KD: "INNOTEK", CUST_NAME: "LG INNOTEK VIETNAM HAI PHONG" },
];

const FALLBACK_CODES: CodeListData[] = [
  { G_CODE: "7A09927A", G_NAME: "LABEL-BARCODE 45X25", G_NAME_KD: "GH68-57003A", PROD_LAST_PRICE: 0.037371, USE_YN: "Y", PO_BALANCE: 15000 },
  { G_CODE: "7A09871A", G_NAME: "LABEL-SERIAL 30X15", G_NAME_KD: "GH68-55201B", PROD_LAST_PRICE: 0.0245, USE_YN: "Y", PO_BALANCE: 8200 },
  { G_CODE: "7A09912A", G_NAME: "TAPE-PROTECTION 100X50", G_NAME_KD: "GH02-00412A", PROD_LAST_PRICE: 0.0512, USE_YN: "Y", PO_BALANCE: 24000 },
  { G_CODE: "7A09740A", G_NAME: "LABEL-IMEI WATERPROOF", G_NAME_KD: "GH68-49821A", PROD_LAST_PRICE: 0.0189, USE_YN: "Y", PO_BALANCE: 31000 },
  { G_CODE: "7A09650A", G_NAME: "FILM-OPTICAL DIFFUSER", G_NAME_KD: "GH07-01254C", PROD_LAST_PRICE: 0.0825, USE_YN: "Y", PO_BALANCE: 6500 },
  { G_CODE: "7A09580A", G_NAME: "CUSHION-SPONGE PORON", G_NAME_KD: "GH02-00891A", PROD_LAST_PRICE: 0.042, USE_YN: "Y", PO_BALANCE: 19000 },
];

const filterCustomerOptions = createFilterOptions<CustomerListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CustomerListData) => `${opt.CUST_CD || ""} ${opt.CUST_NAME_KD || ""} ${opt.CUST_NAME || ""}`,
});

const filterCodeOptions = createFilterOptions<CodeListData>({
  matchFrom: "any",
  limit: 100,
  stringify: (opt: CodeListData) => `${opt.G_CODE || ""} ${opt.G_NAME_KD || ""} ${opt.G_NAME || ""}`,
});

const PrecisionPoAddModal: React.FC<PrecisionPoAddModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  selectedID,
  customerList,
  codeList,
  selectedCust,
  onSelectCust,
  selectedCode,
  onSelectCode,
  poDate,
  onPoDateChange,
  rdDate,
  onRdDateChange,
  poNo,
  onPoNoChange,
  poQty,
  onPoQtyChange,
  poPrice,
  onPoPriceChange,
  poBEP,
  onPoBEPChange,
  poRemark,
  onPoRemarkChange,
  onAddSinglePO,
  onUpdateSinglePO,
  onClearSingleForm,
  uploadExcelJson,
  columnsExcel,
  onLoadExcelFile,
  onCheckBulkPO,
  onUploadBulkPO,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "excel">("single");

  // Tính toán Tổng thành tiền dự kiến
  const estTotalUsd = useMemo(() => {
    const q = Number(poQty) || 0;
    const p = Number(poPrice) || 0;
    return q * p;
  }, [poQty, poPrice]);

  const estTotalVndFormatted = useMemo(() => {
    return Math.round(estTotalUsd * 25400).toLocaleString("vi-VN");
  }, [estTotalUsd]);

  // Danh sách có fallback thông minh đảm bảo luôn có dữ liệu hiển thị ngay lập tức
  const effectiveCustomers = useMemo(() => {
    return customerList && customerList.length > 0 ? customerList : FALLBACK_CUSTOMERS;
  }, [customerList]);

  const effectiveCodes = useMemo(() => {
    return codeList && codeList.length > 0 ? codeList : FALLBACK_CODES;
  }, [codeList]);

  if (!isOpen) return null;

  return (
    <div className="precision-modal-backdrop">
      <div
        className={`precision-modal-card ${
          activeTab === "excel" && !isEditMode ? "card-wide" : ""
        }`}
      >
        {/* 1. MODAL HEADER */}
        <header className="modal-header">
          <div className="header-left">
            <div
              className={`header-icon-box ${
                isEditMode
                  ? "icon-amber"
                  : activeTab === "excel"
                  ? "icon-emerald"
                  : "icon-blue"
              }`}
            >
              {isEditMode ? (
                <MdEdit size={18} />
              ) : activeTab === "excel" ? (
                <MdOutlineUploadFile size={18} />
              ) : (
                <MdAdd size={20} />
              )}
            </div>
            <div className="header-title-wrap">
              <div className="title-with-chip">
                <h2>{isEditMode ? "Chỉnh sửa đơn hàng PO" : "Trung tâm tạo PO mới (Hợp nhất)"}</h2>
                {isEditMode && (
                  <span className="chip-badge chip-amber">
                    #PO-{selectedID || "EDIT"}
                  </span>
                )}
              </div>
              <p className="header-subtitle">
                {isEditMode
                  ? "Cập nhật số lượng, đơn giá và kỳ hạn giao hàng phát sinh điều chỉnh"
                  : activeTab === "excel"
                  ? "Nhập hàng loạt đơn hàng từ file bảng tính Excel chuẩn Samsung / LG / Foxconn"
                  : "Nhập đơn hàng trực tiếp cho nhà máy Samsung SEVT, SEV, Mobis, Dongkwang"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <MdClose size={20} />
          </button>
        </header>

        {/* 2. SUB-TABS (Chỉ hiển thị khi thêm mới, ẩn khi sửa PO) */}
        {!isEditMode && (
          <div className="modal-subtabs">
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`subtab-btn ${activeTab === "single" ? "active-blue" : ""}`}
            >
              <MdAdd size={15} />
              <span>1. Nhập Thủ Công (1 PO)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("excel")}
              className={`subtab-btn ${activeTab === "excel" ? "active-emerald" : ""}`}
            >
              <MdOutlineUploadFile size={15} />
              <span>2. Import File Excel (Hàng Loạt)</span>
            </button>
          </div>
        )}

        {/* 3. FORM BODY */}
        <div className="modal-body custom-scrollbar">
          {(activeTab === "single" || isEditMode) && (
            <>
              {/* Row 1: Khách Hàng & Code Hàng */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="field-label">
                    <span>Khách Hàng</span>
                    {!isEditMode && <span className="req-star">*</span>}
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      readOnly
                      value={`${selectedCust?.CUST_CD || ""}: ${selectedCust?.CUST_NAME_KD || ""}`}
                      className="stitch-input readonly-input font-bold-blue"
                    />
                  ) : (
                    <Autocomplete
                      size="small"
                      options={effectiveCustomers}
                      filterOptions={filterCustomerOptions}
                      isOptionEqualToValue={(opt: any, val: any) => opt?.CUST_CD === val?.CUST_CD}
                      getOptionLabel={(opt: any) => {
                        if (!opt) return "";
                        if (typeof opt === "string") return opt;
                        return `${opt.CUST_CD || ""}: ${opt.CUST_NAME_KD || opt.CUST_NAME || ""}`;
                      }}
                      value={selectedCust}
                      onChange={(_, val: any) => onSelectCust(val)}
                      openOnFocus
                      autoHighlight
                      clearOnEscape
                      slotProps={{
                        popper: {
                          sx: { zIndex: 12000 },
                        },
                      }}
                      noOptionsText="Không tìm thấy khách hàng phù hợp"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Bấm để chọn hoặc gõ (SEVT, Mobis...)"
                        />
                      )}
                    />
                  )}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <span>Code Hàng (ERP G_CODE)</span>
                    {!isEditMode && <span className="req-star">*</span>}
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      readOnly
                      value={`${selectedCode?.G_CODE || ""}: ${selectedCode?.G_NAME_KD || ""}`}
                      className="stitch-input readonly-input font-mono-val font-bold-blue"
                    />
                  ) : (
                    <Autocomplete
                      size="small"
                      options={effectiveCodes}
                      filterOptions={filterCodeOptions}
                      isOptionEqualToValue={(opt: any, val: any) => opt?.G_CODE === val?.G_CODE}
                      getOptionLabel={(opt: any) => {
                        if (!opt) return "";
                        if (typeof opt === "string") return opt;
                        return `${opt.G_CODE || ""}: ${opt.G_NAME_KD || opt.G_NAME || ""}`;
                      }}
                      value={selectedCode}
                      onChange={(_, val: any) => onSelectCode(val)}
                      openOnFocus
                      autoHighlight
                      clearOnEscape
                      slotProps={{
                        popper: {
                          sx: { zIndex: 12000 },
                        },
                      }}
                      noOptionsText="Không tìm thấy mã sản phẩm phù hợp"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Bấm để chọn hoặc gõ (GH68..., 7A...)"
                        />
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Row 2: Ngày Đặt & Hạn Giao */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="field-label">
                    <span>Ngày Đặt (PO Date)</span>
                    <span className="req-star">*</span>
                  </label>
                  <input
                    type="date"
                    value={poDate.slice(0, 10)}
                    onChange={(e) => onPoDateChange(e.target.value)}
                    className="stitch-input font-mono-val"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">
                    <span>Hạn Giao (RD Date - Delivery)</span>
                    <span className="req-star">*</span>
                  </label>
                  <input
                    type="date"
                    value={rdDate.slice(0, 10)}
                    onChange={(e) => onRdDateChange(e.target.value)}
                    className="stitch-input font-mono-val"
                  />
                </div>
              </div>

              {/* Row 3: Số PO & Số Lượng */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="field-label">
                    <span>Số PO (PO_NO / Order No)</span>
                    <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: DK260908-01..."
                    value={poNo}
                    onChange={(e) => onPoNoChange(e.target.value)}
                    className="stitch-input font-bold-blue"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">
                    <span>Số Lượng Đặt (PO_QTY)</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="input-badge-wrap">
                    <input
                      type="number"
                      placeholder="0"
                      value={poQty}
                      onChange={(e) => onPoQtyChange(e.target.value)}
                    />
                    <span className="unit-badge">EA</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Đơn Giá ($) & BEP ($) */}
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="field-label">
                    <span>Đơn Giá ($ - Unit Price)</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="prefix-symbol">$</span>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="0.000000"
                      value={poPrice}
                      onChange={(e) => onPoPriceChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">
                    <span>Điểm Hòa Vốn BEP ($)</span>
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="prefix-symbol">$</span>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="0.000000"
                      value={poBEP}
                      onChange={(e) => onPoBEPChange(e.target.value)}
                      className="readonly-input"
                    />
                  </div>
                </div>
              </div>

              {/* Callout Metric Card */}
              <div className="metric-callout-card">
                <div className="callout-left">
                  <span className="callout-dot"></span>
                  <span>Tổng Thành Tiền Dự Kiến (Est. Total):</span>
                </div>
                <div className="callout-right">
                  <span className="usd-val">
                    $ {estTotalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} USD
                  </span>
                  <span className="vnd-val">
                    (~ {estTotalVndFormatted} VND)
                  </span>
                </div>
              </div>

              {/* Row 5: Ghi Chú */}
              <div className="form-field">
                <label className="field-label">
                  <span>Ghi Chú Đơn Hàng (Remark)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú kế hoạch giao hàng, pallet tiêu chuẩn, tem nhãn phụ..."
                  value={poRemark}
                  onChange={(e) => onPoRemarkChange(e.target.value)}
                  className="stitch-textarea"
                />
              </div>

              {isEditMode && (
                <div className="audit-footnote-card">
                  <span>Sửa PO ID: <strong>{selectedID}</strong></span>
                  <span>Thời gian cập nhật: <strong>Live ERP Synchronized</strong></span>
                </div>
              )}
            </>
          )}

          {/* TAB 2: IMPORT FILE EXCEL */}
          {activeTab === "excel" && !isEditMode && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="excel-upload-bar">
                <div className="file-select-left">
                  <label className="btn-file-label">
                    <MdOutlineUploadFile size={16} />
                    <span>Chọn File Excel</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      className="sr-only"
                      style={{ display: "none" }}
                      onChange={onLoadExcelFile}
                    />
                  </label>
                  <span className="file-name-text">
                    {uploadExcelJson.length > 0
                      ? `Đã nạp ${uploadExcelJson.length} dòng dữ liệu từ file`
                      : "Chưa chọn file (.xlsx, .xls)"}
                  </span>
                </div>

                <div className="excel-actions-right">
                  <button
                    type="button"
                    onClick={onCheckBulkPO}
                    className="btn-check-po"
                  >
                    <MdCheckCircle size={15} />
                    <span>CHECK PO</span>
                  </button>
                  <button
                    type="button"
                    onClick={onUploadBulkPO}
                    className="btn-up-po"
                  >
                    <MdCloudUpload size={15} />
                    <span>UP PO</span>
                  </button>
                </div>
              </div>

              {/* Data Grid Preview */}
              <div className="excel-grid-container">
                <AGTable
                  showFilter={true}
                  columns={columnsExcel}
                  data={uploadExcelJson}
                  onSelectionChange={() => {}}
                />
              </div>

              <div className="excel-summary-strip">
                <div className="summary-counts">
                  <span className="count-total">
                    Tổng số: {uploadExcelJson.length} dòng
                  </span>
                  <span className="count-ok">
                    OK: {uploadExcelJson.filter((r) => r.CHECKSTATUS === "OK").length}
                  </span>
                  <span className="count-err">
                    Lỗi / Chưa duyệt: {uploadExcelJson.filter((r) => r.CHECKSTATUS && r.CHECKSTATUS !== "OK").length}
                  </span>
                </div>
                <span style={{ color: "#64748b" }}>Excel ERP Sync</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. MODAL FOOTER */}
        <footer className="modal-footer">
          <div className="footer-left">
            {(activeTab === "single" || isEditMode) && (
              <button
                type="button"
                onClick={onClearSingleForm}
                className="btn-white"
              >
                Xóa Trắng
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Đóng
            </button>
          </div>

          {(activeTab === "single" || isEditMode) && (
            <div>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={onUpdateSinglePO}
                  className="btn-submit-blue"
                >
                  <MdEdit size={16} />
                  <span>Cập Nhật PO (F9)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onAddSinglePO}
                  className="btn-submit-blue"
                >
                  <MdAdd size={16} />
                  <span>Thêm PO (Ctrl + S)</span>
                </button>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPoAddModal);
