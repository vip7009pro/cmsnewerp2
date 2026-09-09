import React from "react";
import CustomDialog from "../../../../components/Dialog/CustomDialog";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { Button } from "@mui/material";

interface PrecisionUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: EmployeeTableData;
  setCustInfo: (keyname: string, value: any) => void;
  workpositionload: Array<any>;
  onClear: () => void;
  onAdd: () => void;
  onUpdate: () => void;
  onTrainFace: () => void;
  onCheckFace: () => void;
  isLoading?: boolean;
}

export const PrecisionUserModal: React.FC<PrecisionUserModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  setCustInfo,
  workpositionload,
  onClear,
  onAdd,
  onUpdate,
  onTrainFace,
  onCheckFace,
  isLoading,
}) => {
  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Add/Update Employee (EMPL_NO: ${selectedUser.EMPL_NO || "Mới"})`}
      content={
        <div className="precision-usermanager__modalForm">
          {/* CỘT 1: THÔNG TIN ĐỊNH DANH */}
          <div className="precision-usermanager__formSection">
            <span className="precision-usermanager__sectionTitle">
              1. Thông Tin Định Danh
            </span>
            <div className="precision-usermanager__formGroup">
              <label>Mã ERP (EMPL_NO):</label>
              <input
                type="text"
                value={selectedUser.EMPL_NO}
                onChange={(e) => setCustInfo("EMPL_NO", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Mã Nhân Sự (CMS_ID):</label>
              <input
                type="text"
                value={selectedUser.CMS_ID}
                onChange={(e) => setCustInfo("CMS_ID", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Mã Chấm Công (NV_CCID):</label>
              <input
                type="number"
                value={selectedUser.NV_CCID}
                onChange={(e) => setCustInfo("NV_CCID", Number(e.target.value))}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Tên (FIRST_NAME):</label>
              <input
                type="text"
                value={selectedUser.FIRST_NAME}
                onChange={(e) => setCustInfo("FIRST_NAME", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Họ và Đệm (MIDLAST_NAME):</label>
              <input
                type="text"
                value={selectedUser.MIDLAST_NAME}
                onChange={(e) => setCustInfo("MIDLAST_NAME", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Ngày Sinh (DOB):</label>
              <input
                type="date"
                value={selectedUser.DOB ? String(selectedUser.DOB).slice(0, 10) : ""}
                onChange={(e) => setCustInfo("DOB", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Quê Quán:</label>
              <input
                type="text"
                value={selectedUser.HOMETOWN}
                onChange={(e) => setCustInfo("HOMETOWN", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Giới Tính:</label>
              <select
                value={selectedUser.SEX_CODE}
                onChange={(e) => setCustInfo("SEX_CODE", Number(e.target.value))}
              >
                <option value={0}>Nữ</option>
                <option value={1}>Nam</option>
              </select>
            </div>
          </div>

          {/* CỘT 2: ĐỊA CHỈ & LIÊN HỆ */}
          <div className="precision-usermanager__formSection">
            <span className="precision-usermanager__sectionTitle">
              2. Địa Chỉ & Liên Hệ
            </span>
            <div className="precision-usermanager__formGroup">
              <label>Tỉnh / Thành Phố:</label>
              <input
                type="text"
                value={selectedUser.ADD_PROVINCE}
                onChange={(e) => setCustInfo("ADD_PROVINCE", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Quận / Huyện:</label>
              <input
                type="text"
                value={selectedUser.ADD_DISTRICT}
                onChange={(e) => setCustInfo("ADD_DISTRICT", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Xã / Thị Trấn:</label>
              <input
                type="text"
                value={selectedUser.ADD_COMMUNE}
                onChange={(e) => setCustInfo("ADD_COMMUNE", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Thôn / Xóm:</label>
              <input
                type="text"
                value={selectedUser.ADD_VILLAGE}
                onChange={(e) => setCustInfo("ADD_VILLAGE", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Số Điện Thoại:</label>
              <input
                type="text"
                value={selectedUser.PHONE_NUMBER}
                onChange={(e) => setCustInfo("PHONE_NUMBER", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Ngày Bắt Đầu Làm:</label>
              <input
                type="date"
                value={selectedUser.WORK_START_DATE ? String(selectedUser.WORK_START_DATE).slice(0, 10) : ""}
                onChange={(e) => setCustInfo("WORK_START_DATE", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Ngày Nghỉ Việc:</label>
              <input
                type="date"
                disabled={selectedUser.WORK_STATUS_CODE !== 0}
                value={selectedUser.RESIGN_DATE ? String(selectedUser.RESIGN_DATE).slice(0, 10) : ""}
                onChange={(e) => setCustInfo("RESIGN_DATE", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Password:</label>
              <input
                type="password"
                value={selectedUser.PASSWORD}
                onChange={(e) => setCustInfo("PASSWORD", e.target.value)}
              />
            </div>
          </div>

          {/* CỘT 3: VỊ TRÍ & PHÂN CÔNG */}
          <div className="precision-usermanager__formSection">
            <span className="precision-usermanager__sectionTitle">
              3. Vị Trí & Phân Công
            </span>
            <div className="precision-usermanager__formGroup">
              <label>Email:</label>
              <input
                type="text"
                value={selectedUser.EMAIL}
                onChange={(e) => setCustInfo("EMAIL", e.target.value)}
              />
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Vị Trí Công Đoạn:</label>
              <select
                value={selectedUser.WORK_POSITION_CODE}
                onChange={(e) => setCustInfo("WORK_POSITION_CODE", Number(e.target.value))}
              >
                {workpositionload.map((element, index) => (
                  <option key={index} value={element.WORK_POSITION_CODE}>
                    {element.WORK_POSITION_NAME}
                  </option>
                ))}
              </select>
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Ca Làm Việc:</label>
              <select
                value={selectedUser.WORK_SHIFT_CODE}
                onChange={(e) => setCustInfo("WORK_SHIFT_CODE", Number(e.target.value))}
              >
                <option value={0}>Hành chính</option>
                <option value={1}>TEAM 1</option>
                <option value={2}>TEAM 2</option>
              </select>
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Cấp Bậc (Chức Danh):</label>
              <select
                value={selectedUser.POSITION_CODE}
                onChange={(e) => setCustInfo("POSITION_CODE", Number(e.target.value))}
              >
                <option value={0}>Manager</option>
                <option value={1}>AM</option>
                <option value={2}>Senior</option>
                <option value={3}>Staff</option>
                <option value={4}>No Pos</option>
              </select>
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Chức Vụ:</label>
              <select
                value={selectedUser.JOB_CODE}
                onChange={(e) => setCustInfo("JOB_CODE", Number(e.target.value))}
              >
                <option value={1}>Dept Staff</option>
                <option value={2}>Leader</option>
                <option value={3}>Sub Leader</option>
                <option value={4}>Worker</option>
              </select>
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Nhà Máy:</label>
              <select
                value={selectedUser.FACTORY_CODE}
                onChange={(e) => setCustInfo("FACTORY_CODE", Number(e.target.value))}
              >
                <option value={1}>Nhà máy 1</option>
                <option value={2}>Nhà máy 2</option>
              </select>
            </div>
            <div className="precision-usermanager__formGroup">
              <label>Trạng Thái:</label>
              <select
                value={selectedUser.WORK_STATUS_CODE}
                onChange={(e) => setCustInfo("WORK_STATUS_CODE", Number(e.target.value))}
              >
                <option value={0}>Đã nghỉ</option>
                <option value={1}>Đang làm</option>
                <option value={2}>Nghỉ sinh</option>
              </select>
            </div>
          </div>
        </div>
      }
      actions={
        <div className="precision-usermanager__modalActions">
          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: "11px", borderColor: "#cbd5e1", color: "#475569" }}
            onClick={onClear}
          >
            Clear Form
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px", backgroundColor: "#2563eb" }}
            onClick={onAdd}
            disabled={isLoading}
          >
            + Thêm Mới
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px", backgroundColor: "#059669" }}
            onClick={onUpdate}
            disabled={isLoading}
          >
            Cập Nhật
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: "11px", borderColor: "#bfdbfe", color: "#2563eb" }}
            onClick={onTrainFace}
            disabled={isLoading}
          >
            Train Face
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: "11px", borderColor: "#a7f3d0", color: "#059669" }}
            onClick={onCheckFace}
            disabled={isLoading}
          >
            Check Face
          </Button>
        </div>
      }
    />
  );
};

export default PrecisionUserModal;
