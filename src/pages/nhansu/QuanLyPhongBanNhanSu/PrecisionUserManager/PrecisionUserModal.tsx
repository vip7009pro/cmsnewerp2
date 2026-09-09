import React, { useState, useEffect } from "react";
import "./PrecisionUserModal.scss";
import { EmployeeTableData } from "../../interfaces/nhansuInterface";
import {
  FiUser,
  FiX,
  FiRefreshCw,
  FiPlus,
  FiCheck,
} from "react-icons/fi";
import PrecisionUserIdSection from "./PrecisionUserIdSection";
import PrecisionUserContactSection from "./PrecisionUserContactSection";
import PrecisionUserWorkSection from "./PrecisionUserWorkSection";
import PrecisionUserPhotoSection from "./PrecisionUserPhotoSection";

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
  onUploadAvatar?: (file: File) => void;
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
  onUploadAvatar,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    setSelectedFile(null);
    setPreviewUrl(
      selectedUser.EMPL_NO
        ? `/Picture_NS/NS_${selectedUser.EMPL_NO}.jpg`
        : ""
    );
  }, [selectedUser.EMPL_NO, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImgError(false);
    }
  };

  const handleSaveAvatar = () => {
    if (selectedFile && onUploadAvatar) {
      onUploadAvatar(selectedFile);
    }
  };

  if (!isOpen) return null;

  const statusName =
    selectedUser.WORK_STATUS_CODE === 1
      ? "Đang Hoạt Động"
      : selectedUser.WORK_STATUS_CODE === 0
      ? "Đã Nghỉ Việc"
      : "Nghỉ Sinh";

  const statusClass =
    selectedUser.WORK_STATUS_CODE === 1
      ? "precision-user-modal__badgeStatus--active"
      : selectedUser.WORK_STATUS_CODE === 0
      ? "precision-user-modal__badgeStatus--resigned"
      : "precision-user-modal__badgeStatus--maternity";

  return (
    <div className="precision-user-modal-overlay" onClick={onClose}>
      <div
        className="precision-user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="precision-user-modal__header">
          <div className="precision-user-modal__headerLeft">
            <div className="precision-user-modal__iconBadge">
              <FiUser size={20} />
            </div>
            <div className="precision-user-modal__titleInfo">
              <div className="precision-user-modal__titleRow">
                <span className="precision-user-modal__titleText">
                  Thêm / Cập nhật Nhân viên
                </span>
                <span className="precision-user-modal__badgeEmplNo">
                  EMPL_NO: {selectedUser.EMPL_NO || "MỚI"}
                </span>
                <span
                  className={`precision-user-modal__badgeStatus ${statusClass}`}
                >
                  ● {statusName}
                </span>
              </div>
              <span className="precision-user-modal__subTitle">
                Quản trị định danh, ca kíp và phân quyền nhân sự nhà máy CMS Vina
              </span>
            </div>
          </div>
          <button
            className="precision-user-modal__btnClose"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* 2. Scrollable Form Body */}
        <div className="precision-user-modal__body">
          <div className="precision-user-modal__grid3Col">
            {/* Cột 1: Thông Tin Định Danh */}
            <PrecisionUserIdSection
              selectedUser={selectedUser}
              setCustInfo={setCustInfo}
            />

            {/* Cột 2: Địa Chỉ & Liên Hệ */}
            <PrecisionUserContactSection
              selectedUser={selectedUser}
              setCustInfo={setCustInfo}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* Cột 3: Vị Trí & Phân Công */}
            <PrecisionUserWorkSection
              selectedUser={selectedUser}
              setCustInfo={setCustInfo}
              workpositionload={workpositionload}
            />
          </div>

          {/* Cập Nhật Ảnh Đại Diện & Face AI */}
          <PrecisionUserPhotoSection
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            imgError={imgError}
            setImgError={setImgError}
            handleFileChange={handleFileChange}
            handleSaveAvatar={handleSaveAvatar}
            onTrainFace={onTrainFace}
            onCheckFace={onCheckFace}
            isLoading={isLoading}
          />
        </div>

        {/* 3. Footer Actions */}
        <div className="precision-user-modal__footer">
          <button
            type="button"
            className="precision-user-modal__btnClear"
            onClick={onClear}
          >
            <FiRefreshCw size={12} />
            CLEAR FORM
          </button>

          <div className="precision-user-modal__footerRight">
            <button
              type="button"
              className="precision-user-modal__btnCloseFooter"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              className="precision-user-modal__btnAdd"
              onClick={onAdd}
              disabled={isLoading}
            >
              <FiPlus size={13} />+ THÊM MỚI
            </button>
            <button
              type="button"
              className="precision-user-modal__btnUpdate"
              onClick={onUpdate}
              disabled={isLoading}
            >
              <FiCheck size={13} />
              CẬP NHẬT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionUserModal;
