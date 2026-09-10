import React, { memo } from "react";
import {
  Autocomplete,
  TextField,
  createFilterOptions,
} from "@mui/material";
import {
  FiX,
  FiUploadCloud,
  FiPlus,
  FiPrinter,
  FiLayers,
} from "react-icons/fi";
import { CodeListDataUpGia, CustomerListData } from "../../interfaces/kdInterface";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import QuotationForm from "../QuotationForm/QuotationForm";

interface Props {
  /* Pivot Modal */
  showPivot: boolean;
  onClosePivot: () => void;
  selectedDataSource: any;

  /* Up Giá Modal */
  showUpPrice: boolean;
  onCloseUpPrice: () => void;
  customerList: CustomerListData[];
  codelist: CodeListDataUpGia[];
  selectedCust_CD: CustomerListData | null;
  setSelectedCust_CD: (v: CustomerListData | null) => void;
  selectedCode: CodeListDataUpGia | null;
  setSelectedCode: (v: CodeListDataUpGia | null) => void;
  moq: number;
  setMOQ: (v: number) => void;
  newprice: string;
  setNewPrice: (v: string) => void;
  newbep: string;
  setNewBep: (v: string) => void;
  newpricedate: string;
  setNewPriceDate: (v: string) => void;
  onAddSinglePrice: () => void;
  onReadFileExcel: (e: any) => void;
  onUploadDatabase: () => void;
  uploadTableElement: React.ReactNode;

  /* Print Modal */
  showPrint: boolean;
  onClosePrint: () => void;
  printData: any[];
  printRef: React.RefObject<HTMLDivElement>;
  onTriggerPrint: () => void;
}

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

