// PrecisionDTCResultRecordSheet.tsx - Bottom Sheet "PHIẾU NHẬP KẾT QUẢ ĐO" cho Mobile (Zero-Blur)
// Chứa nguyên vẹn form nhập liệu (ID TEST / LOT NVL, Remark, nạp Excel XRF, hạng mục test)
// để giải phóng không gian cho bảng dữ liệu — giữ 100% state/handler của hook useDTCResultData.

import React from "react";
import {
  IoCloseOutline,
  IoSwapHorizontalOutline,
  IoSearchOutline,
  IoDocumentAttachOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { TestListTable } from "../../interfaces/qcInterface";
import PrecisionDTCResultPills from "./PrecisionDTCResultPills";

interface PrecisionDTCResultRecordSheetProps {
  isOpen: boolean;
  onClose: () => void;
  switchIDLOT: boolean;
  setSwitchIDLOT: (val: boolean) => void;
  dtc_id: string;
  setDTC_ID: (val: string) => void;
  remark: string;
  setRemark: (val: string) => void;
  uphangloat: boolean;
  setUpHangLoat: (val: boolean) => void;
  M_Name: string;
  M_Code: string;
  WidthCD: number | string;
  VendorLot: string;
  testList: TestListTable[];
  testname: string;
  onSelectTest: (code: string) => void;
  onReadUploadFile: (e: any) => void;
  onSaveResults: () => void;
  onSearch: () => void;
}

const PrecisionDTCResultRecordSheet: React.FC<PrecisionDTCResultRecordSheetProps> = ({
  isOpen,
  onClose,
  switchIDLOT,
  setSwitchIDLOT,
  dtc_id,
  setDTC_ID,
  remark,
  setRemark,
  uphangloat,
  setUpHangLoat,
  M_Name,
  M_Code,
  WidthCD,
  VendorLot,
  testList,
  testname,
  onSelectTest,
  onReadUploadFile,
  onSaveResults,
  onSearch,
}) => {
  // Parity: khối Excel XRF chỉ hiển thị khi hạng mục test đang chọn là XRF (TEST_CODE = 3).
  const isXRF = testname === "3";

  const handleSave = () => {
    // Đóng sheet trước để người dùng thấy ngay thông báo kết quả (Swal)
    onClose();
    onSaveResults();
  };

  const handleSearchAndClose = () => {
    onClose();
    onSearch();
  };

  if (!isOpen) return null;

  return (
    <div className="precision-dtcresult-drawer-overlay" onClick={onClose} role="presentation">
      <div
        className="precision-dtcresult-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Phiếu nhập kết quả đo ĐTC"
      >
        <div className="drawer-header">
          <span className="drawer-title">PHIẾU NHẬP KẾT QUẢ ĐO ĐTC</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng phiếu nhập"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* 1. Chế độ tra cứu: ID TEST vs LOT NVL */}
          <button
            type="button"
            className={`precision-dtcresult__switchPill precision-dtcresult__switchPill--sheet ${
              switchIDLOT ? "precision-dtcresult__switchPill--nvl" : ""
            }`}
            onClick={() => setSwitchIDLOT(!switchIDLOT)}
            title="Nhấp để chuyển đổi giữa ID TEST và LOT NVL"
          >
            <IoSwapHorizontalOutline size={15} />
            <span>{switchIDLOT ? "ĐANG TRA THEO: LOT NVL" : "ĐANG TRA THEO: ID TEST"}</span>
          </button>

          {/* 2. Ô nhập ID / LOT + nút tra cứu */}
          <div className="sheet-field">
            <label className="sheet-label" htmlFor="dtc-result-id-input">
              {switchIDLOT ? "Mã LOT NVL" : "Mã ID TEST"}
            </label>
            <div className="precision-dtcresult__inputBox precision-dtcresult__inputBox--sheet">
              <input
                id="dtc-result-id-input"
                type="text"
                inputMode="numeric"
                placeholder={switchIDLOT ? "202304190123" : "123456"}
                value={dtc_id}
                onChange={(e) => setDTC_ID(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
              />
              <button
                type="button"
                className="icon-action"
                onClick={handleSearchAndClose}
                title="Tra cứu thông tin kiểm tra"
              >
                <IoSearchOutline size={18} />
              </button>
            </div>
          </div>

          {/* 3. Thông tin vật liệu tra được (chỉ khi tra theo LOT NVL) */}
          {switchIDLOT && M_Name ? (
            <div className="sheet-context">
              <div className="context-line">
                <span className="context-label">Mã VL</span>
                <span className="context-value">{M_Code}</span>
              </div>
              <div className="context-line">
                <span className="context-label">Vật liệu</span>
                <span className="context-value">{M_Name}</span>
              </div>
              <div className="context-line">
                <span className="context-label">Quy cách</span>
                <span className="context-value">{WidthCD}</span>
              </div>
              {VendorLot && (
                <div className="context-line">
                  <span className="context-label">Lot NCC</span>
                  <span className="context-value context-value--vendor">{VendorLot}</span>
                </div>
              )}
            </div>
          ) : null}

          {/* 4. Ghi chú đợt đo */}
          <div className="sheet-field">
            <label className="sheet-label" htmlFor="dtc-result-remark-input">
              Remark (ghi chú đợt đo)
            </label>
            <input
              id="dtc-result-remark-input"
              className="sheet-input"
              type="text"
              placeholder="Ghi chú đợt đo..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          {/* 5. Công cụ Excel XRF (chỉ hiện khi hạng mục test là XRF) */}
          {isXRF && (
            <div className="sheet-excelTools">
              <label className="excel-upload-btn" title="Tải file Excel kết quả đo XRF">
                <IoDocumentAttachOutline size={16} />
                <span>Nạp file Excel</span>
                <input type="file" accept=".xlsx, .xls" onChange={onReadUploadFile} />
              </label>

              <label className="bulk-checkbox" title="Chế độ tải nhiều dòng kết quả liên tiếp">
                <input
                  type="checkbox"
                  checked={uphangloat}
                  onChange={(e) => setUpHangLoat(e.target.checked)}
                />
                <span>Up hàng loạt</span>
              </label>
            </div>
          )}

          {/* 6. Chọn hạng mục test (tái sử dụng nguyên component pills của desktop) */}
          <div className="sheet-pillsWrapper">
            <PrecisionDTCResultPills
              testList={testList}
              activeTestCode={testname}
              onSelectTest={onSelectTest}
            />
          </div>
        </div>

        {/* Footer neo đáy sheet: LƯU KẾT QUẢ ĐO */}
        <div className="drawer-footer">
          <button
            type="button"
            className="precision-dtcresult__btnSave precision-dtcresult__btnSave--sheet"
            onClick={handleSave}
            title="Lưu toàn bộ kết quả đo vào hệ thống CSDL"
          >
            <IoSaveOutline size={18} />
            <span>LƯU KẾT QUẢ ĐO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultRecordSheet);
