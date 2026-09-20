import React from "react";

interface PrecisionFailingFormInProps {
  testtype: string;
  setTestType: (v: string) => void;
  planId: string;
  setPlanId: (v: string) => void;
  g_name: string;
  m_lot_no: string;
  setM_LOT_NO: (v: string) => void;
  process_lot_no: string;
  setProcessLotNo: (v: string) => void;
  vendorLot: string;
  setVendorLot: (v: string) => void;
  m_name: string;
  defect_phenomenon: string;
  setDefectPhenomenon: (v: string) => void;
  request_empl: string;
  setrequest_empl: (v: string) => void;
  request_empl2: string;
  setrequest_empl2: (v: string) => void;
  empl_name: string;
  empl_name2: string;
  remark: string;
  setReMark: (v: string) => void;
  checkPlanID: (id: string) => void;
  checkPQC3_ID: (id: string) => void;
  checkLotNVL: (lot: string) => void;
  checkLotProcess: (lot: string) => void;
  checkEMPL_NAME: (sel: number, no: string) => void;
  onLotKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const PrecisionFailingFormIn: React.FC<PrecisionFailingFormInProps> = ({
  testtype,
  setTestType,
  planId,
  setPlanId,
  g_name,
  m_lot_no,
  setM_LOT_NO,
  process_lot_no,
  setProcessLotNo,
  vendorLot,
  setVendorLot,
  m_name,
  defect_phenomenon,
  setDefectPhenomenon,
  request_empl,
  setrequest_empl,
  request_empl2,
  setrequest_empl2,
  empl_name,
  empl_name2,
  remark,
  setReMark,
  checkPlanID,
  checkPQC3_ID,
  checkLotNVL,
  checkLotProcess,
  checkEMPL_NAME,
  onLotKeyDown,
}) => {
  return (
    <>
      <div className="form-group">
        <label>Phân Loại Hàng</label>
        <select
          className="input-control font-semibold"
          value={testtype}
          onChange={(e) => setTestType(e.target.value)}
        >
          <option value="NVL">Vật Liệu (NVL)</option>
          <option value="BTP">Bán Thành Phẩm (BTP)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Số Chỉ Thị SX</label>
        <input
          type="text"
          className="input-control input-control--mono input-control--bold"
          placeholder="1F80008A"
          value={planId}
          onChange={(e) => {
            const val = e.target.value;
            setPlanId(val);
            if (val.length >= 7) {
              checkPlanID(val);
              checkPQC3_ID(val);
            }
          }}
        />
        {g_name && <div className="detected-pill">{g_name}</div>}
      </div>

      <div className="form-group">
        <label>{testtype === "NVL" ? "LOT NVL" : "LOT SX"}</label>
        <input
          type="text"
          className="input-control input-control--mono input-control--bold text-emerald-700"
          placeholder={testtype === "NVL" ? "202304190123" : "1E75DC03"}
          value={testtype === "NVL" ? m_lot_no : process_lot_no}
          onKeyDown={onLotKeyDown}
          onChange={(e) => {
            const val = e.target.value;
            if (testtype === "NVL") {
              setM_LOT_NO(val);
              if (val.length >= 7) checkLotNVL(val);
            } else {
              setProcessLotNo(val);
              if (val.length >= 5) checkLotProcess(val);
            }
          }}
        />
        {m_name && <div className="detected-pill">{m_name}</div>}
      </div>

      <div className="form-group">
        <label>VENDOR LOT</label>
        <input
          type="text"
          className="input-control input-control--mono text-rose-600"
          placeholder="Vendor lot..."
          value={vendorLot}
          onChange={(e) => setVendorLot(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Hiện Tượng Lỗi (Defect)</label>
        <textarea
          className="input-control"
          placeholder="Nội dung hiện tượng lỗi..."
          value={defect_phenomenon}
          onChange={(e) => setDefectPhenomenon(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>NV Giao</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="Mã NV..."
            value={request_empl}
            onChange={(e) => {
              setrequest_empl(e.target.value);
              if (e.target.value.length >= 5) checkEMPL_NAME(1, e.target.value);
            }}
          />
          {empl_name && <div className="detected-pill text-[9px]">{empl_name}</div>}
        </div>

        <div className="form-group">
          <label>NV Nhận</label>
          <input
            type="text"
            className="input-control input-control--mono"
            placeholder="Mã NV..."
            value={request_empl2}
            onChange={(e) => {
              setrequest_empl2(e.target.value);
              if (e.target.value.length >= 5) checkEMPL_NAME(2, e.target.value);
            }}
          />
          {empl_name2 && <div className="detected-pill text-[9px]">{empl_name2}</div>}
        </div>
      </div>

      <div className="form-group">
        <label>Ghi Chú</label>
        <input
          type="text"
          className="input-control"
          placeholder="Ghi chú thêm..."
          value={remark}
          onChange={(e) => setReMark(e.target.value)}
        />
      </div>
    </>
  );
};
