import React from "react";
import {
  SubDeptTableData,
  WORK_POSITION_DATA,
} from "../../interfaces/nhansuInterface";

interface Props {
  selectedWorkPosition: WORK_POSITION_DATA;
  setWorkPositionInfo: (keyname: string, value: any) => void;
  subDeptList?: Array<SubDeptTableData>;
  parentSubDeptName?: string;
}

export const PrecisionDeptPosForm: React.FC<Props> = ({
  selectedWorkPosition,
  setWorkPositionInfo,
  subDeptList = [],
  parentSubDeptName,
}) => {
  return (
    <>
      {/* Mã Phòng Ban Cha (SUBDEPTCODE) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Mã Phòng Ban Cha <span className="field-var">(subdeptcode)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--fk">
            FK Cấp 2
          </span>
        </div>
        <select
          value={selectedWorkPosition.SUBDEPTCODE || ""}
          onChange={(e) =>
            setWorkPositionInfo("SUBDEPTCODE", Number(e.target.value))
          }
        >
          {subDeptList.length > 0 ? (
            subDeptList.map((item, index) => (
              <option key={index} value={item.SUBDEPTCODE}>
                {item.SUBDEPTCODE} - {item.SUBDEPTNAME}{" "}
                {item.SUBDEPTNAME_KR ? `(${item.SUBDEPTNAME_KR})` : ""}
              </option>
            ))
          ) : (
            <option value={selectedWorkPosition.SUBDEPTCODE}>
              {selectedWorkPosition.SUBDEPTCODE} - {parentSubDeptName || "Phòng ban hiện tại"}
            </option>
          )}
        </select>
      </div>

      {/* Grid 2 cột: Mã Vị Trí & Nhóm Chấm Công */}
      <div className="precision-dept-modal__grid2Col">
        <div className="precision-dept-modal__field">
          <div className="precision-dept-modal__fieldLabelRow">
            <label>
              Mã Vị Trí <span className="req">*</span>
            </label>
          </div>
          <input
            type="number"
            className="font-mono-code"
            value={selectedWorkPosition.WORK_POSITION_CODE || ""}
            onChange={(e) =>
              setWorkPositionInfo("WORK_POSITION_CODE", Number(e.target.value))
            }
            readOnly
            title="Khóa tự tăng / Không chỉnh sửa trực tiếp"
          />
        </div>

        <div className="precision-dept-modal__field">
          <div className="precision-dept-modal__fieldLabelRow">
            <label>Nhóm Chấm Công</label>
            <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--att">
              ATT_GRP
            </span>
          </div>
          <input
            type="number"
            className="font-mono-code"
            value={selectedWorkPosition.ATT_GROUP_CODE || ""}
            onChange={(e) =>
              setWorkPositionInfo("ATT_GROUP_CODE", Number(e.target.value))
            }
            placeholder="Mã máy chấm công"
          />
        </div>
      </div>

      {/* Tên Vị Trí (WORK_POSITION_NAME) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Vị Trí <span className="field-var">(work_position_name)</span>
            <span className="req">*</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--kr">
            {selectedWorkPosition.WORK_POSITION_NAME || "Vị trí"}
          </span>
        </div>
        <input
          type="text"
          value={selectedWorkPosition.WORK_POSITION_NAME || ""}
          onChange={(e) =>
            setWorkPositionInfo("WORK_POSITION_NAME", e.target.value)
          }
          placeholder="Ví dụ: KTXA1, LINE-A-LEADER..."
        />
      </div>

      {/* Tên Tiếng Hàn (WORK_POSITION_NAME_KR) */}
      <div className="precision-dept-modal__field">
        <div className="precision-dept-modal__fieldLabelRow">
          <label>
            Tên Tiếng Hàn <span className="field-var">(work_position_name_kr)</span>
          </label>
          <span className="precision-dept-modal__fieldBadge precision-dept-modal__fieldBadge--kr">
            한국어 직무
          </span>
        </div>
        <input
          type="text"
          value={selectedWorkPosition.WORK_POSITION_NAME_KR || ""}
          onChange={(e) =>
            setWorkPositionInfo("WORK_POSITION_NAME_KR", e.target.value)
          }
          placeholder="한국어 직무명 입력 (예: KT1)"
        />
      </div>

      {/* Thông tin loại chuyền */}
      <div className="precision-dept-modal__infoCard">
        <div className="info-left">
          <span className="dot-active"></span>
          <div>
            <span className="info-title">Vị Trí Công Đoạn</span>
            <div className="info-desc">
              Thuộc: {parentSubDeptName || "Phòng ban đã chọn"}
            </div>
          </div>
        </div>
        <span className="info-badge">Active</span>
      </div>
    </>
  );
};

export default PrecisionDeptPosForm;
