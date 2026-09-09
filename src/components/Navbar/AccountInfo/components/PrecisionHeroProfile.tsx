import React, { useRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import getsentence from "../../../String/String";

interface PrecisionHeroProfileProps {
  userData?: UserData;
  onOpenChangePassword: () => void;
  onUploadAvatar: (file: File) => void;
}

export default function PrecisionHeroProfile({
  userData,
  onOpenChangePassword,
  onUploadAvatar,
}: PrecisionHeroProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );

  const fullName =
    [userData?.MIDLAST_NAME, userData?.FIRST_NAME].filter(Boolean).join(" ") ||
    userData?.EMPL_NO ||
    "NHÂN VIÊN CMS";

  const userInitials =
    userData?.FIRST_NAME?.slice(0, 1) ||
    userData?.MIDLAST_NAME?.slice(0, 1) ||
    "NV";

  // Calculate Seniority based on WORK_START_DATE
  const getSeniority = () => {
    if (!userData?.WORK_START_DATE) return "Chính thức";
    const start = moment(userData.WORK_START_DATE);
    if (!start.isValid()) return "Chính thức";
    const now = moment();
    const years = now.diff(start, "years");
    start.add(years, "years");
    const months = now.diff(start, "months");
    if (years === 0 && months === 0) return "< 1 tháng";
    if (years === 0) return `${months} tháng`;
    return months > 0 ? `${years} năm ${months} th` : `${years} năm`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadAvatar(file);
      e.target.value = "";
    }
  };

  return (
    <div className="precision-hub__card precision-hub__profileCard">
      <div className="precision-hub__profileWatermark" />

      <div className="precision-hub__profileHeader">
        {/* Avatar Box with Upload Badge */}
        <div
          className="precision-hub__avatarContainer"
          onClick={() => fileInputRef.current?.click()}
          title="Click để tải lên / cập nhật ảnh thẻ nhân sự"
        >
          <div className="precision-hub__avatarBox">
            {userData?.EMPL_IMAGE === "Y" ? (
              <img
                src={`/Picture_NS/NS_${userData?.EMPL_NO}.jpg`}
                alt={fullName}
              />
            ) : (
              <div className="precision-hub__avatarFallback">{userInitials}</div>
            )}
          </div>
          <div className="precision-hub__avatarUploadBadge">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              photo_camera
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Profile Details & Metadata */}
        <div className="precision-hub__profileDetails">
          <div className="precision-hub__nameRow">
            <h1 className="precision-hub__userName">{fullName}</h1>
            {userData?.JOB_NAME && (
              <span className="precision-hub__jobBadge">
                {userData.JOB_NAME.toUpperCase()}
              </span>
            )}
            {userData?.WORK_POSITION_NAME && (
              <span className="precision-hub__positionBadge">
                {userData.WORK_POSITION_NAME}
              </span>
            )}
          </div>

          <div className="precision-hub__departmentRow">
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#64748b" }}>
              corporate_fare
            </span>
            <span>Main Department: {userData?.MAINDEPTNAME || "Khối Sản Xuất"}</span>
            {userData?.SUBDEPTNAME && (
              <>
                <span style={{ color: "#cbd5e1" }}>•</span>
                <span>Sub Department: {userData.SUBDEPTNAME}</span>
              </>
            )}
          </div>

          {/* 4 Structured Real Metadata Tags */}
          <div className="precision-hub__metaGrid">
            <div className="precision-hub__metaItem">
              <span className="precision-hub__metaLabel">
                {getsentence(20, lang ?? "en")}
              </span>
              <span className="precision-hub__metaValue precision-hub__metaValue--primary">
                {userData?.CMS_ID || "---"}
              </span>
            </div>

            <div className="precision-hub__metaItem">
              <span className="precision-hub__metaLabel">
                {getsentence(21, lang ?? "en")}
              </span>
              <span className="precision-hub__metaValue">
                {userData?.EMPL_NO || "---"}
              </span>
            </div>

            <div className="precision-hub__metaItem">
              <span className="precision-hub__metaLabel">Thâm niên</span>
              <span className="precision-hub__metaValue">
                {getSeniority()}
              </span>
            </div>

            <div className="precision-hub__metaItem">
              <span className="precision-hub__metaLabel">
                {getsentence(28, lang ?? "en")}
              </span>
              <span className="precision-hub__metaValue">
                Nhóm {userData?.ATT_GROUP_CODE ?? 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Bottom Action Bar */}
      <div className="precision-hub__profileToolbar">
        <div className="precision-hub__secInfo">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#64748b" }}>
            shield
          </span>
          <span>Bảo mật hệ thống: Xác thực tài khoản & Phân quyền ERP nội bộ</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="precision-hub__btnAction"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#64748b" }}>
              upload
            </span>
            <span>Đổi ảnh thẻ</span>
          </button>

          <button
            type="button"
            className="precision-hub__btnAction precision-hub__btnAction--primary"
            onClick={onOpenChangePassword}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              lock_reset
            </span>
            <span>Change password</span>
          </button>
        </div>
      </div>
    </div>
  );
}
