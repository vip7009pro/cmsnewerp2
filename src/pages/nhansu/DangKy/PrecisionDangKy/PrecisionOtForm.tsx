import React, { useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import Swal from "sweetalert2";
import moment from "moment";

interface PrecisionOtFormProps {
  onSuccess?: () => void;
}

export const PrecisionOtForm: React.FC<PrecisionOtFormProps> = ({ onSuccess }) => {
  const [otDate, setOtDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState<string>("1700");
  const [finishTime, setFinishTime] = useState<string>("2000");
  const [otReason, setOtReason] = useState<string>("");

  // Tính số giờ OT dự kiến
  const calcOtHours = (): string => {
    try {
      const sH = parseInt(startTime.slice(0, 2), 10) || 0;
      const sM = parseInt(startTime.slice(2, 4), 10) || 0;
      const fH = parseInt(finishTime.slice(0, 2), 10) || 0;
      const fM = parseInt(finishTime.slice(2, 4), 10) || 0;
      let diffMinutes = fH * 60 + fM - (sH * 60 + sM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      return (diffMinutes / 60).toFixed(1);
    } catch {
      return "0.0";
    }
  };

  const handleClearOt = () => {
    setOtDate(moment().format("YYYY-MM-DD"));
    setStartTime("");
    setFinishTime("");
    setOtReason("");
  };

  const handleSubmitOt = () => {
    if (!startTime || !finishTime) {
      Swal.fire(
        "Chú ý",
        "Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc (ví dụ 1700, 2000)!",
        "warning"
      );
      return;
    }

    const insertData = {
      over_start: startTime,
      over_finish: finishTime,
    };

    generalQuery("dangkytangcacanhan", insertData)
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          const uData = getUserData();
          const newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Đăng ký tăng ca",
            CONTENT: `${uData?.EMPL_NO ?? ""} (${uData?.MIDLAST_NAME ?? ""} ${uData?.FIRST_NAME ?? ""}), nhân viên ${uData?.WORK_POSITION_NAME ?? ""} đã đăng ký tăng ca từ ${startTime} tới ${finishTime}.`,
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
          Swal.fire("Thành công", "Chúc mừng bạn, đăng ký tăng ca thành công!", "success");
          onSuccess?.();
        } else {
          Swal.fire(
            "Thông báo",
            "Đăng ký tăng ca thất bại! Kiểm tra xem đã điểm danh chưa? " +
              (response.data.message || ""),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng ký tăng ca:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối máy chủ!", "error");
      });
  };

  return (
    <>
      <div className="form-title-row">
        <span className="form-title">
          <span className="dot-indicator" style={{ background: "#f59e0b" }}></span>
          Đăng Ký Tăng Ca Sản Xuất (OT)
        </span>
        <span
          className="form-badge"
          style={{ background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}
        >
          Định mức 4h/ngày
        </span>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Ngày tăng ca <span className="req">*</span></label>
          <input
            type="date"
            value={otDate}
            onChange={(e) => setOtDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Hệ số tính lương</label>
          <select defaultValue="150">
            <option value="150">Tăng ca ngày thường (150%)</option>
            <option value="200">Tăng ca ngày nghỉ tuần (200%)</option>
            <option value="210">Tăng ca ban đêm 22h-06h (210%)</option>
            <option value="300">Tăng ca ngày Lễ / Tết (300%)</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Giờ bắt đầu (HHmm) <span className="req">*</span></label>
          <input
            type="text"
            placeholder="1700"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Giờ kết thúc (HHmm) <span className="req">*</span></label>
          <input
            type="text"
            placeholder="2000"
            value={finishTime}
            onChange={(e) => setFinishTime(e.target.value)}
          />
        </div>
      </div>

      <div className="ot-summary-box">
        <span className="summary-text">
          <span className="material-symbols-outlined">timelapse</span>
          Thời lượng tăng ca dự kiến:
        </span>
        <span className="summary-badge">{calcOtHours()} giờ</span>
      </div>

      <div className="form-field">
        <label>Nội dung công việc tăng ca</label>
        <textarea
          placeholder="Ghi rõ nội dung công việc, line sản xuất hoặc mã PO..."
          value={otReason}
          onChange={(e) => setOtReason(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-clear"
          onClick={handleClearOt}
        >
          <span className="material-symbols-outlined">restart_alt</span>
          <span>Làm mới</span>
        </button>

        <button
          type="button"
          className="btn-submit"
          style={{ background: "#f59e0b" }}
          onClick={handleSubmitOt}
        >
          <span className="material-symbols-outlined">send</span>
          <span>Đăng ký tăng ca</span>
        </button>
      </div>
    </>
  );
};

export default React.memo(PrecisionOtForm);
