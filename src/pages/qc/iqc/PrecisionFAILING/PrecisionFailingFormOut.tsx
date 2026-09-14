import React from "react";

interface PrecisionFailingFormOutProps {
  planId: string;
  setPlanId: (v: string) => void;
  g_name: string;
  request_empl: string;
  setrequest_empl: (v: string) => void;
  request_empl2: string;
  setrequest_empl2: (v: string) => void;
  empl_name: string;
  empl_name2: string;
  remark: string;
  setReMark: (v: string) => void;
  checkPlanID: (id: string) => void;
  checkEMPL_NAME: (sel: number, no: string) => void;
}

export const PrecisionFailingFormOut: React.FC<PrecisionFailingFormOutProps> = ({
  planId,
  setPlanId,
  g_name,
  request_empl,
  setrequest_empl,
  request_empl2,
  setrequest_empl2,
  empl_name,
  empl_name2,
  remark,
  setReMark,
  checkPlanID,
  checkEMPL_NAME,
}) => {
  return (
    <>
      <div className="form-section-title">
        <span>OUTPUT LIỆU QC FAIL</span>
        <span className="sub-badge">Xuất Vào CT</span>
      </div>

      <div className="form-group">
        <label>Số CT Xuất Mới</label>
        <input
          type="text"
          className="input-control input-control--mono input-control--bold text-amber-700"
          placeholder="1F80008A..."
          value={planId}
          onChange={(e) => {
            const val = e.target.value;
            setPlanId(val);
            if (val.length >= 7) checkPlanID(val);
          }}
        />
        {g_name && <div className="detected-pill">{g_name}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ng. Giao</label>
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
          <label>Ng. Nhận</label>
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
        <label>Ghi Chú Xuất</label>
        <input
          type="text"
          className="input-control"
          placeholder="Lý do xuất, chỉ thị..."
          value={remark}
          onChange={(e) => setReMark(e.target.value)}
        />
      </div>
    </>
  );
};