const PrecisionPriceModals: React.FC<Props> = ({
  showPivot,
  onClosePivot,
  selectedDataSource,

  showUpPrice,
  onCloseUpPrice,
  customerList,
  codelist,
  selectedCust_CD,
  setSelectedCust_CD,
  selectedCode,
  setSelectedCode,
  moq,
  setMOQ,
  newprice,
  setNewPrice,
  newbep,
  setNewBep,
  newpricedate,
  setNewPriceDate,
  onAddSinglePrice,
  onReadFileExcel,
  onUploadDatabase,
  uploadTableElement,

  showPrint,
  onClosePrint,
  printData,
  printRef,
  onTriggerPrint,
}) => {
  return (
    <>
      {/* ── 1. Modal Up Giá (Thêm lẻ & Tải lên Excel) ── */}
      {showUpPrice && (
        <div className="precision-quotation__modal-overlay" onClick={onCloseUpPrice}>
          <div
            className="precision-quotation__modal-box precision-quotation__modal-box--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="precision-quotation__modal-header">
              <h4>
                <FiUploadCloud /> Tải Lên Bảng Giá Sản Phẩm (Upload Master Price)
              </h4>
              <button className="close-btn" onClick={onCloseUpPrice}>
                <FiX />
              </button>
            </div>

            <div className="precision-quotation__modal-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Form Thêm Đơn Lẻ & Chọn File Excel */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {/* File input */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
                  <label
                    htmlFor="upload-excel-price"
                    style={{
                      padding: "4px 10px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    Chọn File Excel
                  </label>
                  <input
                    id="upload-excel-price"
                    type="file"
                    style={{ display: "none" }}
                    onChange={onReadFileExcel}
                  />
                </div>

                <div style={{ width: 1, height: 24, background: "#cbd5e1" }} />

                {/* Autocomplete Cust */}
                <Autocomplete
                  sx={{ width: 170 }}
                  size="small"
                  options={customerList}
                  filterOptions={filterOptions}
                  isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value?.CUST_CD}
                  getOptionLabel={(option: any) => `${option.CUST_CD}: ${option.CUST_NAME_KD}`}
                  renderInput={(params) => (
                    <TextField {...params} label="Khách hàng" sx={{ input: { fontSize: 11 } }} />
                  )}
                  value={selectedCust_CD}
                  onChange={(_, val) => setSelectedCust_CD(val as CustomerListData | null)}
                />

                {/* Autocomplete Code */}
                <Autocomplete
                  sx={{ width: 230 }}
                  size="small"
                  options={codelist}
                  filterOptions={filterOptions}
                  isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value?.G_CODE}
                  getOptionLabel={(option: any) => `${option.G_CODE}: ${option.G_NAME_KD}`}
                  renderInput={(params) => (
                    <TextField {...params} label="Mã SP (G_CODE)" sx={{ input: { fontSize: 11 } }} />
                  )}
                  value={selectedCode}
                  onChange={(_, val) => setSelectedCode(val as CodeListDataUpGia | null)}
                />

                {/* MOQ */}
                <input
                  type="number"
                  placeholder="MOQ"
                  value={moq}
                  onChange={(e) => setMOQ(Number(e.target.value))}
                  style={{ width: 65, height: 32, padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 11 }}
                />

                {/* Price */}
                <input
                  type="text"
                  placeholder="Giá ($)"
                  value={newprice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={{ width: 85, height: 32, padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 11, fontWeight: 700 }}
                />

                {/* BEP */}
                <input
                  type="text"
                  placeholder="BEP"
                  value={newbep}
                  onChange={(e) => setNewBep(e.target.value)}
                  style={{ width: 75, height: 32, padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 11 }}
                />

                {/* Date */}
                <input
                  type="date"
                  value={newpricedate.slice(0, 10)}
                  onChange={(e) => setNewPriceDate(e.target.value)}
                  style={{ height: 32, padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 11 }}
                />

                {/* Add button */}
                <button
                  className="precision-quotation__btn precision-quotation__btn--emerald"
                  onClick={onAddSinglePrice}
                >
                  <FiPlus /> Thêm dòng
                </button>
              </div>

              {/* Preview Table */}
              <div style={{ flex: 1, minHeight: 300, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
                {uploadTableElement}
              </div>
            </div>

            <div className="precision-quotation__modal-footer">
              <button
                className="precision-quotation__btn precision-quotation__btn--outline"
                onClick={onCloseUpPrice}
              >
                Đóng
              </button>
              <button
                className="precision-quotation__btn precision-quotation__btn--blue"
                onClick={onUploadDatabase}
              >
                <FiUploadCloud /> Lưu vào Cơ Sở Dữ Liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Modal Pivot Table ── */}
      {showPivot && (
        <div className="precision-quotation__modal-overlay" onClick={onClosePivot}>
          <div
            className="precision-quotation__modal-box precision-quotation__modal-box--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="precision-quotation__modal-header">
              <h4>
                <FiLayers /> Phân Tích Đa Chiều Bảng Giá (Pivot Grid)
              </h4>
              <button className="close-btn" onClick={onClosePivot}>
                <FiX />
              </button>
            </div>

            <div className="precision-quotation__modal-body" style={{ padding: 6, height: "calc(100% - 85px)" }}>
              <PivotTable datasource={selectedDataSource} tableID="datasxtablepivot" />
            </div>

            <div className="precision-quotation__modal-footer">
              <button className="precision-quotation__btn precision-quotation__btn--outline" onClick={onClosePivot}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Modal In Báo Giá ── */}
      {showPrint && (
        <div className="precision-quotation__modal-overlay" onClick={onClosePrint}>
          <div
            className="precision-quotation__modal-box precision-quotation__modal-box--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="precision-quotation__modal-header">
              <h4>
                <FiPrinter /> Mẫu In Báo Giá Thương Mại
              </h4>
              <button className="close-btn" onClick={onClosePrint}>
                <FiX />
              </button>
            </div>

            <div className="precision-quotation__modal-body">
              <div ref={printRef} style={{ background: "#ffffff", padding: 16, borderRadius: 4, minHeight: 400 }}>
                <QuotationForm QUOTATION_DATA={printData} />
              </div>
            </div>

            <div className="precision-quotation__modal-footer">
              <button className="precision-quotation__btn precision-quotation__btn--outline" onClick={onClosePrint}>
                Đóng
              </button>
              <button className="precision-quotation__btn precision-quotation__btn--purple" onClick={onTriggerPrint}>
                <FiPrinter /> In Văn Bản
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(PrecisionPriceModals);
