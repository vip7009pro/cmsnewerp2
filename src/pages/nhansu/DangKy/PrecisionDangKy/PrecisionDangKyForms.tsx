import React from "react";
import PrecisionLeaveForm from "./PrecisionLeaveForm";
import PrecisionOtForm from "./PrecisionOtForm";
import PrecisionAttendanceForm from "./PrecisionAttendanceForm";

export type PortalTabType = "leave" | "ot" | "attendance";

interface PrecisionDangKyFormsProps {
  activeTab: PortalTabType;
  onChangeTab: (tab: PortalTabType) => void;
  onRegistrationSuccess?: () => void;
}

export const PrecisionDangKyForms: React.FC<PrecisionDangKyFormsProps> = ({
  activeTab,
  onChangeTab,
  onRegistrationSuccess,
}) => {
  return (
    <div className="precision-dangky__leftPanel">
      {/* SUB-TABS SELECTOR CONTROLLER */}
      <div className="precision-dangky__subtabs">
        <button
          type="button"
          className={`subtab-btn ${activeTab === "leave" ? "subtab-btn--active" : ""}`}
          onClick={() => onChangeTab("leave")}
        >
          <span className="material-symbols-outlined">calendar_add_on</span>
          <span>Nghỉ phép</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "ot" ? "subtab-btn--active" : ""}`}
          onClick={() => onChangeTab("ot")}
        >
          <span className="material-symbols-outlined">schedule</span>
          <span>Tăng ca (OT)</span>
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "attendance" ? "subtab-btn--active" : ""}`}
          onClick={() => onChangeTab("attendance")}
        >
          <span className="material-symbols-outlined">fingerprint</span>
          <span>Chấm công</span>
        </button>
      </div>

      {/* FORM CARD CONTAINER */}
      <div className="precision-dangky__formCard">
        {activeTab === "leave" && <PrecisionLeaveForm onSuccess={onRegistrationSuccess} />}
        {activeTab === "ot" && <PrecisionOtForm onSuccess={onRegistrationSuccess} />}
        {activeTab === "attendance" && <PrecisionAttendanceForm onSuccess={onRegistrationSuccess} />}
      </div>

      {/* HỘP GHI CHÚ QUY CHẾ DUYỆT TỰ ĐỘNG */}
      <div className="precision-dangky__noticeCard">
        <span className="material-symbols-outlined notice-icon">info</span>
        <div className="notice-content">
          <span className="notice-title">Quy chế phê duyệt tự động CMS Vina</span>
          <span className="notice-desc">
            Đơn nghỉ phép dưới 02 ngày cần duyệt bởi Quản lý/Leader trước 17:00 ngày hôm trước. Đơn tăng ca được chốt công tự động khi hệ thống quẹt thẻ khớp với giờ xin duyệt.
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDangKyForms);
