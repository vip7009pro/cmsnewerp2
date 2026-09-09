import React, { useState } from "react";
import { generalQuery, getSocket, getUserData } from "../../../../api/Api";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import Swal from "sweetalert2";
import moment from "moment";

interface PrecisionLeaveFormProps {
  onSuccess?: () => void;
}

export const PrecisionLeaveForm: React.FC<PrecisionLeaveFormProps> = ({ onSuccess }) => {
  const [canghi, setCanNghi] = useState<number>(1);
  const [fromdate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [nghitype, setNghiType] = useState<number>(1);
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [leaveDurationType, setLeaveDurationType] = useState<"full" | "morning" | "afternoon">("full");

  // Tính số ngày nghỉ dự kiến
  const calcLeaveDays = (): string => {
    if (leaveDurationType === "morning" || leaveDurationType === "afternoon") {
      return "0.5";
    }
    const mFrom = moment(fromdate);
    const mTo = moment(todate);
    const diff = mTo.diff(mFrom, "days") + 1;
    return (diff > 0 ? diff : 1).toFixed(1);
  };

  const handleClearLeave = () => {
    setCanNghi(1);
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setNghiType(1);
    setLeaveReason("");
    setLeaveDurationType("full");
  };

  const handleSubmitLeave = () => {
    const finalReasonCode = leaveDurationType !== "full" && nghitype === 1 ? 2 : nghitype;
    const insertData = {
      canghi: canghi,
      reason_code: finalReasonCode,
      remark_content: leaveReason,
      ngaybatdau: fromdate,
      ngayketthuc: todate,
    };

    generalQuery("dangkynghi2", insertData)
      .then(async (response) => {
        if (response.data.tk_status === "OK") {
          const uData = getUserData();
          const newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Đăng ký nghỉ",
            CONTENT: `${uData?.EMPL_NO ?? ""} (${uData?.MIDLAST_NAME ?? ""} ${uData?.FIRST_NAME ?? ""}), nhân viên ${uData?.WORK_POSITION_NAME ?? ""} đã đăng ký nghỉ từ ngày ${fromdate} tới ngày ${todate}.`,
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
          Swal.fire("Thành công", "Đăng ký nghỉ phép thành công!", "success");
          onSuccess?.();
        } else {
          Swal.fire("Lỗi", "Đăng ký nghỉ thất bại! " + (response.data.message || ""), "error");
        }
      })
      .catch((error) => {
        console.error("Lỗi đăng ký nghỉ:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi kết nối máy chủ!", "error");
      });
  };

  return (
    <>
      <div className="form-title-row">
        <span className="form-title">
          <span className="dot-indicator"></span>
          Biểu mẫu Đăng Ký Nghỉ Phép
        </span>
        <span className="form-badge">Hưởng nguyên lương</span>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Kiểu nghỉ <span className="req">*</span></label>
          <select
            value={nghitype}
            onChange={(e) => setNghiType(Number(e.target.value))}
          >
            <option value={1}>Phép năm (100% lương)</option>
            <option value={2}>Nửa phép</option>
            <option value={3}>Việc riêng</option>
            <option value={4}>Nghỉ ốm (BHXH)</option>
            <option value={5}>Chế độ</option>
            <option value={6}>Lý do khác</option>
          </select>
        </div>

        <div className="form-field">
          <label>Ca nghỉ phân bổ</label>
          <select
            value={canghi}
            onChange={(e) => setCanNghi(Number(e.target.value))}
          >
            <option value={1}>Ca 1 (Hành chính / Ca ngày)</option>
            <option value={2}>Ca 2 (Ca đêm)</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Từ ngày (From Date) <span className="req">*</span></label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Đến ngày (To Date) <span className="req">*</span></label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Radio thời lượng nghỉ */}
      <div className="duration-pills">
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="leave-duration"
              checked={leaveDurationType === "full"}
              onChange={() => setLeaveDurationType("full")}
            />
            <span>Cả ngày (8h)</span>
          </label>
          <label>
            <input
              type="radio"
              name="leave-duration"
              checked={leaveDurationType === "morning"}
              onChange={() => setLeaveDurationType("morning")}
            />
            <span>Nửa sáng (4h)</span>
          </label>
          <label>
            <input
              type="radio"
              name="leave-duration"
              checked={leaveDurationType === "afternoon"}
              onChange={() => setLeaveDurationType("afternoon")}
            />
            <span>Nửa chiều (4h)</span>
          </label>
        </div>

        <span className="calc-badge">{calcLeaveDays()} ngày</span>
      </div>

      <div className="form-field">
        <label>Lý do cụ thể <span className="req">*</span></label>
        <textarea
          placeholder="Ghi rõ lý do xin nghỉ và bàn giao công việc..."
          value={leaveReason}
          onChange={(e) => setLeaveReason(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-clear"
          onClick={handleClearLeave}
        >
          <span className="material-symbols-outlined">restart_alt</span>
          <span>Làm mới</span>
        </button>

        <button
          type="button"
          className="btn-submit"
          onClick={handleSubmitLeave}
        >
          <span className="material-symbols-outlined">send</span>
          <span>Gửi đăng ký duyệt</span>
        </button>
      </div>
    </>
  );
};

export default React.memo(PrecisionLeaveForm);
