import React from "react";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { FiPhone, FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  selectedUser: EmployeeTableData;
  setCustInfo: (keyname: string, value: any) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const PrecisionUserContactSection: React.FC<Props> = ({
  selectedUser,
  setCustInfo,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div className="precision-user-modal__card">
      <div className="precision-user-modal__cardHeader">
        <span className="precision-user-modal__dot"></span>
        <span className="precision-user-modal__cardTitle">
          2. ĐỊA CHỈ & LIÊN HỆ
        </span>
      </div>

      <div className="precision-user-modal__field">
        <label>Tỉnh / Thành Phố</label>
        <input
          type="text"
          value={selectedUser.ADD_PROVINCE || ""}
          onChange={(e) => setCustInfo("ADD_PROVINCE", e.target.value)}
          placeholder="Hà Nội, Vĩnh Phúc..."
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Quận / Huyện</label>
        <input
          type="text"
          value={selectedUser.ADD_DISTRICT || ""}
          onChange={(e) => setCustInfo("ADD_DISTRICT", e.target.value)}
          placeholder="Mê Linh, Đông Anh..."
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Xã / Thị Trấn</label>
        <input
          type="text"
          value={selectedUser.ADD_COMMUNE || ""}
          onChange={(e) => setCustInfo("ADD_COMMUNE", e.target.value)}
          placeholder="Thanh Lâm, Quang Minh..."
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Thôn / Xóm</label>
        <input
          type="text"
          value={selectedUser.ADD_VILLAGE || ""}
          onChange={(e) => setCustInfo("ADD_VILLAGE", e.target.value)}
          placeholder="Yên Vinh, TDP 1..."
        />
      </div>

      <div className="precision-user-modal__field">
        <label>Số Điện Thoại</label>
        <div className="precision-user-modal__inputWrapper">
          <FiPhone className="field-icon" size={14} />
          <input
            type="tel"
            className="font-mono-val"
            value={selectedUser.PHONE_NUMBER || ""}
            onChange={(e) => setCustInfo("PHONE_NUMBER", e.target.value)}
            placeholder="0987xxxxxx"
          />
        </div>
      </div>

      <div className="precision-user-modal__grid2Col">
        <div className="precision-user-modal__field">
          <label>Ngày Bắt Đầu Làm</label>
          <input
            type="date"
            value={
              selectedUser.WORK_START_DATE
                ? String(selectedUser.WORK_START_DATE).slice(0, 10)
                : ""
            }
            onChange={(e) => setCustInfo("WORK_START_DATE", e.target.value)}
          />
        </div>
        <div className="precision-user-modal__field">
          <label>Ngày Nghỉ Việc</label>
          <input
            type="date"
            disabled={selectedUser.WORK_STATUS_CODE !== 0}
            value={
              selectedUser.RESIGN_DATE
                ? String(selectedUser.RESIGN_DATE).slice(0, 10)
                : ""
            }
            onChange={(e) => setCustInfo("RESIGN_DATE", e.target.value)}
          />
        </div>
      </div>

      <div className="precision-user-modal__field">
        <label>Mật Khẩu Đăng Nhập</label>
        <div className="precision-user-modal__inputWrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="font-mono-val"
            value={selectedUser.PASSWORD || ""}
            onChange={(e) => setCustInfo("PASSWORD", e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrecisionUserContactSection;
