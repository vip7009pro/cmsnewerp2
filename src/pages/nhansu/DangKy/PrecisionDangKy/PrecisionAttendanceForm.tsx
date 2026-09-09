import React, { useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import Swal from "sweetalert2";
import moment from "moment";

interface PrecisionAttendanceFormProps {
  onSuccess?: () => void;
}

export const PrecisionAttendanceForm: React.FC<PrecisionAttendanceFormProps> = ({ onSuccess }) => {
  const [confirmDate, setConfirmDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [confirmType, setConfirmType] = useState<string>("GD");
  const [confirmWorktime, setConfirmWorktime] = useState<string>("0800-1700");
  const [confirmReason, setConfirmReason] = useState<string>("");

  const handleClearAttendance = () => {
    setConfirmDate(moment().format("YYYY-MM-DD"));
    setConfirmType("GD");
    setConfirmWorktime("");
    setConfirmReason("");
  };

  const handleSubmitAttendance = () => {
    if (!confirmWorktime) {
      Swal.fire(
        "Chú ý",
        "Vui lòng nhập khoảng thời gian cần xác nhận (ví dụ 0800-1700 hoặc 0800)!",
        "warning"
      );
      return;
    }

    const insertData = {
      confirm_worktime: confirmType + ":" + confirmWorktime,
      confirm_date: confirmDate,
    };

    generalQuery("xacnhanchamcongnhom", insertData)
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          const uData = getUserData();
          const newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Xác nhận chấm công",
            CONTENT: `${uData?.EMPL_NO ?? ""} (${uData?.MIDLAST_NAME ?? ""} ${uData?.FIRST_NAME ?? ""}), nhân viên ${uData?.WORK_POSITION_NAME ?? ""} đã đăng ký xác nhận chấm công ngày ${confirmDate}, thời gian ${confirmWorktime}.`,
            SUBDEPTNAME: uData?.SUBDEPTNAME ?? "",
            MAINDEPTNAME: uData?.MAINDEPTNAME ?? "",
            INS_EMPL: "NHU1903",
            INS_DATE: moment().format("YYYY-MM-DD"),
            UPD_EMPL: "NHU1903",
            UPD_DATE: moment().format("YYYY-MM-DD"),
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
          Swal.fire("Thành công", "Chúc mừng bạn, xác nhận chấm công thành công!", "success");
          onSuccess?.();
        } else {
          Swal.fire("Lỗi", "Xác nhận thất bại! " + (response.data.message || ""), "error");
        }
      })
      .catch((error) => {
        console.error("Lỗi xác nhận chấm công:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối máy chủ!", "error");
      });
  };

  return (
    <>
      <div className="form-title-row">
        <span className="form-title">
          <span className="dot-indicator" style={{ background: "#0284c7" }}></span>
          Giải Trình &amp; Xác Nhận Chấm Công
        </span>
        <span
          className="form-badge"
          style={{ background: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}
        >
          Tối đa 3 lần/tháng
        </span>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Kiểu xác nhận <span className="req">*</span></label>
          <select
            value={confirmType}
            onChange={(e) => setConfirmType(e.target.value)}
          >
            <option value="GD">Quên giờ vào (Check-in)</option>
            <option value="GS">Quên giờ về (Check-out)</option>
            <option value="CA">Quên cả giờ vào - giờ về</option>
          </select>
        </div>

        <div className="form-field">
          <label>Ngày xảy ra sự cố <span className="req">*</span></label>
          <input
            type="date"
            value={confirmDate}
            onChange={(e) => setConfirmDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label>Thời gian làm việc thực tế <span className="req">*</span></label>
        <input
          type="text"
          placeholder="Ví dụ: 0800-1700 hoặc 0800"
          value={confirmWorktime}
          onChange={(e) => setConfirmWorktime(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Lý do giải trình cụ thể</label>
        <textarea
          placeholder="Ghi rõ lý do quên quẹt thẻ hoặc sự cố máy quét..."
          value={confirmReason}
          onChange={(e) => setConfirmReason(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-clear"
          onClick={handleClearAttendance}
        >
          <span className="material-symbols-outlined">restart_alt</span>
          <span>Làm mới</span>
        </button>

        <button
          type="button"
          className="btn-submit"
          style={{ background: "#0284c7" }}
          onClick={handleSubmitAttendance}
        >
          <span className="material-symbols-outlined">send</span>
          <span>Gửi xác nhận công</span>
        </button>
      </div>
    </>
  );
};

export default React.memo(PrecisionAttendanceForm);
