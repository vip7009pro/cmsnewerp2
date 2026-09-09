import React from "react";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { FiCreditCard } from "react-icons/fi";

interface Props {
  selectedUser: EmployeeTableData;
  setCustInfo: (keyname: string, value: any) => void;
}

export const PrecisionUserIdSection: React.FC<Props> = ({
  selectedUser,
  setCustInfo,
}) => {
  return (
    <div className="precision-user-modal__card">
      <div className="precision-user-modal__cardHeader">
        <span className="precision-user-modal__dot"></span>
        <span className="precision-user-modal__cardTitle">
          1. THÔNG TIN ĐỊNH DANH
        </span>
      </div>

      <div className="precision-user-modal__field">
        <label>
          Mã ERP (EMPL_NO) <span className="req">*</span>
        </label>
        <div className="precision-user-modal__inputWrapper">
          <FiCreditCard className="field-icon" size={14} />
          <input
            type="text"
            className="font-mono-val"
            value={selectedUser.EMPL_NO || ""}
            onChange={(e) => setCustInfo("EMPL_NO", e.target.value)}
            placeholder="VD: BQV1706"
          />
        </div>
      </div>

      <div className="precision-user-modal__field">
        <label>Mã Nhân Sự (CMS_ID)</label>
        <input
          type="text"
          className="font-mono-val"
          value={selectedUser.CMS_ID || ""}
          onChange={(e) => setCustInfo("CMS_ID", e.target.value)}
          placeholder="VD: CMS541"
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Mã Chấm Công (NV_CCID)</label>
        <input
          type="number"
          className="font-mono-val"
          value={selectedUser.NV_CCID || ""}
          onChange={(e) => setCustInfo("NV_CCID", Number(e.target.value))}
          placeholder="VD: 958"
        />
      </div>

      <div className="precision-user-modal__grid2Col">
        <div className="precision-user-modal__field">
          <label>Họ và Đệm (MIDLAST)</label>
          <input
            type="text"
            value={selectedUser.MIDLAST_NAME || ""}
            onChange={(e) => setCustInfo("MIDLAST_NAME", e.target.value)}
            placeholder="VD: Nguyễn Văn"
          />
        </div>
        <div className="precision-user-modal__field">
          <label>Tên (FIRST)</label>
          <input
            type="text"
            value={selectedUser.FIRST_NAME || ""}
            onChange={(e) => setCustInfo("FIRST_NAME", e.target.value)}
            placeholder="VD: A"
          />
        </div>
      </div>

      <div className="precision-user-modal__field">
        <label>Ngày Sinh (DOB)</label>
        <input
          type="date"
          value={selectedUser.DOB ? String(selectedUser.DOB).slice(0, 10) : ""}
          onChange={(e) => setCustInfo("DOB", e.target.value)}
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Quê Quán</label>
        <input
          type="text"
          value={selectedUser.HOMETOWN || ""}
          onChange={(e) => setCustInfo("HOMETOWN", e.target.value)}
          placeholder="Thôn - Xã - Huyện - Tỉnh"
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Giới Tính</label>
        <select
          value={selectedUser.SEX_CODE ?? 1}
          onChange={(e) => setCustInfo("SEX_CODE", Number(e.target.value))}
        >
          <option value={1}>Nam</option>
          <option value={0}>Nữ</option>
        </select>
      </div>
    </div>
  );
};

export default PrecisionUserIdSection;
