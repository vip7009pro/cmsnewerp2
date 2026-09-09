import React from "react";
import {
  FiImage,
  FiUploadCloud,
  FiShield,
  FiCpu,
} from "react-icons/fi";

interface Props {
  selectedFile: File | null;
  previewUrl: string;
  imgError: boolean;
  setImgError: (err: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveAvatar: () => void;
  onTrainFace: () => void;
  onCheckFace: () => void;
  isLoading?: boolean;
}

export const PrecisionUserPhotoSection: React.FC<Props> = ({
  selectedFile,
  previewUrl,
  imgError,
  setImgError,
  handleFileChange,
  handleSaveAvatar,
  onTrainFace,
  onCheckFace,
  isLoading,
}) => {
  return (
    <div className="precision-user-modal__photoCard">
      <div className="precision-user-modal__photoLeft">
        <div className="precision-user-modal__avatarBox">
          {previewUrl && !imgError ? (
            <img
              src={previewUrl}
              alt="Avatar"
              onError={() => setImgError(true)}
            />
          ) : (
            <FiImage size={32} className="fallback-icon" />
          )}
          <div className="size-badge">150x200</div>
        </div>

        <div className="precision-user-modal__photoActions">
          <div className="photo-title">
            Cập nhật ảnh đại diện hồ sơ
            <span className="hint">(.JPG / PNG &lt; 5MB)</span>
          </div>
          <div className="photo-buttons">
            <label className="btn-choose">
              <FiUploadCloud size={13} />
              Chọn tập tin...
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="button"
              className="btn-save-photo"
              onClick={handleSaveAvatar}
              disabled={!selectedFile || isLoading}
            >
              <FiUploadCloud size={13} />
              Lưu ảnh
            </button>
          </div>
          <span className="file-status">
            {selectedFile
              ? `Đã chọn: ${selectedFile.name}`
              : "Chưa có tập tin mới nào được chọn"}
          </span>
        </div>
      </div>

      <div className="precision-user-modal__aiActions">
        <div className="precision-user-modal__aiStatusPill">
          <span className="pill">
            <FiShield size={11} /> Face ID Synced
          </span>
          <span className="model-info">ZKTeco Model v4.1</span>
        </div>

        <button
          type="button"
          className="precision-user-modal__btnTrain"
          onClick={onTrainFace}
          disabled={isLoading}
        >
          <FiCpu size={14} />
          TRAIN FACE
        </button>

        <button
          type="button"
          className="precision-user-modal__btnCheck"
          onClick={onCheckFace}
          disabled={isLoading}
        >
          <FiShield size={14} />
          CHECK FACE
        </button>
      </div>
    </div>
  );
};

export default PrecisionUserPhotoSection;
