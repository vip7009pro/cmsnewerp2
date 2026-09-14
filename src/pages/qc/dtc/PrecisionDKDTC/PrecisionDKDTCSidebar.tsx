import React from "react";
import {
  IoQrCodeOutline,
  IoCheckmarkCircleOutline,
  IoSwapHorizontalOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { BiScan } from "react-icons/bi";
import { TestListTable, CheckAddedSPECDATA } from "../../interfaces/qcInterface";
import PrecisionDKDTCChecklist from "./PrecisionDKDTCChecklist";

interface PrecisionDKDTCSidebarProps {
  checkNVL: boolean;
  setCheckNVL: (val: boolean) => void;
  testtype: string;
  setTestType: (val: string) => void;
  inputno: string;
  setInputNo: (val: string) => void;
  lotncc: string;
  setLotNCC: (val: string) => void;
  request_empl: string;
  setRequestEmpl: (val: string) => void;
  empl_name: string;
  g_name: string;
  m_name: string;
  testList: TestListTable[];
  addedSpec: CheckAddedSPECDATA[];
  showdkbs: boolean;
  setShowDKBS: (val: boolean) => void;
  oldDTC_ID: number;
  setOldDTC_ID: (val: number) => void;
  remark: string;
  setRemark: (val: string) => void;
  onOpenScanner: (target: "inputno" | "lotncc") => void;
  onToggleTestItem: (testCode: number) => void;
  onSelectAllTests: (select: boolean) => void;
  onRegister: () => void;
  checkEMPL_NAME: (val: string) => void;
}

const PrecisionDKDTCSidebar: React.FC<PrecisionDKDTCSidebarProps> = ({
  checkNVL,
  setCheckNVL,
  testtype,
  setTestType,
  inputno,
  setInputNo,
  lotncc,
  setLotNCC,
  request_empl,
  setRequestEmpl,
  empl_name,
  g_name,
  m_name,
  testList,
  addedSpec,
  showdkbs,
  setShowDKBS,
  oldDTC_ID,
  setOldDTC_ID,
  remark,
  setRemark,
  onOpenScanner,
  onToggleTestItem,
  onSelectAllTests,
  onRegister,
  checkEMPL_NAME,
}) => {
  return (
    <aside className="precision-dkdtc__sidebar">
      {/* Sidebar Header */}
      <div className="precision-dkdtc__sidebarHeader">
        <div className="precision-dkdtc__sidebarTitle">
          <IoShieldCheckmarkOutline className="icon" />
          <span>PHIẾU ĐĂNG KÝ TEST</span>
        </div>
        <span className="precision-dkdtc__sidebarBadge">
          {checkNVL ? "IQC • VẬT LIỆU" : "PQC/OQC • SP"}
        </span>
      </div>

      {/* Sidebar Body */}
      <div className="precision-dkdtc__sidebarBody">
        {/* Toggle Switch Chế Độ Kiểm Tra */}
        <div
          className={`precision-dkdtc__swapCard ${
            checkNVL ? "precision-dkdtc__swapCard--nvl" : ""
          }`}
          onClick={() => setCheckNVL(!checkNVL)}
          role="button"
          tabIndex={0}
          title="Nhấp để chuyển đổi giữa Sản phẩm và Nguyên vật liệu"
        >
          <div className="precision-dkdtc__swapInfo">
            <span className="precision-dkdtc__swapTitle">Đang kiểm tra:</span>
            <span className="precision-dkdtc__swapSubtitle">
              {checkNVL
                ? "Nguyên Vật Liệu (IQC)"
                : "Thành Phẩm / Bán TP (PQC/OQC)"}
            </span>
          </div>
          <button
            type="button"
            className="precision-dkdtc__swapBtn"
            onClick={(e) => {
              e.stopPropagation();
              setCheckNVL(!checkNVL);
            }}
          >
            <IoSwapHorizontalOutline size={14} />
            <span>{checkNVL ? "Sang Sản Phẩm" : "Sang NVL"}</span>
          </button>
        </div>

        {/* Phân loại Test */}
        <div className="precision-dkdtc__fieldGroup">
          <label className="precision-dkdtc__fieldLabel">
            <span>Phân loại test</span>
            <span className="req">*</span>
          </label>
          <select
            className="precision-dkdtc__select"
            value={testtype}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="3">MASS PRODUCTION (Sản xuất hàng loạt)</option>
            <option value="1">FIRST_LOT (Lô đầu tiên)</option>
            <option value="2">ECN (Thay đổi kỹ thuật)</option>
            <option value="4">SAMPLE (Mẫu thử nghiệm)</option>
          </select>
        </div>

        {/* Ô quét / Nhập Mã YCSX hoặc Lot NVL */}
        <div className="precision-dkdtc__fieldGroup">
          <label className="precision-dkdtc__fieldLabel">
            <span>{checkNVL ? "LOT NVL ERP" : "MÃ YCSX / LABEL_ID"}</span>
            <span className="req">*</span>
          </label>
          <div className="precision-dkdtc__inputWrapper">
            <input
              type="text"
              className="precision-dkdtc__input precision-dkdtc__input--mono precision-dkdtc__input--withAction"
              placeholder={checkNVL ? "VD: 202304190123" : "VD: 1F80008 hoặc 13AB19S5"}
              value={inputno}
              onChange={(e) => setInputNo(e.target.value)}
            />
            <button
              type="button"
              className="precision-dkdtc__inputAction"
              onClick={() => onOpenScanner("inputno")}
              title="Quét mã vạch / QR Code bằng Camera"
            >
              <BiScan size={16} />
            </button>
          </div>
          {/* Kết quả tra cứu tên sản phẩm hoặc vật liệu */}
          {(checkNVL ? m_name : g_name) && (
            <div className="precision-dkdtc__fieldResult">
              {checkNVL ? m_name : g_name}
            </div>
          )}
        </div>

        {/* Ô nhập Lot NCC (chỉ hiện khi checkNVL === true) */}
        {checkNVL && (
          <div className="precision-dkdtc__fieldGroup">
            <label className="precision-dkdtc__fieldLabel">
              <span>LOT NHÀ CUNG CẤP</span>
            </label>
            <div className="precision-dkdtc__inputWrapper">
              <input
                type="text"
                className="precision-dkdtc__input precision-dkdtc__input--mono precision-dkdtc__input--withAction"
                placeholder="VD: LOT-VENDOR-12345"
                value={lotncc}
                onChange={(e) => setLotNCC(e.target.value)}
              />
              <button
                type="button"
                className="precision-dkdtc__inputAction"
                onClick={() => onOpenScanner("lotncc")}
                title="Quét mã LOT NCC bằng Camera"
              >
                <BiScan size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mã nhân viên yêu cầu test */}
        <div className="precision-dkdtc__fieldGroup">
          <label className="precision-dkdtc__fieldLabel">
            <span>NV yêu cầu test</span>
            <span className="req">*</span>
          </label>
          <input
            type="text"
            className="precision-dkdtc__input precision-dkdtc__input--mono"
            placeholder="Mã NV (VD: NHU1903)"
            value={request_empl}
            onChange={(e) => {
              setRequestEmpl(e.target.value);
              if (e.target.value.length >= 7) {
                checkEMPL_NAME(e.target.value);
              }
            }}
          />
          {empl_name && (
            <div className="precision-dkdtc__fieldResult precision-dkdtc__fieldResult--success">
              {empl_name}
            </div>
          )}
        </div>

        {/* Danh sách Hạng Mục Test Checklist */}
        <PrecisionDKDTCChecklist
          testList={testList}
          addedSpec={addedSpec}
          checkNVL={checkNVL}
          onToggleTestItem={onToggleTestItem}
          onSelectAllTests={onSelectAllTests}
        />

        {/* Đăng ký bổ sung */}
        <div className="precision-dkdtc__fieldGroup">
          <label className="precision-dkdtc__checkboxLabel">
            <input
              type="checkbox"
              checked={showdkbs}
              onChange={() => setShowDKBS(!showdkbs)}
            />
            <span>Đăng ký bổ sung cho ID Test cũ</span>
          </label>

          {showdkbs && (
            <div className="precision-dkdtc__inputWrapper" style={{ marginTop: "4px" }}>
              <input
                type="number"
                className="precision-dkdtc__input precision-dkdtc__input--mono"
                placeholder="Nhập ID Test đã có (DTC_ID)"
                value={oldDTC_ID === -1 ? "" : oldDTC_ID}
                onChange={(e) => setOldDTC_ID(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div className="precision-dkdtc__fieldGroup">
          <label className="precision-dkdtc__fieldLabel">
            <span>Ghi chú thêm</span>
          </label>
          <input
            type="text"
            className="precision-dkdtc__input"
            placeholder="Ghi chú nội bộ, lưu ý mẫu..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Footer: Nút Đăng Ký Test */}
      <div className="precision-dkdtc__sidebarFooter">
        <button
          type="button"
          className="precision-dkdtc__btnSubmit"
          onClick={onRegister}
          title="Bấm để tạo ID và ghi nhận danh mục test ĐTC"
        >
          <IoCheckmarkCircleOutline size={17} />
          <span>ĐĂNG KÝ TEST ĐTC</span>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(PrecisionDKDTCSidebar);
