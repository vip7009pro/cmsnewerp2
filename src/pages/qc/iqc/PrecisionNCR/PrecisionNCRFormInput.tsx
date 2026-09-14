import React from "react";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";

interface PrecisionNCRFormInputProps {
  cmsLot: string;
  setCmsLot: (val: string) => void;
  vendorLot: string;
  setVendorLot: (val: string) => void;
  m_name: string;
  width_cd: number;
  ncr_date: string;
  setNCR_DATE: (val: string) => void;
  response_date: string;
  setRESPONSE_DATE: (val: string) => void;
  defect_title: string;
  setDefect_Title: (val: string) => void;
  defect_detail: string;
  setDefect_Detail: (val: string) => void;
  iqc_empl: string;
  setIQC_Empl: (val: string) => void;
  empl_name: string;
  remark: string;
  setReMark: (val: string) => void;
  checkLotNVL: (lot: string) => void;
  checkEMPL_NAME: (empl: string) => void;
  onAddRow: () => void;
  onSaveData: () => void;
}

export const PrecisionNCRFormInput: React.FC<PrecisionNCRFormInputProps> = ({
  cmsLot,
  setCmsLot,
  vendorLot,
  setVendorLot,
  m_name,
  width_cd,
  ncr_date,
  setNCR_DATE,
  response_date,
  setRESPONSE_DATE,
  defect_title,
  setDefect_Title,
  defect_detail,
  setDefect_Detail,
  iqc_empl,
  setIQC_Empl,
  empl_name,
  remark,
  setReMark,
  checkLotNVL,
  checkEMPL_NAME,
  onAddRow,
  onSaveData,
}) => {
  return (
    <>
      {/* LOT NVL ERP */}
      <div className="form-group">
        <label>
          <span>LOT NVL ERP:</span>
          {m_name && (
            <span className="badge-lookup">
              {m_name.slice(0, 14)} | {width_cd}
            </span>
          )}
        </label>
        <input
          type="text"
          className="font-mono"
          placeholder="2304190123"
          value={cmsLot}
          onChange={(e) => {
            const val = e.target.value;
            setCmsLot(val);
            if (val.length >= 7) {
              checkLotNVL(val);
            }
          }}
        />
      </div>

      {/* VENDOR LOT */}
      <div className="form-group">
        <label>VENDOR LOT:</label>
        <input
          type="text"
          className="font-mono"
          placeholder="abcdxyz123"
          value={vendorLot}
          onChange={(e) => setVendorLot(e.target.value)}
        />
      </div>

      {/* NCR DATE & RESPONSE DATE */}
      <div className="form-group">
        <label>NGÀY PHÁT HIỆN (NCR DATE):</label>
        <input
          type="date"
          className="font-mono"
          value={ncr_date}
          onChange={(e) => setNCR_DATE(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>HẠN PHẢN HỒI (REQ DATE):</label>
        <input
          type="date"
          className="font-mono"
          value={response_date}
          onChange={(e) => setRESPONSE_DATE(e.target.value)}
        />
      </div>

      {/* DEFECT TITLE */}
      <div className="form-group">
        <label>TIÊU ĐỀ LỖI (DEFECT TITLE):</label>
        <input
          type="text"
          placeholder="Ví dụ: Bong keo, xước cuộn..."
          value={defect_title}
          onChange={(e) => setDefect_Title(e.target.value)}
        />
      </div>

      {/* DEFECT DETAIL */}
      <div className="form-group">
        <label>CHI TIẾT LỖI (DEFECT DETAIL):</label>
        <textarea
          placeholder="Mô tả cụ thể vị trí và tình trạng..."
          value={defect_detail}
          onChange={(e) => setDefect_Detail(e.target.value)}
        />
      </div>

      {/* MÃ IQC & TÊN NV */}
      <div className="form-group">
        <label>
          <span>MÃ NHÂN VIÊN IQC:</span>
          {empl_name && <span className="badge-lookup">{empl_name}</span>}
        </label>
        <input
          type="text"
          className="font-mono"
          placeholder="NHU1903"
          value={iqc_empl}
          onChange={(e) => {
            const val = e.target.value;
            setIQC_Empl(val);
            if (val.length >= 7) {
              checkEMPL_NAME(val);
            }
          }}
        />
      </div>

      {/* REMARK */}
      <div className="form-group">
        <label>GHI CHÚ (REMARK):</label>
        <input
          type="text"
          placeholder="Ghi chú thêm..."
          value={remark}
          onChange={(e) => setReMark(e.target.value)}
        />
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button
          className="btn-submit"
          style={{ flex: 1, background: "var(--pn-purple)" }}
          onClick={onAddRow}
          title="Thêm dòng vào bảng tạm"
        >
          <AiOutlinePlus />
          <span>+ ADD DÒNG</span>
        </button>
        <button
          className="btn-submit"
          style={{ flex: 1, background: "var(--pn-success)" }}
          onClick={onSaveData}
          title="Lưu tất cả dòng vào CSDL"
        >
          <AiOutlineSave />
          <span>LƯU NCR</span>
        </button>
      </div>
    </>
  );
};
