import React from "react";
import { FiX, FiRadio } from "react-icons/fi";
import AddInfo from "../AddInfo";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const PrecisionPostManagerAddModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="postmanager-modal">
      <div className="postmanager-modal__backdrop" onClick={onClose} />
      <div className="postmanager-modal__window" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="postmanager-modal__header">
          <div className="postmanager-modal__titleWrap">
            <div className="icon-badge">
              <FiRadio size={16} />
            </div>
            <div className="title-text">
              <h3>Soạn Thảo & Đăng Tin Bảng Tin Nội Bộ</h3>
              <span>Khởi tạo bài viết, tải ảnh và phát hành tức thì lên bảng tin doanh nghiệp</span>
            </div>
          </div>

          <button
            type="button"
            className="postmanager-modal__closeBtn"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Nội dung bên trong: Giao diện Đăng Tin hoàn chỉnh AddInfo */}
        <div className="postmanager-modal__content">
          <AddInfo />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostManagerAddModal);
