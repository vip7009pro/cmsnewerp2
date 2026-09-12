import React, { useState } from "react";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsPersonBadge } from "react-icons/bs";
import { MdOutlineFingerprint, MdOutlineFace } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";

interface PrecisionUserProfilePanelProps {
  selectedUser: EmployeeTableData;
  onUploadAvatar: (file: File) => void;
  onTrainFace: () => void;
  onCheckFace: () => void;
  isLoadingFace?: boolean;
}

export const PrecisionUserProfilePanel: React.FC<
  PrecisionUserProfilePanelProps
> = ({
  selectedUser,
  onUploadAvatar,
  onTrainFace,
  onCheckFace,
  isLoadingFace,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const hasImage = selectedUser.EMPL_IMAGE === "Y";
  const avatarUrl = hasImage
    ? `/Picture_NS/NS_${selectedUser.EMPL_NO}.jpg`
    : "/noimage.webp";

  const isWorking = selectedUser.WORK_STATUS_CODE === 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUploadAvatar(file);
    }
  };

  return (
    <div className="precision-usermanager__profileCard">
      {/* Profile Header */}
      <div className="precision-usermanager__profileHeader">
        <div className="precision-usermanager__profileTitle">
          <BsPersonBadge size={16} color="#2563eb" />
          <span>Hồ Sơ Nhân Viên</span>
        </div>
        <span
          className={`precision-usermanager__statusBadge ${
            isWorking
              ? "precision-usermanager__statusBadge--active"
              : "precision-usermanager__statusBadge--resigned"
          }`}
        >
          {isWorking ? "Đang hoạt động" : "Đã nghỉ việc"}
        </span>
      </div>

      {/* Photo Frame */}
      <div className="precision-usermanager__photoFrame">
        <img
          src={avatarUrl}
          alt={selectedUser.FULL_NAME || "Employee Photo"}
          onError={(e: any) => {
            e.target.src = "/noimage.webp";
          }}
        />
        <div className="precision-usermanager__photoOverlay">
          <div className="precision-usermanager__overlayName">
            <span>{selectedUser.FULL_NAME || "Chưa chọn nhân viên"}</span>
            {selectedUser.SUBDEPTNAME && (
              <span className="dept-badge">{selectedUser.SUBDEPTNAME}</span>
            )}
          </div>
          <div className="precision-usermanager__overlayMeta">
            <span>ERP: <b>{selectedUser.EMPL_NO || "---"}</b></span>
            <span>•</span>
            <span>CMS: <b>{selectedUser.CMS_ID || "---"}</b></span>
            <span>•</span>
            <span>CC: <b>{selectedUser.NV_CCID || "---"}</b></span>
          </div>
        </div>
      </div>

      {/* Upload Avatar Control */}
      <div className="precision-usermanager__uploadBox">
        <div className="precision-usermanager__uploadMeta">
          <span>Cập nhật ảnh đại diện</span>
          <span>.JPG</span>
        </div>
        <div className="precision-usermanager__uploadControls">
          <input
            type="file"
            accept=".jpg"
            onChange={handleFileChange}
          />
          <button
            className="precision-usermanager__btnUpload"
            onClick={handleUploadClick}
            disabled={!file || !selectedUser.EMPL_NO}
            type="button"
          >
            <AiOutlineCloudUpload size={14} />
            <span>Lưu ảnh</span>
          </button>
        </div>
      </div>

      {/* Detail Key-Value List */}
      <div className="precision-usermanager__infoList">
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Bộ phận:</span>
          <span className="info-val">
            {selectedUser.MAINDEPTNAME} - {selectedUser.SUBDEPTNAME}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Vị trí:</span>
          <span className="info-val" style={{ color: "#2563eb" }}>
            {selectedUser.WORK_POSITION_NAME || "Chưa phân công"}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Chức danh / Cấp:</span>
          <span className="info-val">
            {selectedUser.JOB_NAME} ({selectedUser.POSITION_NAME})
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Ca phân công:</span>
          <span className="info-val" style={{ color: "#b45309" }}>
            {selectedUser.WORK_SHIF_NAME || "Hành chính"}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Ngày sinh (DOB):</span>
          <span className="info-val">
            {selectedUser.DOB ? String(selectedUser.DOB).slice(0, 10) : "---"}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Điện thoại:</span>
          <span className="info-val">
            {selectedUser.PHONE_NUMBER ? (
              <a
                href={`tel:${selectedUser.PHONE_NUMBER}`}
                className="info-val--link"
                style={{ display: "inline-flex", alignItems: "center", gap: 3 }}
              >
                <FiPhoneCall size={11} />
                <span>{selectedUser.PHONE_NUMBER}</span>
              </a>
            ) : (
              "---"
            )}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Ngày vào:</span>
          <span className="info-val">
            {selectedUser.WORK_START_DATE
              ? String(selectedUser.WORK_START_DATE).slice(0, 10)
              : "---"}
          </span>
        </div>
        <div className="precision-usermanager__infoRow">
          <span className="info-label">Quê quán:</span>
          <span
            className="info-val"
            style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={selectedUser.HOMETOWN}
          >
            {selectedUser.HOMETOWN || "---"}
          </span>
        </div>
      </div>

      {/* Face AI Actions */}
      <div className="precision-usermanager__faceActions">
        <button
          className="precision-usermanager__btnAction precision-usermanager__btnAction--train"
          onClick={onTrainFace}
          disabled={isLoadingFace || !selectedUser.EMPL_NO}
          type="button"
          title="Trích xuất và lưu vector khuôn mặt 128D"
        >
          <MdOutlineFingerprint size={15} />
          <span>{isLoadingFace ? "Đang xử lý..." : "Train Face"}</span>
        </button>

        <button
          className="precision-usermanager__btnAction precision-usermanager__btnAction--check"
          onClick={onCheckFace}
          disabled={isLoadingFace || !selectedUser.EMPL_NO}
          type="button"
          title="Kiểm tra nhận diện khuôn mặt qua Face API"
        >
          <MdOutlineFace size={15} />
          <span>Check Face</span>
        </button>
      </div>
    </div>
  );
};

export default PrecisionUserProfilePanel;
