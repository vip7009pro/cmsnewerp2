import React from "react";
import {
  MainDeptTableData,
  SubDeptTableData,
} from "../../interfaces/nhansuInterface";
import { FiHash, FiLock } from "react-icons/fi";

interface Props {
  selectedSubDept: SubDeptTableData;
  setSubDeptInfo: (keyname: string, value: any) => void;
  mainDeptList?: Array<MainDeptTableData>;
  parentDeptName?: string;
}

export const PrecisionDeptSubForm: React.FC<Props> = ({
  selectedSubDept,
  setSubDeptInfo,
  mainDeptList = [],
  parentDeptName,
}) => {
  return (
    <>
      {/* Mã Bộ Phận Cha (MAINDEPTCODE) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Mã Bộ Phận Cha <span className="field-var">(maindeptcode)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--fk">
            Khóa Ngoại FK
          </span>
        </div>
        <select
          value={selectedSubDept.MAINDEPTCODE || ""}
          onChange={(e) =>
            setSubDeptInfo("MAINDEPTCODE", Number(e.target.value))
          }
        >
          {mainDeptList.length > 0 ? (
            mainDeptList.map((item, index) => (
              <option key={index} value={item.MAINDEPTCODE}>
                {item.MAINDEPTCODE} - {item.MAINDEPTNAME}{" "}
                {item.MAINDEPTNAME_KR ? `(${item.MAINDEPTNAME_KR})` : ""}
              </option>
            ))
          ) : (
            <option value={selectedSubDept.MAINDEPTCODE}>
              {selectedSubDept.MAINDEPTCODE} - {parentDeptName || "Bộ phận hiện tại"}
            </option>
          )}
        </select>
      </div>

      {/* Mã Phòng Ban Con (SUBDEPTCODE) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Mã Phòng Ban Con <span className="field-var">(subdeptcode)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--pk">
            Khóa Chính Sub
          </span>
        </div>
        <div className="precision-dept-modal__inputWrapper">
          <FiHash className="left-icon" size={14} />
          <input
            type="number"
            className="font-mono-code"
            value={selectedSubDept.SUBDEPTCODE || ""}
            onChange={(e) =>
              setSubDeptInfo("SUBDEPTCODE", Number(e.target.value))
            }
            readOnly
            title="Khóa tự tăng / Không chỉnh sửa trực tiếp"
          />
          <FiLock className="right-icon" size={14} />
        </div>
      </div>

      {/* Tên Phòng Ban (SUBDEPTNAME) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Phòng Ban <span className="field-var">(subdeptname)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--sub">
            Tên Ngắn Line
          </span>
        </div>
        <input
          type="text"
          value={selectedSubDept.SUBDEPTNAME || ""}
          onChange={(e) => setSubDeptInfo("SUBDEPTNAME", e.target.value)}
          placeholder="Ví dụ: KT1, KT2, QA-PQC..."
        />
      </div>

      {/* Tên Tiếng Hàn (SUBDEPTNAME_KR) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Tiếng Hàn <span className="field-var">(subdeptname_kr)</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--kr">
            한국어 부서
          </span>
        </div>
        <input
          type="text"
          value={selectedSubDept.SUBDEPTNAME_KR || ""}
          onChange={(e) => setSubDeptInfo("SUBDEPTNAME_KR", e.target.value)}
          placeholder="한국어 입력 (예: 검사 (KT))"
        />
      </div>

      {/* Thông tin phụ trách */}
      <div className="precision-dept-modal__infoCard">
        <div className="info-left">
          <span className="dot-active"></span>
          <div>
            <span className="info-title">Thuộc Khối Quản Lý</span>
            <div className="info-desc">
              Trực thuộc: {parentDeptName || "Bộ phận chính đã chọn"}
            </div>
          </div>
        </div>
        <span className="info-badge">Active</span>
      </div>
    </>
  );
};

export default PrecisionDeptSubForm;
