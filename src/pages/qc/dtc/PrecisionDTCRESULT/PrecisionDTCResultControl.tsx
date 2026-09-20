import React from "react";
import {
  IoSwapHorizontalOutline,
  IoSaveOutline,
  IoDocumentAttachOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { TestListTable } from "../../interfaces/qcInterface";
import PrecisionDTCResultPills from "./PrecisionDTCResultPills";

interface PrecisionDTCResultControlProps {
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
  Cust_Cd: string;
  VendorLot: string;
  testList: TestListTable[];
  testname: string;
  testcode_tenthat: string;
  onSelectTest: (code: string) => void;
  onReadUploadFile: (e: any) => void;
  onSaveResults: () => void;
  onSearch: () => void;
}

const PrecisionDTCResultControl: React.FC<PrecisionDTCResultControlProps> = ({
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
  testcode_tenthat,
  onSelectTest,
  onReadUploadFile,
  onSaveResults,
  onSearch,
}) => {
  // Parity backup: khối Excel XRF chỉ hiển thị khi hạng mục test đang chọn là XRF (TEST_CODE = 3).
  // Không dùng `testcode_tenthat === "XRF"` vì state này mặc định "XRF" từ đầu.
  const isXRF = testname === "3";

  return (
    <div className="precision-dtcresult__controlCard">
      {/* Top Row: Input, Metadata Pill, Remark, Excel, and Save Action */}
      <div className="precision-dtcresult__controlRow">
        <div className="precision-dtcresult__controlLeft">
          {/* Switch ID TEST vs LOT NVL */}
          <button
            type="button"
            className={`precision-dtcresult__switchPill ${
              switchIDLOT ? "precision-dtcresult__switchPill--nvl" : ""
            }`}
            onClick={() => setSwitchIDLOT(!switchIDLOT)}
            title="Nhấp để chuyển đổi giữa ID TEST và LOT NVL"
          >
            <IoSwapHorizontalOutline size={14} />
            <span>{switchIDLOT ? "LOT NVL:" : "ID TEST:"}</span>
          </button>

          {/* Input Box */}
          <div className="precision-dtcresult__inputBox">
            <input
              type="text"
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
              onClick={onSearch}
              title="Tra cứu thông tin kiểm tra"
            >
              <IoSearchOutline size={15} />
            </button>
          </div>

          {/* Product / Material Context Info Pill */}
          {switchIDLOT && M_Name ? (
            <div className="precision-dtcresult__contextPill">
              <span className="pill-label">Mã VL:</span>
              <span className="pill-val">{M_Code}</span>
              <span className="pill-divider">|</span>
              <span className="pill-label">Vật liệu:</span>
              <span className="pill-val">{M_Name}</span>
              <span className="pill-divider">|</span>
              <span className="pill-label">Quy cách:</span>
              <span className="pill-val">{WidthCD}</span>
              {VendorLot && (
                <>
                  <span className="pill-divider">|</span>
                  <span className="pill-label">Lot NCC:</span>
                  <span className="pill-val" style={{ color: "#7c3aed" }}>
                    {VendorLot}
                  </span>
                </>
              )}
            </div>
          ) : null}

          {/* Remark Input */}
          <div className="precision-dtcresult__remarkBox">
            <label htmlFor="dtc-remark-input">Remark:</label>
            <input
              id="dtc-remark-input"
              type="text"
              placeholder="Ghi chú đợt đo..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          {/* Excel Tools for XRF */}
          {isXRF && (
            <div className="precision-dtcresult__excelTools">
              <label className="excel-upload-btn" title="Tải file Excel kết quả đo XRF">
                <IoDocumentAttachOutline size={14} />
                <span>Nạp file Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={onReadUploadFile}
                />
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
        </div>

        {/* Main Save Action Button */}
        <button
          type="button"
          className="precision-dtcresult__btnSave"
          onClick={onSaveResults}
          title="Lưu toàn bộ kết quả đo vào hệ thống CSDL"
        >
          <IoSaveOutline size={16} />
          <span>LƯU KẾT QUẢ ĐO</span>
        </button>
      </div>

      {/* Bottom Row: Horizontal Test Category Pills */}
      <PrecisionDTCResultPills
        testList={testList}
        activeTestCode={testname}
        onSelectTest={onSelectTest}
      />
    </div>
  );
};

export default React.memo(PrecisionDTCResultControl);
