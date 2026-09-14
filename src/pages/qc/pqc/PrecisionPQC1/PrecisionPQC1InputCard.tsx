import React from "react";
import { FiSave, FiCheckSquare, FiUser, FiHash } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionPQC1InputCardProps {
  userData?: UserData;
  factory: string;
  setFactory: (val: string) => void;
  planId: string;
  setPlanId: (val: string) => void;
  lineqc_empl: string;
  setLineqc_empl: (val: string) => void;
  prod_leader_empl: string;
  setprod_leader_empl: (val: string) => void;
  remark: string;
  setReMark: (val: string) => void;
  empl_name: string;
  empl_name2: string;
  g_name: string;
  refArray: any[];
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  checkPlanID: (val: string) => void;
  checkDataSX: (val: string) => void;
  checkEMPL_NAME: (selection: number, val: string) => void;
  onSaveSetting: () => void;
  onUpdateSampleQty: () => void;
}

export const PrecisionPQC1InputCard: React.FC<PrecisionPQC1InputCardProps> = ({
  userData,
  factory,
  setFactory,
  planId,
  setPlanId,
  lineqc_empl,
  setLineqc_empl,
  prod_leader_empl,
  setprod_leader_empl,
  remark,
  setReMark,
  empl_name,
  empl_name2,
  g_name,
  refArray,
  handleKeyDown,
  checkPlanID,
  checkDataSX,
  checkEMPL_NAME,
  onSaveSetting,
  onUpdateSampleQty,
}) => {
  return (
    <div className="precision-pqc1-inputcard">
      <div className="precision-pqc1-inputcard__header">
        <span className="title">
          <span className="badge-setting">FORM NHẬP</span>
          Đăng Ký Cài Đặt Công Đoạn (PQC1 Setting)
        </span>
        <div className="emp-tags">
          {empl_name && (
            <span className="field-hint qc-name" title="Nhân viên QC phụ trách">
              <FiUser size={11} /> QC: {empl_name}
            </span>
          )}
          {empl_name2 && (
            <span className="field-hint leader-name" title="Leader sản xuất">
              <FiUser size={11} /> Leader: {empl_name2}
            </span>
          )}
        </div>
      </div>

      <div className="precision-pqc1-inputcard__grid">
        {/* 1. Nhà máy */}
        <div className="field-group" style={{ maxWidth: 110 }}>
          <label>Nhà máy <span className="req">*</span></label>
          <div className="input-wrapper">
            <select
              disabled={userData?.EMPL_NO === "NHU1903"}
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
            >
              <option value="NM1">Nhà Máy 1</option>
              <option value="NM2">Nhà Máy 2</option>
            </select>
          </div>
          <span className="field-hint">{factory}</span>
        </div>

        {/* 2. Số chỉ thị sản xuất (PLAN_ID) */}
        <div className="field-group">
          <label>Chỉ thị PLAN_ID <span className="req">*</span></label>
          <div className="input-wrapper">
            <input
              ref={refArray[0]}
              type="text"
              placeholder="Nhập hoặc quét mã..."
              value={planId}
              onKeyDown={(e) => handleKeyDown(e, 0)}
              onChange={(e) => {
                const val = e.target.value;
                setPlanId(val);
                if (val.length >= 8) {
                  checkPlanID(val);
                  checkDataSX(val);
                }
              }}
            />
            <span className="icon-end"><FiHash /></span>
          </div>
          <span className="field-hint" title={g_name || "Quét mã chỉ thị >= 8 ký tự"}>
            {g_name ? `SP: ${g_name}` : "Gõ >= 8 ký tự để tra"}
          </span>
        </div>

        {/* 3. Mã LINEQC */}
        <div className="field-group">
          <label>Mã LINEQC <span className="req">*</span></label>
          <div className="input-wrapper">
            <input
              ref={refArray[1]}
              type="text"
              placeholder="Mã thẻ QC..."
              value={lineqc_empl}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              onChange={(e) => {
                const val = e.target.value;
                setLineqc_empl(val);
                if (val.length >= 7) {
                  checkEMPL_NAME(1, val);
                }
              }}
            />
            <span className="icon-end"><FiUser /></span>
          </div>
          <span className={`field-hint ${empl_name ? "qc-name" : ""}`}>
            {empl_name || "Quét mã QC >= 7 ký tự"}
          </span>
        </div>

        {/* 4. Mã Leader SX */}
        <div className="field-group">
          <label>Mã Leader SX</label>
          <div className="input-wrapper">
            <input
              ref={refArray[2]}
              type="text"
              placeholder="Mã thẻ Leader..."
              value={prod_leader_empl}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onChange={(e) => {
                const val = e.target.value;
                setprod_leader_empl(val);
                if (val.length >= 7) {
                  checkEMPL_NAME(2, val);
                }
              }}
            />
            <span className="icon-end"><FiUser /></span>
          </div>
          <span className={`field-hint ${empl_name2 ? "leader-name" : ""}`}>
            {empl_name2 || "Quét mã Leader >= 7 ký tự"}
          </span>
        </div>
      </div>

      {/* Row 2: Remark & Buttons */}
      <div className="precision-pqc1-inputcard__grid" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        <div className="field-group">
          <label>Ghi chú (Remark)</label>
          <div className="input-wrapper">
            <input
              ref={refArray[3]}
              type="text"
              placeholder="Nhập ghi chú cài đặt công đoạn..."
              value={remark}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              onChange={(e) => setReMark(e.target.value)}
            />
          </div>
          <span className="field-hint">Ghi chú bổ sung khi setting</span>
        </div>

        <div className="precision-pqc1-inputcard__actions">
          <button
            ref={refArray[4]}
            type="button"
            className="btn-input"
            onClick={onSaveSetting}
            title="Lưu dữ liệu cài đặt công đoạn"
          >
            <FiSave size={13} /> Lưu Setting
          </button>

          <button
            type="button"
            className="btn-update-qty"
            onClick={onUpdateSampleQty}
            title="Cập nhật số lượng mẫu cho các dòng đã tích chọn trên bảng"
          >
            <FiCheckSquare size={13} /> Cập Nhật QTY
          </button>
        </div>
      </div>
    </div>
  );
};
