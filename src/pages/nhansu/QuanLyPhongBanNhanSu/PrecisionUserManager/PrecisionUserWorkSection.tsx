import React from "react";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { FiMail } from "react-icons/fi";

interface Props {
  selectedUser: EmployeeTableData;
  setCustInfo: (keyname: string, value: any) => void;
  workpositionload: Array<any>;
}

export const PrecisionUserWorkSection: React.FC<Props> = ({
  selectedUser,
  setCustInfo,
  workpositionload,
}) => {
  return (
    <div className="precision-user-modal__card">
      <div className="precision-user-modal__cardHeader">
        <span className="precision-user-modal__dot"></span>
        <span className="precision-user-modal__cardTitle">
          3. VỊ TRÍ & PHÂN CÔNG
        </span>
      </div>

      <div className="precision-user-modal__field">
        <label>Email Công Ty</label>
        <div className="precision-user-modal__inputWrapper">
          <FiMail className="field-icon" size={14} />
          <input
            type="email"
            value={selectedUser.EMAIL || ""}
            onChange={(e) => setCustInfo("EMAIL", e.target.value)}
            placeholder="email@cmsvina.com"
          />
        </div>
      </div>

      <div className="precision-user-modal__field">
        <label>Vị Trí Công Đoạn</label>
        <select
          value={selectedUser.WORK_POSITION_CODE ?? 1}
          onChange={(e) =>
            setCustInfo("WORK_POSITION_CODE", Number(e.target.value))
          }
        >
          {workpositionload.map((element, index) => (
            <option key={index} value={element.WORK_POSITION_CODE}>
              {element.WORK_POSITION_NAME}
            </option>
          ))}
        </select>
      </div>

      <div className="precision-user-modal__field">
        <label>Ca Làm Việc</label>
        <select
          value={selectedUser.WORK_SHIFT_CODE ?? 0}
          onChange={(e) =>
            setCustInfo("WORK_SHIFT_CODE", Number(e.target.value))
          }
        >
          <option value={0}>Hành chính (08:00 - 17:00)</option>
          <option value={1}>TEAM 1 (Ca ngày / đêm)</option>
          <option value={2}>TEAM 2 (Ca kíp)</option>
        </select>
      </div>

      <div className="precision-user-modal__field">
        <label>Cấp Bậc (Chức Danh)</label>
        <select
          value={selectedUser.POSITION_CODE ?? 3}
          onChange={(e) =>
            setCustInfo("POSITION_CODE", Number(e.target.value))
          }
        >
          <option value={0}>Manager</option>
          <option value={1}>AM</option>
          <option value={2}>Senior</option>
          <option value={3}>Staff</option>
          <option value={4}>No Pos</option>
        </select>
      </div>

      <div className="precision-user-modal__field">
        <label>Chức Vụ</label>
        <select
          value={selectedUser.JOB_CODE ?? 4}
          onChange={(e) => setCustInfo("JOB_CODE", Number(e.target.value))}
        >
          <option value={1}>Dept Staff</option>
          <option value={2}>Leader (Trưởng nhóm)</option>
          <option value={3}>Sub Leader (Phó nhóm)</option>
          <option value={4}>Worker (Công nhân)</option>
        </select>
      </div>

      <div className="precision-user-modal__field">
        <label>Nhà Máy Trực Thuộc</label>
        <select
          value={selectedUser.FACTORY_CODE ?? 1}
          onChange={(e) =>
            setCustInfo("FACTORY_CODE", Number(e.target.value))
          }
        >
          <option value={1}>Nhà máy 1 (KCN Quang Minh)</option>
          <option value={2}>Nhà máy 2</option>
        </select>
      </div>

      <div className="precision-user-modal__field">
        <label>Trạng Thái Làm Việc</label>
        <select
          value={selectedUser.WORK_STATUS_CODE ?? 1}
          onChange={(e) =>
            setCustInfo("WORK_STATUS_CODE", Number(e.target.value))
          }
        >
          <option value={1}>● Đang làm việc</option>
          <option value={0}>○ Đã nghỉ việc</option>
          <option value={2}>◐ Nghỉ sinh / Tạm hoãn</option>
        </select>
      </div>
    </div>
  );
};

export default PrecisionUserWorkSection;
