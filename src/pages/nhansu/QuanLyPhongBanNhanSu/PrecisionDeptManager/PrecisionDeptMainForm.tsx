import React from "react";
import { MainDeptTableData } from "../../interfaces/nhansuInterface";
import { FiHash, FiLock } from "react-icons/fi";

interface Props {
  selectedMainDept: MainDeptTableData;
  setMainDeptInfo: (keyname: string, value: any) => void;
}

export const PrecisionDeptMainForm: React.FC<Props> = ({
  selectedMainDept,
  setMainDeptInfo,
}) => {
  return (
    <>
      {/* Mã Bộ Phận (MAINDEPTCODE) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Mã Bộ Phận <span className="field-var">(maindeptcode)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--pk">
            Khóa Chính PK
          </span>
        </div>
        <div className="precision-dept-modal__inputWrapper">
          <FiHash className="left-icon" size={14} />
          <input
            type="number"
            className="font-mono-code"
            value={selectedMainDept.MAINDEPTCODE || ""}
            onChange={(e) =>
              setMainDeptInfo("MAINDEPTCODE", Number(e.target.value))
            }
            readOnly
            title="Khóa tự tăng / Không chỉnh sửa trực tiếp"
          />
          <FiLock className="right-icon" size={14} />
        </div>
      </div>

      {/* Tên Bộ Phận (MAINDEPTNAME) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Bộ Phận <span className="field-var">(maindeptname)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--intl">
            Tiêu Chuẩn Quốc Tế
          </span>
        </div>
        <input
          type="text"
          value={selectedMainDept.MAINDEPTNAME || ""}
          onChange={(e) => setMainDeptInfo("MAINDEPTNAME", e.target.value)}
          placeholder="Ví dụ: INSPECTION, PRODUCTION, QUALITY..."
        />
      </div>

      {/* Tên Tiếng Hàn (MAINDEPTNAME_KR) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Tiếng Hàn <span className="field-var">(maindeptname_kr)</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--kr">
            한국어 표기
          </span>
        </div>
        <input
          type="text"
          value={selectedMainDept.MAINDEPTNAME_KR || ""}
          onChange={(e) => setMainDeptInfo("MAINDEPTNAME_KR", e.target.value)}
          placeholder="한국어 부서명 입력 (예: 검사)"
        />
      </div>

      {/* Thông tin trạng thái */}
      <div className="precision-dept-modal__infoCard">
        <div className="info-left">
          <span className="dot-active"></span>
          <div>
            <span className="info-title">Trạng Thái Bộ Phận</span>
            <div className="info-desc">Cho phép các phòng ban con kế thừa</div>
          </div>
        </div>
        <span className="info-badge">Active</span>
      </div>
    </>
  );
};

export default PrecisionDeptMainForm;
